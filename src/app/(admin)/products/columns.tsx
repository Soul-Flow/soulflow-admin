"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
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

// Khớp với cấu trúc database (ERD)
export type Product = {
	id: string;
	nameVn: string;
	price: number;
	quantity: number;
	available: boolean;
};

function ActionCell({ row }: { row: Row<Product> }) {
	const product = row.original;
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleUpdate = () => {
		setShowEditDialog(false);
		toast.success(`Đã cập nhật sản phẩm ${product.nameVn}!`);
	};

	const handleDelete = () => {
		setShowDeleteDialog(false);
		toast.success(`Đã xóa sản phẩm ${product.nameVn} thành công!`);
	};

	const formattedAmount = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(product.price);

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
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard.writeText(product.id);
							toast.success("Đã sao chép ID sản phẩm!");
						}}
					>
						Sao chép ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => setShowViewSheet(true)}
					>
						<Eye className="mr-2 h-4 w-4" /> Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => setShowEditDialog(true)}
					>
						<Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" /> Xóa sản phẩm
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* VIEW SHEET */}
			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Sản Phẩm</SheetTitle>
						<SheetDescription>ID: {product.id}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Tên:</span>
							<span className="col-span-2 font-medium">{product.nameVn}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Giá:</span>
							<span className="col-span-2 font-medium">{formattedAmount}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Tồn kho:
							</span>
							<span className="col-span-2">{product.quantity}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">
								Trạng thái:
							</span>
							<span className="col-span-2">
								{product.available ? (
									<Badge
										variant="default"
										className="bg-green-600 hover:bg-green-700"
									>
										Kinh doanh
									</Badge>
								) : (
									<Badge variant="secondary">Tạm ngưng</Badge>
								)}
							</span>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* EDIT DIALOG */}
			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Sản Phẩm</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin sản phẩm {product.nameVn}.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Tên Sản Phẩm</Label>
							<Input defaultValue={product.nameVn} />
						</div>
						<div className="grid gap-2">
							<Label>Giá (VNĐ)</Label>
							<Input type="number" defaultValue={product.price} />
						</div>
						<div className="grid gap-2">
							<Label>Tồn kho</Label>
							<Input type="number" defaultValue={product.quantity} />
						</div>
						<div className="grid gap-2">
							<Label>Trạng thái</Label>
							<select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
								<option value="true">Kinh doanh</option>
								<option value="false">Tạm ngưng</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowEditDialog(false)}>
							Hủy
						</Button>
						<Button onClick={handleUpdate}>Lưu thay đổi</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* DELETE ALERT DIALOG */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa sản phẩm{" "}
							<strong>{product.nameVn}</strong>? Hành động này không thể hoàn
							tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							Xóa sản phẩm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "nameVn",
		header: "Tên Sản Phẩm",
	},
	{
		accessorKey: "price",
		header: "Giá (VNĐ)",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(amount);
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "quantity",
		header: "Tồn kho",
		cell: ({ row }) => {
			const qty = parseInt(row.getValue("quantity"), 10);
			// Cảnh báo nếu số lượng dưới 10
			return (
				<div className={`font-medium ${qty < 10 ? "text-destructive" : ""}`}>
					{qty}
				</div>
			);
		},
	},
	{
		accessorKey: "available",
		header: "Trạng thái",
		cell: ({ row }) => {
			const isAvailable = row.getValue("available");
			return isAvailable ? (
				<Badge variant="default" className="bg-green-600 hover:bg-green-700">
					Kinh doanh
				</Badge>
			) : (
				<Badge variant="secondary">Tạm ngưng</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <ActionCell row={row} />,
	},
];
