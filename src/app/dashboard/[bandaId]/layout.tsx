import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

type Banda = {
	nome?: string;
	id: string;
};

async function getBanda(bandaId: string): Promise<Banda | null> {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const { data: banda, error } = await supabase.from("bandas").select("*").eq("id", bandaId).single();

	if (error) {
		console.error("Erro ao buscar banda:", error);
		return null;
	}

	return banda;
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
