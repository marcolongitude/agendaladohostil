import { redirect } from "next/navigation";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Banda = {
	nome?: string;
	id: string;
};

async function getBanda(bandaId: string): Promise<Banda | null> {
	const supabase = createServerActionClient({
		cookies,
	});

	try {
		const { data: banda, error } = await supabase.from("bandas").select("nome, id").eq("id", bandaId).single();

		if (error) {
			console.error("Erro ao buscar banda:", error);
			return null;
		}

		return banda;
	} catch (error) {
		console.error("Erro ao buscar banda:", error);
		return null;
	}
}

export default async function BandaLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ bandaId: string }>;
}) {
	const { bandaId } = await params;
	const banda = await getBanda(bandaId);

	if (!banda) {
		redirect("/dashboard");
	}

	return <>{children}</>;
}
