import { Container } from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventoLoading() {
	return (
		<Container title=" ">
			<div className="grid gap-6">
				<div className="absolute top-4 left-4">
					<Skeleton className="h-7 w-48" />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Informações do Evento</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{/* Data */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-40" />
							</div>
							{/* Hora */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-20" />
							</div>
							{/* Local */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-32" />
							</div>
							{/* Cidade */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-36" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Músicos Convidados</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{/* Músicos */}
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center justify-between">
									<div>
										<Skeleton className="h-5 w-40 mb-1" />
										<Skeleton className="h-4 w-24" />
									</div>
									<Skeleton className="h-6 w-20" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}
