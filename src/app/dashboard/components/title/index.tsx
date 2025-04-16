import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	align?: "left" | "center" | "right";
}

export function Title({ children, size = "md", align = "left", className, ...props }: TitleProps) {
	const sizeClasses = {
		sm: "text-xl md:text-2xl",
		md: "text-2xl md:text-3xl",
		lg: "text-3xl md:text-4xl",
		xl: "text-4xl md:text-5xl",
	};

	const alignClasses = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	};

	return (
		<h1
			className={cn("font-semibold tracking-tight", sizeClasses[size], alignClasses[align], className)}
			{...props}
		>
			{children}
		</h1>
	);
}
