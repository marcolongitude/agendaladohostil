import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";

export function FormButton({ children, ...props }: ButtonProps) {
	return <Button {...props}>{children}</Button>;
}
