"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

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
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-300">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
						required
					/>
				</div>
				<div>
					<label htmlFor="senha" className="block text-sm font-medium text-gray-300">
						Senha
					</label>
					<input
						type="password"
						id="senha"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
						required
					/>
				</div>
				{error && (
					<div className="text-red-400 text-sm">
						{error}
						{needsEmailConfirmation && (
							<Button
								onClick={handleResendConfirmation}
								disabled={loading}
								className="ml-2 text-indigo-400 hover:text-indigo-300"
								variant="link"
							>
								Reenviar email de confirmação
							</Button>
						)}
					</div>
				)}
				<button
					type="submit"
					disabled={loading}
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{loading ? "Entrando..." : "Entrar"}
				</button>
			</form>
			<div className="text-center">
				<p className="text-sm text-gray-400">
					Não tem uma conta?{" "}
					<Link href="/cadastro" className="font-medium text-indigo-400 hover:text-indigo-300">
						Cadastre-se
					</Link>
				</p>
			</div>
		</div>
	);
}
