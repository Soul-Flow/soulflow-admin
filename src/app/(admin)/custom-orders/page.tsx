"use client";

import {
	CheckCircle2,
	Clock,
	Copy,
	ExternalLink,
	FileSpreadsheet,
	Filter,
	HeartHandshake,
	MessageSquare,
	Palette,
	Phone,
	PhoneCall,
	Plus,
	RefreshCw,
	Search,
	ShieldAlert,
	Trash2,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateCustomOrderDialog } from "@/app/(admin)/orders/create-custom-order-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CustomOrderResponse } from "@/interfaces/responses/custom-order-response.interface";
import { formatDateTime } from "@/lib/utils";
import { customOrderService } from "@/services/customOrderService";

const GOOGLE_SHEET_URL =
	"https://docs.google.com/spreadsheets/d/1WgIVmJNdyCVSJwJxyflVVNPsuJRm1J_QvD174g82zlQ/edit?usp=sharing";

export default function CustomOrdersPage() {
	const [requests, setRequests] = useState<CustomOrderResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

	const fetchRequests = async () => {
		try {
			setLoading(true);
			const data = await customOrderService.getAll();
			setRequests(data || []);
		} catch (_err) {
			toast.error("Không thể tải danh sách yêu cầu đặt hoa.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	const handleStatusChange = async (
		id: string,
		newStatus: "PENDING" | "CONTACTED" | "ORDER_CREATED" | "SPAM",
	) => {
		// Optimistic UI update
		setRequests((prev) =>
			prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
		);
		try {
			const updated = await customOrderService.updateStatus(id, newStatus);
			if (updated) {
				setRequests((prev) =>
					prev.map((item) => (item.id === id ? updated : item)),
				);
			}
			toast.success(`Đã cập nhật trạng thái yêu cầu #${id}`);
		} catch (_err) {
			toast.error("Cập nhật trạng thái thất bại.");
			fetchRequests();
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await customOrderService.delete(id);
			setRequests((prev) => prev.filter((item) => item.id !== id));
			toast.success(`Đã xóa yêu cầu #${id}`);
		} catch (_err) {
			toast.error("Không thể xóa yêu cầu.");
		}
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`Đã sao chép ${label}: ${text}`);
	};

	// Parse number from budget string (e.g. "1.500.000₫" -> 1500000)
	const parseBudgetPrice = (budgetStr?: string): number | undefined => {
		if (!budgetStr) return undefined;
		const digits = budgetStr.replace(/[^0-9]/g, "");
		const num = Number.parseInt(digits, 10);
		return Number.isNaN(num) || num <= 0 ? undefined : num;
	};

	// Filtered items
	const filteredRequests = useMemo(() => {
		return requests.filter((item) => {
			const matchesSearch =
				!searchQuery.trim() ||
				item.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.phone?.includes(searchQuery) ||
				item.occasion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.preferredColors?.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				selectedStatus === "ALL" || item.status === selectedStatus;

			return matchesSearch && matchesStatus;
		});
	}, [requests, searchQuery, selectedStatus]);

	// Stats
	const stats = useMemo(() => {
		return {
			total: requests.length,
			pending: requests.filter((r) => r.status === "PENDING").length,
			contacted: requests.filter((r) => r.status === "CONTACTED").length,
			completed: requests.filter((r) => r.status === "ORDER_CREATED").length,
			spam: requests.filter((r) => r.status === "SPAM").length,
		};
	}, [requests]);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "PENDING":
				return (
					<Badge
						variant="outline"
						className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 font-semibold"
					>
						<Clock className="h-3 w-3" />
						Chờ liên hệ
					</Badge>
				);
			case "CONTACTED":
				return (
					<Badge
						variant="outline"
						className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 gap-1.5 font-semibold"
					>
						<PhoneCall className="h-3 w-3" />
						Đã liên hệ
					</Badge>
				);
			case "ORDER_CREATED":
				return (
					<Badge
						variant="outline"
						className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 font-semibold"
					>
						<CheckCircle2 className="h-3 w-3" />
						Đã chốt đơn
					</Badge>
				);
			case "SPAM":
				return (
					<Badge
						variant="outline"
						className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 gap-1.5 font-semibold"
					>
						<ShieldAlert className="h-3 w-3" />
						Spam / Rác
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5">
						<h1 className="text-2xl font-bold tracking-tight">
							Đặt Hoa Theo Yêu Cầu
						</h1>
						<Badge
							variant="outline"
							className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-semibold px-2 py-0.5"
						>
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
							Cloud Sync
						</Badge>
					</div>
					<p className="text-muted-foreground text-sm mt-0.5">
						Danh sách khách hàng gửi yêu cầu tư vấn & đặt hoa thiết kế (Lưu tạm RAM + Đồng bộ Google Sheets).
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2.5">
					<Button
						variant="outline"
						size="sm"
						onClick={fetchRequests}
						disabled={loading}
						className="gap-1.5"
					>
						<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
						Làm mới
					</Button>

					<a
						href={GOOGLE_SHEET_URL}
						target="_blank"
						rel="noreferrer"
					>
						<Button
							size="sm"
							className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm cursor-pointer"
						>
							<FileSpreadsheet className="h-4 w-4" />
							Mở Google Sheets
							<ExternalLink className="h-3.5 w-3.5 opacity-70" />
						</Button>
					</a>
				</div>
			</div>

			{/* Metric Stat Cards */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
				<Card className="p-4 border-border/60 shadow-2xs">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-muted-foreground">
							Tổng yêu cầu
						</span>
						<HeartHandshake className="h-4 w-4 text-emerald-600" />
					</div>
					<div className="text-2xl font-bold mt-2">{stats.total}</div>
				</Card>

				<Card className="p-4 border-border/60 shadow-2xs">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-amber-600 dark:text-amber-400">
							Chờ liên hệ
						</span>
						<Clock className="h-4 w-4 text-amber-500" />
					</div>
					<div className="text-2xl font-bold mt-2 text-amber-600 dark:text-amber-400">
						{stats.pending}
					</div>
				</Card>

				<Card className="p-4 border-border/60 shadow-2xs">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-sky-600 dark:text-sky-400">
							Đã liên hệ
						</span>
						<PhoneCall className="h-4 w-4 text-sky-500" />
					</div>
					<div className="text-2xl font-bold mt-2 text-sky-600 dark:text-sky-400">
						{stats.contacted}
					</div>
				</Card>

				<Card className="p-4 border-border/60 shadow-2xs">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
							Đã chốt đơn
						</span>
						<CheckCircle2 className="h-4 w-4 text-emerald-500" />
					</div>
					<div className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
						{stats.completed}
					</div>
				</Card>

				<Card className="p-4 border-border/60 shadow-2xs col-span-2 md:col-span-1">
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-red-600 dark:text-red-400">
							Spam / Rác
						</span>
						<ShieldAlert className="h-4 w-4 text-red-500" />
					</div>
					<div className="text-2xl font-bold mt-2 text-red-600 dark:text-red-400">
						{stats.spam}
					</div>
				</Card>
			</div>

			{/* Search & Filter Toolbar */}
			<div className="flex flex-col sm:flex-row items-center gap-3">
				<div className="relative flex-1 w-full">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm theo tên khách, username, SĐT, ngân sách, dịp tặng, ghi chú..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 bg-card border-border/60"
					/>
				</div>

				<div className="flex items-center gap-2 w-full sm:w-auto">
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-full sm:w-44 bg-card border-border/60">
							<Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
							<SelectValue placeholder="Lọc trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">Tất cả trạng thái</SelectItem>
							<SelectItem value="PENDING">Chờ liên hệ</SelectItem>
							<SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
							<SelectItem value="ORDER_CREATED">Đã chốt đơn</SelectItem>
							<SelectItem value="SPAM">Spam / Rác</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Custom Orders List */}
			{loading ? (
				<div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border/60">
					<RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
					<p className="text-sm text-muted-foreground">Đang tải danh sách yêu cầu...</p>
				</div>
			) : filteredRequests.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border/60 text-center px-4">
					<HeartHandshake className="h-10 w-10 text-muted-foreground/50 mb-3" />
					<h3 className="font-semibold text-lg">Chưa có yêu cầu đặt hoa nào</h3>
					<p className="text-sm text-muted-foreground max-w-sm mt-1">
						{searchQuery || selectedStatus !== "ALL"
							? "Không tìm thấy yêu cầu phù hợp với bộ lọc hiện tại."
							: "Khi khách hàng gửi form yêu cầu trên website, thông tin sẽ lập tức xuất hiện tại đây."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredRequests.map((req) => (
						<Card
							key={req.id}
							className="border-border/70 hover:border-border transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
						>
							<CardHeader className="p-4 pb-3">
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<Badge
											variant="outline"
											className="font-mono text-xs font-bold bg-muted/60"
										>
											{req.id}
										</Badge>
										<span className="text-xs text-muted-foreground">
											{formatDateTime(req.createdAt)}
										</span>
									</div>
									{getStatusBadge(req.status)}
								</div>

								<div className="pt-2">
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
												<User className="h-4 w-4 text-emerald-600" />
												{req.customerName}
											</h4>
											{req.username && (
												<span className="text-xs text-muted-foreground font-mono">
													@{req.username}
												</span>
											)}
										</div>

										{req.phone && (
											<a
												href={`tel:${req.phone}`}
												className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md transition-colors"
											>
												<Phone className="h-3 w-3" />
												{req.phone}
											</a>
										)}
									</div>
								</div>
							</CardHeader>

							<CardContent className="p-4 pt-0 space-y-3 grow">
								{/* Key details tags */}
								<div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/40">
									<div>
										<span className="text-muted-foreground block text-[11px]">
											Ngân sách dự kiến:
										</span>
										<span className="font-bold text-foreground text-sm text-emerald-600 dark:text-emerald-400">
											{req.budget || "Thương lượng"}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground block text-[11px]">
											Dịp tặng:
										</span>
										<span className="font-semibold text-foreground">
											{req.occasion || "Tùy dịp"}
										</span>
									</div>
								</div>

								{/* Reference Product */}
								{req.productName && (
									<div className="text-xs bg-emerald-500/10 p-2.5 rounded-md border border-emerald-500/20">
										<span className="text-muted-foreground block text-[11px]">
											Mẫu hoa tham khảo:
										</span>
										<span className="font-medium text-foreground">
											{req.productName} {req.productCode ? `(${req.productCode})` : ""}
										</span>
									</div>
								)}

								{/* Address */}
								{req.address && (
									<div className="text-xs space-y-0.5">
										<span className="text-muted-foreground block text-[11px]">
											Địa chỉ nhận hoa:
										</span>
										<span className="font-medium text-foreground">
											{req.address}
										</span>
									</div>
								)}

								{/* Customer note */}
								{req.note && (
									<div className="text-xs space-y-1">
										<span className="text-muted-foreground flex items-center gap-1">
											<MessageSquare className="h-3.5 w-3.5" />
											Ghi chú của khách:
										</span>
										<p className="text-muted-foreground italic bg-background p-2 rounded-md border border-border/50 text-[12px] leading-relaxed">
											"{req.note}"
										</p>
									</div>
								)}

								{/* Action Buttons Footer */}
								<div className="pt-3 flex items-center justify-between border-t border-border/60 mt-auto gap-2">
									<div className="flex items-center gap-1.5">
										{/* Nút Tạo Đơn Hàng */}
										<CreateCustomOrderDialog
											initialUsername={req.username || ""}
											initialPrice={parseBudgetPrice(req.budget)}
											onCreated={() => {
												handleStatusChange(req.id, "ORDER_CREATED");
												fetchRequests();
											}}
											trigger={
												<Button
													size="sm"
													className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-bold shadow-sm cursor-pointer"
												>
													<Plus className="h-3.5 w-3.5" />
													Tạo Đơn
												</Button>
											}
										/>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" size="sm" className="h-8 text-xs">
													Trạng thái
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleStatusChange(req.id, "PENDING")}
												>
													<Clock className="h-4 w-4 mr-2 text-amber-500" />
													Chờ liên hệ
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleStatusChange(req.id, "CONTACTED")}
												>
													<PhoneCall className="h-4 w-4 mr-2 text-sky-500" />
													Đã liên hệ tư vấn
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleStatusChange(req.id, "ORDER_CREATED")}
												>
													<CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
													Đã chốt đơn
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => handleStatusChange(req.id, "SPAM")}
												>
													<ShieldAlert className="h-4 w-4 mr-2 text-red-500" />
													Đánh dấu là Spam
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 text-xs"
											onClick={() => copyToClipboard(req.phone, "Số điện thoại")}
										>
											<Copy className="h-3.5 w-3.5 mr-1" />
											Copy SĐT
										</Button>

										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-muted-foreground hover:text-destructive"
											onClick={() => handleDelete(req.id)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
