export function formatPhoneNumber(phone: string) {
	// Remove todos os caracteres não numéricos
	const numbers = phone.replace(/\D/g, "");

	// Verifica se é celular (9 dígitos) ou telefone fixo (8 dígitos)
	if (numbers.length === 11) {
		// Formato: (XX) X XXXX-XXXX
		return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
	} else if (numbers.length === 10) {
		// Formato: (XX) XXXX-XXXX
		return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
	}

	// Retorna o número original se não se encaixar nos padrões
	return phone;
}
