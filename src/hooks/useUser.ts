import { create } from "zustand";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

interface User {
	id: string;
	tipo: "manager" | "musico";
}

interface UserStore {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUser = create<UserStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));

export function useUserInitializer() {
	const { setUser } = useUser();

	useEffect(() => {
		const supabase = createClientComponentClient();
		let isMounted = true;

		async function initUser() {
			try {
				const {
					data: { user: authUser },
				} = await supabase.auth.getUser();

				if (!authUser || !isMounted) return;

				const { data: musico } = await supabase
					.from("musicos")
					.select("id, tipo")
					.eq("id", authUser.id)
					.single();

				if (musico && isMounted) {
					setUser({
						id: musico.id,
						tipo: musico.tipo as "manager" | "musico",
					});
				}
			} catch (error) {
				console.error("Error initializing user:", error);
			}
		}

		// Inicializa o usuário
		initUser();

		// Escuta mudanças na autenticação
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_OUT") {
				setUser(null);
				return;
			}

			if (session?.user) {
				const { data: musico } = await supabase
					.from("musicos")
					.select("id, tipo")
					.eq("id", session.user.id)
					.single();

				if (musico) {
					setUser({
						id: musico.id,
						tipo: musico.tipo as "manager" | "musico",
					});
				}
			}
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [setUser]);
}
