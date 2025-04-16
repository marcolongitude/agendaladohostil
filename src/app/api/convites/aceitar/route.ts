import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
	try {
		const { token } = await request.json();
		if (!token) {
			return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 });
		}

		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Busca o convite
		const { data: convite, error: conviteError } = await supabase
			.from("convites_banda")
			.select("*")
			.eq("token", token)
			.single();

		if (conviteError || !convite) {
			return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
		}

		// Verifica se o convite já está aceito ou expirado
		if (convite.status === "aceito") {
			return NextResponse.json({ error: "Convite já aceito" }, { status: 400 });
		}
		if (convite.status === "expirado") {
			return NextResponse.json({ error: "Convite expirado" }, { status: 400 });
		}

		// Atualiza o status do convite para aceito
		const { error: updateError } = await supabase
			.from("convites_banda")
			.update({ status: "aceito" })
			.eq("id", convite.id);

		if (updateError) {
			return NextResponse.json({ error: "Erro ao aceitar convite" }, { status: 500 });
		}

		return NextResponse.json({ message: "Convite aceito com sucesso" });
	} catch {
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
