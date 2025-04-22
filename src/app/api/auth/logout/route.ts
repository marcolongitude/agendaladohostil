import { NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json({ success: true });

		// Lista de cookies conhecidos para remover
		const cookiesToClear = [
			"sb-access-token",
			"sb-refresh-token",
			"supabase-auth-token",
			"session",
			"__stripe_mid",
			"__stripe_sid",
			"sb-provider-token",
			"next-auth.session-token",
			"next-auth.callback-url",
			"next-auth.csrf-token",
		];

		// Remove cada cookie com diferentes configurações
		cookiesToClear.forEach((name) => {
			// Tenta remover com diferentes configurações
			response.cookies.set(name, "", {
				expires: new Date(0),
				path: "/",
				maxAge: 0,
			});

			response.cookies.set(name, "", {
				expires: new Date(0),
				path: "/",
				maxAge: 0,
				httpOnly: true,
				secure: true,
				sameSite: "lax",
			});

			// Adiciona header Set-Cookie para garantir que o navegador também remova
			response.headers.append(
				"Set-Cookie",
				`${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
			);
		});

		// Adiciona headers para prevenir cache
		response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");

		return response;
	} catch (error) {
		console.error("Erro ao fazer logout:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
