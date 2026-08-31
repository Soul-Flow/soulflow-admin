"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SortOrder } from "@/enums/sort-order.enum";
import type { CategoryResponse } from "@/interfaces/responses/category-response.interface";
import useCategoryStore from "@/stores/categoryStore";
import useProductStore from "@/stores/productStore";

const productSchema = z.object({
	nameVn: z.string().min(1, "Tên tiếng Việt là bắt buộc"),
	nameEng: z.string().min(1, "Tên tiếng Anh là bắt buộc"),
	descriptionVn: z.string().optional(),
	descriptionEng: z.string().optional(),
	price: z.number({ message: "Giá phải là số" }).min(0, "Giá không được âm"),
	quantity: z.number({ message: "Số lượng phải là số" }).min(0),
	categoryPk: z.number({ message: "Danh mục là bắt buộc" }).min(1),
	customised: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface CreateProductDialogProps {
	onCreated?: () => void;
}

interface ImagePreview {
	file: File;
	previewUrl: string;
}

export function CreateProductDialog({ onCreated }: CreateProductDialogProps) {
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [images, setImages] = useState<ImagePreview[]>([]);
	const { save } = useProductStore();
	const { filter: filterCategory } = useCategoryStore();

	useEffect(() => {
		if (open) {
			filterCategory({
				keyword: null,
				deleted: false,
				sortOrder: SortOrder.DESC,
				pageNumber: 0,
				pageSize: 100,
			}).then((page) => setCategories(page?.content ?? []));
		}
	}, [open, filterCategory]);

	// Clean up object URLs when they're replaced or the component unmounts,
	// to avoid leaking memory from createObjectURL.
	useEffect(() => {
		return () => {
			images.forEach((img) => {
				URL.revokeObjectURL(img.previewUrl);
			});
		};
	}, [images]);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			nameVn: "",
			nameEng: "",
			descriptionVn: "",
			descriptionEng: "",
			price: 0,
			quantity: 0,
			categoryPk: 0,
			customised: false,
		},
	});

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

		// Reset the input value so selecting the same file again still fires onChange
		e.target.value = "";
	};

	const handleRemoveImage = (index: number) => {
		setImages((prev) => {
			const target = prev[index];
			if (target) URL.revokeObjectURL(target.previewUrl);
			return prev.filter((_, i) => i !== index);
		});
	};

	const onSubmit = async (data: ProductFormValues) => {
		try {
			await save(
				{
					nameVn: data.nameVn,
					nameEng: data.nameEng,
					descriptionVn: data.descriptionVn ?? "",
					descriptionEng: data.descriptionEng ?? "",
					price: data.price,
					available: true,
					quantity: data.quantity,
					categoryPk: data.categoryPk,
					customised: data.customised,
				},
				images.map((img) => img.file),
			);
			toast.success("Đã thêm sản phẩm mới thành công!", {
				description: `Sản phẩm "${data.nameVn}" đã được thêm vào hệ thống.`,
			});
			reset();
			images.forEach((img) => {
				URL.revokeObjectURL(img.previewUrl);
			});
			setImages([]);
			setOpen(false);
			onCreated?.();
		} catch {
			toast.error("Thêm sản phẩm thất bại. Vui lòng thử lại.");
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			reset();
			images.forEach((img) => {
				URL.revokeObjectURL(img.previewUrl);
			});
			setImages([]);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<PlusCircle className="h-4 w-4" />
					Thêm Sản Phẩm Mới
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
				<DialogHeader>
					<DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
					<DialogDescription>
						Điền thông tin chi tiết để thêm sản phẩm mới vào hệ thống.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="p-nameVn">Tên Sản Phẩm (VN) *</Label>
							<Input
								id="p-nameVn"
								placeholder="VD: Hoa Hồng Đỏ"
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
							<Label htmlFor="p-nameEng">Tên Sản Phẩm (EN) *</Label>
							<Input
								id="p-nameEng"
								placeholder="VD: Red Rose"
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
							<Label htmlFor="p-price">Giá (VNĐ) *</Label>
							<Input
								id="p-price"
								type="number"
								placeholder="VD: 350000"
								{...register("price", { valueAsNumber: true })}
								aria-invalid={!!errors.price}
							/>
							{errors.price && (
								<p className="text-xs text-destructive">{errors.price.message}</p>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="p-quantity">Số lượng (Tồn kho) *</Label>
							<Input
								id="p-quantity"
								type="number"
								placeholder="VD: 50"
								{...register("quantity", { valueAsNumber: true })}
								aria-invalid={!!errors.quantity}
							/>
							{errors.quantity && (
								<p className="text-xs text-destructive">
									{errors.quantity.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label>Danh mục *</Label>
							<Select onValueChange={(v) => setValue("categoryPk", Number(v))}>
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
							<Label>Thiết kế theo yêu cầu (Customised)</Label>
							<Select
								onValueChange={(v) => setValue("customised", v === "true")}
								defaultValue="false"
							>
								<SelectTrigger aria-invalid={!!errors.customised}>
									<SelectValue placeholder="Chọn loại" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="false">Mặc định (Không)</SelectItem>
									<SelectItem value="true">Cho phép (Có)</SelectItem>
								</SelectContent>
							</Select>
							{errors.customised && (
								<p className="text-xs text-destructive">
									{errors.customised.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="p-descVn">Mô tả (VN)</Label>
							<Textarea
								id="p-descVn"
								className="min-h-[75px]"
								placeholder="Mô tả sản phẩm tiếng Việt..."
								{...register("descriptionVn")}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="p-descEng">Mô tả (EN)</Label>
							<Textarea
								id="p-descEng"
								className="min-h-[75px]"
								placeholder="Mô tả sản phẩm tiếng Anh..."
								{...register("descriptionEng")}
							/>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="p-images">Hình ảnh sản phẩm</Label>
						<label
							htmlFor="p-images"
							className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input p-3 text-sm text-muted-foreground hover:bg-accent/50"
						>
							<ImagePlus className="h-4 w-4" />
							Chọn ảnh để tải lên
						</label>
						<input
							id="p-images"
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={handleImageChange}
						/>
						{images.length > 0 && (
							<div className="grid grid-cols-4 gap-2 pt-1">
								{images.map((img, index) => (
									<div
										key={img.previewUrl}
										className="group relative aspect-square overflow-hidden rounded-md border"
									>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={img.previewUrl}
											alt={`Ảnh sản phẩm ${index + 1}`}
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
						)}
					</div>

					<DialogFooter className="pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang lưu..." : "Thêm Sản Phẩm"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
