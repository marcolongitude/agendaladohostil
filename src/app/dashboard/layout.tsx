import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { DashboardMenu } from "./components/DashboardMenu";

type Usuario = {
	nome: string;
	tipo: string;
};

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

async function getUsuario(): Promise<Usuario | null> {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	try {
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (userError || !user) {
			return null;
		}

		const { data: musico, error: musicoError } = await supabase
			.from("musicos")
			.select("nome, tipo")
			.eq("id", user.id)
			.single();

		if (musicoError) {
			console.error("Erro ao buscar músico:", musicoError);
			return {
				nome: user.user_metadata?.nome || user.email,
				tipo: user.user_metadata?.tipo || "musico",
			};
		}

		return musico
			? {
					nome: musico.nome,
					tipo: musico.tipo,
			  }
			: {
					nome: user.user_metadata?.nome || user.email,
					tipo: user.user_metadata?.tipo || "musico",
			  };
	} catch (error) {
		console.error("Erro ao buscar usuário:", error);
		return null;
	}
}

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ bandaId?: string }>;
}) {
	const { bandaId } = await params;
	const usuario = await getUsuario();

	if (!usuario) {
		redirect("/login");
	}

	const banda = bandaId ? await getBanda(bandaId) : null;

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<DashboardMenu usuario={usuario} bandaId={banda?.id} />
			<div className="flex-1">{children}</div>
		</div>
	);
}
