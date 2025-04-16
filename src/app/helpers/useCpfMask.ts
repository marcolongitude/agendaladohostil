export function useCpfMask() {
	function applyMask(value: string): string {
		const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
		return digitsOnly
			.replace(/^(\d{3})(\d)/, "$1.$2")
			.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})\.(\d{3})(\d)/, ".$1.$2-$3");
	}

	return { applyMask };
}
