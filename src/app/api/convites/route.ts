import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
	try {
		const { banda_id, email } = await request.json();
		if (!banda_id) {
			return NextResponse.json({ error: "banda_id é obrigatório" }, { status: 400 });
		}

		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Gera um token seguro
		const token = randomBytes(24).toString("hex");

		// Salva o convite na tabela
		const { error } = await supabase.from("convites_banda").insert({
			banda_id,
			email: email || null,
			token,
			status: "pendente",
			// expires_at: pode ser adicionado se quiser expiração
		});

		if (error) {
			return NextResponse.json({ error: "Erro ao criar convite: " + error.message }, { status: 500 });
		}

		// Monta o link do convite
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const link = `${baseUrl}/convite/${token}`;

		return NextResponse.json({ link });
	} catch {
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}

// Novo método GET para listar convites de uma banda
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const banda_id = searchParams.get("banda_id");
	if (!banda_id) {
		return NextResponse.json({ error: "banda_id é obrigatório" }, { status: 400 });
	}
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { data, error } = await supabase
		.from("convites_banda")
		.select("id, token, status, expires_at, email")
		.eq("banda_id", banda_id)
		.order("created_at", { ascending: false });
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(data);
}
