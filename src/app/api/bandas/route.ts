import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { bandaSchema } from "@/schemas/banda";

export async function POST(request: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Verificar a sessão do usuário
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session) {
			console.error("Erro ao verificar sessão:", sessionError);
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		console.log("Sessão do usuário:", session.user.email);

		const body = await request.json();
		const validatedData = bandaSchema.parse(body);

		// Obter o ID do músico associado ao usuário
		const { data: musico, error: musicoError } = await supabase
			.from("musicos")
			.select("id")
			.eq("email", session.user.email)
			.single();

		if (musicoError) {
			console.error("Erro ao obter músico:", musicoError);
			return NextResponse.json({ error: "Erro ao buscar músico: " + musicoError.message }, { status: 500 });
		}

		if (!musico) {
			console.error("Músico não encontrado para o email:", session.user.email);
			return NextResponse.json({ error: "Músico não encontrado" }, { status: 404 });
		}

		console.log("Músico encontrado:", musico.id);

		// Criar a banda
		const { data: banda, error: bandaError } = await supabase
			.from("bandas")
			.insert({
				...validatedData,
				criador_id: musico.id,
			})
			.select()
			.single();

		if (bandaError) {
			console.error("Erro ao criar banda:", bandaError);
			return NextResponse.json({ error: "Erro ao criar banda: " + bandaError.message }, { status: 500 });
		}

		console.log("Banda criada:", banda.id);

		// Criar o registro na tabela membros_banda
		const { error: membroError } = await supabase.from("membros_banda").insert({
			musico_id: musico.id,
			banda_id: banda.id,
			instrumento: "Não especificado", // Valor padrão
			papel: "admin",
		});

		if (membroError) {
			console.error("Erro ao criar membro da banda:", membroError);
			// Tentar deletar a banda criada
			await supabase.from("bandas").delete().eq("id", banda.id);
			return NextResponse.json(
				{ error: "Erro ao criar membro da banda: " + membroError.message },
				{ status: 500 }
			);
		}

		console.log("Membro da banda criado com sucesso");

		return NextResponse.json(banda);
	} catch (error) {
		console.error("Erro ao processar requisição:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor: " + (error instanceof Error ? error.message : String(error)) },
			{ status: 500 }
		);
	}
}

// Novo método GET para buscar detalhes da banda por id
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	if (!id) {
		return NextResponse.json({ error: "id da banda é obrigatório" }, { status: 400 });
	}
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { data: banda, error } = await supabase
		.from("bandas")
		.select("id, nome, descricao, cidade, estado, genero, criador_id, created_at")
		.eq("id", id)
		.single();
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (!banda) {
		return NextResponse.json({ error: "Banda não encontrada" }, { status: 404 });
	}
	return NextResponse.json(banda);
}
