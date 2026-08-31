"use client";

import { Clock, Package, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OrderStatus } from "@/enums/order-status.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import { formatDateTime } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
	[OrderStatus.PENDING]: {
		label: "Chờ xử lý",
		className:
			"bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400",
	},
	[OrderStatus.WAITING_PAYMENT]: {
		label: "Chờ thanh toán",
		className:
			"bg-purple-500/15 text-purple-700 border-purple-500/25 dark:text-purple-400",
	},
	[OrderStatus.PAID]: {
		label: "Đã thanh toán",
		className:
			"bg-teal-500/15 text-teal-700 border-teal-500/25 dark:text-teal-400",
	},
	[OrderStatus.PROCESSING]: {
		label: "Đang xử lý",
		className:
			"bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400",
	},
	[OrderStatus.SHIPPED]: {
		label: "Đang giao",
		className:
			"bg-indigo-500/15 text-indigo-700 border-indigo-500/25 dark:text-indigo-400",
	},
};

interface OrderListProps {
	orders: OrderResponse[];
	selectedOrderPk: string | null;
	onSelectOrder: (order: OrderResponse) => void;
	loading: boolean;
}

export function OrderList({
	orders,
	selectedOrderPk,
	onSelectOrder,
	loading,
}: OrderListProps) {
	if (loading && orders.length === 0) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground p-8">
				Đang tải dữ liệu...
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 space-y-4">
				<Package className="h-12 w-12 opacity-20" />
				<p>Không có đơn hàng nào đang chờ xử lý.</p>
			</div>
		);
	}

	return (
		<div className="h-[calc(100vh-140px)] pr-2 overflow-y-auto custom-scrollbar">
			<div className="space-y-3 p-2">
				{orders.map((order) => {
					const isSelected = order.pk === selectedOrderPk;
					const statusInfo = statusConfig[order.status] ?? {
						label: order.status,
						className: "",
					};

					const totalAmount = new Intl.NumberFormat("vi-VN", {
						style: "currency",
						currency: "VND",
					}).format(parseFloat(order.total || "0"));

					return (
						<Card
							key={order.pk}
							className={`p-4 cursor-pointer transition-all hover:shadow-md ${
								isSelected
									? "border-primary ring-1 ring-primary shadow-sm bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
							onClick={() => onSelectOrder(order)}
						>
							<div className="flex justify-between items-start mb-3">
								<div>
									<h4 className="font-semibold text-sm">{order.code}</h4>
									<div className="text-xs font-medium text-primary mt-1 tabular-nums">
										{totalAmount}
									</div>
								</div>
								<Badge variant="outline" className={statusInfo.className}>
									{statusInfo.label}
								</Badge>
							</div>

							<div className="space-y-1.5 text-xs text-muted-foreground">
								<div className="flex items-center gap-2">
									<User className="h-3.5 w-3.5" />
									<span className="truncate">{order.fullname}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-3.5 w-3.5" />
									<span>{order.phone}</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-3.5 w-3.5" />
									<span>{formatDateTime(order.createdDate)}</span>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
