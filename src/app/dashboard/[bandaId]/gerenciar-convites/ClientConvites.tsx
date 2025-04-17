"use client";

import { ConvitesList } from "./ConvitesList";
import { ConviteDialog } from "./ConviteDialog";
import { useUser } from "@/hooks/useUser";
import { useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

interface Convite {
	id: string;
	banda_id: string;
	email: string | null;
	token: string;
	status: "pendente" | "aceito" | "recusado" | "expirado";
	created_at: string;
	expires_at: string;
}

interface ClientConvitesProps {
	bandaId: string;
	convites: Convite[];
}

export function ClientConvites({ bandaId, convites: initialConvites }: ClientConvitesProps) {
	const { user } = useUser();
	const [convites, setConvites] = useState<Convite[]>(initialConvites);

	const refreshConvites = useCallback(async () => {
		try {
			const supabase = createClientComponentClient();
			const { data, error } = await supabase
				.from("convites_banda")
				.select("*")
				.eq("banda_id", bandaId)
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			if (data) {
				setConvites(data);
			}
		} catch (error) {
			console.error("Erro ao atualizar lista de convites:", error);
			toast.error("Erro ao atualizar lista de convites");
		}
	}, [bandaId]);

	return (
		<div className="space-y-4">
			{user?.tipo === "manager" && (
				<div className="flex justify-end">
					<ConviteDialog bandaId={bandaId} onSuccess={refreshConvites} />
				</div>
			)}
			<ConvitesList convites={convites} />
		</div>
	);
}
