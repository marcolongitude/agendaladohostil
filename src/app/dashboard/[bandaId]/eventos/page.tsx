"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Title } from "../../components/title";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Compromisso {
	id: string;
	titulo: string;
	descricao: string | null;
	data: string;
	hora: string;
	local: string;
	status: "agendado" | "cancelado" | "concluido";
}

export default function EventosPage() {
	const params = useParams();
	const { setLoading, setLoadingMessage } = useLoading();
	const [data, setData] = useState<{
		compromissos: Compromisso[];
		userType?: string;
		isLoading: boolean;
	}>({ compromissos: [], isLoading: true });

	useEffect(() => {
		let isMounted = true;

		async function loadData() {
			if (!isMounted) return;

			try {
				setLoading(true);
				setLoadingMessage("Carregando eventos...");

				const bandaId = params?.bandaId as string;

				// Buscar eventos e tipo do usuário em paralelo
				const [eventosResponse, userTypeResponse] = await Promise.all([
					fetch(`/api/eventos?bandaId=${bandaId}`),
					fetch("/api/user/type"),
				]);

				// Verificar erros nas respostas
				if (!eventosResponse.ok) {
					const error = await eventosResponse.json();
					throw new Error(error.error || "Erro ao carregar eventos");
				}

				if (!userTypeResponse.ok) {
					const error = await userTypeResponse.json();
					throw new Error(error.error || "Erro ao carregar tipo do usuário");
				}

				// Processar as respostas
				const [{ compromissos }, { tipo: userType }] = await Promise.all([
					eventosResponse.json(),
					userTypeResponse.json(),
				]);

				if (!isMounted) return;

				setData({
					compromissos,
					userType,
					isLoading: false,
				});
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error(error instanceof Error ? error.message : "Erro ao carregar dados");
				if (isMounted) {
					setData((prev) => ({ ...prev, isLoading: false }));
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadData();

		return () => {
			isMounted = false;
		};
	}, [params?.bandaId]);

	if (data.isLoading) {
		return null;
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "agendado":
				return "text-yellow-500";
			case "concluido":
				return "text-green-500";
			case "cancelado":
				return "text-red-500";
			default:
				return "text-gray-500";
		}
	}

	return (
		<main className="p-8 max-w-3xl mx-auto">
			<header className="flex justify-between items-center mb-8">
				<Title>Eventos</Title>
				{data.userType === "manager" && (
					<Button variant="outline" className="ml-auto">
						Novo evento
					</Button>
				)}
			</header>

			<ul className="space-y-4">
				{data.compromissos.map((compromisso) => (
					<li
						key={compromisso.id}
						className="p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
					>
						<div className="space-y-2">
							<div className="flex items-start justify-between gap-4">
								<h3 className="font-semibold text-lg">{compromisso.titulo}</h3>
								<span className={`text-sm font-medium ${getStatusColor(compromisso.status)}`}>
									{compromisso.status}
								</span>
							</div>

							{compromisso.descricao && (
								<p className="text-sm text-muted-foreground">{compromisso.descricao}</p>
							)}

							<div className="flex flex-col gap-1 text-sm">
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">Data:</span>
									<span>
										{format(new Date(compromisso.data), "dd 'de' MMMM 'de' yyyy", {
											locale: ptBR,
										})}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">Hora:</span>
									<span>{compromisso.hora}</span>
								</div>

								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">Local:</span>
									<span>{compromisso.local}</span>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</main>
	);
}
