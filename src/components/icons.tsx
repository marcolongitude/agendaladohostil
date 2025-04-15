import { Loader2, type LucideIcon } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
	spinner: Loader2,
	// Aqui você pode adicionar mais ícones conforme necessário
	// Exemplo:
	// logo: (props: LucideProps) => (
	//   <svg {...props}>...</svg>
	// ),
} satisfies Record<string, Icon>;
