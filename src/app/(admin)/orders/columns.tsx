"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, RefreshCcw, Trash } from "lucide-react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { OrderStatus } from "@/enums/order-status.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import useOrderStore from "@/stores/orderStore";

const statusConfig: Record<string, { label: string; className: string }> = {
	[OrderStatus.PENDING]: {
		label: "Chờ xử lý",
		className: "bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400",
	},
	[OrderStatus.PROCESSING]: {
		label: "Đang xử lý",
		className: "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400",
	},
	[OrderStatus.SHIPPED]: {
		label: "Đang giao",
		className: "bg-indigo-500/15 text-indigo-700 border-indigo-500/25 dark:text-indigo-400",
	},
	[OrderStatus.DELIVERED]: {
		label: "Đã giao",
		className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
	},
	[OrderStatus.CANCELLED]: {
		label: "Đã hủy",
		className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400",
	},
};

function ActionCell({
	row,
	onMutated,
}: { row: Row<OrderResponse>; onMutated: () => void }) {
	const order = row.original;
	const { save, deleteByPk, loading } = useOrderStore();
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [newStatus, setNewStatus] = useState<string>(order.status);

	const totalNum = parseFloat(order.total);
	const formattedTotal = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(totalNum);

	const handleUpdateStatus = async () => {
		try {
			await save({
				pk: Number(order.pk),
				status: newStatus as OrderStatus,
				fullname: order.fullname,
				phone: order.phone,
				address: order.address,
				accountPk: Number(order.accountPk),
				orderDetailRequests: [],
			});
			toast.success(`Đã cập nhật trạng thái đơn hàng ${order.code}!`);
			setShowEditDialog(false);
			onMutated();
		} catch {
			toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
		}
	};

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

	const statusInfo = statusConfig[order.status] ?? { label: order.status, className: "" };

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
					<DropdownMenuItem className="cursor-pointer" onSelect={() => setShowViewSheet(true)}>
						<Eye className="mr-2 h-4 w-4" /> Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer" onSelect={() => setShowEditDialog(true)}>
						<RefreshCcw className="mr-2 h-4 w-4" /> Cập nhật trạng thái
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

			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Đơn Hàng</SheetTitle>
						<SheetDescription>Mã đơn: {order.code}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Khách hàng:</span>
							<span className="col-span-2 font-medium">{order.fullname}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Điện thoại:</span>
							<span className="col-span-2">{order.phone}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Địa chỉ:</span>
							<span className="col-span-2">{order.address}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Tổng tiền:</span>
							<span className="col-span-2 font-medium">{formattedTotal}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Ngày đặt:</span>
							<span className="col-span-2">{order.createdDate}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Hết hạn:</span>
							<span className="col-span-2">{order.expiredDate}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">Trạng thái:</span>
							<span className="col-span-2">
								<Badge variant="outline" className={statusInfo.className}>
									{statusInfo.label}
								</Badge>
							</span>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Đơn Hàng</DialogTitle>
						<DialogDescription>Chỉnh sửa trạng thái đơn hàng {order.code}.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Khách hàng</Label>
							<span className="text-sm font-medium">{order.fullname}</span>
						</div>
						<div className="grid gap-2">
							<Label>Trạng thái mới</Label>
							<select
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
								value={newStatus}
								onChange={(e) => setNewStatus(e.target.value)}
							>
								{Object.entries(statusConfig).map(([val, cfg]) => (
									<option key={val} value={val}>{cfg.label}</option>
								))}
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowEditDialog(false)}>Hủy</Button>
						<Button onClick={handleUpdateStatus} disabled={loading}>
							{loading ? "Đang lưu..." : "Lưu thay đổi"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa đơn hàng <strong>{order.code}</strong> của khách hàng{" "}
							<strong>{order.fullname}</strong>? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete} disabled={loading}>
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
				<span className="font-mono text-xs font-medium">{row.getValue("pk")}</span>
			),
		},
		{
			accessorKey: "code",
			header: "Mã đơn hàng",
			cell: ({ row }) => (
				<span className="font-mono text-xs font-medium">{row.getValue("code")}</span>
			),
		},
		{
			accessorKey: "fullname",
			header: "Khách hàng",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("fullname")}</span>
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
					<span className="font-medium tabular-nums">
						{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}
					</span>
				);
			},
		},
		{
			accessorKey: "createdDate",
			header: "Ngày đặt",
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.getValue("createdDate")}</span>
			),
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				const config = statusConfig[status] ?? { label: status, className: "" };
				return (
					<Badge variant="outline" className={config.className}>
						{config.label}
					</Badge>
				);
			},
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Hành động</span>,
			cell: ({ row }) => <ActionCell row={row} onMutated={onMutated} />,
		},
	];
}
