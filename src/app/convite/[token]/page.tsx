import { AceitarConviteButton } from "./AceitarConviteButton";

interface Convite {
	banda_nome: string;
	email?: string;
	expires_at: string;
}

async function getConvite(token: string): Promise<Convite | null> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/convites?token=${token}`, {
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) return null;
	return res.json();
}

function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default async function ConvitePage({ params }: { params: Promise<{ token: string }> }) {
	const { token } = await params;
	const convite = await getConvite(token);

	if (!convite) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Convite Inválido</h1>
					<p className="text-muted-foreground">Este convite não existe ou já expirou.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center max-w-md">
				<h1 className="text-2xl font-bold mb-4">Convite para {convite.banda_nome}</h1>
				<div className="mb-6">
					<div className="text-sm text-muted-foreground mb-4">
						Por favor, informe seu melhor e-mail para aceitar o convite. Este e-mail será usado para:
						<br />
						- Acesso à plataforma
						<br />
						- Comunicação com a banda
						<br />- Recuperação de senha
					</div>
					<div className="text-sm text-muted-foreground">Expira em:</div>
					<div className="text-md font-semibold mb-4">{formatDate(convite.expires_at)}</div>
				</div>
				<AceitarConviteButton token={token} />
			</div>
		</div>
	);
}
