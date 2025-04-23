import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilLoading() {
	return (
		<Container title="Perfil">
			<div className="space-y-8">
				{/* Seção de informações básicas */}
				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				</div>

				{/* Seção de configurações */}
				<div className="space-y-4">
					<Skeleton className="h-5 w-32" />
					<div className="space-y-2">
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div className="space-y-1">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-4 w-48" />
							</div>
							<Skeleton className="h-6 w-12" />
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
