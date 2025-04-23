import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientProfile } from "./ClientProfile";
import { Container } from "@/components/Container";
import PerfilLoading from "./loading";

interface Musico {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	instrumento: string;
	tipo: string;
	created_at: string;
}

async function getPerfilData(): Promise<{
	musico: Musico;
}> {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	// Verifica o usuário de forma segura
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		redirect("/login");
	}

	const { data: musico } = await supabase.from("musicos").select("*").eq("id", user.id).single();

	if (!musico) {
		redirect("/login");
	}

	return { musico };
}

async function PerfilContainer() {
	const { musico } = await getPerfilData();
	return <ClientProfile musico={musico} />;
}

export default function PerfilPage() {
	return (
		<Container title="Perfil">
			<Suspense fallback={<PerfilLoading />}>
				<PerfilContainer />
			</Suspense>
		</Container>
	);
}
