import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Criar cliente do Supabase para uso em componentes do lado do servidor
export function createClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	return createSupabaseClient<Database>(supabaseUrl, supabaseKey);
}
