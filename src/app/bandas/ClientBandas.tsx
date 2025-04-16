"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Banda {
	id: string;
	nome: string;
	descricao: string;
	compromissos_banda: {
		status: string;
		data: string;
		hora: string;
	}[];
}

interface ClientBandasProps {
	bandas: Banda[];
	userType: string;
}

export function ClientBandas({ bandas, userType }: ClientBandasProps) {
	// Função para verificar se a banda tem eventos futuros
	const temEventosFuturos = (banda: Banda) => {
		if (!banda.compromissos_banda) return false;
		const hoje = new Date();
		return banda.compromissos_banda.some((compromisso) => {
			const dataEvento = new Date(`${compromisso.data}T${compromisso.hora}`);
			return compromisso.status === "agendado" && dataEvento > hoje;
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				{userType === "manager" && (
					<Button asChild variant="outline" size="default">
						<Link href="/bandas/nova" className="flex items-center gap-2">
							<Plus className="w-4 h-4" />
							Nova Banda
						</Link>
					</Button>
				)}
			</div>

			{bandas.length === 0 ? (
				<div className="text-center text-muted-foreground mt-10">
					Você ainda não pertence a nenhuma banda.
					<br />
					{userType === "manager"
						? "Clique em 'Nova Banda' para criar uma."
						: "Peça para um manager te adicionar a uma banda."}
				</div>
			) : (
				<div className="space-y-1">
					{bandas.map((banda) => (
						<div key={banda.id}>
							<Button variant="ghost" className="w-full p-4 h-auto hover:bg-muted" asChild>
								<Link href={`/dashboard/${banda.id}`}>
									<div className="flex items-center gap-3 w-full">
										<div className="flex-1 text-left">
											<h2 className="text-lg font-medium group-hover:text-primary transition-colors">
												{banda.nome}
											</h2>
											<p className="text-sm text-muted-foreground line-clamp-1">
												{banda.descricao}
											</p>
										</div>
										<div className="flex items-center gap-2">
											{temEventosFuturos(banda) && (
												<span className="relative flex h-3 w-3">
													<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
													<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
												</span>
											)}
											<svg
												className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									</div>
								</Link>
							</Button>
							<div className="h-[1px] bg-border"></div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
