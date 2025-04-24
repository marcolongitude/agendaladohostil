import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AceitarConviteButton } from "./AceitarConviteButton";
import AceiteLoading from "./loading";

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
	shows: Show;
}

async function getAceiteData(aceiteId: string): Promise<Aceite> {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const { data: aceite } = await supabase
		.from("aceites_show")
		.select(
			`
      *,
      musicos (
        nome,
        instrumento
      ),
      shows (
        *
      )
    `
		)
		.eq("id", aceiteId)
		.single();

	if (!aceite) {
		redirect("/");
	}

	return aceite as Aceite;
}

async function AceiteContainer({ aceiteId }: { aceiteId: string }) {
	const aceite = await getAceiteData(aceiteId);
	const show = aceite.shows;

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
						<CardTitle>Você foi convidado</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div>
								<p className="font-medium">{aceite.musicos.nome}</p>
								<p className="text-sm text-muted-foreground">{aceite.musicos.instrumento}</p>
							</div>
							<div className="flex gap-2">
								<AceitarConviteButton aceite={aceite} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}

export default async function AceitePage({ params }: { params: Promise<{ aceiteId: string }> }) {
	const { aceiteId } = await params;

	return (
		<Suspense fallback={<AceiteLoading />}>
			<AceiteContainer aceiteId={aceiteId} />
		</Suspense>
	);
}
