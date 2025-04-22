import { useCallback } from "react";
import { toast } from "sonner";

export function useLogout() {
	const clearAllCookies = () => {
		// Pega todos os cookies
		const cookies = document.cookie.split(";");

		// Expira cada cookie
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

			// Remove o cookie com diferentes configurações
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
		}
	};

	const clearStorages = () => {
		try {
			// Limpa todos os storages
			localStorage.clear();
			sessionStorage.clear();

			// Remove dados específicos do Supabase se existirem
			localStorage.removeItem("supabase.auth.token");
			sessionStorage.removeItem("supabase.auth.token");
		} catch (error) {
			console.error("Erro ao limpar storages:", error);
		}
	};

	const logout = useCallback(async () => {
		try {
			console.log("Iniciando logout manual...");

			// Limpa todos os cookies
			clearAllCookies();
			console.log("Cookies limpos");

			// Limpa localStorage e sessionStorage
			clearStorages();
			console.log("Storages limpos");

			// Faz uma chamada para o servidor limpar a sessão
			try {
				await fetch("/api/auth/logout", {
					method: "POST",
					credentials: "include", // Importante para enviar cookies
				});
			} catch (error) {
				console.error("Erro ao limpar sessão no servidor:", error);
			}

			// Força um refresh completo e redireciona
			console.log("Redirecionando...");
			window.location.href = "/login";
		} catch (error) {
			console.error("Erro no processo de logout:", error);
			toast.error("Erro ao fazer logout");

			// Mesmo com erro, tenta redirecionar
			window.location.href = "/login";
		}
	}, []);

	return logout;
}
