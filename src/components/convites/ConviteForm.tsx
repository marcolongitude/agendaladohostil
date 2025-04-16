"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ConviteFormProps {
	bandaId: string;
	onSuccess: () => void;
}

export function ConviteForm({ bandaId, onSuccess }: ConviteFormProps) {
	const [email, setEmail] = useState("");
	const [expiresIn, setExpiresIn] = useState("7");
	const { setLoading, setLoadingMessage } = useLoading();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setLoadingMessage("Criando convite...");

		try {
			const supabase = createClientComponentClient();
			const { error } = await supabase.from("convites_banda").insert({
				banda_id: bandaId,
				email: email || null,
				expires_at: new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString(),
			});

			if (error) throw error;

			toast({
				title: "Convite criado com sucesso!",
				description: "O convite foi gerado e pode ser compartilhado.",
			});

			onSuccess();
		} catch (error) {
			console.error("Erro ao criar convite:", error);
			toast({
				title: "Erro ao criar convite",
				description: "Ocorreu um erro ao criar o convite. Tente novamente.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email (opcional)</Label>
				<Input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="email@exemplo.com"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="expiresIn">Expira em (dias)</Label>
				<Input
					id="expiresIn"
					type="number"
					min="1"
					max="30"
					value={expiresIn}
					onChange={(e) => setExpiresIn(e.target.value)}
				/>
			</div>

			<Button type="submit" className="w-full">
				Criar Convite
			</Button>
		</form>
	);
}
