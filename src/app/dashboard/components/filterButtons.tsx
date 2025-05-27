"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterButtonsProps {
	filters: {
		label: string;
		value: string;
		count?: number;
	}[];
	activeFilter: string;
	onFilterChange: (value: string) => void;
}

export function FilterButtons({ filters, activeFilter, onFilterChange }: FilterButtonsProps) {
	return (
		<div className="relative w-full mb-6">
			<div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				<div className="flex flex-nowrap gap-2 pb-2">
					<Button
						variant="outline"
						size={"sm"}
						className={cn(
							"whitespace-nowrap shrink-0",
							activeFilter === "todos" && "bg-primary text-primary-foreground"
						)}
						onClick={() => onFilterChange("todos")}
					>
						Todos
					</Button>
					{filters.map((filter) => (
						<Button
							key={filter.value}
							variant="outline"
							size={"sm"}
							className={cn(
								"whitespace-nowrap shrink-0",
								activeFilter === filter.value && "bg-primary text-primary-foreground"
							)}
							onClick={() => onFilterChange(filter.value)}
						>
							{filter.label}
							{filter.count !== undefined && (
								<span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
									{filter.count}
								</span>
							)}
						</Button>
					))}
				</div>
			</div>
			<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
		</div>
	);
}
