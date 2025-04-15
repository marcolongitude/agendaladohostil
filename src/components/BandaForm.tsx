"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bandaSchema, type BandaFormData } from "@/schemas/banda";
import { toast } from "sonner";

export function BandaForm() {
	const router = useRouter();

	const form = useForm<BandaFormData>({
		resolver: zodResolver(bandaSchema),
		defaultValues: {
			nome: "",
			descricao: "",
			cidade: "",
			estado: "",
			genero: "",
		},
	});

	async function onSubmit(data: BandaFormData) {
		try {
			const response = await fetch("/api/bandas", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Erro ao criar banda");
			}

			toast.success("Banda criada com sucesso!");
			router.push("/bandas");
			router.refresh();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Erro ao criar banda");
			}
			console.error(error);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Nome da banda" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="descricao"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Textarea placeholder="Descreva sua banda" className="resize-none" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="cidade"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cidade</FormLabel>
							<FormControl>
								<Input placeholder="Cidade" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="estado"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Estado</FormLabel>
							<FormControl>
								<Input placeholder="Estado" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="genero"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gênero Musical</FormLabel>
							<FormControl>
								<Input placeholder="Gênero musical principal" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full">
					Criar Banda
				</Button>
			</form>
		</Form>
	);
}
