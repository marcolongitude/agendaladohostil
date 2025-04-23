import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function GerenciarConvitesLoading() {
	return (
		<Container title="Gerenciar Convites">
			<div className="space-y-4">
				<div className="flex justify-end">
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="space-y-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between p-4 border rounded-lg">
							<div className="space-y-2">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-4 w-32" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-8 w-8" />
								<Skeleton className="h-8 w-8" />
							</div>
						</div>
					))}
				</div>
			</div>
		</Container>
	);
}
