"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const conviteSchema = z.object({
	email: z.string().email("E-mail inválido").optional().or(z.literal("")),
	expires_at: z.string().optional(), // ISO string
});

type ConviteFormData = z.infer<typeof conviteSchema>;

export function ConviteForm({ bandaId }: { bandaId: string }) {
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
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Erro ao criar convite");
			}
			toast.success("Convite criado com sucesso!");
			router.push(`/dashboard/${bandaId}/convites`);
			router.refresh();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Erro ao criar convite");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-2 items-end">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Email do convidado (opcional)</FormLabel>
							<FormControl>
								<Input placeholder="email@exemplo.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="expires_at"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Expira em (opcional)</FormLabel>
							<FormControl>
								<Input type="datetime-local" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="mt-6 md:mt-0">
					Criar convite
				</Button>
			</form>
		</Form>
	);
}
