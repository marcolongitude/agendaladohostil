import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EventoLoading from "./loading";
import { ShareAceite } from "./ShareAceite";

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

interface Aceite {
	id: string;
	musico_id: string;
	show_id: string;
	status: "pendente" | "aceito" | "recusado";
	created_at: string;
	musicos: {
		nome: string;
		instrumento: string;
	};
}

async function getEventoData(
	bandaId: string,
	eventoId: string
): Promise<{
	show: Show;
	aceites: Aceite[];
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

	// Busca o tipo do usuário
	const { data: musico } = await supabase.from("musicos").select("tipo").eq("id", user.id).single();

	// Busca o show
	const { data: show } = await supabase.from("shows").select("*").eq("id", eventoId).single();

	if (!show) {
		redirect(`/dashboard/${bandaId}/eventos`);
	}

	// Busca os aceites
	const { data: aceites } = await supabase
		.from("aceites_show")
		.select(
			`
      *,
      musicos (
        nome,
        instrumento
      )
    `
		)
		.eq("show_id", eventoId);

	return {
		show: show as Show,
		aceites: (aceites as Aceite[]) || [],
		isManager: musico?.tipo === "manager",
	};
}

function getStatusColor(status: string) {
	switch (status) {
		case "aceito":
			return "bg-green-500/10 text-green-500";
		case "pendente":
			return "bg-yellow-500/10 text-yellow-500";
		case "recusado":
			return "bg-red-500/10 text-red-500";
		default:
			return "bg-gray-500/10 text-gray-500";
	}
}

async function EventoContainer({ bandaId, eventoId }: { bandaId: string; eventoId: string }) {
	const { show, aceites, isManager } = await getEventoData(bandaId, eventoId);

	return (
		<Container title={show.nome_evento}>
			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Informações do Evento</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="flex items-center gap-2">
								<Calendar className="h-5 w-5 text-muted-foreground" />
								<span>
									{format(new Date(show.data), "dd 'de' MMMM 'de' yyyy", {
										locale: ptBR,
									})}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-5 w-5 text-muted-foreground" />
								<span>{format(new Date(`2000-01-01T${show.hora}`), "HH:mm")}</span>
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-muted-foreground" />
								<span>{show.casa_de_show}</span>
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-muted-foreground" />
								<span>{show.cidade}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Músicos Convidados</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{aceites.map((aceite, index) => (
								<div key={aceite.id}>
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">{aceite.musicos.nome}</p>
											<p className="text-sm text-muted-foreground">
												{aceite.musicos.instrumento}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge className={getStatusColor(aceite.status)}>
												{aceite.status.charAt(0).toUpperCase() + aceite.status.slice(1)}
											</Badge>
											{isManager && aceite.status === "pendente" && (
												<ShareAceite aceiteId={aceite.id} />
											)}
										</div>
									</div>
									{index < aceites.length - 1 && <Separator className="my-4" />}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}

export default async function EventoPage({ params }: { params: Promise<{ bandaId: string; eventoId: string }> }) {
	const { bandaId, eventoId } = await params;

	return (
		<Suspense fallback={<EventoLoading />}>
			<EventoContainer bandaId={bandaId} eventoId={eventoId} />
		</Suspense>
	);
}
