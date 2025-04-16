import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { CreateUserProvider } from "./components/form/createUserProvider";

export default function UserRegistration() {
	return (
		<div className="container mx-auto py-10">
			<Card className="max-w-md mx-auto">
				<CardHeader>
					<CardTitle className="text-center">Agenda MAG</CardTitle>
					<CardDescription className="text-center">Cadastro de músico</CardDescription>
				</CardHeader>
				<CardContent>
					<CreateUserProvider />
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-gray-500">
						Já possui uma conta?{" "}
						<Link href="/login" className="text-blue-600 hover:underline">
							Faça login
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
