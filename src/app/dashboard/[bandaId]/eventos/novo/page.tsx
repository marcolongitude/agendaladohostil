import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { EventoForm } from "./EventoForm";
import EventosLoading from "../loading";

interface MusicoResponse {
	musico_id: string;
	musicos: {
		id: string;
		nome: string;
		instrumento: string;
	};
}

async function getMusicosData(bandaId: string): Promise<{
	musicos: Array<{
		id: string;
		nome: string;
		instrumento: string;
	}>;
}> {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	// Verifica o usuário
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		redirect("/login");
	}

	// Verifica se o usuário tem permissão para acessar a banda
	const { data: membroBanda } = await supabase
		.from("membros_banda")
		.select("*")
		.eq("banda_id", bandaId)
		.eq("musico_id", user.id)
		.single();

	if (!membroBanda) {
		redirect("/bandas");
	}

	// Busca os músicos da banda
	const { data: musicos } = await supabase
		.from("membros_banda")
		.select(
			`
      musico_id,
      musicos (
        id,
        nome,
        instrumento
      )
    `
		)
		.eq("banda_id", bandaId);

	return {
		musicos:
			(musicos as MusicoResponse[] | null)?.map((m) => ({
				id: m.musicos.id,
				nome: m.musicos.nome,
				instrumento: m.musicos.instrumento,
			})) || [],
	};
}

async function NovoEventoContainer({ bandaId }: { bandaId: string }) {
	const { musicos } = await getMusicosData(bandaId);

	return (
		<Container title="Novo Evento">
			<EventoForm bandaId={bandaId} musicos={musicos} />
		</Container>
	);
}

export default async function NovoEventoPage({ params }: { params: Promise<{ bandaId: string }> }) {
	const { bandaId } = await params;

	return (
		<Suspense fallback={<EventosLoading />}>
			<NovoEventoContainer bandaId={bandaId} />
		</Suspense>
	);
}
