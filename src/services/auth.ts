type LoginResponse = {
	success: boolean;
	message?: string;
};

type LoginData = {
	email: string;
	password: string;
};

export async function login(data: LoginData): Promise<LoginResponse> {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		// Opções de cache do Next.js
		cache: "no-store", // Não cachear respostas de login
	});

	if (!response.ok) {
		const error = await response.json();
		return {
			success: false,
			message: error.message || "Erro ao realizar login",
		};
	}

	return response.json();
}
