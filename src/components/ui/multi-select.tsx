"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
	label: string;
	value: string;
}

interface MultiSelectProps {
	options: Option[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	className?: string;
}

export function MultiSelect({
	options,
	selected,
	onChange,
	placeholder = "Selecione...",
	className,
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);

	const handleUnselect = (value: string) => {
		onChange(selected.filter((item) => item !== value));
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", selected.length > 0 ? "h-full" : "h-10", className)}
				>
					<div className="flex flex-wrap gap-1">
						{selected.length === 0 && placeholder}
						{selected.map((value) => (
							<Badge
								variant="secondary"
								key={value}
								className="mr-1 mb-1"
								onClick={(e) => {
									e.stopPropagation();
									handleUnselect(value);
								}}
							>
								{options.find((option) => option.value === value)?.label}
								<button
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(value);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleUnselect(value);
									}}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						))}
					</div>
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Buscar..." />
					<CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
					<CommandGroup className="max-h-64 overflow-auto">
						{options.map((option) => (
							<CommandItem
								key={option.value}
								onSelect={() => {
									onChange(
										selected.includes(option.value)
											? selected.filter((item) => item !== option.value)
											: [...selected, option.value]
									);
									setOpen(true);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										selected.includes(option.value) ? "opacity-100" : "opacity-0"
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
