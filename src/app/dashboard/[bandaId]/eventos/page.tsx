import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { ClientEventos } from "./ClientEventos";
import { Button } from "@/components/ui/button";

export default async function EventosPage({ params }: { params: Promise<{ bandaId: string }> }) {
	const { bandaId } = await params;
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

	console.log("Compromissos encontrados:", compromissos); // Para debug

	return (
		<Container
			title="Eventos"
			action={
				musico?.tipo === "manager" && (
					<Button variant="outline" className="ml-auto">
						Novo evento
					</Button>
				)
			}
		>
			<ClientEventos compromissos={compromissos || []} />
		</Container>
	);
}
