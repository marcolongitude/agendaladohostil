import { mask } from "remask";
import { useCallback } from "react";

export function usePhoneMask() {
	const applyMask = useCallback((value: string) => {
		const digits = value.replace(/\D/g, "");

		const pattern = digits.length > 10 ? "(99) 9 9999-9999" : "(99) 9999-9999";

		return mask(digits, pattern);
	}, []);

	return { applyMask };
}
