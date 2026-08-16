import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Safely parses any date representation (dd-MM-yyyy HH:mm:ss, dd/MM/yyyy, ISO, epoch)
 * without returning NaN or "Invalid Date".
 */
export function parseDateSafely(
	val?: string | Date | number | null,
): Date | null {
	if (!val) return null;
	if (val instanceof Date) {
		return isNaN(val.getTime()) ? null : val;
	}
	if (typeof val === "number") {
		const d = new Date(val);
		return isNaN(d.getTime()) ? null : d;
	}

	const str = String(val).trim();
	if (!str) return null;

	// Pattern 1: dd-MM-yyyy or dd/MM/yyyy with optional time
	// Example: "16-08-2026 21:18:58" or "16/08/2026 21:18" or "16-08-2026"
	const dmyMatch = str.match(
		/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
	);
	if (dmyMatch) {
		const day = parseInt(dmyMatch[1], 10);
		const month = parseInt(dmyMatch[2], 10) - 1;
		const year = parseInt(dmyMatch[3], 10);
		const hour = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
		const min = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
		const sec = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;
		const parsed = new Date(year, month, day, hour, min, sec);
		return isNaN(parsed.getTime()) ? null : parsed;
	}

	// Pattern 2: Standard ISO or other parseable date strings
	const parsed = new Date(str);
	if (!isNaN(parsed.getTime())) {
		return parsed;
	}

	return null;
}

/**
 * Formats a date value as "HH:mm" in Vietnam Time (Asia/Ho_Chi_Minh).
 */
export function formatTime(val?: string | Date | number | null): string {
	const d = parseDateSafely(val);
	if (!d) return "-";
	try {
		return d.toLocaleTimeString("vi-VN", {
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Asia/Ho_Chi_Minh",
		});
	} catch {
		return d.toLocaleTimeString("vi-VN", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
}

/**
 * Formats a date value as "dd/MM/yyyy HH:mm" in Vietnam Time (Asia/Ho_Chi_Minh).
 */
export function formatDateTime(
	val?: string | Date | number | null,
	includeSeconds = false,
): string {
	const d = parseDateSafely(val);
	if (!d) return "-";
	try {
		return d.toLocaleString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: includeSeconds ? "2-digit" : undefined,
			timeZone: "Asia/Ho_Chi_Minh",
		});
	} catch {
		return d.toLocaleString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: includeSeconds ? "2-digit" : undefined,
		});
	}
}

/**
 * Formats a date value as "dd/MM/yyyy".
 */
export function formatDateOnly(val?: string | Date | number | null): string {
	const d = parseDateSafely(val);
	if (!d) return "-";
	try {
		return d.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			timeZone: "Asia/Ho_Chi_Minh",
		});
	} catch {
		return d.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}
}
