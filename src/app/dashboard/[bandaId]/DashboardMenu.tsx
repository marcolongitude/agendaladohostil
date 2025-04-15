"use client";
import { Menu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardMenu({
	bandaNome,
	bandaId,
	usuario,
}: {
	bandaNome: string;
	bandaId: string;
	usuario: { nome: string; tipo: string } | null;
}) {
	const router = useRouter();
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
		<header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" aria-label="Voltar" onClick={() => router.back()}>
					<ArrowLeft className="w-5 h-5 text-white" />
				</Button>
				<div className="text-xl font-bold text-white">{bandaNome || "Banda"}</div>
			</div>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Abrir menu">
						<Menu className="w-6 h-6 text-white" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="max-w-xs p-0 pt-16">
					<SheetHeader className="mt-8">
						<SheetTitle className="text-center">Menu</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col items-center gap-2 py-4 px-2">
						<div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-white mb-1">
							{getInitials(usuario?.nome || "")}
						</div>
						<div className="text-white font-semibold">{usuario?.nome || "Usuário"}</div>
						<div className="text-xs text-gray-400 mb-2">
							{usuario?.tipo === "manager" ? "Manager" : "Músico"}
						</div>
						<div className="w-full border-b border-gray-800 my-2" />
						<nav className="flex flex-col gap-2 w-full">
							<SheetClose asChild>
								<Link href={`/dashboard/${bandaId}/convites`}>
									<Button variant="ghost" className="w-full justify-start">
										Convites
									</Button>
								</Link>
							</SheetClose>
						</nav>
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
}
