import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { BandaForm } from "@/components/BandaForm";

export default async function NovaBandaPage() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-lg mx-auto px-4 py-6">
				<h1 className="text-2xl font-bold text-white mb-6">Nova Banda</h1>
				<div className="rounded-lg p-6">
					<BandaForm />
				</div>
			</div>
		</div>
	);
}
