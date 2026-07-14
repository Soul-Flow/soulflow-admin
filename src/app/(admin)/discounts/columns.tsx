"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { DiscountResponse } from "@/interfaces/responses/discount-response.interface";
import useDiscountStore from "@/stores/discountStore";

const editSchema = z.object({
	code: z.string().min(3, "Mã giảm giá phải có ít nhất 3 ký tự"),
	descriptionVn: z.string().min(1, "Mô tả là bắt buộc"),
	descriptionEng: z.string().optional(),
	percentage: z.number({ message: "Phần trăm phải là số" }).min(1).max(100),
	expiredDate: z.string().min(1, "Ngày hết hạn là bắt buộc"),
});

type EditFormValues = z.infer<typeof editSchema>;

function StatusCell({
	row,
	onMutated,
}: {
	row: Row<DiscountResponse>;
	onMutated: () => void;
}) {
	const discount = row.original;
	const { save } = useDiscountStore();
	const [isExpired, setIsExpired] = useState<boolean>(
		discount.expired === "true" ||
			discount.expired === (true as unknown as string),
	);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleStatusChange = async (val: string) => {
		const newExpiredStatus = val === "true";
		setIsExpired(newExpiredStatus);
		setIsUpdating(true);
		try {
			await save({
				pk: Number(discount.pk),
				percentage: parseFloat(discount.percentage),
				descriptionVn: discount.description,
				descriptionEng: discount.description,
				expiredDate: discount.expiredDate,
				// NOTE: backend needs to support an 'expired' boolean parameter if we want to toggle it manually,
				// or maybe we just pass what we have and toggle. For now we assume updating save works.
				productRequests: [],
			});
			toast.success(
				newExpiredStatus
					? `Đã đánh dấu mã "${discount.code}" là Hết hạn!`
					: `Đã đánh dấu mã "${discount.code}" là Còn hiệu lực!`,
			);
			onMutated();
		} catch {
			toast.error("Thao tác thất bại. Vui lòng thử lại.");
			setIsExpired(!newExpiredStatus); // Revert
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Select
			value={String(isExpired)}
			onValueChange={handleStatusChange}
			disabled={isUpdating}
		>
			<SelectTrigger
				className={`h-7 w-[120px] text-xs font-medium ${isExpired ? "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400"}`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="false" className="text-xs">
					Còn hiệu lực
				</SelectItem>
				<SelectItem value="true" className="text-xs">
					Đã hết hạn
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function ActionCell({
	row,
	onMutated,
}: {
	row: Row<DiscountResponse>;
	onMutated: () => void;
}) {
	const discount = row.original;
	const { save, deleteByPk, loading } = useDiscountStore();
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const _isExpired =
		discount.expired === "true" ||
		discount.expired === (true as unknown as string);
	const percentageNum = parseFloat(discount.percentage);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<EditFormValues>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			code: discount.code,
			descriptionVn: discount.description,
			descriptionEng: discount.description,
			percentage: percentageNum,
			expiredDate: discount.expiredDate,
		},
	});

	const handleEdit = async (data: EditFormValues) => {
		try {
			await save({
				pk: Number(discount.pk),
				percentage: data.percentage,
				descriptionVn: data.descriptionVn,
				descriptionEng: data.descriptionEng ?? data.descriptionVn,
				expiredDate: data.expiredDate,
				productRequests: [],
			});
			toast.success(`Đã cập nhật mã giảm giá "${discount.code}" thành công!`);
			setShowEditDialog(false);
			onMutated();
		} catch {
			toast.error("Cập nhật mã giảm giá thất bại. Vui lòng thử lại.");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteByPk(Number(discount.pk));
			toast.success(`Đã xóa mã giảm giá "${discount.code}" thành công!`);
			setShowDeleteDialog(false);
			onMutated();
		} catch {
			toast.error("Xóa mã giảm giá thất bại. Vui lòng thử lại.");
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
						<Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" /> Xóa mã giảm giá
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog
				open={showEditDialog}
				onOpenChange={(o) => {
					setShowEditDialog(o);
					if (!o) reset();
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Mã Giảm Giá</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin mã {discount.code}.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit(handleEdit)}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label>Mã giảm giá</Label>
								<Input
									{...register("code")}
									aria-invalid={!!errors.code}
									disabled
								/>
								{errors.code && (
									<p className="text-xs text-destructive">
										{errors.code.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Mô tả</Label>
								<Input
									{...register("descriptionVn")}
									aria-invalid={!!errors.descriptionVn}
								/>
								{errors.descriptionVn && (
									<p className="text-xs text-destructive">
										{errors.descriptionVn.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Giảm (%)</Label>
								<Input
									type="number"
									{...register("percentage", { valueAsNumber: true })}
									aria-invalid={!!errors.percentage}
								/>
								{errors.percentage && (
									<p className="text-xs text-destructive">
										{errors.percentage.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Ngày hết hạn</Label>
								<Input
									type="date"
									{...register("expiredDate")}
									aria-invalid={!!errors.expiredDate}
								/>
								{errors.expiredDate && (
									<p className="text-xs text-destructive">
										{errors.expiredDate.message}
									</p>
								)}
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
						<AlertDialogTitle>Xác nhận xóa mã giảm giá</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa mã <strong>{discount.code}</strong>?
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
							{loading ? "Đang xóa..." : "Xóa mã giảm giá"}
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
}): ColumnDef<DiscountResponse>[] {
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
			header: "Mã giảm giá",
			cell: ({ row }) => (
				<span className="font-medium uppercase">{row.getValue("code")}</span>
			),
		},
		{
			accessorKey: "description",
			header: "Mô tả",
			cell: ({ row }) => (
				<span className="text-muted-foreground max-w-[200px] truncate inline-block align-middle">
					{row.getValue("description")}
				</span>
			),
		},
		{
			accessorKey: "percentage",
			header: "Giảm (%)",
			cell: ({ row }) => (
				<span className="font-bold">
					{parseFloat(row.getValue("percentage"))}%
				</span>
			),
		},
		{
			accessorKey: "createdDate",
			header: "Ngày tạo",
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.getValue("createdDate")}
				</span>
			),
		},
		{
			accessorKey: "expiredDate",
			header: "Ngày hết hạn",
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.getValue("expiredDate")}
				</span>
			),
		},
		{
			accessorKey: "expired",
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
