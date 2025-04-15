import { z } from "zod";

export const userFormSchema = z
	.object({
		name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
		email: z.string().email("E-mail inválido"),
		password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
		confirmPassword: z.string().min(6, "Confirme sua senha"),
		telefone: z.string().min(8, "Informe seu telefone"),
		instrumento: z.string().min(1, "Informe seu instrumento"),
		tipo: z.enum(["musico", "manager"], {
			errorMap: () => ({ message: "Selecione um perfil" }),
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não conferem",
		path: ["confirmPassword"],
	});

export type UserFormData = z.infer<typeof userFormSchema>;
