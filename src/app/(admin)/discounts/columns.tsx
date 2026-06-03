"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
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

import type { DiscountResponse, DiscountStatus } from "./discount.dto";

const statusConfig: Record<
	DiscountStatus,
	{ label: string; className: string }
> = {
	active: {
		label: "Đang hoạt động",
		className:
			"bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
	},
	expired: {
		label: "Đã hết hạn",
		className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400",
	},
	upcoming: {
		label: "Sắp diễn ra",
		className:
			"bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400",
	},
};

function ActionCell({ row }: { row: Row<DiscountResponse> }) {
	const discount = row.original;
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleEdit = () => {
		setShowEditDialog(false);
		toast.success(`Đã cập nhật mã giảm giá "${discount.code}" thành công!`);
	};

	const handleDelete = () => {
		setShowDeleteDialog(false);
		toast.success(`Đã xóa mã giảm giá "${discount.code}" thành công!`, {
			description: "Mã giảm giá đã được xóa khỏi hệ thống.",
		});
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
						onSelect={() => setShowEditDialog(true)}
					>
						<Edit className="mr-2 h-4 w-4" />
						Chỉnh sửa
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" />
						Xóa mã giảm giá
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Mã Giảm Giá</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin mã giảm giá {discount.code}.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Mã giảm giá</Label>
							<Input defaultValue={discount.code} />
						</div>
						<div className="grid gap-2">
							<Label>Mô tả</Label>
							<Input defaultValue={discount.description} />
						</div>
						<div className="grid gap-2">
							<Label>Giảm (%)</Label>
							<Input type="number" defaultValue={discount.discountPercent} />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowEditDialog(false)}>
							Hủy
						</Button>
						<Button onClick={handleEdit}>Lưu thay đổi</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa mã giảm giá</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa mã giảm giá{" "}
							<strong>{discount.code}</strong>? Hành động này không thể hoàn
							tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							Xóa mã giảm giá
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export const columns: ColumnDef<DiscountResponse>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-mono text-xs">{row.getValue("id")}</span>
		),
	},
	{
		accessorKey: "code",
		header: "Mã giảm giá",
		cell: ({ row }) => (
			<span className="font-medium uppercase">{row.getValue("code")}</span>
		),
	},
	{
		accessorKey: "description",
		header: "Mô tả",
		cell: ({ row }) => (
			<span className="text-muted-foreground line-clamp-1 max-w-[200px]">
				{row.getValue("description")}
			</span>
		),
	},
	{
		accessorKey: "discountPercent",
		header: "Giảm (%)",
		cell: ({ row }) => (
			<span className="font-bold">{row.getValue("discountPercent")}%</span>
		),
	},
	{
		accessorKey: "minOrderAmount",
		header: "Đơn tối thiểu",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("minOrderAmount"));
			const formatted = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(amount);
			return <span className="font-medium tabular-nums">{formatted}</span>;
		},
	},
	{
		id: "dateRange",
		header: "Thời gian",
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.startDate} - {row.original.endDate}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => {
			const status = row.getValue("status") as DiscountStatus;
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
