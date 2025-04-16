"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

// Root Component
interface ModalRootProps {
	children: ReactNode;
	trigger?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

function Root({ children, trigger, open: controlledOpen, onOpenChange }: ModalRootProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;

	const handleOpenChange = (newOpen: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] mx-auto rounded-xl">
				{children}
			</DialogContent>
		</Dialog>
	);
}

// Header Component
interface ModalHeaderProps {
	title?: string;
	children?: ReactNode;
}

function Header({ title, children }: ModalHeaderProps) {
	return (
		<DialogHeader className="flex flex-col gap-4">
			{title && <DialogTitle>{title}</DialogTitle>}
			{children}
		</DialogHeader>
	);
}

// Body Component
interface ModalBodyProps {
	children: ReactNode;
	className?: string;
}

function Body({ children, className = "" }: ModalBodyProps) {
	return <div className={`flex flex-col gap-4 ${className}`}>{children}</div>;
}

// Footer Component
interface ModalFooterProps {
	children: ReactNode;
	className?: string;
}

function Footer({ children, className = "" }: ModalFooterProps) {
	return <DialogFooter className={`mt-4 ${className}`}>{children}</DialogFooter>;
}

// Export the composition
export const ModalComposition = {
	Root,
	Header,
	Body,
	Footer,
};
