export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			musicos: {
				Row: {
					id: string;
					nome: string;
					email: string;
					telefone: string;
					instrumento: string;
					tipo: "musico" | "manager";
					senha: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					nome: string;
					email: string;
					telefone: string;
					instrumento: string;
					tipo: "musico" | "manager";
					senha: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					nome?: string;
					email?: string;
					telefone?: string;
					instrumento?: string;
					tipo?: "musico" | "manager";
					senha?: string;
					created_at?: string;
				};
			};
			shows: {
				Row: {
					id: string;
					nome_evento: string;
					cidade: string;
					casa_de_show: string;
					data: string;
					hora: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					nome_evento: string;
					cidade: string;
					casa_de_show: string;
					data: string;
					hora: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					nome_evento?: string;
					cidade?: string;
					casa_de_show?: string;
					data?: string;
					hora?: string;
					created_at?: string;
				};
			};
			aceites_show: {
				Row: {
					id: string;
					musico_id: string;
					show_id: string;
					status: "pendente" | "aceito" | "recusado";
					created_at: string;
				};
				Insert: {
					id?: string;
					musico_id: string;
					show_id: string;
					status?: "pendente" | "aceito" | "recusado";
					created_at?: string;
				};
				Update: {
					id?: string;
					musico_id?: string;
					show_id?: string;
					status?: "pendente" | "aceito" | "recusado";
					created_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			criar_usuario: {
				Args: {
					nome: string;
					email: string;
					telefone: string;
					instrumento: string;
					tipo: "musico" | "manager";
					senha_texto: string;
				};
				Returns: string;
			};
			verificar_senha: {
				Args: {
					email_usuario: string;
					senha_texto: string;
				};
				Returns: {
					id: string;
					nome: string;
					tipo: "musico" | "manager";
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
