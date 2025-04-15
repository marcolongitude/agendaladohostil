import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const supabase = createMiddlewareClient({ req: request, res: response });

	// Atualiza a sessão se existir um token de atualização
	await supabase.auth.getSession();

	return response;
}
