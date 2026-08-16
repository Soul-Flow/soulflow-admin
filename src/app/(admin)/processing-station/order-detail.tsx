"use client";

import { PackageOpen, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { OrderStatus } from "@/enums/order-status.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import { formatDateTime } from "@/lib/utils";
import useOrderStore from "@/stores/orderStore";

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
	[OrderStatus.DELIVERED]: {
		label: "Đã giao (Hoàn tất)",
		className:
			"bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
	},
	[OrderStatus.CANCELLED]: {
		label: "Đã hủy",
		className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400",
	},
};

interface OrderDetailProps {
	order: OrderResponse | null;
	onStatusUpdated: () => void;
	isModal?: boolean;
}

export function OrderDetail({
	order,
	onStatusUpdated,
	isModal = false,
}: OrderDetailProps) {
	const { updateStatus, deleteByPk } = useOrderStore();
	const [isUpdating, setIsUpdating] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [showStatusDialog, setShowStatusDialog] = useState(false);
	const [pendingStatus, setPendingStatus] = useState<string | null>(null);

	if (!order) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 space-y-4 border-2 border-dashed rounded-xl min-h-[300px]">
				<PackageOpen className="h-16 w-16 opacity-20" />
				<p>Chọn một đơn hàng bên trái để xem chi tiết và xử lý.</p>
			</div>
		);
	}

	const handleStatusSelect = (newStatus: string) => {
		setPendingStatus(newStatus);
		setShowStatusDialog(true);
	};

	const confirmStatusChange = async () => {
		if (!pendingStatus || !order) return;
		setIsUpdating(true);
		try {
			await updateStatus(Number(order.pk), pendingStatus as OrderStatus);

			toast.success(
				`Đã cập nhật trạng thái đơn hàng ${order.code} thành ${statusConfig[pendingStatus]?.label || pendingStatus}`,
			);

			// If delivered or cancelled, tell parent to remove it from list
			onStatusUpdated();
		} catch {
			toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
		} finally {
			setIsUpdating(false);
			setShowStatusDialog(false);
			setPendingStatus(null);
		}
	};

	const handleDelete = async () => {
		if (!order) return;
		setIsDeleting(true);
		try {
			await deleteByPk(Number(order.pk));
			toast.success(`Đã xóa vĩnh viễn đơn hàng ${order.code} thành công!`);
			setShowDeleteDialog(false);
			onStatusUpdated();
		} catch {
			toast.error("Xóa đơn hàng thất bại. Vui lòng thử lại.");
		} finally {
			setIsDeleting(false);
		}
	};

	const formatCurrency = (amount: string | number) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(typeof amount === "string" ? parseFloat(amount || "0") : amount);

	const statusInfo = statusConfig[order.status] ?? {
		label: order.status,
		className: "",
	};

	const items =
		order.orderDetailResponses || (order as any).orderDetails || [];

	return (
		<div
			className={
				isModal
					? "flex flex-col space-y-4"
					: "flex flex-col h-[calc(100vh-140px)]"
			}
		>
			{/* Header Actions */}
			<div className="flex flex-wrap items-center justify-between p-4 border rounded-xl bg-card shadow-2xs gap-3">
				<div>
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-bold tracking-tight">
							Đơn #{order.code}
						</h2>
						<Badge variant="outline" className={statusInfo.className}>
							{statusInfo.label}
						</Badge>
					</div>
					<p className="text-xs text-muted-foreground mt-0.5">
						Ngày đặt: {formatDateTime(order.createdDate)}
					</p>
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					{/* Complete Order Button (Only visible if PAID or later) */}
					{[
						OrderStatus.PAID,
						OrderStatus.PROCESSING,
						OrderStatus.SHIPPED,
					].includes(order.status as OrderStatus) && (
						<Button
							variant="default"
							size="sm"
							className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
							onClick={() => handleStatusSelect(OrderStatus.DELIVERED)}
							disabled={isUpdating}
						>
							<PackageOpen className="w-4 h-4 mr-2" />
							Hoàn tất
						</Button>
					)}

					<Button
						variant="destructive"
						size="sm"
						className="h-9"
						onClick={() => handleStatusSelect(OrderStatus.CANCELLED)}
						disabled={isUpdating}
					>
						<XCircle className="w-4 h-4 mr-2" />
						Hủy đơn
					</Button>

					<div className="h-6 w-px bg-border mx-1"></div>

					<span className="text-sm font-medium">Trạng thái:</span>
					<Select
						value={order.status}
						onValueChange={handleStatusSelect}
						disabled={isUpdating}
					>
						<SelectTrigger
							className={`h-9 w-[150px] font-medium ${statusInfo.className}`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{(() => {
								const allowedStatusesByPaymentMethod = {
									SEPAY: [
										OrderStatus.PENDING,
										OrderStatus.WAITING_PAYMENT,
										OrderStatus.PAID,
										OrderStatus.PROCESSING,
										OrderStatus.DELIVERED,
										OrderStatus.CANCELLED,
									],
									COD: [
										OrderStatus.PENDING,
										OrderStatus.PROCESSING,
										OrderStatus.PAID,
										OrderStatus.DELIVERED,
										OrderStatus.CANCELLED,
									],
									STORE: [
										OrderStatus.PENDING,
										OrderStatus.PROCESSING,
										OrderStatus.PAID,
										OrderStatus.DELIVERED,
										OrderStatus.CANCELLED,
									],
								};

								const allowedStatuses =
									(order.paymentMethod &&
										allowedStatusesByPaymentMethod[
											order.paymentMethod as keyof typeof allowedStatusesByPaymentMethod
										]) ||
									Object.values(OrderStatus);

								return Object.entries(statusConfig)
									.filter(([val]) => allowedStatuses.includes(val as OrderStatus))
									.map(([val, cfg]) => (
										<SelectItem key={val} value={val} className="font-medium">
											{cfg.label}
										</SelectItem>
									));
							})()}
						</SelectContent>
					</Select>

					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 text-muted-foreground hover:text-red-600"
						title="Xóa vĩnh viễn đơn hàng"
						onClick={() => setShowDeleteDialog(true)}
						disabled={isUpdating || isDeleting}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Content */}
			<div
				className={
					isModal
						? "space-y-4 pt-1"
						: "flex-1 bg-muted/20 p-5 rounded-b-xl border-x border-b overflow-y-auto"
				}
			>
				<div className="flex-1 space-y-4">
					{/* Grid 2 Column: Customer Info & Payment Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
							<h3 className="font-semibold text-sm border-b pb-2">
								Thông tin người nhận
							</h3>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Người nhận:
								</span>
								<span className="col-span-2 font-semibold text-foreground">
									{order.fullname || "-"}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Điện thoại:
								</span>
								<span className="col-span-2 font-mono font-medium">
									{order.phone || "-"}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Địa chỉ:
								</span>
								<span className="col-span-2">
									{order.address ? order.address.replace(/\|\|/g, ", ") : "-"}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-sm items-center">
								<span className="font-medium text-muted-foreground text-xs">
									Trạng thái:
								</span>
								<span className="col-span-2">
									<Badge variant="outline" className={statusInfo.className}>
										{statusInfo.label}
									</Badge>
								</span>
							</div>
						</div>

						<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
							<h3 className="font-semibold text-sm border-b pb-2">
								Chi tiết thanh toán
							</h3>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Hình thức:
								</span>
								<span className="col-span-2 uppercase font-medium">
									<Badge variant="outline" className="font-semibold">
										{order.paymentMethod || "COD"}
									</Badge>
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Tạm tính:
								</span>
								<span className="col-span-2 font-mono font-medium">
									{formatCurrency(
										parseFloat(order.total) -
											parseFloat(order.shippingFee || "0") +
											parseFloat(order.discountAmount?.toString() || "0"),
									)}
								</span>
							</div>
							{(order.discountAmount || 0) > 0 && (
								<div className="grid grid-cols-3 gap-2 text-sm">
									<span className="font-medium text-muted-foreground text-xs">
										Khuyến mãi:
									</span>
									<span className="col-span-2 font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
										{order.discountCode ? `[${order.discountCode}] ` : ""}
										-{formatCurrency(order.discountAmount.toString())}
									</span>
								</div>
							)}
							<div className="grid grid-cols-3 gap-2 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Phí vận chuyển:
								</span>
								<span className="col-span-2 font-mono font-medium">
									{formatCurrency(order.shippingFee || "0")}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 pt-2 border-t mt-1 text-sm">
								<span className="font-medium text-muted-foreground text-xs">
									Tổng đơn:
								</span>
								<span className="col-span-2 font-bold text-primary text-base font-mono">
									{formatCurrency(order.total)}
								</span>
							</div>
						</div>
					</div>

					{/* Order Items */}
					<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs">
						<h3 className="font-semibold text-sm border-b pb-3 mb-3 flex items-center justify-between">
							<span>Danh sách sản phẩm hoa</span>
							<Badge variant="secondary" className="font-mono text-xs">
								{items.length} món
							</Badge>
						</h3>
						{items.length > 0 ? (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="text-xs">Sản phẩm</TableHead>
											<TableHead className="text-right text-xs">Đơn giá</TableHead>
											<TableHead className="text-center text-xs">Số lượng</TableHead>
											<TableHead className="text-right text-xs">Thành tiền</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{items.map((item: any, index: number) => {
											const name = item.name || item.productName || "Sản phẩm";
											const price = parseFloat(item.price || "0");
											const qty = parseInt(item.quantity || "1", 10);
											const total = parseFloat(
												item.subtotal || (price * qty).toString(),
											);
											return (
												<TableRow key={`detail-item-${index}`}>
													<TableCell className="font-semibold text-sm">
														💐 {name}
													</TableCell>
													<TableCell className="text-right text-muted-foreground text-sm font-mono">
														{formatCurrency(price)}
													</TableCell>
													<TableCell className="text-center font-bold text-sm">
														{qty}
													</TableCell>
													<TableCell className="text-right text-primary font-bold text-sm font-mono">
														{formatCurrency(total)}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="text-center py-6 text-muted-foreground text-xs">
								Không có thông tin chi tiết sản phẩm.
							</div>
						)}
					</div>
				</div>
			</div>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa vĩnh viễn đơn hàng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng{" "}
							<strong>{order.code}</strong> của khách hàng{" "}
							<strong>{order.fullname}</strong> không? Hành động này sẽ xóa dữ
							liệu khỏi hệ thống và không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn chuyển trạng thái đơn hàng{" "}
							<strong>{order.code}</strong> sang{" "}
							<strong>
								{pendingStatus
									? statusConfig[pendingStatus]?.label || pendingStatus
									: ""}
							</strong>{" "}
							không?
							{pendingStatus === OrderStatus.CANCELLED &&
								" Hành động này sẽ hủy đơn hàng."}
							{pendingStatus === OrderStatus.DELIVERED &&
								" Hành động này sẽ hoàn tất đơn hàng."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setPendingStatus(null)}>
							Không
						</AlertDialogCancel>
						<AlertDialogAction
							className={
								pendingStatus === OrderStatus.CANCELLED
									? "bg-red-600 hover:bg-red-700 text-white"
									: pendingStatus === OrderStatus.DELIVERED
										? "bg-emerald-600 hover:bg-emerald-700 text-white"
										: ""
							}
							onClick={confirmStatusChange}
							disabled={isUpdating}
						>
							{isUpdating ? "Đang cập nhật..." : "Đồng ý"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
