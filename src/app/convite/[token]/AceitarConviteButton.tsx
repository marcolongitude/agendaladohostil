"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AceitarConviteButton({ token }: { token: string }) {
	const router = useRouter();

	async function handleAceitar() {
		const res = await fetch("/api/convites/aceitar", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token }),
		});
		const data = await res.json();

		if (!res.ok) {
			toast.error(data.error || "Erro ao aceitar convite");
			return;
		}

		if (data.redirectToCadastro) {
			router.push(`/cadastro?token=${token}`);
		} else if (data.redirectToLogin) {
			router.push("/login");
		} else {
			router.push("/dashboard");
		}
	}

	return (
		<Button className="w-full" onClick={handleAceitar}>
			Aceitar convite
		</Button>
	);
}
