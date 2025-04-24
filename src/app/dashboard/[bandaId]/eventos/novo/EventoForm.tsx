"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

const formSchema = z.object({
	nome_evento: z.string().min(1, "Nome do evento é obrigatório"),
	cidade: z.string().min(1, "Cidade é obrigatória"),
	casa_de_show: z.string().min(1, "Casa de show é obrigatória"),
	data: z.string().min(1, "Data é obrigatória"),
	hora: z.string().min(1, "Hora é obrigatória"),
	musicos: z.array(z.string()).min(1, "Selecione pelo menos um músico"),
});

type FormData = z.infer<typeof formSchema>;

interface EventoFormProps {
	bandaId: string;
	musicos: Array<{
		id: string;
		nome: string;
		instrumento: string;
	}>;
}

export function EventoForm({ bandaId, musicos }: EventoFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome_evento: "",
			cidade: "",
			casa_de_show: "",
			data: "",
			hora: "",
			musicos: [],
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/eventos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					banda_id: bandaId,
				}),
			});

			if (!response.ok) {
				throw new Error("Erro ao criar evento");
			}

			toast.success("Evento criado com sucesso!");
			router.push(`/dashboard/${bandaId}/eventos`);
		} catch (error) {
			toast.error("Erro ao criar evento");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="nome_evento"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome do Evento</FormLabel>
							<FormControl>
								<Input placeholder="Digite o nome do evento" {...field} />
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
								<Input placeholder="Digite a cidade" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="casa_de_show"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Casa de Show</FormLabel>
							<FormControl>
								<Input placeholder="Digite o nome da casa de show" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="data"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Data</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="hora"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Hora</FormLabel>
								<FormControl>
									<Input type="time" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="musicos"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Músicos</FormLabel>
							<FormControl>
								<MultiSelect
									options={musicos.map((m) => ({
										label: `${m.nome} (${m.instrumento})`,
										value: m.id,
									}))}
									selected={field.value}
									onChange={field.onChange}
									placeholder="Selecione os músicos"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end space-x-4">
					<Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Criando..." : "Criar Evento"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
