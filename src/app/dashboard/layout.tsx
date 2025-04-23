import { redirect } from "next/navigation";
import { DashboardMenu } from "./components/DashboardMenu";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Usuario = {
	nome: string;
	tipo: string;
	email: string;
};

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

async function getUsuario(): Promise<Usuario | null> {
	const supabase = createServerActionClient({
		cookies,
	});

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
			.select("nome, tipo, email")
			.eq("id", user.id)
			.single();

		if (musicoError) {
			console.error("Erro ao buscar músico:", musicoError);
			return {
				nome: user.user_metadata?.nome || user.email || "",
				tipo: user.user_metadata?.tipo || "musico",
				email: user.email || "",
			};
		}

		return musico
			? {
					nome: musico.nome,
					tipo: musico.tipo,
					email: musico.email || user.email || "",
			  }
			: {
					nome: user.user_metadata?.nome || user.email || "",
					tipo: user.user_metadata?.tipo || "musico",
					email: user.email || "",
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
	params: { bandaId?: string };
}) {
	const bandaId = params.bandaId;
	const usuario = await getUsuario();

	if (!usuario) {
		redirect("/login");
	}

	const banda = bandaId ? await getBanda(bandaId) : null;

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<DashboardMenu usuario={usuario} bandaId={banda?.id} bandaNome={banda?.nome} />
			<div className="flex-1">{children}</div>
		</div>
	);
}
