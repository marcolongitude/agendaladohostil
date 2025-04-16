interface ContainerProps {
	children: React.ReactNode;
	title: string;
	action?: React.ReactNode;
}

export function Container({ children, title, action }: ContainerProps) {
	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
				{action}
			</div>
			{children}
		</div>
	);
}
