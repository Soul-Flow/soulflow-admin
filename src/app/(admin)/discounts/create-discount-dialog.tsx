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
import useDiscountStore from "@/stores/discountStore";

const discountSchema = z.object({
	code: z.string().optional(),
	descriptionVn: z.string().min(1, "Mô tả tiếng Việt là bắt buộc"),
	descriptionEng: z.string().optional(),
	percentage: z
		.number({ message: "Phần trăm giảm giá phải là số" })
		.min(1, "Tối thiểu 1%")
		.max(100, "Tối đa 100%"),
	minOrderAmount: z.number({ message: "Bắt buộc nhập và phải là số" }).min(0, "Không được nhỏ hơn 0"),
	usageLimit: z.number({ message: "Bắt buộc nhập và phải là số" }).min(1, "Tối thiểu 1 lượt"),
	expiredDate: z.string().min(1, "Ngày hết hạn là bắt buộc"),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

interface CreateDiscountDialogProps {
	onCreated?: () => void;
}

export function CreateDiscountDialog({ onCreated }: CreateDiscountDialogProps) {
	const [open, setOpen] = useState(false);
	const { save } = useDiscountStore();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<DiscountFormValues>({
		resolver: zodResolver(discountSchema),
		defaultValues: {
			descriptionVn: "",
			descriptionEng: "",
			percentage: 0,
			minOrderAmount: 0,
			usageLimit: 999999,
			expiredDate: "",
		},
	});

	const onSubmit = async (data: DiscountFormValues) => {
		try {
			// Backend cần LocalDateTime nên phải thêm giờ vào cuối chuỗi YYYY-MM-DD
			const formattedExpiredDate = data.expiredDate
				? (data.expiredDate.length === 10 ? `${data.expiredDate}T23:59:59` : data.expiredDate)
				: "";

			await save({
				code: data.code,
				percentage: data.percentage,
				minOrderAmount: data.minOrderAmount,
				usageLimit: data.usageLimit,
				descriptionVn: data.descriptionVn,
				descriptionEng: data.descriptionEng ?? data.descriptionVn,
				expiredDate: formattedExpiredDate,
				productRequests: [],
			});
			toast.success("Đã tạo mã giảm giá mới thành công!", {
				description: `Giảm ${data.percentage}% đã được thêm vào hệ thống.`,
			});
			reset();
			setOpen(false);
			onCreated?.();
		} catch {
			toast.error("Tạo mã giảm giá thất bại. Vui lòng thử lại.");
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) reset();
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
					<div className="grid gap-2">
						<Label htmlFor="d-code">Mã Khuyến Mãi</Label>
						<Input
							id="d-code"
							placeholder="VD: SUMMER10 (Bỏ trống sẽ tạo ngẫu nhiên)"
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
						<Label htmlFor="d-descVn">Mô tả (VN) *</Label>
						<Input
							id="d-descVn"
							placeholder="VD: Giảm giá mùa hè"
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
						<Label htmlFor="d-descEng">Mô tả (EN)</Label>
						<Input
							id="d-descEng"
							placeholder="VD: Summer discount"
							{...register("descriptionEng")}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="d-minOrderAmount">Đơn tối thiểu (VNĐ) *</Label>
							<Input
								id="d-minOrderAmount"
								type="number"
								placeholder="VD: 100000"
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
							<Label htmlFor="d-usageLimit">Số lượt dùng tối đa *</Label>
							<Input
								id="d-usageLimit"
								type="number"
								placeholder="VD: 100"
								{...register("usageLimit", { valueAsNumber: true })}
								aria-invalid={!!errors.usageLimit}
							/>
							{errors.usageLimit && (
								<p className="text-xs text-destructive">
									{errors.usageLimit.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="d-percentage">Phần trăm giảm (%) *</Label>
						<Input
							id="d-percentage"
							type="number"
							placeholder="VD: 15"
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
						<Label htmlFor="d-expiredDate">Ngày hết hạn *</Label>
						<Input
							id="d-expiredDate"
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
