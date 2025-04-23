import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tagVariants = {
	// Cores para tipos de usuário
	manager:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800",
	musico: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",

	// Cores para instrumentos
	guitarra: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
	baixo: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800",
	bateria:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
	teclado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
	vocal: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-800",
} as const;

type TagColor = keyof typeof tagVariants;

interface TagProps {
	children: React.ReactNode;
	color: TagColor;
	className?: string;
}

export function Tag({ children, color, className }: TagProps) {
	return (
		<Badge variant="outline" className={cn("font-medium border", tagVariants[color], className)}>
			{children}
		</Badge>
	);
}
