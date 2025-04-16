import { z } from "zod";

export const bandaSchema = z.object({
	nome: z.string().min(1, "Nome é obrigatório"),
	descricao: z.string().min(1, "Descrição é obrigatória"),
	cep: z.string().min(9, "CEP deve ter 8 dígitos").max(9, "CEP deve ter 8 dígitos"),
	cidade: z.string().min(1, "Cidade é obrigatória"),
	estado: z.string().min(1, "Estado é obrigatório"),
	genero: z.string().min(1, "Gênero é obrigatório"),
});

export type BandaFormData = z.infer<typeof bandaSchema>;
