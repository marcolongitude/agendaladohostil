import { AceitarConviteButton } from "./AceitarConviteButton";

interface Convite {
	id: string;
	banda_id: string;
	email: string | null;
	expires_at: string | null;
	status: string;
	token: string;
	banda_nome: string;
}

async function getConvite(token: string): Promise<Convite | null> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const res = await fetch(`${baseUrl}/api/convites?token=${token}`, { cache: "no-store" });
	if (!res.ok) return null;
	return res.json();
}

function formatDate(dateStr: string | null) {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default async function ConvitePage({ params }: { params: { token: string } }) {
	const convite = await getConvite(params.token);
	if (!convite) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700 text-center">
					<h2 className="text-2xl font-bold text-red-400 mb-2">Convite não encontrado</h2>
					<p className="text-gray-400">Verifique se o link está correto ou se o convite expirou.</p>
				</div>
			</div>
		);
	}

	console.log("convite", convite);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900  px-2">
			<div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700 mx-2">
				<h2 className="text-2xl font-bold text-white mb-4 text-center">{convite.banda_nome}</h2>
				<div className="mb-6 text-center">
					<div className="text-lg text-gray-400 mb-1">Convidado:</div>
					<div className="text-xl font-bold text-yellow-400 mb-2">{convite.email || "Qualquer e-mail"}</div>
					<div className="text-sm text-gray-400">Expira em:</div>
					<div className="text-md font-semibold text-blue-300 mb-4">{formatDate(convite.expires_at)}</div>
				</div>
				<AceitarConviteButton token={params.token} />
			</div>
		</div>
	);
}
