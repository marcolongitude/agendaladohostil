import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
