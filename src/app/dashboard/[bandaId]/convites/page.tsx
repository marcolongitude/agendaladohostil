import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ConviteDialog } from "./ConviteDialog";
import { CopyLinkButton } from "./CopyLinkButton";

interface Convite {
	id: string;
	token: string;
	status: "pendente" | "aceito" | "expirado";
	expires_at: string | null;
	email: string | null;
}

async function getConvites(bandaId: string) {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const { data, error } = await supabase
		.from("convites_banda")
		.select("id, token, status, expires_at, email")
		.eq("banda_id", bandaId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error("Erro ao buscar convites");
	}

	return data as Convite[];
}

async function getUserType() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: musico } = await supabase.from("musicos").select("tipo").eq("id", user.id).single();

	return musico?.tipo;
}

export default async function ConvitesPage({ params }: { params: { bandaId: string } }) {
	const convites = await getConvites(params.bandaId);
	const userType = await getUserType();
	const isManager = userType === "manager";

	return (
		<main className="p-8 max-w-3xl mx-auto">
			<header className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-white">Convites</h1>
				{isManager && <ConviteDialog bandaId={params.bandaId} />}
			</header>

			<ul className="space-y-4">
				{convites.map((convite) => (
					<li
						key={convite.id}
						className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between gap-4"
					>
						<div className="min-w-0 space-y-1">
							<p className="flex items-center gap-2 overflow-hidden">
								<span className="text-sm text-gray-400 flex-shrink-0">ID:</span>
								<code className="text-sm font-mono text-gray-300 truncate">{convite.token}</code>
							</p>
							<p className="flex items-center gap-2">
								<span className="text-sm text-gray-400">Status:</span>
								<span
									className={`text-sm ${
										convite.status === "pendente"
											? "text-yellow-500"
											: convite.status === "aceito"
											? "text-green-500"
											: "text-gray-500"
									}`}
								>
									{convite.status}
								</span>
							</p>
							{convite.expires_at && (
								<p className="text-sm text-gray-400">
									Expira em: {new Date(convite.expires_at).toLocaleDateString("pt-BR")}
								</p>
							)}
						</div>
						{convite.status === "pendente" && <CopyLinkButton token={convite.token} />}
					</li>
				))}
			</ul>
		</main>
	);
}
