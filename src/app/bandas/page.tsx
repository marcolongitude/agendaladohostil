import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Container } from "@/components/Container";
import { ClientBandas } from "./ClientBandas";

interface Banda {
	id: string;
	nome: string;
	descricao: string;
	compromissos_banda: {
		status: string;
		data: string;
		hora: string;
	}[];
}

export default async function BandasPage() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Busca o usuário na tabela musicos por id
	let { data: userData, error: userError } = await supabase
		.from("musicos")
		.select("id, nome, tipo")
		.eq("id", user.id)
		.single();

	// Se não encontrar por id, busca por email
	if (!userData) {
		const { data: userByEmail } = await supabase
			.from("musicos")
			.select("id, nome, tipo")
			.eq("email", user.email)
			.single();

		if (userByEmail) {
			userData = userByEmail;
		} else {
			// Se não existe por id nem por email, insere
			const { error: insertError } = await supabase.from("musicos").insert([
				{
					id: user.id,
					nome: user.user_metadata?.nome || user.email,
					email: user.email,
					telefone: user.phone || "N/A",
					instrumento: user.user_metadata?.instrumento || "N/A",
					tipo: user.user_metadata?.tipo || "musico",
					senha: "autenticado_supabase",
				},
			]);
			if (insertError) {
				console.error("Erro ao criar usuário em musicos:", insertError);
				redirect("/login");
			}
			// Após o insert, busque por email
			({ data: userData, error: userError } = await supabase
				.from("musicos")
				.select("id, nome, tipo")
				.eq("email", user.email)
				.single());
		}
	}

	if (userError || !userData) {
		console.error("Erro ao buscar usuário:", userError);
		redirect("/login");
	}

	try {
		// Busca as bandas do usuário (apenas as que ele é membro)
		const { data: membros, error: membrosError } = await supabase
			.from("membros_banda")
			.select("bandas:id, bandas(id, nome, descricao, compromissos_banda(status, data, hora))")
			.eq("musico_id", userData.id);

		if (membrosError) {
			console.error("Erro ao buscar bandas:", membrosError);
			return <div>Erro ao carregar bandas</div>;
		}

		// Extrai as bandas do resultado
		interface MembroBanda {
			bandas: Banda;
		}
		const bandas = ((membros as MembroBanda[]) || []).map((m) => m.bandas).filter(Boolean);

		return (
			<Container title="Bandas">
				<ClientBandas bandas={bandas} userType={userData.tipo} />
			</Container>
		);
	} catch (error) {
		console.error("Erro na página de bandas:", error);
		redirect("/login");
	}
}
