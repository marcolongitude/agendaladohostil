import { Suspense } from "react";
import { Container } from "@/components/Container";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientMusicos } from "./ClientMusicos";
import MusicosLoading from "./loading";

interface Musico {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	instrumento: string;
	tipo: string;
}

interface MembroBanda {
	musico_id: string;
	musico: Musico;
}

async function getMusicosData(bandaId: string): Promise<{
	membros: MembroBanda[];
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

	// Busca os músicos da banda com seus dados
	const { data: membros } = await supabase
		.from("membros_banda")
		.select(
			`
			musico_id,
			musico:musicos!inner (
				id,
				nome,
				email,
				telefone,
				instrumento,
				tipo
			)
		`
		)
		.eq("banda_id", bandaId)
		.returns<{ musico_id: string; musico: Musico }[]>();

	return { membros: membros || [] };
}

async function MusicosContainer({ bandaId }: { bandaId: string }) {
	const { membros } = await getMusicosData(bandaId);
	return <ClientMusicos membros={membros} />;
}

export default async function MusicosPage({ params }: { params: Promise<{ bandaId: string }> }) {
	const { bandaId } = await params;

	return (
		<Container title="Lista de Músicos">
			<Suspense fallback={<MusicosLoading />}>
				<MusicosContainer bandaId={bandaId} />
			</Suspense>
		</Container>
	);
}
