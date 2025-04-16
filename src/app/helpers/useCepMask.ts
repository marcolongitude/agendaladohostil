export function useCepMask() {
	function applyMask(value: string): string {
		const digitsOnly = value.replace(/\D/g, "").slice(0, 8);
		return digitsOnly.replace(/^(\d{5})(\d)/, "$1-$2");
	}

	return { applyMask };
}
