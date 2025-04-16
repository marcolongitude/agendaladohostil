"use client";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardMenu({
	bandaNome,
	bandaId,
	usuario,
}: {
	bandaNome?: string;
	bandaId?: string;
	usuario: { nome: string; tipo: string } | null;
}) {
	const router = useRouter();
	const pathname = usePathname();

	// Extrai o bandaId da URL atual se estiver disponível
	const currentBandaId = bandaId || pathname.split("/")[2];

	function getInitials(nome: string) {
		if (!nome) return "";
		return nome
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}

	// Determina a tab ativa baseada na URL atual
	const activeTab = pathname.includes("perfil") ? "perfil" : pathname.includes("eventos") ? "eventos" : "convites";

	return (
		<header className="flex flex-col sticky top-0 z-10">
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" aria-label="Voltar" onClick={() => router.back()}>
						<ArrowLeft className="w-5 h-5" />
					</Button>
					<div className="text-xl font-bold">{bandaNome || "Dashboard"}</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
						{getInitials(usuario?.nome || "")}
					</div>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Sair"
						onClick={async () => {
							try {
								const supabase = createClientComponentClient();
								const { error } = await supabase.auth.signOut();

								if (error) {
									console.error("Erro ao fazer logout:", error.message);
									return;
								}

								// Limpa os cookies
								document.cookie.split(";").forEach((c) => {
									document.cookie = c
										.replace(/^ +/, "")
										.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
								});

								// Força um reload da página para garantir que todos os estados sejam limpos
								window.location.href = "/login";
							} catch (error) {
								console.error("Erro ao fazer logout:", error);
							}
						}}
					>
						<LogOut className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<div className="relative w-full border-b border-border">
				<div className="overflow-x-auto scrollbar-none">
					<Tabs defaultValue={activeTab} className="w-full">
						<TabsList className="h-12 bg-transparent w-max flex px-4 gap-8">
							<Link href={`/dashboard/${currentBandaId}/gerenciar-convites`}>
								<TabsTrigger
									value="convites"
									className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
								>
									Convites
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
								</TabsTrigger>
							</Link>
							<Link href={`/dashboard/${currentBandaId}/eventos`}>
								<TabsTrigger
									value="eventos"
									className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
								>
									Eventos
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
								</TabsTrigger>
							</Link>
							<Link href={`/bandas`}>
								<TabsTrigger
									value="lista-bandas"
									className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
								>
									Lista de bandas
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
								</TabsTrigger>
							</Link>
							<Link href={`/dashboard/${currentBandaId}/eventos`}>
								<TabsTrigger
									value="musicos"
									className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
								>
									Lista de músicos
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
								</TabsTrigger>
							</Link>
							<Link href={`/dashboard/${currentBandaId}/eventos`}>
								<TabsTrigger
									value="repertorios"
									className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
								>
									Repertórios
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
								</TabsTrigger>
							</Link>
							<Link href={`/dashboard/${currentBandaId}/perfil`}>
								<TabsTrigger
									value="perfil"
									className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
								>
									Perfil
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
								</TabsTrigger>
							</Link>
						</TabsList>
					</Tabs>
				</div>
			</div>
		</header>
	);
}
