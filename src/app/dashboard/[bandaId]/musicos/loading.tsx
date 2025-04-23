import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function MusicosLoading() {
	return (
		<Container title="Lista de Músicos">
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="p-4 border rounded-lg space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<Skeleton className="h-6 w-48" />
								<div className="space-y-1">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-40" />
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
					</div>
				))}
			</div>
		</Container>
	);
}
