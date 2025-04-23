"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Musico {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	instrumento: string;
	tipo: string;
}

interface MembroBanda {
	musico_id: string;
	musico: Musico;
}

interface ClientMusicosProps {
	membros: MembroBanda[];
}

export function ClientMusicos({ membros }: ClientMusicosProps) {
	if (membros.length === 0) {
		return (
			<Alert variant="default" className="bg-card border-warning/50">
				<AlertCircle className="h-4 w-4 text-warning" />
				<AlertDescription className="text-warning">Nenhum músico encontrado.</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			{membros.map(({ musico }) => (
				<div
					key={musico.id}
					className="p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
				>
					<div className="flex flex-col justify-between">
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">{musico.nome}</h3>
							<div className="space-y-1 text-sm text-muted-foreground">
								<p>{musico.email}</p>
								<p>{musico.telefone}</p>
							</div>
						</div>
						<div className="flex justify-end items-end gap-4 text-sm">
							<span>{musico.instrumento}</span>
							<span className="capitalize">{musico.tipo}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
