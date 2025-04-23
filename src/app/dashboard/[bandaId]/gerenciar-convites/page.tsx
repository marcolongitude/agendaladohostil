import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { ClientConvites } from "./ClientConvites";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import GerenciarConvitesLoading from "./loading";

interface Convite {
	id: string;
	banda_id: string;
	email: string | null;
	token: string;
	status: "pendente" | "aceito" | "recusado" | "expirado";
	created_at: string;
	expires_at: string;
}

type ConvitesError = "not_member" | "not_manager" | null;

async function getConvitesData(bandaId: string): Promise<{
	convites: Convite[];
	error: ConvitesError;
}> {
	const supabase = createServerActionClient({
		cookies,
	});

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
		return { convites: [], error: "not_member" };
	}

	if (musico?.tipo !== "manager") {
		return { convites: [], error: "not_manager" };
	}

	// Busca os convites da banda
	const { data: convites } = await supabase
		.from("convites_banda")
		.select("*")
		.eq("banda_id", bandaId)
		.order("created_at", { ascending: false });

	return { convites: (convites as Convite[]) || [], error: null };
}

function ConvitesContent({ bandaId, error, convites }: { bandaId: string; error: ConvitesError; convites: Convite[] }) {
	if (error === "not_member") {
		return (
			<div className="flex flex-col items-center justify-center p-8">
				<h2 className="text-xl font-semibold mb-2">Você não é membro desta banda</h2>
				<p className="text-muted-foreground text-center">
					Você precisa ser membro da banda para acessar esta página.
				</p>
			</div>
		);
	}

	if (error === "not_manager") {
		return (
			<div className="flex flex-col items-center justify-center p-8">
				<h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
				<p className="text-muted-foreground text-center">Apenas managers podem gerenciar convites da banda.</p>
			</div>
		);
	}

	return <ClientConvites convites={convites || []} bandaId={bandaId} />;
}

async function ConvitesContainer({ bandaId }: { bandaId: string }) {
	const data = await getConvitesData(bandaId);

	return <ConvitesContent bandaId={bandaId} error={data.error} convites={data.convites} />;
}

export default async function GerenciarConvitesPage({ params }: { params: Promise<{ bandaId: string }> }) {
	const { bandaId } = await params;

	return (
		<Container title="Gerenciar Convites">
			<Suspense fallback={<GerenciarConvitesLoading />}>
				<ConvitesContainer bandaId={bandaId} />
			</Suspense>
		</Container>
	);
}
