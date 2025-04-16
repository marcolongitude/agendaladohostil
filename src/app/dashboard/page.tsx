"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface Banda {
	id: string;
	nome: string;
	created_at: string;
}

export default function DashboardPage() {
	const [bandas, setBandas] = useState<Banda[]>([]);
	const { setLoading, setLoadingMessage } = useLoading();
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		async function loadBandas() {
			try {
				setLoading(true);
				setLoadingMessage("Carregando suas bandas...");

				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) {
					router.push("/login");
					return;
				}

				const { data: bandas, error } = await supabase.from("bandas").select("*").eq("criador_id", user.id);

				if (error) throw error;
				setBandas(bandas || []);
			} catch (error) {
				console.error("Erro ao carregar bandas:", error);
			} finally {
				setLoading(false);
			}
		}

		loadBandas();
	}, [router, setLoading, setLoadingMessage, supabase]);

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Abrir menu">
						<Menu className="w-6 h-6" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="max-w-xs p-0">
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
						<SheetClose asChild>
							<Button variant="ghost" className="absolute top-2 right-2">
								Fechar
							</Button>
						</SheetClose>
					</SheetHeader>
					<nav className="flex flex-col gap-2 p-4">
						<Link href="/dashboard/convites">
							<Button variant="ghost" className="w-full justify-start">
								Convites
							</Button>
						</Link>
						{/* Outras opções de menu podem ser adicionadas aqui */}
					</nav>
				</SheetContent>
			</Sheet>
			{/* Conteúdo do dashboard */}
			<div className="flex-1 flex items-center justify-center">
				<h1 className="text-3xl font-bold">Dashboard</h1>
			</div>
			<main className="container mx-auto py-8">
				<h1 className="text-3xl font-bold mb-8">Suas Bandas</h1>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{bandas.map((banda) => (
						<div
							key={banda.id}
							className="bg-card p-6 rounded-lg shadow-lg cursor-pointer hover:bg-muted transition"
							onClick={() => router.push(`/dashboard/${banda.id}`)}
						>
							<h2 className="text-xl font-semibold mb-2">{banda.nome}</h2>
							<p className="text-sm text-muted-foreground">
								Criada em: {new Date(banda.created_at).toLocaleDateString("pt-BR")}
							</p>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
