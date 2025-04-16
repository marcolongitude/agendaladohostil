declare module "@/contexts/AuthContext" {
	export interface User {
		id: string;
		nome: string;
		tipo: string;
	}

	export interface AuthContextType {
		user: User | null;
		loading: boolean;
	}

	export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element;
	export const useAuth: () => AuthContextType;
}
