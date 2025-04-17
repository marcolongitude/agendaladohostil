import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { token, email } = await request.json();

		if (!token) {
			return NextResponse.json({ message: "Token não fornecido" }, { status: 400 });
		}

		if (!email) {
			return NextResponse.json({ message: "E-mail não fornecido" }, { status: 400 });
		}

		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

		// Verifica se o convite existe e é válido
		const { data: convite, error: conviteError } = await supabase
			.from("convites_banda")
			.select("*")
			.eq("token", token)
			.single();

		if (conviteError || !convite) {
			return NextResponse.json({ message: "Convite inválido ou expirado" }, { status: 400 });
		}

		// Verifica se o convite já foi aceito
		if (convite.status !== "pendente") {
			return NextResponse.json({ message: "Este convite já foi utilizado" }, { status: 400 });
		}

		// Verifica se o email já está em uso
		const { data: existingUser } = await supabase.from("musicos").select("id").eq("email", email).single();

		// Atualiza o convite com o email
		const { error: updateError } = await supabase
			.from("convites_banda")
			.update({ email, status: "aceito" })
			.eq("id", convite.id);

		if (updateError) {
			throw updateError;
		}

		return NextResponse.json({
			message: "Convite aceito com sucesso",
			requiresSignup: !existingUser,
		});
	} catch (error) {
		console.error("Erro ao aceitar convite:", error);
		return NextResponse.json({ message: "Erro ao aceitar convite" }, { status: 500 });
	}
}
