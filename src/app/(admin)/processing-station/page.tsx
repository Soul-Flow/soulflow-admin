"use client";

import {
	Columns3,
	LayoutGrid,
	Loader2,
	PanelLeftClose,
	RefreshCcw,
	Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import useOrderStore from "@/stores/orderStore";
import { KanbanPipeline } from "./kanban-pipeline";
import { OrderDetail } from "./order-detail";
import { OrderList } from "./order-list";

function ProcessingStationPageContent() {
	const searchParams = useSearchParams();
	const initialOrderId = searchParams.get("orderId");
	const { fetchActiveOrders, loading } = useOrderStore();
	const [orders, setOrders] = useState<OrderResponse[]>([]);
	const [selectedOrderPk, setSelectedOrderPk] = useState<string | null>(
		initialOrderId,
	);
	const [viewMode, setViewMode] = useState<"pipeline" | "split">("pipeline");
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

	const loadOrders = useCallback(
		async (preserveSelection = false) => {
			const pageResponse = await fetchActiveOrders();
			if (pageResponse?.content) {
				const activeOrders = pageResponse.content;
				setOrders(activeOrders);

				if (activeOrders.length > 0) {
					if (preserveSelection && selectedOrderPk) {
						const stillExists = activeOrders.some(
							(o) => o.pk === selectedOrderPk || o.code === selectedOrderPk,
						);
						if (!stillExists) {
							setSelectedOrderPk(activeOrders[0].pk);
						}
					} else {
						setSelectedOrderPk((prev) => {
							if (prev) {
								const matched = activeOrders.find(
									(o) => o.pk === prev || o.code === prev,
								);
								if (matched) return matched.pk;
							}
							return activeOrders[0].pk;
						});
					}
				} else {
					setSelectedOrderPk(null);
				}
			}
		},
		[fetchActiveOrders, selectedOrderPk],
	);

	useEffect(() => {
		void loadOrders();

		// Auto-refresh every 8 seconds to fetch new incoming customer orders
		const intervalId = setInterval(() => {
			void loadOrders(true);
		}, 8000);

		return () => clearInterval(intervalId);
	}, [loadOrders]);

	const handleStatusUpdated = () => {
		void loadOrders(true);
	};

	const handleCardClick = (order: OrderResponse) => {
		setSelectedOrderPk(order.pk);
		setIsDetailDialogOpen(true);
	};

	const selectedOrder = orders.find((o) => o.pk === selectedOrderPk) || null;

	return (
		<div className="flex flex-col h-[calc(100vh-80px)] space-y-4">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b gap-3 shrink-0">
				<div>
					<div className="flex items-center gap-2.5 flex-wrap">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							Trạm Xử Lý Đơn Hàng
						</h1>
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</span>
							<span>LIVE PIPELINE</span>
						</div>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Theo dõi và xử lý đơn hàng theo luồng quy trình vận hành trực tiếp của tiệm hoa.
					</p>
				</div>

				<div className="flex items-center gap-2 self-start md:self-auto">
					{/* View Mode Toggle Buttons */}
					<div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
						<Button
							variant={viewMode === "pipeline" ? "default" : "ghost"}
							size="sm"
							onClick={() => setViewMode("pipeline")}
							className="h-8 px-3 text-xs font-medium gap-1.5"
						>
							<Columns3 className="h-4 w-4" />
							<span className="hidden sm:inline">Cột Quy Trình</span>
						</Button>

						<Button
							variant={viewMode === "split" ? "default" : "ghost"}
							size="sm"
							onClick={() => setViewMode("split")}
							className="h-8 px-3 text-xs font-medium gap-1.5"
						>
							<PanelLeftClose className="h-4 w-4" />
							<span className="hidden sm:inline">Chia Đôi</span>
						</Button>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => loadOrders(true)}
						disabled={loading}
						className="h-8 text-xs font-medium gap-1.5"
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCcw className="h-4 w-4" />
						)}
						<span className="hidden sm:inline">Làm mới</span>
					</Button>
				</div>
			</div>

			{/* Main Workspace Area */}
			{viewMode === "pipeline" ? (
				/* Kanban Pipeline View */
				<div className="flex-1 overflow-hidden">
					<KanbanPipeline
						orders={orders}
						onSelectOrder={handleCardClick}
						onStatusUpdated={handleStatusUpdated}
						loading={loading}
					/>
				</div>
			) : (
				/* Split View Mode */
				<div className="flex flex-1 gap-6 overflow-hidden">
					{/* Left Column: Order List (35%) */}
					<div className="w-[35%] flex flex-col shrink-0">
						<div className="bg-muted/50 rounded-t-lg px-4 py-2 border border-b-0 font-medium flex justify-between items-center text-xs">
							<span>Danh sách đơn hàng chờ xử lý</span>
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
			)}

			{/* Order Detail Modal for Pipeline View */}
			<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
				<DialogContent className="sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-5">
					<DialogHeader className="pb-1 border-b">
						<DialogTitle className="text-lg font-bold">
							Chi tiết đơn hàng {selectedOrder?.code}
						</DialogTitle>
					</DialogHeader>
					<div className="pt-2">
						<OrderDetail
							order={selectedOrder}
							isModal={true}
							onStatusUpdated={() => {
								handleStatusUpdated();
								setIsDetailDialogOpen(false);
							}}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default function ProcessingStationPage() {
	return (
		<Suspense
			fallback={
				<div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
					<p>Đang tải trạm xử lý đơn hàng...</p>
				</div>
			}
		>
			<ProcessingStationPageContent />
		</Suspense>
	);
}
