"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

// Criar cliente do Supabase para uso em componentes do lado do cliente
export const createClient = () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};
