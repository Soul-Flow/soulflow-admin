"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import type { CategoryResponse } from "@/interfaces/responses/category-response.interface";
import useCategoryStore from "@/stores/categoryStore";

// Re-export for consumers that imported Category from this file
export type { CategoryResponse as Category };

const editSchema = z.object({
	nameVn: z
		.string()
		.min(1, "Tên tiếng Việt là bắt buộc")
		.min(2, "Tên tiếng Việt phải có ít nhất 2 ký tự"),
	nameEng: z
		.string()
		.min(1, "Tên tiếng Anh là bắt buộc")
		.min(2, "Tên tiếng Anh phải có ít nhất 2 ký tự"),
	descriptionVn: z.string().optional(),
	descriptionEng: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

function ActionCell({
	row,
	onMutated,
}: { row: Row<CategoryResponse>; onMutated: () => void }) {
	const category = row.original;
	const { save, deleteByPk } = useCategoryStore();
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<EditFormValues>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			nameVn: category.nameVn,
			nameEng: category.nameEng,
			descriptionVn: category.descriptionVn,
			descriptionEng: category.descriptionEng,
		},
	});

	const handleEdit = async (data: EditFormValues) => {
		try {
			await save({
				pk: Number(category.pk),
				nameVn: data.nameVn,
				nameEng: data.nameEng,
				descriptionVn: data.descriptionVn ?? "",
				descriptionEng: data.descriptionEng ?? "",
			});
			toast.success(`Đã cập nhật danh mục "${category.nameVn}" - "${category.nameEng}" thành công!`);
			setShowEditDialog(false);
			onMutated();
		} catch {
			toast.error("Cập nhật danh mục thất bại. Vui lòng thử lại.");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteByPk(Number(category.pk));
			toast.success(`Đã xóa danh mục "${category.nameVn}" - "${category.nameEng}" thành công!`, {
				description: "Danh mục đã được xóa khỏi hệ thống.",
			});
			setShowDeleteDialog(false);
			onMutated();
		} catch {
			toast.error("Xóa danh mục thất bại. Vui lòng thử lại.");
		}
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

			<Dialog
				open={showEditDialog}
				onOpenChange={(open) => {
					setShowEditDialog(open);
					if (!open) reset();
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Danh Mục</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin danh mục ${category.nameVn} - ${category.nameEng}.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit(handleEdit)}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label>Tên Danh Mục (VN)</Label>
								<Input
									{...register("nameVn")}
									aria-invalid={!!errors.nameVn}
								/>
								{errors.nameVn && (
									<p className="text-xs text-destructive">
										{errors.nameVn.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Tên Danh Mục (EN)</Label>
								<Input
									{...register("nameEng")}
									aria-invalid={!!errors.nameEng}
								/>
								{errors.nameEng && (
									<p className="text-xs text-destructive">
										{errors.nameEng.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Mô tả (VN)</Label>
								<Input {...register("descriptionVn")} />
							</div>
							<div className="grid gap-2">
								<Label>Mô tả (EN)</Label>
								<Input {...register("descriptionEng")} />
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowEditDialog(false)}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa danh mục{" "}
							<strong>${category.nameVn} - ${category.nameEng}</strong>? Tất cả sản phẩm thuộc danh mục
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

export function columns({
	onMutated,
}: {
	onMutated: () => void;
}): ColumnDef<CategoryResponse>[] {
	return [
		{
			accessorKey: "pk",
			header: "ID",
			cell: ({ row }) => (
				<span className="font-mono text-xs font-medium">
					{row.getValue("pk")}
				</span>
			),
		},
		{
			accessorKey: "code",
			header: "Mã",
			cell: ({ row }) => (
				<span className="font-mono text-xs">{row.getValue("code")}</span>
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
			accessorKey: "nameEng",
			header: "Tên (EN)",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("nameEng")}</span>
			),
		},
		{
			accessorKey: "descriptionVn",
			header: "Mô tả(VN)",
			cell: ({ row }) => (
				<span className="text-muted-foreground line-clamp-1 max-w-75">
					{row.getValue("descriptionVn")}
				</span>
			),
		},
		{
			accessorKey: "descriptionEng",
			header: "Mô tả (EN)",
			cell: ({ row }) => (
				<span className="text-muted-foreground line-clamp-1 max-w-75">
					{row.getValue("descriptionEng")}
				</span>
			),
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Hành động</span>,
			cell: ({ row }) => <ActionCell row={row} onMutated={onMutated} />,
		},
	];
}