"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyLinkButtonProps {
	token: string;
}

export function CopyLinkButton({ token }: CopyLinkButtonProps) {
	const handleCopy = async () => {
		const link = `${window.location.origin}/convite/${token}`;
		await navigator.clipboard.writeText(link);
		toast.success("Link copiado para a área de transferência!");
	};

	return (
		<Button
			size="icon"
			variant="ghost"
			className="h-8 w-8 text-muted-foreground hover:text-foreground"
			onClick={handleCopy}
			title="Copiar link do convite"
		>
			<Copy className="h-4 w-4" />
		</Button>
	);
}
