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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type Order = {
	id: string;
	customerName: string;
	totalAmount: number;
	date: string;
	status: OrderStatus;
};

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
	{
		pending: {
			label: "Chờ xử lý",
			className:
				"bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400",
		},
		processing: {
			label: "Đang xử lý",
			className:
				"bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400",
		},
		completed: {
			label: "Hoàn thành",
			className:
				"bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
		},
		cancelled: {
			label: "Đã hủy",
			className:
				"bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400",
		},
	};

function ActionCell({ row }: { row: Row<Order> }) {
	const order = row.original;
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const _isLocked = false; // Not applicable here but keeping consistent state pattern

	const handleUpdateStatus = () => {
		setShowEditDialog(false);
		toast.success(`Đã cập nhật trạng thái đơn hàng ${order.id}!`, {
			description: "Trạng thái đơn hàng đã được thay đổi thành công.",
		});
	};

	const handleDelete = () => {
		setShowDeleteDialog(false);
		toast.success(`Đã xóa đơn hàng ${order.id} thành công!`, {
			description: "Đơn hàng đã được xóa khỏi hệ thống.",
		});
	};

	const formattedAmount = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(order.totalAmount);

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
						<Eye className="mr-2 h-4 w-4" />
						Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => setShowEditDialog(true)}
					>
						<RefreshCcw className="mr-2 h-4 w-4" />
						Cập nhật trạng thái
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" />
						Xóa đơn hàng
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* VIEW SHEET */}
			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Đơn Hàng</SheetTitle>
						<SheetDescription>Mã đơn: {order.id}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Khách hàng:
							</span>
							<span className="col-span-2 font-medium">
								{order.customerName}
							</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Tổng tiền:
							</span>
							<span className="col-span-2 font-medium">{formattedAmount}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Ngày đặt:
							</span>
							<span className="col-span-2">{order.date}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">
								Trạng thái:
							</span>
							<span className="col-span-2">
								<Badge
									variant="outline"
									className={statusConfig[order.status].className}
								>
									{statusConfig[order.status].label}
								</Badge>
							</span>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* EDIT DIALOG */}
			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Đơn Hàng</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin đơn hàng {order.id}.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Khách hàng</Label>
							<Input defaultValue={order.customerName} disabled />
						</div>
						<div className="grid gap-2">
							<Label>Trạng thái mới</Label>
							<select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
								<option value="pending">Chờ xử lý</option>
								<option value="processing">Đang xử lý</option>
								<option value="completed">Hoàn thành</option>
								<option value="cancelled">Đã hủy</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowEditDialog(false)}>
							Hủy
						</Button>
						<Button onClick={handleUpdateStatus}>Lưu thay đổi</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* DELETE ALERT DIALOG */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa đơn hàng <strong>{order.id}</strong> của
							khách hàng <strong>{order.customerName}</strong>? Hành động này
							không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							Xóa đơn hàng
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "id",
		header: "Mã đơn hàng",
		cell: ({ row }) => (
			<span className="font-mono text-xs font-medium">
				{row.getValue("id")}
			</span>
		),
	},
	{
		accessorKey: "customerName",
		header: "Khách hàng",
		cell: ({ row }) => (
			<span className="font-medium">{row.getValue("customerName")}</span>
		),
	},
	{
		accessorKey: "totalAmount",
		header: "Tổng tiền",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("totalAmount"));
			const formatted = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(amount);
			return <span className="font-medium tabular-nums">{formatted}</span>;
		},
	},
	{
		accessorKey: "date",
		header: "Ngày đặt",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.getValue("date")}</span>
		),
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => {
			const status = row.getValue("status") as OrderStatus;
			const config = statusConfig[status];
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
		cell: ({ row }) => <ActionCell row={row} />,
	},
];
