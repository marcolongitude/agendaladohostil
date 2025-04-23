import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { ClientEventos } from "./ClientEventos";
import { Button } from "@/components/ui/button";
import EventosLoading from "./loading";

interface Compromisso {
	id: string;
	banda_id: string;
	titulo: string;
	descricao: string | null;
	data: string;
	hora: string;
	local: string;
	status: "agendado" | "cancelado" | "concluido";
	created_at: string;
}

async function getEventosData(bandaId: string): Promise<{
	compromissos: Compromisso[];
	isManager: boolean;
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

	// Busca os eventos da banda
	const { data: compromissos } = await supabase
		.from("compromissos_banda")
		.select("*")
		.eq("banda_id", bandaId)
		.order("data", { ascending: true });

	// Busca o tipo do usuário
	const { data: musico } = await supabase.from("musicos").select("tipo").eq("id", user.id).single();

	return {
		compromissos: (compromissos as Compromisso[]) || [],
		isManager: musico?.tipo === "manager",
	};
}

async function EventosContainer({ bandaId }: { bandaId: string }) {
	const { compromissos, isManager } = await getEventosData(bandaId);

	return (
		<Container
			title="Eventos"
			action={
				isManager && (
					<Button variant="outline" className="ml-auto">
						Novo evento
					</Button>
				)
			}
		>
			<ClientEventos compromissos={compromissos} />
		</Container>
	);
}

export default async function EventosPage({ params }: { params: Promise<{ bandaId: string }> }) {
	const { bandaId } = await params;

	return (
		<Suspense fallback={<EventosLoading />}>
			<EventosContainer bandaId={bandaId} />
		</Suspense>
	);
}
