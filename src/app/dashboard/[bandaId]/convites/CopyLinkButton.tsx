"use client";
import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyLinkButton({ token }: { token: string }) {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/convite/${token}`;
	return (
		<Button
			type="button"
			variant="ghost"
			size="lg"
			className="p-2 rounded hover:bg-gray-700"
			title="Copiar link do convite"
			onClick={async () => {
				await navigator.clipboard.writeText(url);
				toast.success("Link copiado!");
			}}
		>
			<ClipboardCopy className="w-5 h-5 text-gray-400 hover:text-white" />
		</Button>
	);
}
