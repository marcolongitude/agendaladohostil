"use client";

import { Badge } from "@/components/ui/badge";
import { CopyLinkButton } from "./CopyLinkButton";

interface Convite {
	id: string;
	banda_id: string;
	email: string | null;
	token: string;
	status: "pendente" | "aceito" | "recusado" | "expirado";
	created_at: string;
	expires_at: string;
}

interface ConvitesListProps {
	convites: Convite[];
}

export function ConvitesList({ convites }: ConvitesListProps) {
	if (convites.length === 0) {
		return <p className="text-muted-foreground text-center">Nenhum convite encontrado.</p>;
	}

	return (
		<div className="space-y-2">
			{convites.map((convite) => (
				<div key={convite.id} className="flex flex-col gap-1 p-4 rounded-lg bg-card/30">
					<p className="text-sm text-muted-foreground">ID: {convite.id}</p>
					<div className="flex items-center gap-2">
						<p className="text-sm text-muted-foreground">Status:</p>
						<Badge
							variant="secondary"
							className={
								convite.status === "pendente"
									? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20"
									: convite.status === "aceito"
									? "bg-green-500/20 text-green-500 hover:bg-green-500/20"
									: convite.status === "expirado"
									? "bg-destructive/20 text-destructive hover:bg-destructive/20"
									: "bg-destructive/20 text-destructive hover:bg-destructive/20"
							}
						>
							{convite.status}
						</Badge>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Expira em:{" "}
							{new Date(convite.expires_at).toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</p>
						<CopyLinkButton token={convite.token} />
					</div>
				</div>
			))}
		</div>
	);
}
