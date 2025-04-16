"use client";

import { useLoading } from "@/contexts/LoadingContext";

export function Loading() {
	const { isLoading, loadingMessage } = useLoading();

	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				{loadingMessage && <p className="text-white text-sm">{loadingMessage}</p>}
			</div>
		</div>
	);
}
