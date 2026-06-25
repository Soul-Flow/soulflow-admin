"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeToggleProps = {
	className?: string;
	id?: string;
	showText?: boolean;
};

export function ThemeToggle({
	className,
	id,
	showText = false,
}: ThemeToggleProps) {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timer);
	}, []);

	if (!mounted)
		return (
			<button type="button" className={className}>
				...
			</button>
		);

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			id={id}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={
				className ||
				"flex items-center gap-2 p-2 rounded-lg text-sf-fg-muted hover:bg-sf-surface transition-colors cursor-pointer"
			}
		>
			{isDark ? (
				<Sun className="h-4.5 w-4.5 text-sf-fg" />
			) : (
				<Moon className="h-4.5 w-4.5 text-sf-fg" />
			)}
			{showText && (
				<span className="text-sm font-semibold">
					{isDark ? "Switch to Light Theme" : "Switch to Dark Mode"}
				</span>
			)}
		</button>
	);
}
