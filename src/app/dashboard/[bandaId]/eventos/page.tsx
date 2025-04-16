"use client";

import { useEffect, useState, useMemo } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Title } from "../../components/title";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { FilterButtons } from "../../components/filterButtons";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Compromisso {
	id: string;
	titulo: string;
	descricao: string | null;
	data: string;
	hora: string;
	local: string;
	status: "agendado" | "cancelado" | "concluido";
}

const statusLabels = {
	agendado: "Agendados",
	concluido: "Concluídos",
	cancelado: "Cancelados",
};

export default function EventosPage() {
	const params = useParams();
	const { setLoading, setLoadingMessage } = useLoading();
	const [activeFilter, setActiveFilter] = useState("todos");
	const [data, setData] = useState<{
		compromissos: Compromisso[];
		userType?: string;
		isLoading: boolean;
	}>({ compromissos: [], isLoading: true });

	// Calcula os filtros com contagem
	const filters = useMemo(() => {
		const counts = data.compromissos.reduce((acc, evento) => {
			acc[evento.status] = (acc[evento.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(statusLabels).map(([value, label]) => ({
			value,
			label,
			count: counts[value] || 0,
		}));
	}, [data.compromissos]);

	// Filtra e ordena os eventos
	const eventosFiltered = useMemo(() => {
		return data.compromissos
			.filter((evento) => activeFilter === "todos" || evento.status === activeFilter)
			.sort((a, b) => {
				// Primeiro, comparar as datas
				const dateA = new Date(a.data + "T" + a.hora);
				const dateB = new Date(b.data + "T" + b.hora);
				return dateA.getTime() - dateB.getTime();
			});
	}, [data.compromissos, activeFilter]);

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

	function getEmptyMessage(filter: string) {
		if (filter === "todos") {
			return "Nenhum evento encontrado.";
		}
		return `Nenhum evento ${statusLabels[filter as keyof typeof statusLabels].toLowerCase()} encontrado.`;
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

			<FilterButtons filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

			{eventosFiltered.length === 0 ? (
				<Alert variant="default" className="bg-card border-warning/50">
					<AlertCircle className="h-4 w-4 text-warning" />
					<AlertDescription className="text-warning">{getEmptyMessage(activeFilter)}</AlertDescription>
				</Alert>
			) : (
				<ul className="space-y-4">
					{eventosFiltered.map((compromisso) => (
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
			)}
		</main>
	);
}
