"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		console.log("Dados do formulário:", { email, password: "***" });

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			console.log("Resposta da API:", data);

			if (!response.ok) {
				setError(data.error);
				return;
			}

			router.push("/bandas");
			router.refresh();
		} catch (err) {
			console.error("Erro no login:", err);
			setError("Ocorreu um erro ao tentar fazer login");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-4">
					{error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="nome@exemplo.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
							name="email"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Senha</Label>
						<Input
							id="password"
							type="password"
							autoCapitalize="none"
							autoComplete="current-password"
							autoCorrect="off"
							disabled={isLoading}
							name="password"
							required
						/>
					</div>
					<Button disabled={isLoading}>
						{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
						Entrar
					</Button>
					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							Não tem uma conta?{" "}
							<Link href="/cadastro" className="text-primary hover:underline">
								Cadastre-se
							</Link>
						</span>
					</div>
				</div>
			</form>
		</div>
	);
}
