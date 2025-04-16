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
import cep from "cep-promise";

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
			cep: "",
		},
	});

	const handleCepChange = async (cepValue: string) => {
		if (cepValue.length === 8) {
			try {
				const address = await cep(cepValue);
				form.reset({
					...form.getValues(),
					cidade: address.city,
					estado: address.state,
				});
			} catch {
				toast.error("CEP não encontrado");
				form.reset({
					...form.getValues(),
					cidade: "",
					estado: "",
				});
			}
		}
	};

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
					name="cep"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CEP</FormLabel>
							<FormControl>
								<Input
									placeholder="Digite o CEP"
									{...field}
									onChange={(e) => {
										const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
										field.onChange(value);
										if (value.length === 8) {
											handleCepChange(value);
										}
									}}
									value={field.value}
									maxLength={8}
								/>
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
								<Input placeholder="Cidade" {...field} disabled />
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
								<Input placeholder="Estado" {...field} disabled />
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
