"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, Flower2, ImagePlus, MoreHorizontal, Trash, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { ProductResponse } from "@/interfaces/responses/product-response.interface";
import type { CategoryResponse } from "@/interfaces/responses/category-response.interface";
import { formatDateTime } from "@/lib/utils";
import { SortOrder } from "@/enums/sort-order.enum";
import useCategoryStore from "@/stores/categoryStore";
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
	customised: z.boolean(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface ImagePreview {
	file: File;
	previewUrl: string;
}

function StatusCell({
	row,
	onMutated,
}: {
	row: Row<ProductResponse>;
	onMutated: () => void;
}) {
	const product = row.original;
	const { save } = useProductStore();
	const [isAvailable, setIsAvailable] = useState<boolean>(
		product.available === "true" ||
			product.available === (true as unknown as string),
	);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleStatusChange = async (val: string) => {
		const newStatus = val === "true";
		setIsAvailable(newStatus);
		setIsUpdating(true);
		try {
			await save(
				{
					pk: Number(product.pk),
					nameVn: product.nameVn,
					nameEng: product.nameEng,
					descriptionVn: product.descriptionVn,
					descriptionEng: product.descriptionEng,
					price:
						typeof product.price === "string"
							? parseFloat(product.price)
							: product.price,
					available: newStatus,
					quantity:
						typeof product.quantity === "string"
							? parseInt(product.quantity, 10)
							: product.quantity,
					categoryPk: Number(product.categoryPk),
					customised:
						product.customised === "true" ||
						product.customised === (true as unknown as string),
				},
				[],
			);
			toast.success(`Đã cập nhật trạng thái sản phẩm "${product.nameVn}"!`);
			onMutated();
		} catch {
			toast.error("Cập nhật trạng thái thất bại.");
			setIsAvailable(!newStatus); // revert
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Select
			value={String(isAvailable)}
			onValueChange={handleStatusChange}
			disabled={isUpdating}
		>
			<SelectTrigger
				className={`h-8.5 w-[135px] text-xs font-medium ${isAvailable ? "bg-green-600/15 text-green-700 border-green-600/25 dark:text-green-400" : "bg-slate-500/15 text-slate-700 border-slate-500/25 dark:text-slate-400"}`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="true" className="text-xs">
					Kinh doanh
				</SelectItem>
				<SelectItem value="false" className="text-xs">
					Tạm ngưng
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function ActionCell({
	row,
	onMutated,
}: {
	row: Row<ProductResponse>;
	onMutated: () => void;
}) {
	const product = row.original;
	const { save, deleteByPk, loading } = useProductStore();
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [images, setImages] = useState<ImagePreview[]>([]);
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const { filter: filterCategory } = useCategoryStore();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (showEditDialog) {
			filterCategory({
				keyword: null,
				deleted: false,
				sortOrder: SortOrder.DESC,
				pageNumber: 0,
				pageSize: 100,
			}).then((page) => setCategories(page?.content ?? []));
		}
	}, [showEditDialog, filterCategory]);

	useEffect(() => {
		if (
			searchParams.get("action") === "view" &&
			searchParams.get("keyword") === product.code
		) {
			setShowViewSheet(true);
		}
	}, [searchParams, product.code]);

	const handleOpenChange = (open: boolean) => {
		setShowViewSheet(open);
		if (!open && searchParams.get("action") === "view") {
			router.replace(pathname);
		}
	};

	// Clean up object URLs to avoid memory leaks
	useEffect(() => {
		return () => {
			images.forEach((img) => {
				URL.revokeObjectURL(img.previewUrl);
			});
		};
	}, [images]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const validFiles = Array.from(files).filter((file) => {
			if (!file.type.startsWith("image/")) {
				toast.error(`File "${file.name}" không phải là hình ảnh.`);
				return false;
			}
			if (file.size > 5 * 1024 * 1024) {
				toast.error(`File "${file.name}" vượt quá 5MB.`);
				return false;
			}
			return true;
		});

		const newImages: ImagePreview[] = validFiles.map((file) => ({
			file,
			previewUrl: URL.createObjectURL(file),
		}));

		setImages((prev) => [...prev, ...newImages]);
		e.target.value = "";
	};

	const handleRemoveImage = (index: number) => {
		setImages((prev) => {
			const target = prev[index];
			if (target) URL.revokeObjectURL(target.previewUrl);
			return prev.filter((_, i) => i !== index);
		});
	};

	const isAvailable =
		product.available === "true" ||
		product.available === (true as unknown as string);
	const isCustomised =
		product.customised === "true" ||
		product.customised === (true as unknown as string);
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
		watch,
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
			customised: isCustomised,
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
					customised: data.customised,
				},
				images.map((img) => img.file),
			);
			toast.success(`Đã cập nhật sản phẩm "${product.nameVn}" thành công!`);
			images.forEach((img) => {
				URL.revokeObjectURL(img.previewUrl);
			});
			setImages([]);
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

	const handleOpenEdit = () => {
		const isAvailable = String(product.available) === "true";
		const isCustomised = String(product.customised) === "true";
		const priceNum =
			typeof product.price === "string"
				? parseFloat(product.price)
				: product.price;
		const qtyNum =
			typeof product.quantity === "string"
				? parseInt(product.quantity, 10)
				: product.quantity;

		reset({
			nameVn: product.nameVn,
			nameEng: product.nameEng,
			descriptionVn: product.descriptionVn,
			descriptionEng: product.descriptionEng,
			price: priceNum,
			quantity: qtyNum,
			available: isAvailable,
			categoryPk: Number(product.categoryPk),
			customised: isCustomised,
		});
		setImages([]);
		setShowEditDialog(true);
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
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={handleOpenEdit}
					>
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

			<Sheet open={showViewSheet} onOpenChange={handleOpenChange}>
				<SheetContent className="overflow-y-auto w-full sm:max-w-xl md:max-w-2xl p-6">
					<SheetHeader className="pb-3 border-b">
						<SheetTitle className="text-xl font-bold flex items-center gap-2">
							<Flower2 className="h-5 w-5 text-primary" />
							<span>Chi Tiết Sản Phẩm</span>
							<Badge variant="outline" className="font-mono text-xs ml-auto">
								#{product.code}
							</Badge>
						</SheetTitle>
						<SheetDescription>
							PK: {product.pk} • Ngày tạo: {formatDateTime(product.createdDate)}
						</SheetDescription>
					</SheetHeader>

					<div className="mt-5 space-y-4 text-sm">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
								<h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider border-b pb-1.5">
									Tên sản phẩm
								</h4>
								<div className="space-y-2 text-xs">
									<div>
										<span className="text-muted-foreground font-medium block">
											Tên tiếng Việt:
										</span>
										<span className="font-semibold text-sm text-foreground">
											{product.nameVn}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground font-medium block">
											Tên tiếng Anh:
										</span>
										<span className="font-medium text-foreground">
											{product.nameEng}
										</span>
									</div>
								</div>
							</div>

							<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
								<h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider border-b pb-1.5">
									Giá & Tồn kho
								</h4>
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div>
										<span className="text-muted-foreground font-medium block">
											Đơn giá:
										</span>
										<span className="font-bold text-base text-primary font-mono">
											{formattedAmount}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground font-medium block">
											Tồn kho:
										</span>
										<span className="font-bold text-base text-foreground font-mono">
											{product.quantity}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground font-medium block">
											Đã bán:
										</span>
										<span className="font-medium text-muted-foreground font-mono">
											{product.sales}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground font-medium block">
											Trạng thái:
										</span>
										<span className="mt-1 block">
											{isAvailable ? (
												<Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs">
													Kinh doanh
												</Badge>
											) : (
												<Badge variant="secondary" className="text-xs">
													Tạm ngưng
												</Badge>
											)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Descriptions */}
						<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3 text-xs">
							<h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider border-b pb-1.5">
								Mô tả sản phẩm
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<span className="text-muted-foreground font-medium block mb-1">
										Mô tả (VN):
									</span>
									<p className="text-muted-foreground bg-muted/30 p-2.5 rounded-lg whitespace-pre-wrap">
										{product.descriptionVn || "Không có mô tả tiếng Việt"}
									</p>
								</div>
								<div>
									<span className="text-muted-foreground font-medium block mb-1">
										Mô tả (EN):
									</span>
									<p className="text-muted-foreground bg-muted/30 p-2.5 rounded-lg whitespace-pre-wrap">
										{product.descriptionEng || "No English description"}
									</p>
								</div>
							</div>
						</div>

						{/* Images */}
						{product.productImageResponses &&
							product.productImageResponses.length > 0 && (
								<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
									<h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider border-b pb-1.5 flex items-center justify-between">
										<span>Hình ảnh sản phẩm</span>
										<Badge variant="secondary" className="font-mono text-xs">
											{product.productImageResponses.length} ảnh
										</Badge>
									</h4>
									<div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
										{product.productImageResponses.map((img, index) => (
											<div
												key={img.pk || index}
												className="group relative aspect-square overflow-hidden rounded-md border"
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={img.url}
													alt={`Ảnh sản phẩm ${index + 1}`}
													className="h-full w-full object-cover"
												/>
											</div>
										))}
									</div>
								</div>
							)}
					</div>
				</SheetContent>
			</Sheet>

			<Dialog
				open={showEditDialog}
				onOpenChange={(o) => {
					setShowEditDialog(o);
					if (!o) reset();
				}}
			>
				<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
					<DialogHeader>
						<DialogTitle>Cập Nhật Sản Phẩm</DialogTitle>
						<DialogDescription>
							Chỉnh sửa thông tin sản phẩm {product.nameVn}.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit(handleUpdate)} className="space-y-4 py-2">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Tên Sản Phẩm (VN) *</Label>
								<Input {...register("nameVn")} aria-invalid={!!errors.nameVn} />
								{errors.nameVn && (
									<p className="text-xs text-destructive">
										{errors.nameVn.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Tên Sản Phẩm (EN) *</Label>
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
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Giá (VNĐ) *</Label>
								<Input
									type="number"
									{...register("price", { valueAsNumber: true })}
									aria-invalid={!!errors.price}
								/>
								{errors.price && (
									<p className="text-xs text-destructive">
										{errors.price.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Tồn kho *</Label>
								<Input
									type="number"
									{...register("quantity", { valueAsNumber: true })}
									aria-invalid={!!errors.quantity}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Danh mục *</Label>
								<Select
									value={String(watch("categoryPk") || product.categoryPk)}
									onValueChange={(v) => setValue("categoryPk", Number(v))}
								>
									<SelectTrigger aria-invalid={!!errors.categoryPk}>
										<SelectValue placeholder="Chọn danh mục" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((c) => (
											<SelectItem key={c.pk} value={String(c.pk)}>
												{c.nameVn} - {c.nameEng}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.categoryPk && (
									<p className="text-xs text-destructive">
										{errors.categoryPk.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label>Trạng thái</Label>
								<select
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs"
									onChange={(e) =>
										setValue("available", e.target.value === "true")
									}
									defaultValue={String(isAvailable)}
								>
									<option value="true">Kinh doanh</option>
									<option value="false">Tạm ngưng</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Mô tả (VN)</Label>
								<Textarea
									className="min-h-[75px]"
									placeholder="Mô tả bằng tiếng Việt..."
									{...register("descriptionVn")}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Mô tả (EN)</Label>
								<Textarea
									className="min-h-[75px]"
									placeholder="Mô tả bằng tiếng Anh..."
									{...register("descriptionEng")}
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor={`p-images-${product.pk}`}>
								Hình ảnh sản phẩm (Tải lên thêm)
							</Label>
							<label
								htmlFor={`p-images-${product.pk}`}
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input p-3 text-sm text-muted-foreground hover:bg-accent/50"
							>
								<ImagePlus className="h-4 w-4" />
								Chọn ảnh mới để tải lên
							</label>
							<input
								id={`p-images-${product.pk}`}
								type="file"
								accept="image/*"
								multiple
								className="hidden"
								onChange={handleImageChange}
							/>

							{product.productImageResponses &&
								product.productImageResponses.length > 0 && (
									<div className="pt-2">
										<span className="text-xs text-muted-foreground block mb-2 font-medium">
											Hình ảnh hiện tại ({product.productImageResponses.length}):
										</span>
										<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
											{product.productImageResponses.map((img, index) => (
												<div
													key={`exist-${img.pk || index}`}
													className="aspect-square overflow-hidden rounded-md border opacity-80"
												>
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={img.url}
														alt={`Ảnh hiện tại ${index + 1}`}
														className="h-full w-full object-cover"
													/>
												</div>
											))}
										</div>
									</div>
								)}

							{images.length > 0 && (
								<div className="pt-2">
									<span className="text-xs text-muted-foreground block mb-2 font-medium">
										Ảnh mới sẽ thêm ({images.length}):
									</span>
									<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
										{images.map((img, index) => (
											<div
												key={img.previewUrl}
												className="group relative aspect-square overflow-hidden rounded-md border"
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={img.previewUrl}
													alt={`Ảnh mới ${index + 1}`}
													className="h-full w-full object-cover"
												/>
												<button
													type="button"
													onClick={() => handleRemoveImage(index)}
													className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
													aria-label="Xóa ảnh"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						<DialogFooter className="pt-2">
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
						<AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa sản phẩm{" "}
							<strong>{product.nameVn}</strong>? Hành động này không thể hoàn
							tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
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
			accessorKey: "code",
			header: "Mã SP",
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className="font-mono text-xs font-semibold bg-muted/60 text-foreground border-border/60 px-2 py-0.5"
				>
					{row.getValue("code")}
				</Badge>
			),
		},
		{
			accessorKey: "nameVn",
			header: "Sản Phẩm",
			cell: ({ row }) => {
				const product = row.original;
				const imageUrl = product.productImageResponses?.[0]?.url;
				return (
					<div className="flex items-center gap-3 max-w-[320px]">
						<div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border bg-muted/50 flex items-center justify-center shadow-2xs">
							{imageUrl ? (
								<img
									src={imageUrl}
									alt={product.nameVn}
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							) : (
								<Flower2 className="h-5 w-5 text-muted-foreground/60" />
							)}
						</div>
						<div className="flex flex-col min-w-0">
							<span
								className="font-semibold text-sm sm:text-base text-foreground truncate"
								title={product.nameVn}
							>
								{product.nameVn}
							</span>
							<span
								className="text-xs text-muted-foreground truncate"
								title={product.nameEng}
							>
								{product.nameEng}
							</span>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "price",
			header: "Giá Bán",
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("price"));
				return (
					<span className="font-bold text-sm sm:text-base tabular-nums text-foreground">
						{new Intl.NumberFormat("vi-VN", {
							style: "currency",
							currency: "VND",
						}).format(amount)}
					</span>
				);
			},
		},
		{
			accessorKey: "quantity",
			header: "Tồn Kho",
			cell: ({ row }) => {
				const qty = parseInt(row.getValue("quantity"), 10) || 0;
				if (qty === 0) {
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-destructive/15 text-destructive border border-destructive/20">
							Hết hàng
						</span>
					);
				}
				if (qty < 10) {
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
							{qty} (Sắp hết)
						</span>
					);
				}
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
						{qty}
					</span>
				);
			},
		},
		{
			accessorKey: "sales",
			header: "Đã Bán",
			cell: ({ row }) => (
				<span className="text-sm font-medium text-muted-foreground">{row.getValue("sales") || 0}</span>
			),
		},
		{
			accessorKey: "available",
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
