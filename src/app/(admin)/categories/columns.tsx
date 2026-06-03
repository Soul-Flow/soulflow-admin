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

export type Category = {
	id: string;
	nameVn: string;
	nameEn: string;
	description: string;
};

function ActionCell({ row }: { row: Row<Category> }) {
	const category = row.original;
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleEdit = () => {
		setShowEditDialog(false);
		toast.success(`Đã cập nhật danh mục "${category.nameVn}" thành công!`);
	};

	const handleDelete = () => {
		setShowDeleteDialog(false);
		toast.success(`Đã xóa danh mục "${category.nameVn}" thành công!`, {
			description: "Danh mục đã được xóa khỏi hệ thống.",
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
						Xóa danh mục
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Danh Mục</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin danh mục {category.nameVn}.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Tên Danh Mục (VN)</Label>
							<Input defaultValue={category.nameVn} />
						</div>
						<div className="grid gap-2">
							<Label>Tên Danh Mục (EN)</Label>
							<Input defaultValue={category.nameEn} />
						</div>
						<div className="grid gap-2">
							<Label>Mô tả</Label>
							<Input defaultValue={category.description} />
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
						<AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa danh mục{" "}
							<strong>{category.nameVn}</strong>? Tất cả sản phẩm thuộc danh mục
							này sẽ bị ảnh hưởng. Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							Xóa danh mục
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export const columns: ColumnDef<Category>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-mono text-xs font-medium">
				{row.getValue("id")}
			</span>
		),
	},
	{
		accessorKey: "nameVn",
		header: "Tên (VN)",
		cell: ({ row }) => (
			<span className="font-medium">{row.getValue("nameVn")}</span>
		),
	},
	{
		accessorKey: "nameEn",
		header: "Tên (ENG)",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.getValue("nameEn")}</span>
		),
	},
	{
		accessorKey: "description",
		header: "Mô tả",
		cell: ({ row }) => (
			<span className="text-muted-foreground line-clamp-1 max-w-75">
				{row.getValue("description")}
			</span>
		),
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Hành động</span>,
		cell: ({ row }) => <ActionCell row={row} />,
	},
];
