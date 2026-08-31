"use client";

import {
	AlertTriangle,
	ArrowRight,
	CheckCircle2,
	Clock,
	CreditCard,
	Eye,
	Filter,
	Flower2,
	MapPin,
	Package,
	Phone,
	Sparkles,
	Star,
	Store,
	Truck,
	User,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatus } from "@/enums/order-status.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import { formatTime, parseDateSafely } from "@/lib/utils";
import useOrderStore from "@/stores/orderStore";

interface KanbanPipelineProps {
	orders: OrderResponse[];
	onSelectOrder: (order: OrderResponse) => void;
	onStatusUpdated: () => void;
	loading: boolean;
}

export function getWaitingTime(createdDateStr?: string) {
	if (!createdDateStr) return { text: "Vừa đặt", color: "bg-muted text-muted-foreground border-border" };
	const created = parseDateSafely(createdDateStr);
	if (!created) return { text: "Vừa đặt", color: "bg-muted text-muted-foreground border-border" };
	const diffMin = Math.max(0, Math.floor((Date.now() - created.getTime()) / 60000));

	if (diffMin < 1) {
		return { text: "Vừa xong", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400" };
	}
	if (diffMin < 60) {
		return { text: `${diffMin} phút trước`, color: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400" };
	}
	const hours = Math.floor(diffMin / 60);
	const remMin = diffMin % 60;
	if (hours < 24) {
		return {
			text: `${hours}h ${remMin > 0 ? `${remMin}p ` : ""}trước`,
			color: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-300",
		};
	}
	const days = Math.floor(hours / 24);
	return {
		text: `${days} ngày trước`,
		color: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
	};
}

const PAYMENT_METHOD_MAP: Record<
	string,
	{ label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
	SEPAY: {
		label: "Chuyển khoản SePay",
		icon: CreditCard,
		color: "bg-teal-500/15 text-teal-700 border-teal-500/30 dark:text-teal-400",
	},
	COD: {
		label: "Giao hàng thu tiền (COD)",
		icon: Truck,
		color: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
	},
	STORE: {
		label: "Nhận tại cửa hàng",
		icon: Store,
		color: "bg-purple-500/15 text-purple-700 border-purple-500/30 dark:text-purple-400",
	},
};

export function KanbanPipeline({
	orders,
	onSelectOrder,
	onStatusUpdated,
	loading,
}: KanbanPipelineProps) {
	const { updateStatus } = useOrderStore();
	const [updatingPk, setUpdatingPk] = useState<string | null>(null);
	const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

	const handleQuickAdvance = async (order: OrderResponse, nextStatus: OrderStatus) => {
		setUpdatingPk(order.pk);
		try {
			await updateStatus(Number(order.pk), nextStatus);
			toast.success(
				nextStatus === OrderStatus.DELIVERED
					? `Đã hoàn tất giao đơn hàng ${order.code} thành công!`
					: `Đã chuyển đơn ${order.code} sang khâu tiếp theo`,
			);
			onStatusUpdated();
		} catch {
			toast.error("Không thể cập nhật trạng thái đơn hàng");
		} finally {
			setUpdatingPk(null);
		}
	};

	// Filter by payment method if selected
	const filteredOrders = useMemo(() => {
		if (paymentFilter === "ALL") return orders;
		return orders.filter(
			(o) => (o.paymentMethod || "COD").toUpperCase() === paymentFilter,
		);
	}, [orders, paymentFilter]);

	// 3-Column Pipeline definition (No SHIPPED step, direct DELIVERED completion)
	const columns = useMemo(() => {
		const pendingOrders = filteredOrders
			.filter(
				(o) =>
					o.status === OrderStatus.PENDING ||
					o.status === OrderStatus.WAITING_PAYMENT,
			)
			.sort(
				(a, b) =>
					(parseDateSafely(a.createdDate)?.getTime() || 0) -
					(parseDateSafely(b.createdDate)?.getTime() || 0),
			);

		const paidOrders = filteredOrders
			.filter((o) => o.status === OrderStatus.PAID)
			.sort(
				(a, b) =>
					(parseDateSafely(a.createdDate)?.getTime() || 0) -
					(parseDateSafely(b.createdDate)?.getTime() || 0),
			);

		const processingOrders = filteredOrders
			.filter(
				(o) =>
					o.status === OrderStatus.PROCESSING ||
					o.status === OrderStatus.SHIPPED,
			)
			.sort(
				(a, b) =>
					(parseDateSafely(a.createdDate)?.getTime() || 0) -
					(parseDateSafely(b.createdDate)?.getTime() || 0),
			);

		return [
			{
				id: "PENDING_GROUP",
				title: "1. Chờ Xác Nhận & Thanh Toán",
				description: "Đơn COD, Nhận tại tiệm hoặc Chờ quét QR",
				icon: Clock,
				orders: pendingOrders,
				headerColor:
					"bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400 dark:bg-amber-950/20",
				badgeColor: "bg-amber-500 text-white",
				nextAction: {
					label: "Xác nhận & Cắm hoa",
					targetStatus: OrderStatus.PROCESSING,
					buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
				},
			},
			{
				id: "PAID",
				title: "2. Đã Thanh Toán (SePay QR)",
				description: "Đã nhận tiền trước qua QR / Ưu tiên cắm hoa ngay",
				icon: CreditCard,
				orders: paidOrders,
				headerColor:
					"bg-teal-500/10 text-teal-700 border-teal-500/30 dark:text-teal-400 dark:bg-teal-950/20",
				badgeColor: "bg-teal-600 text-white",
				nextAction: {
					label: "Bắt đầu cắm hoa",
					targetStatus: OrderStatus.PROCESSING,
					buttonClass: "bg-teal-600 hover:bg-teal-700 text-white",
				},
			},
			{
				id: "PROCESSING",
				title: "3. Đang Cắm Hoa & Chuẩn Bị Giao",
				description: "Hoa đang được cắm sẵn sàng giao cho khách",
				icon: Flower2,
				orders: processingOrders,
				headerColor:
					"bg-blue-500/10 text-blue-700 border-blue-500/30 dark:text-blue-400 dark:bg-blue-950/20",
				badgeColor: "bg-blue-600 text-white",
				nextAction: {
					label: "Đã giao (Hoàn tất)",
					targetStatus: OrderStatus.DELIVERED,
					buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold",
				},
			},
		];
	}, [filteredOrders]);

	return (
		<div className="flex flex-col h-[calc(100vh-175px)] min-h-[520px] space-y-3">
			{/* Payment Method Quick Filter Bar */}
			<div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 text-sm">
				<span className="font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0 text-xs">
					<Filter className="h-4 w-4" /> Lọc hình thức:
				</span>

				<Button
					variant={paymentFilter === "ALL" ? "default" : "outline"}
					size="sm"
					onClick={() => setPaymentFilter("ALL")}
					className="h-8 text-xs px-3 rounded-full font-medium"
				>
					Tất cả ({orders.length})
				</Button>

				<Button
					variant={paymentFilter === "SEPAY" ? "default" : "outline"}
					size="sm"
					onClick={() => setPaymentFilter("SEPAY")}
					className="h-8 text-xs px-3 rounded-full gap-1.5 font-medium"
				>
					<CreditCard className="h-3.5 w-3.5 text-teal-500" />
					Chuyển khoản SePay (
					{orders.filter((o) => (o.paymentMethod || "").toUpperCase() === "SEPAY").length}
					)
				</Button>

				<Button
					variant={paymentFilter === "COD" ? "default" : "outline"}
					size="sm"
					onClick={() => setPaymentFilter("COD")}
					className="h-8 text-xs px-3 rounded-full gap-1.5 font-medium"
				>
					<Truck className="h-3.5 w-3.5 text-amber-500" />
					Giao hàng COD (
					{orders.filter((o) => (o.paymentMethod || "COD").toUpperCase() === "COD").length}
					)
				</Button>

				<Button
					variant={paymentFilter === "STORE" ? "default" : "outline"}
					size="sm"
					onClick={() => setPaymentFilter("STORE")}
					className="h-8 text-xs px-3 rounded-full gap-1.5 font-medium"
				>
					<Store className="h-3.5 w-3.5 text-purple-500" />
					Nhận tại cửa hàng (
					{orders.filter((o) => (o.paymentMethod || "").toUpperCase() === "STORE").length}
					)
				</Button>
			</div>

			{/* 3 Column Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
				{columns.map((col) => {
					const IconComponent = col.icon;
					return (
						<div
							key={col.id}
							className="flex flex-col bg-muted/25 rounded-2xl border border-border/80 overflow-hidden shadow-2xs"
						>
							{/* Column Header */}
							<div
								className={`p-3.5 border-b flex items-center justify-between ${col.headerColor}`}
							>
								<div className="flex items-center gap-2.5 min-w-0">
									<IconComponent className="h-4.5 w-4.5 shrink-0" />
									<div className="min-w-0">
										<h3 className="font-bold text-sm truncate uppercase tracking-wider">
											{col.title}
										</h3>
										<p className="text-xs opacity-90 truncate mt-0.5">
											{col.description}
										</p>
									</div>
								</div>
								<Badge
									className={`font-mono text-xs px-2.5 py-0.5 shrink-0 font-bold ${col.badgeColor}`}
								>
									{col.orders.length}
								</Badge>
							</div>

							{/* Column Body with Order Cards */}
							<div className="flex-1 p-3 space-y-3.5 overflow-y-auto custom-scrollbar">
								{col.orders.length === 0 ? (
									<div className="h-36 flex flex-col items-center justify-center text-center text-muted-foreground/60 border border-dashed rounded-xl m-1 p-4">
										<Package className="h-7 w-7 mb-1.5 opacity-40" />
										<p className="text-sm font-medium">Không có đơn ở khâu này</p>
									</div>
								) : (
									col.orders.map((order, idx) => {
										const waiting = getWaitingTime(order.createdDate);
										const isUpdating = updatingPk === order.pk;
										const isOldestInCol = idx === 0;
										const payMethodKey = (order.paymentMethod || "COD").toUpperCase();
										const payConfig =
											PAYMENT_METHOD_MAP[payMethodKey] || PAYMENT_METHOD_MAP.COD;
										const PayIcon = payConfig.icon;
										const items =
											order.orderDetailResponses ||
											(order as any).orderDetails ||
											[];
										const isSepayWaiting =
											col.id === "PENDING_GROUP" && payMethodKey === "SEPAY";

										return (
											<Card
												key={order.pk}
												className={`transition-all duration-200 hover:shadow-md border bg-card text-card-foreground overflow-hidden ${
													waiting.priority === "high"
														? "border-rose-500/70 ring-1 ring-rose-500/20"
														: isOldestInCol
															? "border-amber-500/40"
															: "border-border/80 hover:border-primary/50"
												}`}
											>
												<CardHeader className="p-3.5 pb-2">
													<div className="flex items-start justify-between gap-2">
														<div>
															<div className="flex items-center gap-1.5">
																<Badge
																	variant="outline"
																	className="font-mono font-bold text-sm bg-muted/60 text-foreground border-border px-2.5 py-0.5"
																>
																	#{order.code}
																</Badge>
																{isOldestInCol && (
																	<Star className="h-4 w-4 fill-amber-400 text-amber-500 shrink-0" title="Đơn đến trước trong khâu này" />
																)}
															</div>
															<div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
																<Clock className="h-3.5 w-3.5" />
																<span>{formatTime(order.createdDate)}</span>
															</div>
														</div>

														{/* Waiting SLA Badge */}
														<Badge
															variant="outline"
															className={`text-xs font-medium px-2.5 py-0.5 whitespace-nowrap ${waiting.color}`}
														>
															{waiting.text}
														</Badge>
													</div>
												</CardHeader>

												<CardContent className="p-3.5 pt-0 space-y-3">
													{/* Payment Method Badge */}
													<div className="flex items-center justify-between">
														<Badge
															variant="outline"
															className={`text-xs font-semibold px-2.5 py-0.5 flex items-center gap-1.5 w-fit ${payConfig.color}`}
														>
															<PayIcon className="h-3.5 w-3.5" />
															{payConfig.label}
														</Badge>
													</div>

													{/* Customer Info */}
													<div className="text-sm space-y-1">
														<div className="font-bold text-foreground flex items-center gap-1.5 truncate">
															<User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
															<span className="truncate">
																{order.fullname || "Khách vãng lai"}
															</span>
														</div>
														{order.phone && (
															<div className="text-muted-foreground text-xs flex items-center gap-1.5 font-mono">
																<Phone className="h-3.5 w-3.5 shrink-0" />
																<span>{order.phone}</span>
															</div>
														)}
														{payMethodKey !== "STORE" && order.address && (
															<div className="text-muted-foreground text-xs flex items-center gap-1.5 truncate">
																<MapPin className="h-3.5 w-3.5 shrink-0" />
																<span className="truncate">
																	{order.address.replace(/\|\|/g, ", ")}
																</span>
															</div>
														)}
													</div>

													{/* Products Snippet */}
													{items.length > 0 && (
														<div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-1">
															<div className="font-medium text-foreground flex items-center justify-between gap-1">
																<span className="truncate">
																	💐 {items[0].name || (items[0] as any).productName || "Sản phẩm hoa"}
																</span>
																<span className="font-bold text-muted-foreground shrink-0 ml-1">
																	x{items[0].quantity || 1}
																</span>
															</div>
															{items.length > 1 && (
																<div className="text-xs text-muted-foreground font-medium pl-4">
																	+ và {items.length - 1} món hoa khác trong đơn
																</div>
															)}
														</div>
													)}

													{/* Total Amount */}
													<div className="flex items-center justify-between pt-1 border-t border-border/50 text-sm">
														<span className="text-muted-foreground text-xs font-medium">
															Tổng thanh toán:
														</span>
														<span className="font-bold text-primary font-mono text-base">
															{new Intl.NumberFormat("vi-VN", {
																style: "currency",
																currency: "VND",
															}).format(parseFloat(order.total || "0"))}
														</span>
													</div>

													{/* Action Buttons */}
													<div className="flex items-center gap-2 pt-1">
														<Button
															variant="outline"
															size="sm"
															onClick={() => onSelectOrder(order)}
															className="h-8 text-xs flex-1 px-2 text-muted-foreground hover:text-foreground font-medium"
														>
															<Eye className="h-3.5 w-3.5 mr-1" />
															Chi tiết
														</Button>

														{isSepayWaiting ? (
															<Button
																size="sm"
																disabled
																className="h-8 text-xs flex-1 px-2 font-medium bg-amber-500/15 text-amber-800 border border-amber-500/30 dark:text-amber-300 dark:bg-amber-950/40 cursor-not-allowed opacity-90"
															>
																<Clock className="h-3.5 w-3.5 mr-1 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
																<span>Chờ thanh toán</span>
															</Button>
														) : (
															<Button
																size="sm"
																disabled={isUpdating}
																onClick={() =>
																	handleQuickAdvance(
																		order,
																		col.nextAction.targetStatus,
																	)
																}
																className={`h-8 text-xs flex-1 px-2 font-medium ${col.nextAction.buttonClass}`}
															>
																<span>{col.nextAction.label}</span>
																<ArrowRight className="h-3.5 w-3.5 ml-1 shrink-0" />
															</Button>
														)}
													</div>
												</CardContent>
											</Card>
										);
									})
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
