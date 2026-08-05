"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
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
		label: "Đã giao",
		className:
			"bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
	},
	[OrderStatus.CANCELLED]: {
		label: "Đã hủy",
		className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400",
	},
};

function StatusCell({
	row,
	onMutated,
}: {
	row: Row<OrderResponse>;
	onMutated: () => void;
}) {
	const order = row.original;
	const { updateStatus } = useOrderStore();
	const [status, setStatus] = useState<string>(order.status);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleStatusChange = async (newStatus: string) => {
		setStatus(newStatus);
		setIsUpdating(true);
		try {
			await updateStatus(Number(order.pk), newStatus as OrderStatus);
			toast.success(`Đã cập nhật trạng thái đơn hàng ${order.code}!`);
			onMutated();
		} catch {
			toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
			setStatus(order.status); // Revert on error
		} finally {
			setIsUpdating(false);
		}
	};

	const config = statusConfig[status] ?? { label: status, className: "" };

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

	return (
		<Select
			value={status}
			onValueChange={handleStatusChange}
			disabled={isUpdating}
		>
			<SelectTrigger
				className={`h-7 w-[130px] text-xs font-medium ${config.className}`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(statusConfig)
					.filter(([val]) => allowedStatuses.includes(val as OrderStatus))
					.map(([val, cfg]) => (
						<SelectItem key={val} value={val} className="text-xs">
							{cfg.label}
						</SelectItem>
					))}
			</SelectContent>
		</Select>
	);
}

