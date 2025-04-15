"use client";
import { useState } from "react";
import { FormButton, FormInput, FormSelect } from "@/components/form";
import { perfilOptions } from "./constants";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormData } from "./schema.validations";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function CreateUserProvider() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const supabase = createClientComponentClient();

	const methods = useForm<UserFormData>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			telefone: "",
			instrumento: "",
			tipo: "musico",
		},
	});

	const onSubmit = async (data: UserFormData) => {
		try {
			setIsSubmitting(true);

			// 1. Criar o usuário no Supabase Auth
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					data: {
						name: data.name,
					},
				},
			});

			if (authError) {
				throw new Error(authError.message);
			}

			if (!authData.user) {
				throw new Error("Erro ao criar usuário");
			}

			// 2. Criar o registro na tabela musicos
			const { error: profileError } = await supabase.from("musicos").insert({
				id: authData.user.id,
				nome: data.name,
				email: data.email,
				telefone: data.telefone,
				instrumento: data.instrumento,
				tipo: data.tipo,
				senha: data.password, // Isso será criptografado pela função do banco
			});

			if (profileError) {
				throw new Error(profileError.message);
			}

			// Sucesso
			toast({
				title: "Sucesso!",
				description: "Usuário cadastrado! Por favor, verifique seu email para confirmar o cadastro.",
				variant: "default",
			});

			// Redirecionamento para a página de login após 2 segundos
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (error) {
			console.error("Erro:", error);
			toast({
				title: "Erro!",
				description: error instanceof Error ? error.message : "Erro ao cadastrar usuário",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div className="space-y-4">
					<FormInput name="name" label="Nome" placeholder="Digite seu nome" />
					<FormInput name="email" label="E-mail" placeholder="Digite seu e-mail" type="email" />
					<FormInput name="telefone" label="Telefone" placeholder="Digite seu telefone" />
					<FormInput name="instrumento" label="Instrumento" placeholder="Digite seu instrumento" />
					<FormInput name="password" label="Senha" placeholder="Digite sua senha" type="password" />
					<FormInput
						name="confirmPassword"
						label="Confirmar Senha"
						placeholder="Confirme sua senha"
						type="password"
					/>
					<FormSelect name="tipo" label="Perfil" placeholder="Selecione um perfil" options={perfilOptions} />
				</div>
				<div className="mt-6">
					<FormButton type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Cadastrando..." : "Cadastrar"}
					</FormButton>
				</div>
			</form>
		</FormProvider>
	);
}
