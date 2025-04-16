import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	try {
		// Primeiro verifica a sessão
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		const { data, error } = await supabase.from("musicos").select("*").eq("id", id).single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		if (!data) {
			return NextResponse.json({ error: "Músico não encontrado" }, { status: 404 });
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Erro ao buscar músico:", error);
		return NextResponse.json({ error: "Erro ao buscar dados do músico" }, { status: 500 });
	}
}
