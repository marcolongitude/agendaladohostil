import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { ClientConvites } from "./ClientConvites";

export default async function GerenciarConvitesPage({ params }: { params: Promise<{ bandaId: string }> }) {
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

	// Busca os convites da banda
	const { data: convites } = await supabase
		.from("convites_banda")
		.select("*")
		.eq("banda_id", bandaId)
		.order("created_at", { ascending: false });

	// Busca o tipo do usuário
	const { data: musico } = await supabase.from("musicos").select("tipo").eq("id", user.id).single();

	if (musico?.tipo !== "manager") {
		redirect("/bandas");
	}

	return (
		<Container title="Gerenciar Convites">
			<ClientConvites convites={convites || []} bandaId={bandaId} />
		</Container>
	);
}
