"use client";

import { useState } from "react";
import { OrderStatus } from "@/enums/order-status.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
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
import useOrderStore from "@/stores/orderStore";
import { toast } from "sonner";
import { PackageOpen, XCircle, Trash2 } from "lucide-react";

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
}

export function OrderDetail({ order, onStatusUpdated }: OrderDetailProps) {
	const { save, deleteByPk } = useOrderStore();
	const [isUpdating, setIsUpdating] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [showStatusDialog, setShowStatusDialog] = useState(false);
	const [pendingStatus, setPendingStatus] = useState<string | null>(null);

	if (!order) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 space-y-4 border-2 border-dashed rounded-xl">
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
			await save({
				pk: Number(order.pk),
				status: pendingStatus as OrderStatus,
				fullname: order.fullname,
				phone: order.phone,
				address: order.address,
				accountPk: Number(order.accountPk),
				orderDetailRequests: [],
			});
			
			toast.success(`Đã cập nhật trạng thái đơn hàng ${order.code} thành ${statusConfig[pendingStatus]?.label || pendingStatus}`);
			
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

	return (
		<div className="flex flex-col h-[calc(100vh-140px)]">
			{/* Header Actions */}
			<div className="flex items-center justify-between p-5 border-b bg-card rounded-t-xl shadow-sm">
				<div>
					<h2 className="text-xl font-bold tracking-tight">Chi tiết đơn {order.code}</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Ngày đặt: {order.createdDate}
					</p>
				</div>
				<div className="flex items-center gap-3">
					{/* Complete Order Button (Only visible if PAID or later) */}
					{[OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED].includes(order.status as OrderStatus) && (
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
							{Object.entries(statusConfig)
								.filter(([val]) => val !== OrderStatus.CANCELLED)
								.map(([val, cfg]) => (
									<SelectItem key={val} value={val} className="font-medium">
										{cfg.label}
									</SelectItem>
								))}
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
			<div className="flex-1 bg-muted/20 p-5 rounded-b-xl border-x border-b overflow-y-auto">
				<div className="space-y-6 max-w-4xl mx-auto pb-8">
					{/* Customer Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="p-5 border-2 rounded-xl bg-card text-card-foreground shadow-sm space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">Thông tin khách hàng</h3>
							<div className="grid grid-cols-3 gap-2">
								<span className="font-medium text-muted-foreground text-sm">Khách hàng:</span>
								<span className="col-span-2 font-medium">{order.fullname}</span>
							</div>
							<div className="grid grid-cols-3 gap-2">
								<span className="font-medium text-muted-foreground text-sm">Điện thoại:</span>
								<span className="col-span-2">{order.phone}</span>
							</div>
							<div className="grid grid-cols-3 gap-2">
								<span className="font-medium text-muted-foreground text-sm">Địa chỉ:</span>
								<span className="col-span-2">{order.address}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 items-center">
								<span className="font-medium text-muted-foreground text-sm">Trạng thái:</span>
								<span className="col-span-2">
									<Badge variant="outline" className={statusInfo.className}>
										{statusInfo.label}
									</Badge>
								</span>
							</div>
						</div>

						<div className="p-5 border-2 rounded-xl bg-card text-card-foreground shadow-sm space-y-4">
							<h3 className="font-semibold text-lg border-b pb-2">Thông tin thanh toán</h3>
							<div className="grid grid-cols-3 gap-2">
								<span className="font-medium text-muted-foreground text-sm">Thanh toán:</span>
								<span className="col-span-2 uppercase font-medium">
									<Badge variant="outline">{order.paymentMethod || "COD"}</Badge>
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2">
								<span className="font-medium text-muted-foreground text-sm">Tạm tính:</span>
								<span className="col-span-2">{formatCurrency(parseFloat(order.total) - parseFloat(order.shippingFee || "0"))}</span>
							</div>
							<div className="grid grid-cols-3 gap-2">
								<span className="font-medium text-muted-foreground text-sm">Phí ship:</span>
								<span className="col-span-2">{formatCurrency(order.shippingFee)}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 pt-2 border-t mt-2">
								<span className="font-medium text-muted-foreground text-sm">Tổng cộng:</span>
								<span className="col-span-2 font-bold text-primary text-lg">{formatCurrency(order.total)}</span>
							</div>
						</div>
					</div>

					{/* Order Items */}
					<div className="p-5 border-2 rounded-xl bg-card text-card-foreground shadow-sm">
						<h3 className="font-semibold text-lg border-b pb-4 mb-4">Sản phẩm đã đặt</h3>
						{order.orderDetailResponses && order.orderDetailResponses.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sản phẩm</TableHead>
										<TableHead className="text-right">Đơn giá</TableHead>
										<TableHead className="text-center">Số lượng</TableHead>
										<TableHead className="text-right">Thành tiền</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{order.orderDetailResponses.map((item, index) => {
										const name = item.name || "Sản phẩm";
										const price = parseFloat(item.price || "0");
										const qty = parseInt(item.quantity || "1", 10);
										const total = parseFloat(item.subtotal || (price * qty).toString());
										return (
											<TableRow key={index}>
												<TableCell className="font-medium">{name}</TableCell>
												<TableCell className="text-right text-muted-foreground">{formatCurrency(price)}</TableCell>
												<TableCell className="text-center font-medium">{qty}</TableCell>
												<TableCell className="text-right text-primary font-medium">{formatCurrency(total)}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						) : (
							<div className="text-center py-8 text-muted-foreground text-sm">
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
							Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng <strong>{order.code}</strong>{" "}
							của khách hàng <strong>{order.fullname}</strong> không? Hành động này sẽ xóa dữ liệu khỏi hệ thống và không thể hoàn tác.
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
							Bạn có chắc chắn muốn chuyển trạng thái đơn hàng <strong>{order.code}</strong>{" "}
							sang <strong>{pendingStatus ? statusConfig[pendingStatus]?.label || pendingStatus : ""}</strong> không?
							{pendingStatus === OrderStatus.CANCELLED && " Hành động này sẽ hủy đơn hàng."}
							{pendingStatus === OrderStatus.DELIVERED && " Hành động này sẽ hoàn tất đơn hàng."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setPendingStatus(null)}>Không</AlertDialogCancel>
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
