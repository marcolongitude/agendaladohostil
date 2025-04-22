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

	// Busca o tipo do usuário
	const { data: musico } = await supabase.from("musicos").select("tipo").eq("id", user.id).single();

	// Verifica se o usuário tem permissão para acessar a banda
	const { data: membroBanda } = await supabase
		.from("membros_banda")
		.select("*")
		.eq("banda_id", bandaId)
		.eq("musico_id", user.id)
		.single();

	if (!membroBanda) {
		return (
			<Container title="Acesso Negado">
				<div className="flex flex-col items-center justify-center p-8">
					<h2 className="text-xl font-semibold mb-2">Você não é membro desta banda</h2>
					<p className="text-muted-foreground text-center">
						Você precisa ser membro da banda para acessar esta página.
					</p>
				</div>
			</Container>
		);
	}

	if (musico?.tipo !== "manager") {
		return (
			<Container title="Acesso Negado">
				<div className="flex flex-col items-center justify-center p-8">
					<h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
					<p className="text-muted-foreground text-center">
						Apenas managers podem gerenciar convites da banda.
					</p>
				</div>
			</Container>
		);
	}

	// Busca os convites da banda
	const { data: convites } = await supabase
		.from("convites_banda")
		.select("*")
		.eq("banda_id", bandaId)
		.order("created_at", { ascending: false });

	return (
		<Container title="Gerenciar Convites">
			<ClientConvites convites={convites || []} bandaId={bandaId} />
		</Container>
	);
}
