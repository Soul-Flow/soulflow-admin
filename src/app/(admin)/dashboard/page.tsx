"use client";

import {
	DollarSign,
	Package,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
		amount,
	);

// ─── Metric Cards Data ─────────────────────────────────────────────────────────

interface MetricCard {
	title: string;
	value: string;
	change: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	iconBg: string;
	iconColor: string;
}

const metricCards: MetricCard[] = [
	{
		title: "Tổng Doanh Thu",
		value: formatCurrency(128_500_000),
		change: "+12.5% so với tháng trước",
		icon: DollarSign,
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600",
	},
	{
		title: "Đơn Hàng Mới",
		value: "284",
		change: "+8.2% so với tháng trước",
		icon: ShoppingCart,
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600",
	},
	{
		title: "Người Dùng Hoạt Động",
		value: "1,423",
		change: "+5.1% so với tháng trước",
		icon: Users,
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600",
	},
	{
		title: "Tổng Sản Phẩm",
		value: "156",
		change: "+3 sản phẩm mới",
		icon: Package,
		iconBg: "bg-amber-500/10",
		iconColor: "text-amber-600",
	},
];

// ─── Bar Chart Data ─────────────────────────────────────────────────────────────

const revenueByMonth = [
	{ month: "T1", revenue: 95_000_000 },
	{ month: "T2", revenue: 88_000_000 },
	{ month: "T3", revenue: 105_000_000 },
	{ month: "T4", revenue: 112_000_000 },
	{ month: "T5", revenue: 128_500_000 },
	{ month: "T6", revenue: 135_000_000 },
	{ month: "T7", revenue: 142_000_000 },
	{ month: "T8", revenue: 138_000_000 },
	{ month: "T9", revenue: 125_000_000 },
	{ month: "T10", revenue: 148_000_000 },
	{ month: "T11", revenue: 156_000_000 },
	{ month: "T12", revenue: 85_000_000 },
];

const barChartConfig: ChartConfig = {
	revenue: {
		label: "Doanh thu",
		color: "oklch(0.65 0.19 160)",
	},
};

// ─── Pie Chart Data ─────────────────────────────────────────────────────────────

const CATEGORY_COLORS = [
	"oklch(0.65 0.19 160)",
	"oklch(0.6 0.18 250)",
	"oklch(0.7 0.17 55)",
	"oklch(0.55 0.2 320)",
	"oklch(0.65 0.15 20)",
] as const;

const revenueByCategory = [
	{ name: "hoaTuoi", value: 45_200_000 },
	{ name: "boHoa", value: 32_800_000 },
	{ name: "gioHoa", value: 18_500_000 },
	{ name: "lanHoDiep", value: 22_000_000 },
	{ name: "keHoa", value: 10_000_000 },
];

const pieChartConfig: ChartConfig = {
	hoaTuoi: { label: "Hoa Tươi", color: CATEGORY_COLORS[0] },
	boHoa: { label: "Bó Hoa", color: CATEGORY_COLORS[1] },
	gioHoa: { label: "Giỏ Hoa", color: CATEGORY_COLORS[2] },
	lanHoDiep: { label: "Lan Hồ Điệp", color: CATEGORY_COLORS[3] },
	keHoa: { label: "Kệ Hoa", color: CATEGORY_COLORS[4] },
};

const topSelling = [
	{ id: "PROD-001", name: "Hoa Hồng Đỏ", sold: 125, revenue: 43_750_000 },
	{
		id: "PROD-002",
		name: "Giỏ Hoa Hướng Dương",
		sold: 98,
		revenue: 41_160_000,
	},
	{ id: "PROD-003", name: "Lan Hồ Điệp Trắng", sold: 65, revenue: 78_000_000 },
	{ id: "PROD-004", name: "Bó Hoa Sinh Nhật", sold: 42, revenue: 21_000_000 },
];

const lowStock = [
	{ id: "PROD-010", name: "Hoa Tulip Nhập Khẩu", stock: 0, status: "Hết hàng" },
	{ id: "PROD-011", name: "Kệ Hoa Khai Trương", stock: 2, status: "Sắp hết" },
	{ id: "PROD-012", name: "Bó Hoa Tình Yêu", stock: 5, status: "Sắp hết" },
];

// ─── Page Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			{/* Page heading */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
				<p className="text-muted-foreground">
					Chào mừng trở lại! Đây là tổng quan hoạt động cửa hàng của bạn.
				</p>
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
							<div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
								<TrendingUp className="h-3 w-3" />
								<span>{card.change}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* ── 2. Charts ───────────────────────────────────────────────────── */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
				{/* Bar Chart — Monthly Revenue */}
				<Card className="lg:col-span-4">
					<CardHeader>
						<CardTitle>Doanh thu theo tháng</CardTitle>
						<CardDescription>
							Tổng doanh thu từ tháng 1 đến tháng 12 năm 2025
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={barChartConfig} className="min-h-75 w-full">
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
									tickFormatter={(value: number) =>
										`${(value / 1_000_000).toFixed(0)}M`
									}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar
									dataKey="revenue"
									fill="var(--color-revenue)"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ChartContainer>
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
						<ChartContainer
							config={pieChartConfig}
							className="mx-auto min-h-75 w-full"
						>
							<PieChart>
								<ChartTooltip content={<ChartTooltipContent />} />
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
								<ChartLegend content={<ChartLegendContent nameKey="name" />} />
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="today" className="space-y-4">
				<TabsList>
					<TabsTrigger value="today">Hôm nay</TabsTrigger>
					<TabsTrigger value="week">Tuần này</TabsTrigger>
					<TabsTrigger value="month">Tháng này</TabsTrigger>
				</TabsList>
				<TabsContent value="today" className="space-y-4">
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
										{topSelling.map((product) => (
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
										))}
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
										{lowStock.map((product) => (
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
																? "bg-red-600 text-white"
																: "bg-amber-500 text-slate-900"
														}
													>
														{product.status}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="week" className="space-y-4">
					<div className="text-muted-foreground p-4 text-center border rounded-md">
						Chưa có dữ liệu cho tuần này.
					</div>
				</TabsContent>
				<TabsContent value="month" className="space-y-4">
					<div className="text-muted-foreground p-4 text-center border rounded-md">
						Chưa có dữ liệu cho tháng này.
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
