"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

export default function SplashPage() {
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			setTimeout(() => {
				if (session) {
					router.push("/bandas");
				} else {
					router.push("/login");
				}
			}, 4000);
		};

		checkSession();
	}, [router, supabase.auth]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="flex flex-col justify-center items-center gap-8">
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-gradient-x">
					AGENDA BANDAS
				</h1>
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		</main>
	);
}
