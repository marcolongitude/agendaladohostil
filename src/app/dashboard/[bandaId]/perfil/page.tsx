import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientProfile } from "./ClientProfile";
import { Container } from "@/components/Container";

export default async function PerfilPage() {
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

	return (
		<Container title="Perfil">
			<ClientProfile musico={musico} />
		</Container>
	);
}
