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
	const { user: currentUser, setUser } = useUser();

	useEffect(() => {
		if (currentUser) return;

		const supabase = createClientComponentClient();
		let isMounted = true;

		async function initUser() {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user || !isMounted) return;

				const { data } = await supabase.from("musicos").select("id, tipo").eq("id", user.id).single();

				if (data && isMounted) {
					setUser(data as User);
				}
			} catch (error) {
				console.error("Error initializing user:", error);
			}
		}

		initUser();

		return () => {
			isMounted = false;
		};
	}, [currentUser, setUser]);
}
