import { Container } from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AceiteLoading() {
	return (
		<Container title="Carregando...">
			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Informações do Evento</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-40" />
							</div>
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-20" />
							</div>
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-32" />
							</div>
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-24" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Você foi convidado</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div>
								<Skeleton className="h-5 w-32 mb-2" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-10 w-32" />
								<Skeleton className="h-10 w-32" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}
