import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const eventSchema = z.object({
	nome_evento: z.string().min(1, "Nome do evento é obrigatório"),
	cidade: z.string().min(1, "Cidade é obrigatória"),
	casa_de_show: z.string().min(1, "Casa de show é obrigatória"),
	data: z.string().min(1, "Data é obrigatória"),
	hora: z.string().min(1, "Hora é obrigatória"),
	musicos: z.array(z.string()).min(1, "Selecione pelo menos um músico"),
	banda_id: z.string().min(1, "ID da banda é obrigatório"),
});

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const bandaId = searchParams.get("bandaId");

		if (!bandaId) {
			return NextResponse.json({ error: "ID da banda não fornecido" }, { status: 400 });
		}

		const supabase = createRouteHandlerClient({ cookies });

		// Verifica se o usuário está autenticado
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		// Busca os compromissos da banda
		const { data: compromissos, error } = await supabase
			.from("compromissos_banda")
			.select("id, titulo, descricao, data, hora, local, status")
			.eq("banda_id", bandaId)
			.order("data", { ascending: true })
			.order("hora", { ascending: true });

		if (error) {
			console.error("Erro ao buscar compromissos:", error);
			return NextResponse.json({ error: "Erro ao buscar compromissos" }, { status: 500 });
		}

		return NextResponse.json({ compromissos });
	} catch (error) {
		console.error("Erro na rota de eventos:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		console.log("Iniciando criação de evento...");
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Verifica o usuário
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			console.error("Erro de autenticação:", userError);
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		console.log("Usuário autenticado:", user.id);

		// Valida os dados do evento
		const body = await request.json();
		console.log("Dados recebidos:", body);
		const validatedData = eventSchema.parse(body);
		console.log("Dados validados:", validatedData);

		// Verifica se o usuário tem permissão para acessar a banda
		const { data: membroBanda, error: membroError } = await supabase
			.from("membros_banda")
			.select("*")
			.eq("banda_id", validatedData.banda_id)
			.eq("musico_id", user.id)
			.single();

		if (membroError) {
			console.error("Erro ao verificar membro:", membroError);
			return NextResponse.json({ error: "Erro ao verificar permissões" }, { status: 500 });
		}

		if (!membroBanda) {
			console.error("Usuário não é membro da banda");
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		console.log("Permissões verificadas, criando evento...");

		// Cria o evento
		const { data: evento, error: eventoError } = await supabase
			.from("shows")
			.insert({
				nome_evento: validatedData.nome_evento,
				cidade: validatedData.cidade,
				casa_de_show: validatedData.casa_de_show,
				data: validatedData.data,
				hora: validatedData.hora,
				banda_id: validatedData.banda_id,
			})
			.select()
			.single();

		if (eventoError) {
			console.error("Erro ao criar evento:", eventoError);
			return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
		}

		console.log("Evento criado:", evento);

		// Cria os aceites para cada músico
		const aceites = validatedData.musicos.map((musicoId) => ({
			musico_id: musicoId,
			show_id: evento.id,
			status: "pendente",
		}));

		console.log("Criando aceites:", aceites);

		const { error: aceitesError } = await supabase.from("aceites_show").insert(aceites);

		if (aceitesError) {
			console.error("Erro ao criar aceites:", aceitesError);
			// Se houver erro ao criar os aceites, remove o evento
			await supabase.from("shows").delete().eq("id", evento.id);
			return NextResponse.json({ error: "Erro ao criar aceites" }, { status: 500 });
		}

		console.log("Aceites criados com sucesso");
		return NextResponse.json({ evento }, { status: 201 });
	} catch (error) {
		console.error("Erro não tratado:", error);
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
