"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
	const router = useRouter();
	const form = useForm<ConviteFormData>({
		resolver: zodResolver(conviteSchema),
		defaultValues: { email: "", expires_at: "" },
	});

	async function onSubmit(data: ConviteFormData) {
		try {
			const response = await fetch("/api/convites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					banda_id: bandaId,
					email: data.email || null,
					expires_at: data.expires_at || null,
				}),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "Erro ao criar convite");
			toast.success("Convite criado com sucesso!");
			setOpen(false);
			router.refresh();
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
