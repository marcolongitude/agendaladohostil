import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session && session.user) {
		redirect("/bandas");
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="p-8 rounded-lg shadow-lg border border-border">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Bem-vindo</h1>
					<p className="text-muted-foreground">Faça login para continuar</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
