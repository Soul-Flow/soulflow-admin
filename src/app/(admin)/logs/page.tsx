"use client";

import {
	Activity,
	ArrowUpDown,
	Clock,
	ExternalLink,
	Filter,
	History,
	KeyRound,
	Layers,
	Package,
	RefreshCw,
	Search,
	Shield,
	ShoppingCart,
	Terminal,
	Trash2,
	User,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateTime } from "@/lib/utils";
import { type SystemActivityLog, logService } from "@/services/logService";

const CATEGORY_MAP: Record<
	string,
	{ label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
	AUTH: { label: "Xác thực & Login", icon: KeyRound, color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400" },
	ORDER: { label: "Đơn hàng", icon: ShoppingCart, color: "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400" },
	PRODUCT: { label: "Sản phẩm & Kho", icon: Package, color: "bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400" },
	CATEGORY: { label: "Danh mục", icon: Layers, color: "bg-indigo-500/15 text-indigo-700 border-indigo-500/25 dark:text-indigo-400" },
	DISCOUNT: { label: "Khuyến mãi", icon: Activity, color: "bg-orange-500/15 text-orange-700 border-orange-500/25 dark:text-orange-400" },
	USER: { label: "Người dùng", icon: Users, color: "bg-rose-500/15 text-rose-700 border-rose-500/25 dark:text-rose-400" },
	COMMENT: { label: "Bình luận", icon: Activity, color: "bg-purple-500/15 text-purple-700 border-purple-500/25 dark:text-purple-400" },
};

export default function AuditLogsPage() {
	const [logs, setLogs] = useState<SystemActivityLog[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
	const [searchQuery, setSearchQuery] = useState("");
	const [isAutoRefresh, setIsAutoRefresh] = useState(true);

	const fetchLogs = async (silent = false) => {
		if (!silent) setIsLoading(true);
		try {
			const data = await logService.getLogs({
				category: selectedCategory === "ALL" ? undefined : selectedCategory,
				keyword: searchQuery.trim() || undefined,
				limit: 300,
			});
			setLogs(data || []);
		} catch {
			if (!silent) toast.error("Không thể tải nhật ký hoạt động");
		} finally {
			if (!silent) setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, [selectedCategory, searchQuery]);

	// Auto refresh every 6 seconds if enabled
	useEffect(() => {
		if (!isAutoRefresh) return;
		const interval = setInterval(() => {
			fetchLogs(true);
		}, 6000);
		return () => clearInterval(interval);
	}, [isAutoRefresh, selectedCategory, searchQuery]);

	const handleClearLogs = async () => {
		if (!confirm("Bạn có chắc muốn xóa bộ nhớ nhật ký hoạt động hiện tại?")) return;
		try {
			await logService.clearLogs();
			setLogs([]);
			toast.success("Đã làm sạch bộ nhớ nhật ký hoạt động!");
		} catch {
			toast.error("Xóa nhật ký thất bại");
		}
	};

	// Statistics
	const stats = useMemo(() => {
		const total = logs.length;
		const authLogins = logs.filter((l) => l.category === "AUTH").length;
		const orderEvents = logs.filter((l) => l.category === "ORDER").length;
		const dataEdits = logs.filter((l) => ["PRODUCT", "CATEGORY", "DISCOUNT", "USER"].includes(l.category)).length;
		return { total, authLogins, orderEvents, dataEdits };
	}, [logs]);

	return (
		<div className="space-y-6 p-4 sm:p-8">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
						<History className="h-3.5 w-3.5" />
						Hệ Thống & Giám Sát
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
						Nhật Ký Hoạt Động & Truy Cập
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Theo dõi toàn bộ lịch sử đăng nhập của User, thay đổi dữ liệu từ Admin và Web khách hàng.
					</p>
				</div>

				<div className="flex items-center gap-2.5">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsAutoRefresh(!isAutoRefresh)}
						className={`text-xs ${isAutoRefresh ? "border-emerald-500/40 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}
					>
						<span className={`h-2 w-2 rounded-full mr-2 ${isAutoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
						{isAutoRefresh ? "Tự làm mới (6s)" : "Tạm dừng live"}
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={() => fetchLogs()}
						disabled={isLoading}
						className="text-xs"
					>
						<RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
						Làm mới
					</Button>

					<Button
						variant="destructive"
						size="sm"
						onClick={handleClearLogs}
						className="text-xs"
					>
						<Trash2 className="h-3.5 w-3.5 mr-1.5" />
						Làm sạch log
					</Button>
				</div>
			</div>

			{/* Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border-border shadow-2xs">
					<CardHeader className="pb-2">
						<CardDescription className="text-xs font-semibold uppercase tracking-wider">
							Tổng Bản Ghi
						</CardDescription>
						<CardTitle className="text-2xl font-bold font-mono text-foreground">
							{stats.total}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<Activity className="h-3.5 w-3.5 text-primary" />
							Lưu trữ trong bộ nhớ tạm In-Memory
						</p>
					</CardContent>
				</Card>

				<Card className="border-border shadow-2xs">
					<CardHeader className="pb-2">
						<CardDescription className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
							Đăng Nhập / Xác Thực
						</CardDescription>
						<CardTitle className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
							{stats.authLogins}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<KeyRound className="h-3.5 w-3.5 text-emerald-500" />
							Tài khoản & Google OAuth
						</p>
					</CardContent>
				</Card>

				<Card className="border-border shadow-2xs">
					<CardHeader className="pb-2">
						<CardDescription className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
							Sự Kiện Đơn Hàng
						</CardDescription>
						<CardTitle className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
							{stats.orderEvents}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<ShoppingCart className="h-3.5 w-3.5 text-blue-500" />
							Tạo đơn, thanh toán, đổi trạng thái
						</p>
					</CardContent>
				</Card>

				<Card className="border-border shadow-2xs">
					<CardHeader className="pb-2">
						<CardDescription className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
							Chỉnh Sửa Dữ Liệu
						</CardDescription>
						<CardTitle className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
							{stats.dataEdits}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<Layers className="h-3.5 w-3.5 text-amber-500" />
							Thêm / Sửa / Xóa Sản phẩm & Danh mục
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Controls */}
			<Card className="border-border shadow-2xs">
				<CardHeader className="pb-3">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
						{/* Tabs Filter */}
						<Tabs
							value={selectedCategory}
							onValueChange={setSelectedCategory}
							className="w-full lg:w-auto"
						>
							<TabsList className="grid grid-cols-3 sm:grid-cols-7 h-auto p-1 gap-1">
								<TabsTrigger value="ALL" className="text-xs py-1.5">
									Tất cả
								</TabsTrigger>
								<TabsTrigger value="AUTH" className="text-xs py-1.5">
									Đăng nhập
								</TabsTrigger>
								<TabsTrigger value="ORDER" className="text-xs py-1.5">
									Đơn hàng
								</TabsTrigger>
								<TabsTrigger value="PRODUCT" className="text-xs py-1.5">
									Sản phẩm
								</TabsTrigger>
								<TabsTrigger value="CATEGORY" className="text-xs py-1.5">
									Danh mục
								</TabsTrigger>
								<TabsTrigger value="DISCOUNT" className="text-xs py-1.5">
									Voucher
								</TabsTrigger>
								<TabsTrigger value="USER" className="text-xs py-1.5">
									Người dùng
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Search Input */}
						<div className="relative w-full lg:w-72">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm theo người dùng, nội dung..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 text-xs h-9"
							/>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{isLoading && logs.length === 0 ? (
						<div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
							<RefreshCw className="h-6 w-6 animate-spin text-primary" />
							<p className="text-xs">Đang tải nhật ký hoạt động...</p>
						</div>
					) : logs.length === 0 ? (
						<div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
							<History className="h-8 w-8 text-muted-foreground/50" />
							<p className="text-sm font-medium">Chưa có hoạt động nào được ghi nhận</p>
							<p className="text-xs text-muted-foreground">
								Các hành động đăng nhập và chỉnh sửa từ Admin/Web sẽ xuất hiện tại đây theo thời gian thực.
							</p>
						</div>
					) : (
						<div className="rounded-xl border border-border overflow-hidden">
							<Table>
								<TableHeader className="bg-muted/40">
									<TableRow>
										<TableHead className="w-[150px] text-xs font-bold">Thời Gian</TableHead>
										<TableHead className="w-[130px] text-xs font-bold">Phân Loại</TableHead>
										<TableHead className="w-[180px] text-xs font-bold">Người Thực Hiện</TableHead>
										<TableHead className="w-[160px] text-xs font-bold">Đối Tượng (Target)</TableHead>
										<TableHead className="text-xs font-bold">Chi Tiết Hoạt Động</TableHead>
										<TableHead className="w-[120px] text-xs font-bold text-right">IP Client</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{logs.map((log) => {
										const catConfig = CATEGORY_MAP[log.category] || {
											label: log.category,
											icon: Activity,
											color: "bg-slate-500/15 text-slate-700 border-slate-500/25",
										};
										const IconComponent = catConfig.icon;
										const timeStr = formatDateTime(log.timestamp, true);

										return (
											<TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
												<TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
													<div className="flex items-center gap-1.5">
														<Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
														<span>{timeStr}</span>
													</div>
												</TableCell>

												<TableCell>
													<Badge
														variant="outline"
														className={`text-xs px-2.5 py-0.5 flex items-center gap-1.5 w-fit ${catConfig.color}`}
													>
														<IconComponent className="h-3 w-3" />
														{catConfig.label}
													</Badge>
												</TableCell>

												<TableCell>
													<div className="flex flex-col min-w-0">
														<span className="font-semibold text-xs text-foreground truncate" title={log.performedBy}>
															{log.performedBy}
														</span>
														<span className="text-[11px] text-muted-foreground font-mono">
															{log.role.includes("ADMIN") ? (
																<span className="text-primary font-semibold">ADMIN</span>
															) : (
																<span>USER</span>
															)}
														</span>
													</div>
												</TableCell>

												<TableCell>
													<Badge
														variant="outline"
														className="font-mono text-xs font-semibold bg-muted/50 text-foreground border-border/60 max-w-[140px] truncate"
														title={log.target}
													>
														{log.target}
													</Badge>
												</TableCell>

												<TableCell>
													<div className="text-xs text-foreground font-medium leading-relaxed">
														{log.details}
													</div>
												</TableCell>

												<TableCell className="text-right font-mono text-[11px] text-muted-foreground whitespace-nowrap">
													{log.ipAddress}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
