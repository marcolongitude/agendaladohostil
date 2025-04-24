"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Show {
	id: string;
	nome_evento: string;
	cidade: string;
	casa_de_show: string;
	data: string;
	hora: string;
	created_at: string;
	banda_id: string;
}

interface Aceite {
	id: string;
	musico_id: string;
	show_id: string;
	status: "pendente" | "aceito" | "recusado";
	created_at: string;
	musicos: {
		nome: string;
		instrumento: string;
	};
	shows: Show;
}

interface AceitarConviteButtonProps {
	aceite: Aceite;
}

export function AceitarConviteButton({ aceite }: AceitarConviteButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleResponse = async (status: "aceito" | "recusado") => {
		try {
			setIsLoading(true);

			const response = await fetch(`/api/aceites/${aceite.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erro ao responder o convite");
			}

			toast.success(status === "aceito" ? "Convite aceito com sucesso!" : "Convite recusado com sucesso!");

			// Redireciona para a página de login após 1 segundo
			setTimeout(() => {
				router.push("/login");
			}, 1000);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Erro ao responder o convite. Tente novamente.");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	if (aceite.status !== "pendente") {
		return (
			<p className="text-sm text-muted-foreground">
				Você já {aceite.status === "aceito" ? "aceitou" : "recusou"} este convite.
			</p>
		);
	}

	return (
		<>
			<Button variant="default" size="lg" onClick={() => handleResponse("aceito")} disabled={isLoading}>
				<Check className="mr-2 h-4 w-4" />
				Aceitar
			</Button>
			<Button variant="destructive" size="lg" onClick={() => handleResponse("recusado")} disabled={isLoading}>
				<X className="mr-2 h-4 w-4" />
				Recusar
			</Button>
		</>
	);
}
