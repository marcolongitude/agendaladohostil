import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

	console.log("user ", user);

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

		// Função para verificar se a banda tem eventos futuros
		const temEventosFuturos = (banda: Banda) => {
			if (!banda.compromissos_banda) return false;
			const hoje = new Date();
			return banda.compromissos_banda.some((compromisso) => {
				const dataEvento = new Date(`${compromisso.data}T${compromisso.hora}`);
				return compromisso.status === "agendado" && dataEvento > hoje;
			});
		};

		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-lg mx-auto px-4 py-6">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold">Bandas</h1>
						{userData.tipo === "manager" && (
							<Button asChild variant="outline" size="default">
								<Link href="/bandas/nova" className="flex items-center gap-2">
									<Plus className="w-4 h-4" />
									Nova Banda
								</Link>
							</Button>
						)}
					</div>

					{bandas.length === 0 ? (
						<div className="text-center text-muted-foreground mt-10">
							Você ainda não pertence a nenhuma banda.
							<br />
							{userData.tipo === "manager"
								? "Clique em 'Nova Banda' para criar uma."
								: "Peça para um manager te adicionar a uma banda."}
						</div>
					) : (
						<div className="space-y-1">
							{bandas.map((banda: Banda) => (
								<div key={banda.id}>
									<Button variant="ghost" className="w-full p-4 h-auto hover:bg-muted" asChild>
										<Link href={`/dashboard/${banda.id}`}>
											<div className="flex items-center gap-3 w-full">
												<div className="flex-1 text-left">
													<h2 className="text-lg font-medium group-hover:text-primary transition-colors">
														{banda.nome}
													</h2>
													<p className="text-sm text-muted-foreground line-clamp-1">
														{banda.descricao}
													</p>
												</div>
												<div className="flex items-center gap-2">
													{temEventosFuturos(banda) && (
														<span className="relative flex h-3 w-3">
															<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
															<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
														</span>
													)}
													<svg
														className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 5l7 7-7 7"
														/>
													</svg>
												</div>
											</div>
										</Link>
									</Button>
									<div className="h-[1px] bg-border"></div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	} catch (error) {
		console.error("Erro na página de bandas:", error);
		redirect("/login");
	}
}
