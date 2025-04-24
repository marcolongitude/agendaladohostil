import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { ClientEventos } from "./ClientEventos";
import { Button } from "@/components/ui/button";
import EventosLoading from "./loading";
import Link from "next/link";

interface Show {
	id: string;
	nome_evento: string;
	cidade: string;
	casa_de_show: string;
	data: string;
	hora: string;
	created_at: string;
	banda_id: string;
}

async function getEventosData(bandaId: string): Promise<{
	shows: Show[];
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

	// Busca os shows da banda
	const { data: shows } = await supabase
		.from("shows")
		.select("*")
		.eq("banda_id", bandaId)
		.order("data", { ascending: true });

	// Busca o tipo do usuário
	const { data: musico } = await supabase.from("musicos").select("tipo").eq("id", user.id).single();

	return {
		shows: (shows as Show[]) || [],
		isManager: musico?.tipo === "manager",
	};
}

async function EventosContainer({ bandaId }: { bandaId: string }) {
	const { shows, isManager } = await getEventosData(bandaId);

	return (
		<Container
			title="Eventos"
			action={
				isManager && (
					<Button asChild variant="outline" className="ml-auto">
						<Link href={`/dashboard/${bandaId}/eventos/novo`}>Novo evento</Link>
					</Button>
				)
			}
		>
			<ClientEventos shows={shows} />
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
