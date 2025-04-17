import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Loading } from "@/components/Loading";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserInitializer } from "@/components/UserInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Agenda Lado Hostil",
	description: "Agenda para o lado hostil da força",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body className={`${inter.className} bg-background text-foreground`}>
				<ThemeProvider>
					<AuthProvider>
						<LoadingProvider>
							<Loading />
							<UserInitializer />
							<div className="relative flex min-h-screen flex-col">
								<div className="flex-1">{children}</div>
							</div>
							<Toaster />
						</LoadingProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
