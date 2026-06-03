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

const categorySchema = z.object({
	nameVn: z
		.string()
		.min(1, "Tên tiếng Việt là bắt buộc")
		.min(2, "Tên tiếng Việt phải có ít nhất 2 ký tự"),
	nameEn: z
		.string()
		.min(1, "Tên tiếng Anh là bắt buộc")
		.min(2, "Tên tiếng Anh phải có ít nhất 2 ký tự"),
	description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CreateCategoryDialog() {
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			nameVn: "",
			nameEn: "",
			description: "",
		},
	});

	const onSubmit = (data: CategoryFormValues) => {
		// Mock: In real app, this would call the API
		console.log("Creating category:", data);
		toast.success("Đã tạo danh mục mới thành công!", {
			description: `Danh mục "${data.nameVn}" đã được thêm vào hệ thống.`,
		});
		reset();
		setOpen(false);
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
						<Label htmlFor="create-nameEn">Tên tiếng Anh *</Label>
						<Input
							id="create-nameEn"
							placeholder="VD: Fresh Flowers"
							{...register("nameEn")}
							aria-invalid={!!errors.nameEn}
						/>
						{errors.nameEn && (
							<p className="text-xs text-destructive">
								{errors.nameEn.message}
							</p>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="create-description">Mô tả</Label>
						<Textarea
							id="create-description"
							placeholder="Nhập mô tả ngắn về danh mục..."
							rows={3}
							{...register("description")}
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
