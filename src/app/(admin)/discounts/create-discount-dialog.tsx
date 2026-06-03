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

const discountSchema = z.object({
	code: z
		.string()
		.min(3, "Mã giảm giá phải có ít nhất 3 ký tự")
		.max(20, "Mã giảm giá tối đa 20 ký tự"),
	description: z.string().min(1, "Mô tả là bắt buộc"),
	discountPercent: z
		.number({ message: "Phần trăm giảm giá phải là số" })
		.min(1, "Phần trăm giảm giá tối thiểu là 1%")
		.max(100, "Phần trăm giảm giá tối đa là 100%"),
	minOrderAmount: z
		.number({ message: "Giá trị đơn tối thiểu phải là số" })
		.min(0, "Giá trị đơn tối thiểu không được âm"),
	startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
	endDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

export function CreateDiscountDialog() {
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<DiscountFormValues>({
		resolver: zodResolver(discountSchema),
		defaultValues: {
			code: "",
			description: "",
			discountPercent: 0,
			minOrderAmount: 0,
			startDate: "",
			endDate: "",
		},
	});

	const onSubmit = (data: DiscountFormValues) => {
		const upperCode = data.code.toUpperCase();
		console.log("Creating discount:", { ...data, code: upperCode });
		toast.success("Đã tạo mã giảm giá mới thành công!", {
			description: `Mã "${upperCode}" - Giảm ${data.discountPercent}% đã được thêm vào hệ thống.`,
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
					Thêm Mã Giảm Giá
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Tạo Mã Giảm Giá Mới</DialogTitle>
					<DialogDescription>
						Điền thông tin mã giảm giá bên dưới. Nhấn lưu khi hoàn tất.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="create-code">Mã giảm giá *</Label>
							<Input
								id="create-code"
								type="text"
								placeholder="VD: SUMMER2025"
								{...register("code")}
								aria-invalid={!!errors.code}
							/>
							{errors.code && (
								<p className="text-xs text-destructive">
									{errors.code.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="create-description">Mô tả *</Label>
							<Input
								id="create-description"
								type="text"
								placeholder="VD: Giảm giá mùa hè"
								{...register("description")}
								aria-invalid={!!errors.description}
							/>
							{errors.description && (
								<p className="text-xs text-destructive">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="create-discountPercent">Giảm giá (%) *</Label>
							<Input
								id="create-discountPercent"
								type="number"
								placeholder="VD: 15"
								{...register("discountPercent", { valueAsNumber: true })}
								aria-invalid={!!errors.discountPercent}
							/>
							{errors.discountPercent && (
								<p className="text-xs text-destructive">
									{errors.discountPercent.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="create-minOrderAmount">
								Đơn tối thiểu (VND) *
							</Label>
							<Input
								id="create-minOrderAmount"
								type="number"
								placeholder="VD: 500000"
								{...register("minOrderAmount", { valueAsNumber: true })}
								aria-invalid={!!errors.minOrderAmount}
							/>
							{errors.minOrderAmount && (
								<p className="text-xs text-destructive">
									{errors.minOrderAmount.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="create-startDate">Ngày bắt đầu *</Label>
							<Input
								id="create-startDate"
								type="date"
								{...register("startDate")}
								aria-invalid={!!errors.startDate}
							/>
							{errors.startDate && (
								<p className="text-xs text-destructive">
									{errors.startDate.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="create-endDate">Ngày kết thúc *</Label>
							<Input
								id="create-endDate"
								type="date"
								{...register("endDate")}
								aria-invalid={!!errors.endDate}
							/>
							{errors.endDate && (
								<p className="text-xs text-destructive">
									{errors.endDate.message}
								</p>
							)}
						</div>
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
							{isSubmitting ? "Đang lưu..." : "Lưu mã giảm giá"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
