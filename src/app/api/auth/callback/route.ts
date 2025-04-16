import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	if (!code) {
		return NextResponse.redirect(new URL("/login", requestUrl));
	}

	const supabase = createRouteHandlerClient({ cookies });
	await supabase.auth.exchangeCodeForSession(code);

	// Redireciona para o login (ou dashboard, se preferir)
	return NextResponse.redirect(new URL("/login", requestUrl));
}
