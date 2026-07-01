"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import useCategoryStore from "@/stores/categoryStore";

const categorySchema = z.object({
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

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CreateCategoryDialogProps {
	onCreated?: () => void;
}

export function CreateCategoryDialog({ onCreated }: CreateCategoryDialogProps) {
	const [open, setOpen] = useState(false);
	const { save } = useCategoryStore();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			nameVn: "",
			nameEng: "",
			descriptionVn: "",
			descriptionEng: "",
		},
	});

	const onSubmit = async (data: CategoryFormValues) => {
		try {
			await save({
				nameVn: data.nameVn,
				nameEng: data.nameEng,
				descriptionVn: data.descriptionVn ?? "",
				descriptionEng: data.descriptionEng ?? "",
			});
			toast.success("Đã tạo danh mục mới thành công!", {
				description: `Danh mục "${data.nameVn}" đã được thêm vào hệ thống.`,
			});
			reset();
			setOpen(false);
			onCreated?.();
		} catch {
			toast.error("Tạo danh mục thất bại. Vui lòng thử lại.");
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<PlusCircle className="h-4 w-4" />
					Thêm Danh Mục
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Tạo Danh Mục Mới</DialogTitle>
					<DialogDescription>
						Điền thông tin danh mục sản phẩm bên dưới. Nhấn lưu khi hoàn tất.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
					<div className="grid gap-2">
						<Label htmlFor="create-nameVn">Tên tiếng Việt *</Label>
						<Input
							id="create-nameVn"
							placeholder="VD: Hoa Tươi"
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
						<Label htmlFor="create-nameEng">Tên tiếng Anh *</Label>
						<Input
							id="create-nameEng"
							placeholder="VD: Fresh Flowers"
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
						<Label htmlFor="create-descriptionVn">Mô tả tiếng Anh *</Label>
						<Textarea
							id="create-descriptionEng"
							placeholder="Enter category description..."
							rows={3}
							{...register("descriptionEng")}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="create-descriptionVn">Mô tả tiếng Việt *</Label>
						<Textarea
							id="create-descriptionVn"
							placeholder="Nhập mô tả ngắn về danh mục..."
							rows={3}
							{...register("descriptionVn")}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Hủy bỏ
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang lưu..." : "Lưu danh mục"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
