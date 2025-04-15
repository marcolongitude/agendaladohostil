import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardPage() {
	// Nome da banda pode ser passado via props, context ou buscado dinamicamente
	// Aqui, exemplo fixo:

	return (
		<div className="min-h-screen flex flex-col bg-gray-900">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Abrir menu">
						<Menu className="w-6 h-6 text-white" />
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
				<h1 className="text-3xl font-bold text-white">Dashboard</h1>
			</div>
		</div>
	);
}
