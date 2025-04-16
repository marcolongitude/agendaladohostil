import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Banda = {
	id: string;
	nome: string;
	descricao: string;
};

type MembroBanda = {
	banda_id: string;
	instrumento: string;
	bandas: Banda[];
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const { email, senha } = await request.json();
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Verifica as credenciais do usuário no banco
		const { data: userData, error: authError } = await supabase.rpc("verificar_senha", {
			email_usuario: email,
			senha_texto: senha,
		});

		if (authError || !userData || userData.length === 0) {
			console.error("Erro na autenticação:", authError);
			return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
		}

		const user = userData[0];

		// Busca as bandas do usuário
		const { data: bandasData, error: bandasError } = await supabase
			.from("membros_banda")
			.select(
				`
				banda_id,
				instrumento,
				bandas (
					id,
					nome,
					descricao
				)
			`
			)
			.eq("musico_id", user.id);

		if (bandasError) {
			console.error("Erro ao buscar bandas:", bandasError);
			return NextResponse.json({ error: "Erro ao buscar bandas do usuário" }, { status: 500 });
		}

		// Formata os dados das bandas
		const bandas = (bandasData || []).map((membro: MembroBanda) => ({
			id: membro.banda_id,
			nome: membro.bandas[0]?.nome || "",
			descricao: membro.bandas[0]?.descricao || "",
			instrumento: membro.instrumento,
		}));

		// Define um cookie de sessão personalizado
		const response = NextResponse.json({
			message: "Login realizado com sucesso",
			user: {
				id: user.id,
				nome: user.nome,
				tipo: user.tipo,
				bandas,
			},
		});

		// Adiciona um cookie de autenticação
		response.cookies.set("session", user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 dias
		});

		return response;
	} catch (error) {
		console.error("Erro durante o login:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
