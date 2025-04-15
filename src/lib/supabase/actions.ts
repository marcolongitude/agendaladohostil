"use server";

import { createClient } from "./server";
import type { Database } from "@/types/supabase";

// Tipos para os músicos
type Musico = Database["public"]["Tables"]["musicos"]["Row"];
// Omitindo o campo de senha para o retorno
type MusicoSemSenha = Omit<Musico, "senha">;

// Tipos para os shows
type ShowInsert = Database["public"]["Tables"]["shows"]["Insert"];

// Tipos para os aceites de show
type AceiteShowInsert = Database["public"]["Tables"]["aceites_show"]["Insert"];

// Tipo para autenticação
type UsuarioAutenticado = {
	id: string;
	nome: string;
	tipo: "musico" | "manager";
};

// Função para autenticar um usuário
export async function autenticarUsuario(email: string, senha: string): Promise<UsuarioAutenticado | null> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("verificar_senha", {
		email_usuario: email,
		senha_texto: senha,
	});

	if (error || !data || data.length === 0) {
		return null;
	}

	return data[0];
}

// Funções para músicos - agora retornando sem o campo senha
export async function getMusicos(): Promise<MusicoSemSenha[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("musicos")
		.select("id, nome, email, telefone, instrumento, tipo, created_at");

	if (error) {
		throw new Error(`Erro ao buscar músicos: ${error.message}`);
	}

	return data;
}

export async function getMusico(id: string): Promise<MusicoSemSenha | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("musicos")
		.select("id, nome, email, telefone, instrumento, tipo, created_at")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			return null; // Músico não encontrado
		}
		throw new Error(`Erro ao buscar músico: ${error.message}`);
	}

	return data;
}

export async function criarMusico(
	nome: string,
	email: string,
	telefone: string,
	instrumento: string,
	tipo: "musico" | "manager",
	senha: string
): Promise<string> {
	const supabase = createClient();

	// Primeiro, criar o usuário no Auth
	const { data: authData, error: authError } = await supabase.auth.signUp({
		email,
		password: senha,
		options: {
			data: {
				nome,
				tipo,
			},
		},
	});

	if (authError) {
		throw new Error(`Erro ao criar usuário no Auth: ${authError.message}`);
	}

	if (!authData.user) {
		throw new Error("Erro ao criar usuário no Auth: usuário não retornado");
	}

	try {
		// Depois, criar o usuário na tabela musicos
		const { data, error } = await supabase.rpc("criar_usuario", {
			nome,
			email,
			telefone,
			instrumento,
			tipo,
			senha_texto: senha,
		});

		if (error) {
			// Se der erro, tentar deletar o usuário do Auth
			await supabase.auth.admin.deleteUser(authData.user.id);
			throw new Error(`Erro ao criar músico: ${error.message}`);
		}

		return data;
	} catch (error) {
		// Se der erro, tentar deletar o usuário do Auth
		if (authData.user) {
			await supabase.auth.admin.deleteUser(authData.user.id);
		}
		throw error;
	}
}

// Funções para shows
export async function getShows() {
	const supabase = createClient();
	const { data, error } = await supabase.from("shows").select("*");

	if (error) {
		throw new Error(`Erro ao buscar shows: ${error.message}`);
	}

	return data;
}

export async function getShow(id: string) {
	const supabase = createClient();
	const { data, error } = await supabase.from("shows").select("*").eq("id", id).single();

	if (error) {
		if (error.code === "PGRST116") {
			return null; // Show não encontrado
		}
		throw new Error(`Erro ao buscar show: ${error.message}`);
	}

	return data;
}

export async function insertShow(show: ShowInsert) {
	const supabase = createClient();
	const { data, error } = await supabase.from("shows").insert(show).select().single();

	if (error) {
		throw new Error(`Erro ao inserir show: ${error.message}`);
	}

	return data;
}

// Funções para aceites de show
export async function getAceitesShow(showId: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("aceites_show")
		.select(
			`
			*,
			musicos:musico_id (
				id, nome, email, telefone, instrumento, tipo, created_at
			)
		`
		)
		.eq("show_id", showId);

	if (error) {
		throw new Error(`Erro ao buscar aceites de show: ${error.message}`);
	}

	return data;
}

export async function insertAceiteShow(aceite: AceiteShowInsert) {
	const supabase = createClient();
	const { data, error } = await supabase.from("aceites_show").insert(aceite).select().single();

	if (error) {
		throw new Error(`Erro ao inserir aceite de show: ${error.message}`);
	}

	return data;
}

export async function updateStatusAceiteShow(id: string, status: "pendente" | "aceito" | "recusado") {
	const supabase = createClient();
	const { data, error } = await supabase.from("aceites_show").update({ status }).eq("id", id).select().single();

	if (error) {
		throw new Error(`Erro ao atualizar status do aceite: ${error.message}`);
	}

	return data;
}
