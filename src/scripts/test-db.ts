import { createClient } from "@/lib/supabase/server";
import dotenv from "dotenv";
import path from "path";

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function testDatabase() {
	try {
		const supabase = createClient();

		console.log("Testando tabela de bandas...");
		const { data: bandas, error: bandasError } = await supabase.from("bandas").select("*");

		if (bandasError) {
			console.error("Erro ao buscar bandas:", bandasError);
			return;
		}
		console.log("Bandas encontradas:", bandas);

		console.log("\nTestando tabela de membros de banda...");
		const { data: membros, error: membrosError } = await supabase.from("membros_banda").select("*");

		if (membrosError) {
			console.error("Erro ao buscar membros:", membrosError);
			return;
		}
		console.log("Membros encontrados:", membros);

		console.log("\nTestando tabela de compromissos...");
		const { data: compromissos, error: compromissosError } = await supabase.from("compromissos_banda").select("*");

		if (compromissosError) {
			console.error("Erro ao buscar compromissos:", compromissosError);
			return;
		}
		console.log("Compromissos encontrados:", compromissos);
	} catch (error) {
		console.error("Erro ao testar banco de dados:", error);
	}
}

testDatabase();
