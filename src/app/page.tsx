"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

export default function SplashPage() {
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		console.log("0000000000000000000");

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			console.log("Auth state changed:", event, session);

			setTimeout(() => {
				if (event === "SIGNED_IN" || session) {
					console.log("Usuário autenticado, redirecionando para /bandas");
					router.push("/bandas");
				} else {
					console.log("Usuário não autenticado, redirecionando para /login");
					router.push("/login");
				}
			}, 4000);
		});

		// Cleanup subscription
		return () => {
			subscription.unsubscribe();
		};
	}, [router, supabase.auth]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-center gap-8">
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-[size:400%_400%] bg-clip-text text-transparent animate-gradient-x">
					AGENDA BANDAS
				</h1>
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		</main>
	);
}
