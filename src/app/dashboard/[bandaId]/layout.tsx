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
	const { data: banda } = await supabase.from("bandas").select("nome, id").eq("id", bandaId).single();
	return banda;
}

export default async function BandaLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { bandaId: string };
}) {
	const banda = await getBanda(params.bandaId);

	if (!banda) {
		redirect("/dashboard");
	}

	return <>{children}</>;
}
