"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface User {
	id: string;
	nome: string;
	tipo: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();

	useEffect(() => {
		const checkUser = async () => {
			try {
				const {
					data: { user: authUser },
				} = await supabase.auth.getUser();
				if (authUser) {
					const { data: musico } = await supabase
						.from("musicos")
						.select("id, nome, tipo")
						.eq("id", authUser.id)
						.single();

					if (musico) {
						setUser({
							id: musico.id,
							nome: musico.nome,
							tipo: musico.tipo,
						});
					}
				}
			} catch (error) {
				console.error("Erro ao verificar usuário:", error);
			} finally {
				setLoading(false);
			}
		};

		checkUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.user) {
				const { data: musico } = await supabase
					.from("musicos")
					.select("id, nome, tipo")
					.eq("id", session.user.id)
					.single();

				if (musico) {
					setUser({
						id: musico.id,
						nome: musico.nome,
						tipo: musico.tipo,
					});
				}
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase]);

	return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
