"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
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
import type { ProductResponse } from "@/interfaces/responses/product-response.interface";
import useProductStore from "@/stores/productStore";

const editSchema = z.object({
	nameVn: z.string().min(1, "Tên sản phẩm là bắt buộc"),
	nameEng: z.string().min(1, "Tên tiếng Anh là bắt buộc"),
	descriptionVn: z.string().optional(),
	descriptionEng: z.string().optional(),
	price: z.number({ message: "Giá phải là số" }).min(0, "Giá không được âm"),
	quantity: z.number({ message: "Số lượng phải là số" }).min(0),
	available: z.boolean(),
	categoryPk: z.number().min(1, "Danh mục là bắt buộc"),
});

type EditFormValues = z.infer<typeof editSchema>;

function ActionCell({
	row,
	onMutated,
}: { row: Row<ProductResponse>; onMutated: () => void }) {
	const product = row.original;
	const { save, deleteByPk, loading } = useProductStore();
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const isAvailable = product.available === "true" || product.available === true as unknown as string;
	const priceNum = parseFloat(product.price);
	const qtyNum = parseInt(product.quantity, 10);

	const formattedAmount = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(priceNum);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<EditFormValues>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			nameVn: product.nameVn,
			nameEng: product.nameEng,
			descriptionVn: product.descriptionVn,
			descriptionEng: product.descriptionEng,
			price: priceNum,
			quantity: qtyNum,
			available: isAvailable,
			categoryPk: Number(product.categoryPk),
		},
	});

	const handleUpdate = async (data: EditFormValues) => {
		try {
			await save(
				{
					pk: Number(product.pk),
					nameVn: data.nameVn,
					nameEng: data.nameEng,
					descriptionVn: data.descriptionVn ?? "",
					descriptionEng: data.descriptionEng ?? "",
					price: data.price,
					available: data.available,
					quantity: data.quantity,
					categoryPk: data.categoryPk,
				},
				[],
			);
			toast.success(`Đã cập nhật sản phẩm "${product.nameVn}" thành công!`);
			setShowEditDialog(false);
			onMutated();
		} catch {
			toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteByPk(Number(product.pk));
			toast.success(`Đã xóa sản phẩm "${product.nameVn}" thành công!`);
			setShowDeleteDialog(false);
			onMutated();
		} catch {
			toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
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
					<DropdownMenuItem className="cursor-pointer" onSelect={() => setShowViewSheet(true)}>
						<Eye className="mr-2 h-4 w-4" /> Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer" onSelect={() => setShowEditDialog(true)}>
						<Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" /> Xóa sản phẩm
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Sản Phẩm</SheetTitle>
						<SheetDescription>Mã: {product.code}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">PK:</span>
							<span className="col-span-2 font-mono text-xs">{product.pk}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Tên:</span>
							<span className="col-span-2 font-medium">{product.nameVn}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Mô tả:</span>
							<span className="col-span-2 text-muted-foreground">{product.descriptionEng}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Giá:</span>
							<span className="col-span-2 font-medium">{formattedAmount}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Tồn kho:</span>
							<span className="col-span-2">{product.quantity}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Đã bán:</span>
							<span className="col-span-2">{product.sales}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Ngày tạo:</span>
							<span className="col-span-2">{product.createdDate}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">Trạng thái:</span>
							<span className="col-span-2">
								{isAvailable ? (
									<Badge className="bg-green-600 hover:bg-green-700">Kinh doanh</Badge>
								) : (
									<Badge variant="secondary">Tạm ngưng</Badge>
								)}
							</span>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<Dialog open={showEditDialog} onOpenChange={(o) => { setShowEditDialog(o); if (!o) reset(); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập Nhật Sản Phẩm</DialogTitle>
						<DialogDescription>Chỉnh sửa thông tin sản phẩm {product.nameVn}.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit(handleUpdate)}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label>Tên Sản Phẩm (VN)</Label>
								<Input {...register("nameVn")} aria-invalid={!!errors.nameVn} />
								{errors.nameVn && <p className="text-xs text-destructive">{errors.nameVn.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label>Tên Sản Phẩm (EN)</Label>
								<Input {...register("nameEng")} aria-invalid={!!errors.nameEng} />
								{errors.nameEng && <p className="text-xs text-destructive">{errors.nameEng.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label>Mô tả</Label>
								<Input {...register("descriptionVn")} />
							</div>
							<div className="grid gap-2">
								<Label>Giá (VNĐ)</Label>
								<Input type="number" {...register("price", { valueAsNumber: true })} aria-invalid={!!errors.price} />
								{errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label>Tồn kho</Label>
								<Input type="number" {...register("quantity", { valueAsNumber: true })} aria-invalid={!!errors.quantity} />
							</div>
							<div className="grid gap-2">
								<Label>Trạng thái</Label>
								<select
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
									onChange={(e) => setValue("available", e.target.value === "true")}
									defaultValue={String(isAvailable)}
								>
									<option value="true">Kinh doanh</option>
									<option value="false">Tạm ngưng</option>
								</select>
							</div>
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Hủy</Button>
							<Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa sản phẩm <strong>{product.nameVn}</strong>? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete} disabled={loading}>
							{loading ? "Đang xóa..." : "Xóa sản phẩm"}
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
}): ColumnDef<ProductResponse>[] {
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
			header: "Mã",
			cell: ({ row }) => (
				<span className="font-mono text-xs">{row.getValue("code")}</span>
			),
		},
		{
			accessorKey: "nameVn",
			header: "Tên Sản Phẩm(VN)",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("nameVn")}</span>
			),
		},
		{
			accessorKey: "nameEng",
			header: "Tên Sản Phẩm(EN)",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("nameEng")}</span>
			),
		},
		{
			accessorKey: "descriptionVn",
			header: "Mô Tả(VN)",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("descriptionVn")}</span>
			),
		},
		{
			accessorKey: "descriptionEng",
			header: "Mô Tả(EN)",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("descriptionEng")}</span>
			),
		},
		{
			accessorKey: "price",
			header: "Giá (VNĐ)",
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("price"));
				return (
					<span className="font-medium tabular-nums">
						{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}
					</span>
				);
			},
		},
		{
			accessorKey: "quantity",
			header: "Tồn kho",
			cell: ({ row }) => {
				const qty = parseInt(row.getValue("quantity"), 10);
				return (
					<span className={`font-medium ${qty < 10 ? "text-destructive" : ""}`}>{qty}</span>
				);
			},
		},
		{
			accessorKey: "sales",
			header: "Đã bán",
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.getValue("sales")}</span>
			),
		},
		{
			accessorKey: "available",
			header: "Trạng thái",
			cell: ({ row }) => {
				const val = row.getValue("available");
				const isAvailable = val === "true" || val === true;
				return isAvailable ? (
					<Badge className="bg-green-600 hover:bg-green-700">Kinh doanh</Badge>
				) : (
					<Badge variant="secondary">Tạm ngưng</Badge>
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
