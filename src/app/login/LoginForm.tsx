"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const handleResendConfirmation = async () => {
		try {
			setLoading(true);
			const { error } = await supabase.auth.resend({
				type: "signup",
				email: email,
			});

			if (error) {
				throw error;
			}

			setError("Email de confirmação reenviado! Por favor, verifique sua caixa de entrada.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao reenviar email de confirmação");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		setNeedsEmailConfirmation(false);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password: senha,
			});

			if (error) {
				if (error.message === "Email not confirmed") {
					setNeedsEmailConfirmation(true);
					throw new Error("Por favor, confirme seu email antes de fazer login.");
				}
				throw error;
			}

			if (!data.user) {
				throw new Error("Usuário não encontrado");
			}

			// Redirecionamento inteligente
			const params = new URLSearchParams(window.location.search);
			const redirectTo = params.get("redirect") || "/bandas";
			router.push(redirectTo);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao fazer login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="senha">Senha</Label>
					<Input
						type="password"
						id="senha"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						required
					/>
				</div>
				{error && (
					<div className="text-destructive text-sm">
						{error}
						{needsEmailConfirmation && (
							<Button
								onClick={handleResendConfirmation}
								disabled={loading}
								variant="link"
								className="ml-2"
							>
								Reenviar email de confirmação
							</Button>
						)}
					</div>
				)}
				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "Entrando..." : "Entrar"}
				</Button>
			</form>
			<div className="text-center">
				<p className="text-sm text-muted-foreground">
					Não tem uma conta?{" "}
					<Link href="/cadastro" className="text-primary hover:underline">
						Cadastre-se
					</Link>
				</p>
			</div>
		</div>
	);
}
