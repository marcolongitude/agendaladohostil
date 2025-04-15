import { Menu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { DashboardMenu } from "./DashboardMenu";

async function getBanda(bandaId: string) {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const res = await fetch(`${baseUrl}/api/bandas?id=${bandaId}`, { cache: "no-store" });
	if (!res.ok) return null;
	return res.json();
}

async function getUsuario() {
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

function getInitials(nome: string) {
	if (!nome) return "";
	return nome
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { bandaId: string };
}) {
	const banda = await getBanda(params.bandaId);
	const usuario = await getUsuario();

	return (
		<div className="min-h-screen flex flex-col bg-gray-900">
			<DashboardMenu bandaNome={banda?.nome} bandaId={params.bandaId} usuario={usuario} />
			<div className="flex-1">{children}</div>
		</div>
	);
}
