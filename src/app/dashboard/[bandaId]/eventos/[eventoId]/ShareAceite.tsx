"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareAceiteProps {
	aceiteId: string;
}

export function ShareAceite({ aceiteId }: ShareAceiteProps) {
	const handleCopyLink = async () => {
		const link = `${window.location.origin}/aceite/${aceiteId}`;
		await navigator.clipboard.writeText(link);
		toast.success("Link copiado com sucesso!");
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleCopyLink}>
			<Copy className="h-4 w-4" />
		</Button>
	);
}
