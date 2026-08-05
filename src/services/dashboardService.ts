import api from "../lib/api";

export interface DashboardMetrics {
	totalRevenue: number;
	revenueChangePercentage: number;
	newOrders: number;
	ordersChangePercentage: number;
	activeUsers: number;
	usersChangePercentage: number;
	totalProducts: number;
	newProductsCount: number;
}

export interface RevenueByMonth {
	month: string;
	revenue: number;
}

export type RevenueReportType = "MONTH" | "QUARTER" | "YEAR";

export interface RevenueReportItem {
	yearValue: number;
	monthValue: number | null;
	quarterValue: number | null;
	label: string;
	orderCount: number;
	revenue: number;
}

export interface RevenueReportQueryParams {
	startDate: string;
	endDate: string;
	type: RevenueReportType;
}

export interface RevenueByCategory {
	name: string;
	value: number;
}

export interface TopSellingProduct {
	id: string;
	name: string;
	sold: number;
	revenue: number;
}

export interface LowStockProduct {
	id: string;
	name: string;
	stock: number;
	status: string;
}

export interface DashboardData {
	metrics: DashboardMetrics;
	revenueByMonth: RevenueByMonth[];
	revenueByCategory: RevenueByCategory[];
	topSellingProducts: TopSellingProduct[];
	lowStockProducts: LowStockProduct[];
}

interface ApiResponse<T> {
	code: number;
	message: string;
	data: T;
}

export type DashboardFilter =
	| "today"
	| "week"
	| "month"
	| "year"
	| "all"
	| "custom";

export interface DashboardQueryParams {
	filter?: DashboardFilter;
	startDate?: string;
	endDate?: string;
}

export const getDashboardSummary = async (
	params: DashboardQueryParams = { filter: "month" },
): Promise<DashboardData> => {
	const response = await api.get<ApiResponse<DashboardData>>("/dashboard", {
		params,
		headers: {
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
		},
	});
	return response.data.data;
};

export const getRevenueReport = async (
	params: RevenueReportQueryParams,
): Promise<RevenueReportItem[]> => {
	const response = await api.get<RevenueReportItem[]>("/revenue-report", {
		params,
	});
	return response.data;
};
