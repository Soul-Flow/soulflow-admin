"use client";

import {
	AlertCircle,
	DollarSign,
	Loader2,
	Minus,
	Package,
	ShoppingCart,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DashboardFilter } from "@/services/dashboardService";
import useDashboardStore from "@/stores/dashboardStore";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
		amount,
	);

const CATEGORY_COLORS = [
	"oklch(0.65 0.19 160)",
	"oklch(0.6 0.18 250)",
	"oklch(0.7 0.17 55)",
	"oklch(0.55 0.2 320)",
	"oklch(0.65 0.15 20)",
	"oklch(0.75 0.15 100)",
	"oklch(0.5 0.1 200)",
] as const;

const barChartConfig: ChartConfig = {
	revenue: {
		label: "Doanh thu ",
		color: " oklch(0.65 0.19 160)",
	},
};

// ─── Page Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
	const [filter, setFilter] = useState<DashboardFilter>("month");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [chartType, setChartType] = useState<
		"auto" | "hour" | "day" | "week" | "month" | "quarter" | "year"
	>("auto");
	const [dateError, setDateError] = useState<string | null>(null);

	const { data, loading, error, fetchDashboard } = useDashboardStore();

	useEffect(() => {
		// Only fetch automatically if not custom
		if (filter !== "custom") {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			void fetchDashboard({ filter });
		}
	}, [filter, fetchDashboard]);

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<div className="flex flex-col items-center gap-2 text-muted-foreground">
					<Loader2 className="h-8 w-8 animate-spin" />
					<p>Đang tải dữ liệu tổng quan...</p>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<div className="flex flex-col items-center gap-2 text-red-500">
					<AlertCircle className="h-8 w-8" />
					<p>{error || "Không thể tải dữ liệu"}</p>
				</div>
			</div>
		);
	}

	const {
		metrics,
		revenueByMonth,
		revenueByCategory,
		topSellingProducts,
		lowStockProducts,
	} = data;

	const getFilterText = () => {
		if (filter === "today") return "so với hôm qua";
		if (filter === "week") return "so với tuần trước";
		if (filter === "month") return "so với tháng trước";
		if (filter === "quarter") return "so với quý trước";
		if (filter === "year") return "so với năm trước";
		if (filter === "all") return "toàn thời gian";
		if (filter === "custom") return "trong khoảng thời gian này";
		return "";
	};

	const todayStr = new Date().toISOString().split("T")[0];

	const handleCustomFilterApply = () => {
		if (!startDate || !endDate) {
			setDateError("Vui lòng chọn cả ngày bắt đầu và kết thúc");
			return;
		}
		if (startDate > endDate) {
			setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
			return;
		}
		setDateError(null);
		void fetchDashboard({ filter, startDate, endDate, chartType });
	};

	// Prepare pie chart config dynamically based on received categories
	const pieChartConfig: ChartConfig = {};
	revenueByCategory.forEach((cat, index) => {
		pieChartConfig[cat.name] = {
			label: cat.name,
			color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
		};
	});

	const metricCards = [
		{
			title: "Tổng Doanh Thu",
			value: formatCurrency(metrics.totalRevenue),
			change: `${metrics.revenueChangePercentage > 0 ? "+" : ""}${metrics.revenueChangePercentage}% ${getFilterText()}`,
			icon: DollarSign,
			iconBg: "bg-emerald-500/10",
			iconColor: "text-emerald-600",
			trendIcon:
				metrics.revenueChangePercentage > 0
					? TrendingUp
					: metrics.revenueChangePercentage < 0
						? TrendingDown
						: Minus,
			trendColor:
				metrics.revenueChangePercentage > 0
					? "text-emerald-600"
					: metrics.revenueChangePercentage < 0
						? "text-red-600"
						: "text-gray-500",
		},
		{
			title: "Đơn Hàng Mới",
			value: metrics.newOrders.toString(),
			change: `${metrics.ordersChangePercentage > 0 ? "+" : ""}${metrics.ordersChangePercentage}% ${getFilterText()}`,
			icon: ShoppingCart,
			iconBg: "bg-blue-500/10",
			iconColor: "text-blue-600",
			trendIcon:
				metrics.ordersChangePercentage > 0
					? TrendingUp
					: metrics.ordersChangePercentage < 0
						? TrendingDown
						: Minus,
			trendColor:
				metrics.ordersChangePercentage > 0
					? "text-emerald-600"
					: metrics.ordersChangePercentage < 0
						? "text-red-600"
						: "text-gray-500",
		},
		{
			title: "Người Dùng Hoạt Động",
			value: metrics.activeUsers.toString(),
			change: `${metrics.usersChangePercentage > 0 ? "+" : ""}${metrics.usersChangePercentage}% ${getFilterText()}`,
			icon: Users,
			iconBg: "bg-violet-500/10",
			iconColor: "text-violet-600",
			trendIcon:
				metrics.usersChangePercentage > 0
					? TrendingUp
					: metrics.usersChangePercentage < 0
						? TrendingDown
						: Minus,
			trendColor:
				metrics.usersChangePercentage > 0
					? "text-emerald-600"
					: metrics.usersChangePercentage < 0
						? "text-red-600"
						: "text-gray-500",
		},
		{
			title: "Tổng Sản Phẩm",
			value: metrics.totalProducts.toString(),
			change: `${metrics.newProductsCount > 0 ? "+" : ""}${metrics.newProductsCount} sản phẩm mới`,
			icon: Package,
			iconBg: "bg-amber-500/10",
			iconColor: "text-amber-600",
			trendIcon: metrics.newProductsCount > 0 ? TrendingUp : Minus,
			trendColor:
				metrics.newProductsCount > 0 ? "text-emerald-600" : "text-gray-500",
		},
	];

	return (
		<div className="space-y-6">
			{/* Page heading */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
					<p className="text-muted-foreground">
						Chào mừng trở lại! Đây là tổng quan hoạt động cửa hàng của bạn.
					</p>
				</div>
				<div className="flex flex-col items-end gap-2">
					<Tabs
						value={filter}
						onValueChange={(v: any) => setFilter(v)}
						className="w-full lg:w-auto"
					>
						<TabsList className="grid w-full grid-cols-4 lg:flex lg:flex-wrap h-auto gap-1">
							<TabsTrigger value="today">Hôm nay</TabsTrigger>
							<TabsTrigger value="week">Tuần</TabsTrigger>
							<TabsTrigger value="month">Tháng</TabsTrigger>
							<TabsTrigger value="quarter">Quý</TabsTrigger>
							<TabsTrigger value="year">Năm</TabsTrigger>
							<TabsTrigger value="all">Tất cả</TabsTrigger>
							<TabsTrigger value="custom">Tuỳ chọn</TabsTrigger>
						</TabsList>
					</Tabs>

					{filter === "custom" && (
						<div className="flex flex-col gap-2 mt-2">
							<div className="flex flex-wrap items-center gap-2">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-muted-foreground">
										Biểu đồ theo:
									</span>
									<select
										value={chartType}
										onChange={(e) => setChartType(e.target.value as any)}
										className="h-9 border rounded-md px-2 py-1 text-sm bg-background"
									>
										<option value="auto">Tự động</option>
										<option value="day">Ngày</option>
										<option value="week">Tuần</option>
										<option value="month">Tháng</option>
										<option value="quarter">Quý</option>
										<option value="year">Năm</option>
									</select>
								</div>
								<div className="hidden sm:block text-muted-foreground mx-2">
									|
								</div>
								<div className="flex items-center gap-2">
									<input
										type="date"
										value={startDate}
										max={endDate || todayStr}
										onChange={(e) => {
											setStartDate(e.target.value);
											setDateError(null);
										}}
										className="h-9 border rounded-md px-2 py-1 text-sm bg-background"
									/>
									<span className="text-muted-foreground">-</span>
									<input
										type="date"
										value={endDate}
										min={startDate || undefined}
										max={todayStr}
										onChange={(e) => {
											setEndDate(e.target.value);
											setDateError(null);
										}}
										className="h-9 border rounded-md px-2 py-1 text-sm bg-background"
									/>
									<Button size="sm" onClick={handleCustomFilterApply}>
										Áp dụng
									</Button>
								</div>
							</div>
							{dateError && (
								<span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{dateError}
								</span>
							)}
						</div>
					)}
				</div>
			</div>

			{/* ── 1. Metric Cards ─────────────────────────────────────────────── */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{metricCards.map((card) => (
					<Card key={card.title} className="transition-shadow hover:shadow-md">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{card.title}
							</CardTitle>
							<div
								className={`flex h-9 w-9 items-center justify-center rounded-full ${card.iconBg}`}
							>
								<card.icon className={`h-4 w-4 ${card.iconColor}`} />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{card.value}</div>
							<div
								className={`mt-1 flex items-center gap-1 text-xs ${card.trendColor}`}
							>
								<card.trendIcon className="h-3 w-3" />
								<span>{card.change}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* ── 2. Charts ───────────────────────────────────────────────────── */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
				{/* Bar Chart — Revenue report */}
				<Card className="lg:col-span-4">
					<CardHeader className="gap-4">
						<div>
							<CardTitle>Biểu đồ Doanh thu</CardTitle>
							<CardDescription>
								Doanh thu theo thời gian đã chọn trong bộ lọc tổng quan.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						{revenueByMonth.length === 0 ? (
							<div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
								Chưa có dữ liệu
							</div>
						) : (
							<ChartContainer
								config={barChartConfig}
								className="min-h-[300px] w-full"
							>
								<BarChart data={revenueByMonth}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value: number) => {
											if (value >= 1_000_000)
												return `${(value / 1_000_000).toFixed(1)}tr`;
											if (value >= 1_000)
												return `${(value / 1_000).toFixed(0)}k`;
											return value.toString();
										}}
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												formatter={(value) => (
													<div className="flex items-center gap-2">
														<div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-revenue]" />
														<span className="text-muted-foreground">
															Doanh thu
														</span>
														<span className="font-mono font-medium text-foreground tabular-nums ml-auto">
															{formatCurrency(Number(value))}
														</span>
													</div>
												)}
											/>
										}
									/>
									<Bar
										dataKey="revenue"
										fill="var(--color-revenue)"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ChartContainer>
						)}
					</CardContent>
				</Card>

				{/* Pie Chart — Revenue by Category */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Doanh thu theo danh mục</CardTitle>
						<CardDescription>
							Phân bổ doanh thu theo từng danh mục sản phẩm
						</CardDescription>
					</CardHeader>
					<CardContent>
						{revenueByCategory.length === 0 ? (
							<div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
								Chưa có dữ liệu
							</div>
						) : (
							<ChartContainer
								config={pieChartConfig}
								className="mx-auto min-h-[300px] w-full"
							>
								<PieChart>
									<ChartTooltip
										content={
											<ChartTooltipContent
												formatter={(value, name) => (
													<div className="flex items-center gap-2">
														<div
															className="h-2.5 w-2.5 shrink-0 rounded-full"
															style={{
																backgroundColor:
																	pieChartConfig[name as string]?.color,
															}}
														/>
														<span className="text-muted-foreground">
															{name}
														</span>
														<span className="font-mono font-medium text-foreground tabular-nums ml-auto">
															{formatCurrency(Number(value))}
														</span>
													</div>
												)}
											/>
										}
									/>
									<Pie
										data={revenueByCategory}
										dataKey="value"
										nameKey="name"
										innerRadius={60}
										paddingAngle={2}
										strokeWidth={2}
										stroke="transparent"
									>
										{revenueByCategory.map((entry, index) => (
											<Cell
												key={entry.name}
												fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
											/>
										))}
									</Pie>
									<ChartLegend
										content={<ChartLegendContent nameKey="name" />}
									/>
								</PieChart>
							</ChartContainer>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Sản phẩm bán chạy</CardTitle>
						<CardDescription>
							Top sản phẩm có doanh số cao nhất.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tên sản phẩm</TableHead>
									<TableHead className="text-right">Đã bán</TableHead>
									<TableHead className="text-right">Doanh thu</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topSellingProducts.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center text-muted-foreground h-24"
										>
											Chưa có dữ liệu
										</TableCell>
									</TableRow>
								) : (
									topSellingProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell className="font-medium">
												{product.name}
											</TableCell>
											<TableCell className="text-right">
												{product.sold}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(product.revenue)}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Cảnh báo tồn kho</CardTitle>
						<CardDescription>
							Sản phẩm sắp hết hàng cần nhập thêm.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tên sản phẩm</TableHead>
									<TableHead className="text-right">Tồn kho</TableHead>
									<TableHead>Trạng thái</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{lowStockProducts.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center text-muted-foreground h-24"
										>
											Chưa có dữ liệu
										</TableCell>
									</TableRow>
								) : (
									lowStockProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell className="font-medium">
												{product.name}
											</TableCell>
											<TableCell className="text-right">
												{product.stock}
											</TableCell>
											<TableCell>
												<Badge
													variant="destructive"
													className={
														product.stock === 0
															? "bg-red-600 text-white hover:bg-red-700"
															: "bg-amber-500 text-slate-900 hover:bg-amber-600"
													}
												>
													{product.status}
												</Badge>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
