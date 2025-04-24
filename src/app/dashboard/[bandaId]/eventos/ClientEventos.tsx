"use client";

import { useState, useMemo } from "react";
import { format, isFuture, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { FilterButtons } from "../../components/filterButtons";

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

interface ClientEventosProps {
	shows: Show[];
}

const statusLabels = {
	futuros: "Eventos Futuros",
	passados: "Eventos Passados",
};

export function ClientEventos({ shows }: ClientEventosProps) {
	const [activeFilter, setActiveFilter] = useState("futuros");

	// Calcula os filtros com contagem
	const filters = useMemo(() => {
		const counts = shows.reduce((acc, show) => {
			const status = isFuture(new Date(show.data)) ? "futuros" : "passados";
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(statusLabels).map(([value, label]) => ({
			value,
			label,
			count: counts[value] || 0,
		}));
	}, [shows]);

	// Filtra e ordena os eventos
	const showsFiltered = useMemo(() => {
		return shows
			.filter((show) => {
				const isShowFuture = isFuture(new Date(show.data));
				return activeFilter === "futuros" ? isShowFuture : !isShowFuture;
			})
			.sort((a, b) => {
				const dateA = new Date(a.data + "T" + a.hora);
				const dateB = new Date(b.data + "T" + b.hora);
				// Para eventos futuros, ordena do mais próximo para o mais distante
				// Para eventos passados, ordena do mais recente para o mais antigo
				return activeFilter === "futuros"
					? dateA.getTime() - dateB.getTime()
					: dateB.getTime() - dateA.getTime();
			});
	}, [shows, activeFilter]);

	function getEventStatus(data: string) {
		const eventDate = new Date(data);
		if (isPast(eventDate)) {
			return {
				label: "Finalizado",
				class: "bg-gray-500/10 text-gray-500",
			};
		}
		return {
			label: "Ativo",
			class: "bg-green-500/10 text-green-500",
		};
	}

	return (
		<div className="space-y-4">
			<FilterButtons filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

			<div className="grid gap-3">
				{showsFiltered.map((show) => {
					const status = getEventStatus(show.data);
					return (
						<Link key={show.id} href={`/dashboard/${show.banda_id}/eventos/${show.id}`}>
							<Card className="hover:bg-accent/50 transition-colors">
								<CardContent className="p-4">
									<div className="flex items-start justify-between gap-2">
										<div className="space-y-1.5">
											<div className="flex items-center gap-2">
												<h3 className="font-medium">{show.nome_evento}</h3>
												<Badge variant="secondary" className={status.class}>
													{status.label}
												</Badge>
											</div>
											<div className="flex flex-col gap-1 text-sm text-muted-foreground">
												<div className="flex items-center gap-1.5">
													<Calendar className="h-3.5 w-3.5" />
													<span>
														{format(new Date(show.data), "dd 'de' MMM 'de' yyyy", {
															locale: ptBR,
														})}
													</span>
												</div>
												<div className="flex items-center gap-1.5">
													<MapPin className="h-3.5 w-3.5" />
													<span>{show.cidade}</span>
												</div>
											</div>
										</div>
										<ChevronRight className="h-5 w-5 text-muted-foreground" />
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
