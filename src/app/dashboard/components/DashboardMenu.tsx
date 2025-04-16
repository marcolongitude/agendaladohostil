"use client";
import { Menu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

	return (
		<header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-10">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" aria-label="Voltar" onClick={() => router.back()}>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<div className="text-xl font-bold">{bandaNome || "Dashboard"}</div>
			</div>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Abrir menu">
						<Menu className="w-6 h-6" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="max-w-xs p-0 pt-16 flex flex-col justify-between">
					<SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
					<div className="flex flex-col items-center gap-2 py-4 px-2">
						<div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
							{getInitials(usuario?.nome || "")}
						</div>
						<div className="font-semibold">{usuario?.nome || "Usuário"}</div>
						<div className="text-xs text-muted-foreground mb-2">
							{usuario?.tipo === "manager" ? "Manager" : "Músico"}
						</div>
						<SheetClose asChild>
							<Link href={`/dashboard/${currentBandaId}/perfil`}>
								<Button variant="ghost" className="w-full justify-start">
									Perfil
								</Button>
							</Link>
						</SheetClose>
						<div className="w-full border-b border-border my-2" />
						<nav className="flex flex-col gap-2 w-full">
							{currentBandaId && usuario?.tipo === "manager" && (
								<SheetClose asChild>
									<Link href={`/dashboard/${currentBandaId}/gerenciar-convites`}>
										<Button variant="ghost" className="w-full justify-start">
											Gerenciar Convites
										</Button>
									</Link>
								</SheetClose>
							)}
						</nav>
					</div>
					<div className="p-4 border-t border-border">
						<Button
							variant="destructive"
							className="w-full"
							onClick={async () => {
								const supabase = createClientComponentClient();
								await supabase.auth.signOut();
								router.push("/login");
							}}
						>
							Sair
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
}
