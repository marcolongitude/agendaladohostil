"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { ConviteDialog } from "./ConviteDialog";
import { CopyLinkButton } from "./CopyLinkButton";
import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { useParams } from "next/navigation";

interface Convite {
	id: string;
	token: string;
	status: "pendente" | "aceito" | "expirado";
	expires_at: string | null;
	email: string | null;
}

export default function ConvitesPage() {
	const params = useParams();
	const router = useRouter();
	const { setLoading, setLoadingMessage } = useLoading();
	const [data, setData] = useState<{
		convites: Convite[];
		userType?: string;
		isLoading: boolean;
	}>({ convites: [], isLoading: true });

	useEffect(() => {
		const supabase = createClientComponentClient();
		const bandaId = params?.bandaId as string;
		let isMounted = true;

		async function loadData() {
			if (!isMounted) return;

			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					router.push("/login");
					return;
				}

				const [convitesResult, userTypeResult] = await Promise.all([
					supabase
						.from("convites_banda")
						.select("id, token, status, expires_at, email")
						.eq("banda_id", bandaId)
						.order("created_at", { ascending: false }),
					supabase.from("musicos").select("tipo").eq("id", user.id).single(),
				]);

				if (!isMounted) return;

				if (convitesResult.error) {
					throw new Error("Erro ao buscar convites");
				}

				setData({
					convites: convitesResult.data,
					userType: userTypeResult.data?.tipo,
					isLoading: false,
				});
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				if (isMounted) {
					setData((prev) => ({ ...prev, isLoading: false }));
				}
			}
		}

		setLoading(true);
		setLoadingMessage("Carregando convites...");
		loadData().finally(() => {
			if (isMounted) {
				setLoading(false);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [params?.bandaId]);

	const handleConviteCreated = async () => {
		setData((prev) => ({ ...prev, isLoading: true }));
		setLoading(true);
		setLoadingMessage("Atualizando convites...");

		const supabase = createClientComponentClient();
		const bandaId = params?.bandaId as string;

		try {
			const { data: convitesData, error } = await supabase
				.from("convites_banda")
				.select("id, token, status, expires_at, email")
				.eq("banda_id", bandaId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			setData((prev) => ({
				...prev,
				convites: convitesData,
				isLoading: false,
			}));
		} catch (error) {
			console.error("Erro ao atualizar convites:", error);
		} finally {
			setLoading(false);
		}
	};

	if (data.isLoading) {
		return null; // ou um componente de loading se preferir
	}

	return (
		<main className="p-8 max-w-3xl mx-auto">
			<header className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-white">Convites</h1>
				{data.userType === "manager" && (
					<ConviteDialog bandaId={params?.bandaId as string} onSuccess={handleConviteCreated} />
				)}
			</header>

			<ul className="space-y-4">
				{data.convites.map((convite) => (
					<li
						key={convite.id}
						className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between gap-4"
					>
						<div className="min-w-0 space-y-1">
							<p className="flex items-center gap-2 overflow-hidden">
								<span className="text-sm text-gray-400 flex-shrink-0">ID:</span>
								<code className="text-sm font-mono text-gray-300 truncate">{convite.token}</code>
							</p>
							<p className="flex items-center gap-2">
								<span className="text-sm text-gray-400">Status:</span>
								<span
									className={`text-sm ${
										convite.status === "pendente"
											? "text-yellow-500"
											: convite.status === "aceito"
											? "text-green-500"
											: "text-gray-500"
									}`}
								>
									{convite.status}
								</span>
							</p>
							{convite.expires_at && (
								<p className="text-sm text-gray-400">
									Expira em: {new Date(convite.expires_at).toLocaleDateString("pt-BR")}
								</p>
							)}
						</div>
						{convite.status === "pendente" && <CopyLinkButton token={convite.token} />}
					</li>
				))}
			</ul>
		</main>
	);
}
