import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SubTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	size?: "sm" | "md" | "lg";
	align?: "left" | "center" | "right";
}

export function SubTitle({ children, size = "md", align = "left", className, ...props }: SubTitleProps) {
	const sizeClasses = {
		sm: "text-sm md:text-base",
		md: "text-base md:text-lg",
		lg: "text-lg md:text-xl",
	};

	const alignClasses = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	};

	return (
		<h2
			className={cn("font-medium text-muted-foreground", sizeClasses[size], alignClasses[align], className)}
			{...props}
		>
			{children}
		</h2>
	);
}
