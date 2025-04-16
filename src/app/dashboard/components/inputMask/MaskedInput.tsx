"use client";

import { Input } from "@/components/ui/input";
import { useFormContext, Controller } from "react-hook-form";
import { mask } from "remask";

interface MaskedInputProps {
	name: string;
	maskPattern: string | string[];
	placeholder?: string;
	className?: string;
}

export function MaskedInput({ name, maskPattern, placeholder, className }: MaskedInputProps) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value, ...rest } }) => (
				<Input
					value={value}
					onChange={(e) => onChange(mask(e.target.value, maskPattern))}
					placeholder={placeholder}
					className={className}
					{...rest}
				/>
			)}
		/>
	);
}
