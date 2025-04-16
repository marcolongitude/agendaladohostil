"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { bandaSchema, type BandaFormData } from "@/schemas/banda";
import { toast } from "sonner";
import cep from "cep-promise";
import { FormInput } from "@/components/form/FormInput";

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
		<FormProvider {...form}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormInput name="nome" label="Nome" placeholder="Nome da banda" />
					<div className="space-y-2">
						<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Descrição
						</label>
						<Textarea
							{...form.register("descricao")}
							placeholder="Descreva sua banda"
							className="resize-none"
						/>
						{form.formState.errors.descricao && (
							<p className="text-sm font-medium text-destructive">
								{form.formState.errors.descricao.message}
							</p>
						)}
					</div>
					<FormInput
						name="cep"
						label="CEP"
						placeholder="Digite o CEP"
						mask="cep"
						onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
							// O FormInput já aplica a máscara, então podemos pegar o valor limpo
							const cleanCep = e.target.value.replace(/\D/g, "");
							if (cleanCep.length === 8) {
								handleCepChange(cleanCep);
							}
						}}
					/>
					<FormInput name="cidade" label="Cidade" placeholder="Cidade" disabled />
					<FormInput name="estado" label="Estado" placeholder="Estado" disabled />
					<FormInput name="genero" label="Gênero Musical" placeholder="Gênero musical principal" />
					<Button type="submit" className="w-full">
						Criar Banda
					</Button>
				</form>
			</Form>
		</FormProvider>
	);
}
