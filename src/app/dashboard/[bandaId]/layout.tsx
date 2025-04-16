import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { DashboardMenu } from "./DashboardMenu";
import { use } from "react";

type Banda = {
	nome?: string;
	// Add other banda properties as needed
};

type Usuario = {
	nome: string;
	tipo: string;
};

async function getBanda(bandaId: string): Promise<Banda | null> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const res = await fetch(`${baseUrl}/api/bandas?id=${bandaId}`, { cache: "no-store" });
	if (!res.ok) return null;
	return res.json();
}

async function getUsuario(): Promise<Usuario | null> {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;
	const { data: musico } = await supabase.from("musicos").select("nome, tipo").eq("id", user.id).single();
	return musico
		? { nome: musico.nome, tipo: musico.tipo }
		: { nome: user.user_metadata?.nome || user.email, tipo: user.user_metadata?.tipo || "musico" };
}

function DashboardLayoutContent({
	children,
	banda,
	usuario,
	bandaId,
}: {
	children: React.ReactNode;
	banda: Banda | null;
	usuario: Usuario | null;
	bandaId: string;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-gray-900">
			<DashboardMenu bandaNome={banda?.nome} bandaId={bandaId} usuario={usuario} />
			<div className="flex-1">{children}</div>
		</div>
	);
}

export default function DashboardLayoutWrapper({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ bandaId: string }>;
}) {
	const { bandaId } = use(params);
	const banda = use(getBanda(bandaId));
	const usuario = use(getUsuario());

	return (
		<DashboardLayoutContent banda={banda} usuario={usuario} bandaId={bandaId}>
			{children}
		</DashboardLayoutContent>
	);
}
