import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const supabase = createRouteHandlerClient({ cookies });

		// Verifica se o usuário está autenticado
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		// Busca o tipo do usuário
		const { data: musico, error } = await supabase
			.from("musicos")
			.select("tipo")
			.eq("id", session.user.id)
			.single();

		if (error) {
			console.error("Erro ao buscar tipo do usuário:", error);
			return NextResponse.json({ error: "Erro ao buscar tipo do usuário" }, { status: 500 });
		}

		return NextResponse.json({ tipo: musico?.tipo });
	} catch (error) {
		console.error("Erro na rota de tipo de usuário:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
