"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface ClientEventosProps {
	compromissos: Compromisso[];
}

const statusLabels = {
	agendado: "Agendados",
	concluido: "Concluídos",
	cancelado: "Cancelados",
};

export function ClientEventos({ compromissos }: ClientEventosProps) {
	const [activeFilter, setActiveFilter] = useState("todos");

	// Calcula os filtros com contagem
	const filters = useMemo(() => {
		const counts = compromissos.reduce((acc, evento) => {
			acc[evento.status] = (acc[evento.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(statusLabels).map(([value, label]) => ({
			value,
			label,
			count: counts[value] || 0,
		}));
	}, [compromissos]);

	// Filtra e ordena os eventos
	const eventosFiltered = useMemo(() => {
		return compromissos
			.filter((evento) => activeFilter === "todos" || evento.status === activeFilter)
			.sort((a, b) => {
				// Primeiro, comparar as datas
				const dateA = new Date(a.data + "T" + a.hora);
				const dateB = new Date(b.data + "T" + b.hora);
				return dateA.getTime() - dateB.getTime();
			});
	}, [compromissos, activeFilter]);

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
		<div className="space-y-6">
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
		</div>
	);
}