function ActionCell({
	row,
	onMutated,
}: {
	row: Row<OrderResponse>;
	onMutated: () => void;
}) {
	const order = row.original;
	const { deleteByPk, loading } = useOrderStore();
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (
			searchParams.get("action") === "view" &&
			searchParams.get("keyword") === order.code
		) {
			setShowViewSheet(true);
		}
	}, [searchParams, order.code]);

	const handleOpenChange = (open: boolean) => {
		setShowViewSheet(open);
		if (!open && searchParams.get("action") === "view") {
			router.replace(pathname);
		}
	};

	const totalNum = parseFloat(order.total);
	const formattedTotal = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(totalNum);

	const handleDelete = async () => {
		try {
			await deleteByPk(Number(order.pk));
			toast.success(`Đã xóa đơn hàng ${order.code} thành công!`);
			setShowDeleteDialog(false);
			onMutated();
		} catch {
			toast.error("Xóa đơn hàng thất bại. Vui lòng thử lại.");
		}
	};

	const statusInfo = statusConfig[order.status] ?? {
		label: order.status,
		className: "",
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Mở menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Hành động</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => setShowViewSheet(true)}
					>
						<Eye className="mr-2 h-4 w-4" /> Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" /> Xóa đơn hàng
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={showViewSheet} onOpenChange={handleOpenChange}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Đơn Hàng</SheetTitle>
						<SheetDescription>Mã đơn: {order.code}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 px-4 pb-6 space-y-4 text-sm">
						<div className="p-5 border-2 rounded-xl bg-card text-card-foreground shadow-sm space-y-3">
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Khách hàng:
								</span>
								<span className="col-span-2 font-medium">{order.fullname}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Điện thoại:
								</span>
								<span className="col-span-2">{order.phone}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Địa chỉ:
								</span>
								<span className="col-span-2">{order.address?.replace(/\|\|/g, ", ")}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
								<span className="font-medium text-muted-foreground">
									Trạng thái:
								</span>
								<span className="col-span-2">
									<Badge variant="outline" className={statusInfo.className}>
										{statusInfo.label}
									</Badge>
								</span>
							</div>
						</div>

						<div className="p-5 border-2 rounded-xl bg-card text-card-foreground shadow-sm space-y-3">
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Tạm tính:
								</span>
								<span className="col-span-2 font-medium">
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
									}).format(
										totalNum - 
										parseFloat(order.shippingFee || "0") + 
										parseFloat(order.discountAmount?.toString() || "0")
									)}
								</span>
							</div>
							{(order.discountAmount || 0) > 0 && (
								<div className="grid grid-cols-3 gap-2 border-b pb-2">
									<span className="font-medium text-muted-foreground">
										Khuyến mãi:
									</span>
									<span className="col-span-2 font-medium text-green-600 dark:text-green-400">
										{order.discountCode ? `[${order.discountCode}] ` : ""}
										-{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(order.discountAmount)}
									</span>
								</div>
							)}
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Phí ship:
								</span>
								<span className="col-span-2 font-medium">
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
									}).format(parseFloat(order.shippingFee || "0"))}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Tổng tiền:
								</span>
								<span className="col-span-2 font-medium text-primary">
									{formattedTotal}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Thanh toán:
								</span>
								<span className="col-span-2 uppercase font-medium">
									{order.paymentMethod || "COD"}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Ngày đặt:
								</span>
								<span className="col-span-2">{order.createdDate}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Hết hạn:
								</span>
								<span className="col-span-2">{order.expiredDate}</span>
							</div>
						</div>

						{/* Order Items */}
						<div className="p-5 border-2 rounded-xl bg-card text-card-foreground shadow-sm">
							<h3 className="font-semibold text-lg border-b pb-4 mb-4">
								Sản phẩm đã đặt
							</h3>
							{order.orderDetailResponses &&
							order.orderDetailResponses.length > 0 ? (
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
											const total = parseFloat(
												item.subtotal || (price * qty).toString(),
											);

											const formatCurrency = (val: number) =>
												new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
												}).format(val);

											return (
												<TableRow key={`order-item-${index}`}>
													<TableCell className="font-medium">{name}</TableCell>
													<TableCell className="text-right text-muted-foreground">
														{formatCurrency(price)}
													</TableCell>
													<TableCell className="text-center font-medium">
														{qty}
													</TableCell>
													<TableCell className="text-right text-primary font-medium">
														{formatCurrency(total)}
													</TableCell>
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
				</SheetContent>
			</Sheet>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa đơn hàng <strong>{order.code}</strong>{" "}
							của khách hàng <strong>{order.fullname}</strong>? Hành động này
							không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
							{loading ? "Đang xóa..." : "Xóa đơn hàng"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export function columns({
	onMutated,
}: {
	onMutated: () => void;
}): ColumnDef<OrderResponse>[] {
	return [
		{
			accessorKey: "pk",
			header: "PK",
			cell: ({ row }) => (
				<span className="font-mono text-xs font-medium">
					{row.getValue("pk")}
				</span>
			),
		},
		{
			accessorKey: "code",
			header: "Mã đơn hàng",
			cell: ({ row }) => (
				<span className="font-mono text-xs font-medium">
					{row.getValue("code")}
				</span>
			),
		},
		{
			accessorKey: "fullname",
			header: "Khách hàng",
			cell: ({ row }) => (
				<span className="font-medium max-w-[150px] truncate inline-block align-middle">
					{row.getValue("fullname")}
				</span>
			),
		},
		{
			accessorKey: "phone",
			header: "Điện thoại",
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.getValue("phone")}</span>
			),
		},
		{
			accessorKey: "total",
			header: "Tổng tiền",
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("total"));
				return (
					<span className="font-medium tabular-nums text-primary">
						{new Intl.NumberFormat("vi-VN", {
							style: "currency",
							currency: "VND",
						}).format(amount)}
					</span>
				);
			},
		},
		{
			accessorKey: "shippingFee",
			header: "Phí ship",
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("shippingFee") || "0");
				return (
					<span className="font-medium tabular-nums text-muted-foreground text-sm">
						{new Intl.NumberFormat("vi-VN", {
							style: "currency",
							currency: "VND",
						}).format(amount)}
					</span>
				);
			},
		},
		{
			accessorKey: "paymentMethod",
			header: "Thanh toán",
			cell: ({ row }) => {
				const method = row.getValue("paymentMethod") as string;
				return (
					<Badge
						variant="outline"
						className="bg-slate-500/15 text-slate-700 border-slate-500/25 dark:text-slate-400 uppercase"
					>
						{method || "COD"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdDate",
			header: "Ngày đặt",
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.getValue("createdDate")}
				</span>
			),
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => <StatusCell row={row} onMutated={onMutated} />,
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Hành động</span>,
			cell: ({ row }) => <ActionCell row={row} onMutated={onMutated} />,
		},
	];
}
