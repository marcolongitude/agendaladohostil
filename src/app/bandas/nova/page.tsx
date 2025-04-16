import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { BandaForm } from "@/components/BandaForm";
import { Button } from "@/components/ui/button";

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
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/bandas">
						<ArrowLeft className="h-6 w-6" />
					</Link>
				</Button>
				<h1 className="text-2xl font-bold text-white">Nova Banda</h1>
			</div>
			<div className="rounded-lg p-6">
				<BandaForm />
			</div>
		</div>
	);
}
