"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogout } from "@/hooks/useLogout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function DashboardMenu({
	bandaNome,
	bandaId,
	usuario,
}: {
	bandaNome?: string;
	bandaId?: string;
	usuario: { nome: string; tipo: string; email: string } | null;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const logout = useLogout();

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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
									<span className="text-sm font-medium leading-none">
										{getInitials(usuario?.nome || "")}
									</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end">
							<div className="flex flex-col gap-1 p-2">
								<span className="text-sm font-medium">{usuario?.nome}</span>
								<span className="text-sm text-muted-foreground break-all">{usuario?.email}</span>
								<span className="text-sm text-muted-foreground capitalize">{usuario?.tipo}</span>
							</div>
							<div className="flex items-center justify-center p-2">
								<Button
									variant="outline"
									className="w-full justify-center text-sm font-normal"
									onClick={logout}
								>
									Sair
								</Button>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="relative w-full border-b border-border">
				<div className="overflow-x-auto scrollbar-none">
					<Tabs defaultValue={activeTab} className="w-full">
						<TabsList className="h-12 bg-transparent w-max flex px-4 gap-8">
							{usuario?.tipo === "manager" && (
								<Link href={`/dashboard/${currentBandaId}/gerenciar-convites`}>
									<TabsTrigger
										value="convites"
										className="relative px-0 data-[state=active]:shadow-none rounded-none h-full bg-transparent"
									>
										Convites
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 transition-opacity data-[state=active]:opacity-100" />
									</TabsTrigger>
								</Link>
							)}
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
							<Link href={`/dashboard/${currentBandaId}/musicos`}>
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
