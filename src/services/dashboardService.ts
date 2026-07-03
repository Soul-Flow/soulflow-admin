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

export const getDashboardSummary = async (
	filter: "today" | "week" | "month" = "month",
): Promise<DashboardData> => {
	const response = await api.get<ApiResponse<DashboardData>>("/dashboard", {
		params: { filter },
	});
	return response.data.data;
};
