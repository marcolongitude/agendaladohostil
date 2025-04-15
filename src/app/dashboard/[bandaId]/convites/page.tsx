import { ClipboardCopy } from "lucide-react";

function statusColor(status: string) {
	switch (status) {
		case "pendente":
			return "text-yellow-400 border-yellow-400";
		case "aceito":
			return "text-green-400 border-green-400";
		case "expirado":
			return "text-gray-400 border-gray-400";
		default:
			return "text-gray-400 border-gray-400";
	}
}

function formatDate(dateStr: string | null) {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

interface Convite {
	id: string;
	token: string;
	status: string;
	expires_at: string | null;
	email: string | null;
}

async function getConvites(bandaId: string): Promise<Convite[]> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const res = await fetch(`${baseUrl}/api/convites?banda_id=${bandaId}`, { cache: "no-store" });
	if (!res.ok) return [];
	return res.json();
}

export default async function ConvitesPage({ params }: { params: { bandaId: string } }) {
	const convites = await getConvites(params.bandaId);

	return (
		<div className="min-h-screen bg-gray-900 px-2 py-6">
			<h2 className="text-lg font-semibold text-center text-gray-300 mb-8">Convites</h2>
			<div className="max-w-xl mx-auto space-y-4">
				{convites.length === 0 && <div className="text-center text-gray-500">Nenhum convite encontrado.</div>}
				{convites.map((convite) => (
					<div
						key={convite.id}
						className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3 border border-gray-700"
					>
						<div className="flex-1">
							<div className="text-xs text-gray-400">ID</div>
							<div className="text-sm font-mono text-white break-all">{convite.token}</div>
							<div className="flex items-center gap-2 mt-1">
								<span
									className={`text-xs font-bold border rounded px-2 py-0.5 ${statusColor(
										convite.status
									)}`}
								>
									{convite.status}
								</span>
								<span className="text-xs text-gray-400">Expira: {formatDate(convite.expires_at)}</span>
							</div>
						</div>
						<form action="#" className="ml-4">
							<button
								type="button"
								className="p-2 rounded hover:bg-gray-700"
								title="Copiar link do convite"
								onClick={async () => {
									"use client";
									const url = `${
										process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
									}/convite/${convite.token}`;
									await navigator.clipboard.writeText(url);
								}}
							>
								<ClipboardCopy className="w-5 h-5 text-gray-400 hover:text-white" />
							</button>
						</form>
					</div>
				))}
			</div>
		</div>
	);
}
