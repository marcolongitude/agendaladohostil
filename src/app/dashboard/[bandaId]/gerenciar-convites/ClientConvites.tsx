"use client";

import { ConvitesList } from "./ConvitesList";

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

export function ClientConvites({ convites }: ClientConvitesProps) {
	return <ConvitesList convites={convites} />;
}
