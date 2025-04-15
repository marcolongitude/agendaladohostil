import { NextResponse } from "next/server";
import { criarMusico } from "@/lib/supabase/actions";
import { z } from "zod";

// Schema de validação
const criarUsuarioSchema = z.object({
	nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
	email: z.string().email("E-mail inválido"),
	telefone: z.string().min(8, "Telefone inválido"),
	instrumento: z.string().min(1, "Instrumento é obrigatório"),
	tipo: z.enum(["musico", "manager"], {
		errorMap: () => ({ message: "Tipo deve ser musico ou manager" }),
	}),
	senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export async function POST(request: Request) {
	try {
		// Obter e validar dados do corpo da requisição
		const body = await request.json();

		const result = criarUsuarioSchema.safeParse(body);
		if (!result.success) {
			// Retornar erros de validação
			return NextResponse.json(
				{
					success: false,
					message: "Dados inválidos",
					errors: result.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const { nome, email, telefone, instrumento, tipo, senha } = result.data;

		// Chamar a função para criar o usuário no Supabase
		const id = await criarMusico(nome, email, telefone, instrumento, tipo, senha);

		// Retornar sucesso com o ID do usuário criado
		return NextResponse.json({
			success: true,
			message: "Usuário criado com sucesso",
			userId: id,
		});
	} catch (error) {
		console.error("Erro ao criar usuário:", error);

		// Verificar se é um erro de duplicação de email (código personalizado de erro do Supabase)
		const errorMessage = error instanceof Error ? error.message : "Erro ao criar usuário";

		if (errorMessage.includes("duplicate key value violates unique constraint")) {
			return NextResponse.json({ success: false, message: "Este e-mail já está cadastrado" }, { status: 409 });
		}

		// Erro genérico
		return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
	}
}
