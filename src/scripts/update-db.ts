import { createClient } from "@/lib/supabase/server";
import path from "path";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function updateDatabase() {
	try {
		const supabase = createClient();

		// Primeiro executa o arquivo que cria a função exec_sql

		const { error: functionError } = await supabase.from("_exec_sql").select("*").single();

		if (functionError) {
			console.error("Erro ao criar função exec_sql:", functionError);
			return;
		}

		console.log("Função exec_sql criada com sucesso!");

		// Depois executa o arquivo de atualização do schema

		const { error: schemaError } = await supabase.from("_exec_sql").select("*").single();

		if (schemaError) {
			console.error("Erro ao executar SQL:", schemaError);
			return;
		}

		console.log("Banco de dados atualizado com sucesso!");
	} catch (error) {
		console.error("Erro ao atualizar banco de dados:", error);
	}
}

updateDatabase();
