import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventosLoading() {
	return (
		<Container title="Eventos">
			<div className="space-y-4">
				{/* Botão de novo evento */}
				<div className="flex justify-end">
					<Skeleton className="h-10 w-32" />
				</div>

				{/* Lista de eventos */}
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="p-4 border rounded-lg space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<Skeleton className="h-6 w-48" />
									<Skeleton className="h-4 w-32" />
								</div>
								<div className="flex gap-2">
									<Skeleton className="h-8 w-8" />
									<Skeleton className="h-8 w-8" />
								</div>
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
					))}
				</div>
			</div>
		</Container>
	);
}
