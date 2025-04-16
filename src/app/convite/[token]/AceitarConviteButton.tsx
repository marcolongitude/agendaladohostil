"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";

interface AceitarConviteButtonProps {
	token: string;
}

export function AceitarConviteButton({ token }: AceitarConviteButtonProps) {
	const router = useRouter();
	const { setLoading, setLoadingMessage } = useLoading();

	async function handleAceitarConvite() {
		try {
			setLoading(true);
			setLoadingMessage("Aceitando convite...");

			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
			const res = await fetch(`${baseUrl}/api/convites/aceitar`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});

			if (!res.ok) {
				throw new Error("Erro ao aceitar convite");
			}

			router.push("/bandas");
		} catch (error) {
			console.error("Erro ao aceitar convite:", error);
			alert("Erro ao aceitar convite. Tente novamente.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Button onClick={handleAceitarConvite} className="w-full">
			Aceitar Convite
		</Button>
	);
}
