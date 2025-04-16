"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConviteForm } from "./ConviteForm";

interface ConviteDialogProps {
	bandaId: string;
	onSuccess: () => void;
}

export function ConviteDialog({ bandaId, onSuccess }: ConviteDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		setOpen(false);
		onSuccess();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Novo Convite</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Criar Novo Convite</DialogTitle>
				</DialogHeader>
				<ConviteForm bandaId={bandaId} onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
