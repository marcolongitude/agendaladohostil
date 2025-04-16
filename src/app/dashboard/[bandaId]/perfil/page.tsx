"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Title } from "../../components/title";

interface Musico {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	instrumento: string;
	tipo: string;
	created_at: string;
}

export default function PerfilPage() {
	const [musico, setMusico] = useState<Musico | null>(null);
	const { user } = useAuth();
	const { setLoading, setLoadingMessage } = useLoading();
	const supabase = createClientComponentClient();
	const { theme, setTheme } = useTheme();

	const fetchMusico = useCallback(async () => {
		if (!user?.id || musico) return;

		setLoading(true);
		setLoadingMessage("Carregando dados do perfil...");
		try {
			const { data, error } = await supabase.from("musicos").select("*").eq("id", user.id).single();

			if (error) throw error;
			setMusico(data);
		} catch (error) {
			console.error("Erro:", error);
		} finally {
			setLoading(false);
			setLoadingMessage(undefined);
		}
	}, [user?.id, supabase, setLoading, setLoadingMessage, musico]);

	useEffect(() => {
		fetchMusico();
	}, [fetchMusico]);

	if (!musico) {
		return null;
	}

	return (
		<div className="container mx-auto py-8">
			<div className="space-y-6">
				<Title align="center">Informações Pessoais</Title>

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
						<p className="font-medium truncate">
							{new Date(musico.created_at).toLocaleDateString("pt-BR")}
						</p>
					</div>
					<div className="flex items-center space-x-2 pt-4">
						<Switch
							id="theme-mode"
							checked={theme === "dark"}
							onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
						/>
						<Label htmlFor="theme-mode">Modo Escuro</Label>
					</div>
				</div>
			</div>
		</div>
	);
}
