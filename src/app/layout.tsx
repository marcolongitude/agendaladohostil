import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Agenda Lado Hostil",
	description: "Agenda para o lado hostil da força",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning className="dark">
			<body className={`${inter.className} bg-background text-foreground`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
