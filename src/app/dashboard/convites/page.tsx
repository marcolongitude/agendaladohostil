"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { PostgrestError } from "@supabase/supabase-js";

interface Banda {
	nome: string;
}

interface ConviteResponse {
	id: string;
	token: string;
	banda_id: string;
	status: "pendente" | "aceito" | "expirado";
	banda: Banda | Banda[];
}

interface Convite {
	id: string;
	token: string;
	banda_id: string;
	banda_nome: string;
	status: "pendente" | "aceito" | "expirado";
}

export default function ConvitesPage() {
	const [convites, setConvites] = useState<Convite[]>([]);
	const { setLoading, setLoadingMessage } = useLoading();
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		async function loadConvites() {
			try {
				setLoading(true);
				setLoadingMessage("Carregando seus convites...");

				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) {
					router.push("/login");
					return;
				}

				const { data: convitesData, error: convitesError } = (await supabase
					.from("convites_banda")
					.select(
						`
						id,
						token,
						status,
						banda_id,
						banda:bandas (
							nome
						)
					`
					)
					.eq("email", user.email)
					.eq("status", "pendente")) as { data: ConviteResponse[] | null; error: PostgrestError | null };

				if (convitesError) throw convitesError;

				const convitesFormatados = (convitesData || []).map((convite) => ({
					id: convite.id,
					token: convite.token,
					status: convite.status,
					banda_id: convite.banda_id,
					banda_nome: Array.isArray(convite.banda) ? convite.banda[0]?.nome || "" : convite.banda?.nome || "",
				}));

				setConvites(convitesFormatados);
			} catch (error) {
				console.error("Erro ao carregar convites:", error);
			} finally {
				setLoading(false);
			}
		}

		loadConvites();
	}, [router, setLoading, setLoadingMessage, supabase]);

	const handleAcceptInvite = async (conviteId: string, bandaId: string) => {
		try {
			setLoading(true);
			setLoadingMessage("Aceitando convite...");

			const { error } = await supabase.from("convites_banda").update({ status: "aceito" }).eq("id", conviteId);

			if (error) throw error;
			router.push(`/dashboard/${bandaId}`);
		} catch (error) {
			console.error("Erro ao aceitar convite:", error);
			setLoading(false);
		}
	};

	return (
		<main className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Seus Convites</h1>
			<div className="space-y-4">
				{convites.map((convite) => (
					<div key={convite.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-semibold mb-2">{convite.banda_nome}</h2>
						<button
							onClick={() => handleAcceptInvite(convite.id, convite.banda_id)}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
						>
							Aceitar Convite
						</button>
					</div>
				))}
				{convites.length === 0 && <p className="text-gray-400">Você não tem convites pendentes.</p>}
			</div>
		</main>
	);
}
