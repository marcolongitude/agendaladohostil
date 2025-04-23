"use client";

import { useLoading } from "@/contexts/LoadingContext";

export function Loading() {
	const { isLoading, loadingMessage } = useLoading();

	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-card rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
				{loadingMessage && <p className="text-card-foreground text-sm">{loadingMessage}</p>}
			</div>
		</div>
	);
}
