"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import useOrderStore from "@/stores/orderStore";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import { OrderList } from "./order-list";
import { OrderDetail } from "./order-detail";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

function ProcessingStationPageContent() {
	const searchParams = useSearchParams();
	const initialOrderId = searchParams.get("orderId");
	const { fetchActiveOrders, loading } = useOrderStore();
	const [orders, setOrders] = useState<OrderResponse[]>([]);
	const [selectedOrderPk, setSelectedOrderPk] = useState<string | null>(initialOrderId);

	const loadOrders = useCallback(async (preserveSelection = false) => {
		const pageResponse = await fetchActiveOrders();
		if (pageResponse && pageResponse.content) {
			const activeOrders = pageResponse.content;
			setOrders(activeOrders);
			
			if (activeOrders.length > 0) {
				if (preserveSelection && selectedOrderPk) {
					const stillExists = activeOrders.some(o => o.pk === selectedOrderPk || o.code === selectedOrderPk);
					if (!stillExists) {
						setSelectedOrderPk(activeOrders[0].pk);
					}
				} else {
					// Auto-select the first order when loading fresh, UNLESS selectedOrderPk is already set (from URL)
					setSelectedOrderPk((prev) => {
						if (prev) {
							const matched = activeOrders.find(o => o.pk === prev || o.code === prev);
							if (matched) return matched.pk;
						}
						return activeOrders[0].pk;
					});
				}
			} else {
				setSelectedOrderPk(null);
			}
		}
	}, [fetchActiveOrders, selectedOrderPk]);

	useEffect(() => {
		void loadOrders();
		
		// Auto-refresh every 10 seconds to fetch new orders
		const intervalId = setInterval(() => {
			// Pass true to preserve the currently selected order when auto-refreshing
			void loadOrders(true);
		}, 10000);
		
		return () => clearInterval(intervalId);
		// We only want this to run once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleStatusUpdated = () => {
		// When a status is updated (especially to DELIVERED/CANCELLED), 
		// we fetch the active list again to get the fresh data from BE.
		// We tell loadOrders to try to preserve the selection if the order is still active
		void loadOrders(true);
	};

	const selectedOrder = orders.find((o) => o.pk === selectedOrderPk) || null;

	return (
		<div className="flex flex-col h-[calc(100vh-80px)]">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b mb-4 shrink-0">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Trạm Xử Lý Đơn Hàng</h1>
					<p className="text-muted-foreground">
						Khu vực xử lý nhanh các đơn hàng đang hoạt động.
					</p>
				</div>
				<Button 
					variant="outline" 
					size="sm" 
					onClick={() => loadOrders(true)}
					disabled={loading}
					className="flex items-center gap-2"
				>
					{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
					Làm mới dữ liệu
				</Button>
			</div>

			{/* Split View Container */}
			<div className="flex flex-1 gap-6 overflow-hidden">
				{/* Left Column: Order List (35%) */}
				<div className="w-[35%] flex flex-col shrink-0">
					<div className="bg-muted/50 rounded-t-lg px-4 py-2 border border-b-0 font-medium flex justify-between items-center">
						<span>Danh sách chờ xử lý</span>
						<Badge variant="secondary">{orders.length}</Badge>
					</div>
					<div className="border rounded-b-lg flex-1 overflow-hidden bg-background">
						<OrderList
							orders={orders}
							selectedOrderPk={selectedOrderPk}
							onSelectOrder={(order) => setSelectedOrderPk(order.pk)}
							loading={loading}
						/>
					</div>
				</div>

				{/* Right Column: Order Detail (65%) */}
				<div className="w-[65%] flex flex-col flex-1">
					<OrderDetail
						order={selectedOrder}
						onStatusUpdated={handleStatusUpdated}
					/>
				</div>
			</div>
		</div>
	);
}

export default function ProcessingStationPage() {
	return (
		<Suspense
			fallback={
				<div className="p-4 text-center text-sm text-muted-foreground">
					Đang tải...
				</div>
			}
		>
			<ProcessingStationPageContent />
		</Suspense>
	);
}
