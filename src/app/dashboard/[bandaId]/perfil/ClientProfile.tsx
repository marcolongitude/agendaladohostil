"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface Musico {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	instrumento: string;
	tipo: string;
	created_at: string;
}

interface ClientProfileProps {
	musico: Musico;
}

export function ClientProfile({ musico }: ClientProfileProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Evita problemas de hidratação montando o componente apenas no cliente
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="space-y-6">
			<div className="overflow-hidden">
				<p className="text-sm text-muted-foreground">Nome</p>
				<p className="font-medium truncate">{musico.nome}</p>
			</div>
			<div className="overflow-hidden">
				<p className="text-sm text-muted-foreground">Email</p>
				<p className="font-medium truncate">{musico.email}</p>
			</div>
			<div className="overflow-hidden">
				<p className="text-sm text-muted-foreground">Telefone</p>
				<p className="font-medium truncate">{musico.telefone}</p>
			</div>
			<div className="overflow-hidden">
				<p className="text-sm text-muted-foreground">Instrumento</p>
				<p className="font-medium truncate">{musico.instrumento}</p>
			</div>
			<div className="overflow-hidden">
				<p className="text-sm text-muted-foreground">Tipo de Usuário</p>
				<p className="font-medium truncate">{musico.tipo === "musico" ? "Músico" : "Manager"}</p>
			</div>
			<div className="overflow-hidden">
				<p className="text-sm text-muted-foreground">Data de Cadastro</p>
				<p className="font-medium truncate">{new Date(musico.created_at).toLocaleDateString("pt-BR")}</p>
			</div>
			{mounted && (
				<div className="flex items-center space-x-2 pt-4">
					<Switch
						id="theme-mode"
						checked={theme === "dark"}
						onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
					/>
					<Label htmlFor="theme-mode">Modo Escuro</Label>
				</div>
			)}
		</div>
	);
}
