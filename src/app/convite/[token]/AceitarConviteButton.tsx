"use client";

import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const emailSchema = z.object({
	email: z.string().email("E-mail inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface AceitarConviteButtonProps {
	token: string;
}

export function AceitarConviteButton({ token }: AceitarConviteButtonProps) {
	const { setLoading, setLoadingMessage } = useLoading();
	const form = useForm<EmailFormData>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});

	async function handleAceitarConvite(data: EmailFormData) {
		try {
			setLoading(true);
			setLoadingMessage("Verificando e-mail...");

			const res = await fetch(`/api/convites/aceitar`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token, email: data.email }),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Erro ao aceitar convite");
			}

			const response = await res.json();

			// Faz logout antes de redirecionar
			setLoadingMessage("Finalizando...");
			const supabase = createClientComponentClient();
			await supabase.auth.signOut();

			// Pequeno delay para garantir que o logout foi processado
			await new Promise((resolve) => setTimeout(resolve, 500));

			if (response.requiresSignup) {
				window.location.href = `/cadastro?email=${encodeURIComponent(data.email)}&token=${token}`;
			} else {
				window.location.href = "/login";
			}
		} catch (error) {
			console.error("Erro ao aceitar convite:", error);
			toast.error(error instanceof Error ? error.message : "Erro ao aceitar convite");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={form.handleSubmit(handleAceitarConvite)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Seu melhor e-mail</Label>
				<Input id="email" type="email" placeholder="email@exemplo.com" {...form.register("email")} />
				{form.formState.errors.email && (
					<span className="text-xs text-red-500">{form.formState.errors.email.message}</span>
				)}
			</div>
			<Button type="submit" className="w-full">
				Aceitar Convite
			</Button>
		</form>
	);
}
