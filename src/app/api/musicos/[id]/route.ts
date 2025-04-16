import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const supabase = createRouteHandlerClient({ cookies });

	try {
		const { data, error } = await supabase.from("musicos").select("*").eq("id", params.id).single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		if (!data) {
			return NextResponse.json({ error: "Músico não encontrado" }, { status: 404 });
		}

		return NextResponse.json(data);
	} catch {
		return NextResponse.json({ error: "Erro ao buscar dados do músico" }, { status: 500 });
	}
}
