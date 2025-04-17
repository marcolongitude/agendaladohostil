"use client";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

const conviteSchema = z.object({});

type ConviteFormData = z.infer<typeof conviteSchema>;

interface ConviteDialogProps {
	bandaId: string;
	onSuccess?: () => void;
}

export function ConviteDialog({ bandaId, onSuccess }: ConviteDialogProps) {
	const [open, setOpen] = useState(false);
	const form = useForm<ConviteFormData>({
		resolver: zodResolver(conviteSchema),
		defaultValues: {},
	});

	async function onSubmit() {
		try {
			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 24);

			const response = await fetch(`/api/convites`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					banda_id: bandaId,
					email: null,
					expires_at: expiresAt.toISOString(),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Erro ao criar convite");
			}

			await response.json(); // Aguarda a resposta completa

			toast.success("Convite criado com sucesso!");
			if (onSuccess) {
				await onSuccess(); // Aguarda a atualização da lista
			}
			setOpen(false);
			form.reset();
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : "Erro ao criar convite");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="ml-auto">
					Novo convite
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="flex flex-col gap-4">
					<DialogTitle>Criar convite</DialogTitle>
					<DialogDescription className="text-warning/80">
						Crie um novo convite para adicionar um músico à banda. O convite expirará em 24 horas.
						<br />
						<br />O músico convidado poderá informar seu melhor e-mail no momento de aceitar o convite.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<DialogFooter>
						<Button type="submit">Criar convite</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
