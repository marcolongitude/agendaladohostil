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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const conviteSchema = z.object({
	email: z.string().email("E-mail inválido").optional().or(z.literal("")),
	expires_at: z.string().optional(),
});

type ConviteFormData = z.infer<typeof conviteSchema>;

interface ConviteDialogProps {
	bandaId: string;
	onSuccess?: () => void;
}

export function ConviteDialog({ bandaId, onSuccess }: ConviteDialogProps) {
	const [open, setOpen] = useState(false);
	const form = useForm<ConviteFormData>({
		resolver: zodResolver(conviteSchema),
		defaultValues: { email: "", expires_at: "" },
	});

	async function onSubmit(data: ConviteFormData) {
		try {
			const supabase = createClientComponentClient();

			// Gera um token seguro
			const token = crypto.randomUUID();

			// Salva o convite diretamente usando Supabase
			const { error } = await supabase.from("convites_banda").insert({
				banda_id: bandaId,
				email: data.email || null,
				token,
				status: "pendente",
				expires_at: data.expires_at || null,
			});

			if (error) throw new Error("Erro ao criar convite: " + error.message);

			toast.success("Convite criado com sucesso!");
			setOpen(false);
			if (onSuccess) {
				onSuccess();
			}
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
				<DialogHeader>
					<DialogTitle>Criar convite</DialogTitle>
					<DialogDescription>Crie um novo convite para adicionar um músico à banda.</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<Label htmlFor="email">E-mail do convidado (opcional)</Label>
						<Input id="email" type="email" {...form.register("email")} placeholder="email@exemplo.com" />
						{form.formState.errors.email && (
							<span className="text-xs text-red-500">{form.formState.errors.email.message}</span>
						)}
					</div>
					<div>
						<Label htmlFor="expires_at">Expira em (opcional)</Label>
						<Input id="expires_at" type="datetime-local" {...form.register("expires_at")} />
						{form.formState.errors.expires_at && (
							<span className="text-xs text-red-500">{form.formState.errors.expires_at.message}</span>
						)}
					</div>
					<DialogFooter>
						<Button type="submit">Criar convite</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
