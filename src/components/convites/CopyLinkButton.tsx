"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CopyLinkButtonProps {
	token: string;
}

export function CopyLinkButton({ token }: CopyLinkButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		const url = `${window.location.origin}/convite/${token}`;
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2">
			{copied ? (
				<>
					<Check className="h-4 w-4" />
					<span>Copiado!</span>
				</>
			) : (
				<>
					<Copy className="h-4 w-4" />
					<span>Copiar Link</span>
				</>
			)}
		</Button>
	);
}
