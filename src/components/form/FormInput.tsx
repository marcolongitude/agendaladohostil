import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { usePhoneMask } from "@/app/helpers/usePhoneMask";
import { useCpfMask } from "@/app/helpers/useCpfMask";
import { useCepMask } from "@/app/helpers/useCepMask";

type MaskType = "tel" | "cpf" | "cep" | undefined;

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	placeholder?: string;
	mask?: MaskType;
}

export function FormInput({ name, label, placeholder, mask, ...props }: FormInputProps) {
	const { control } = useFormContext();

	const maskMap: Record<Exclude<MaskType, undefined>, (val: string) => string> = {
		tel: usePhoneMask().applyMask,
		cpf: useCpfMask().applyMask,
		cep: useCepMask().applyMask,
	};

	const applyMask = (value: string) => {
		if (!mask) return value;
		const fn = maskMap[mask];
		return fn ? fn(value) : value;
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Input
							{...field}
							{...props}
							placeholder={placeholder}
							onChange={(e) => {
								const maskedValue = applyMask(e.target.value);
								field.onChange(maskedValue);
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
