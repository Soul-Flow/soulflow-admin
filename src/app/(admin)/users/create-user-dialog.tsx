"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
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
import { RoleCode } from "@/enums/role-code.enum";
import useAccountStore from "@/stores/accountStore";

const userSchema = z.object({
	username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
	fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
	email: z.string().email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	phone: z.string().optional(),
	address: z.string().optional(),
	role: z.nativeEnum(RoleCode),
});

type UserFormValues = z.infer<typeof userSchema>;

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

interface CreateUserDialogProps {
	onCreated?: () => void;
}

export function CreateUserDialog({ onCreated }: CreateUserDialogProps) {
	const [open, setOpen] = useState(false);
	const [photo, setPhoto] = useState<File | null>(null);
	const [photoError, setPhotoError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { save } = useAccountStore();

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			username: "",
			fullname: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			role: RoleCode.USER,
		},
	});

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (!file) {
			setPhoto(null);
			setPhotoError(null);
			return;
		}
		if (!file.type.startsWith("image/")) {
			setPhotoError("Vui lòng chọn một file hình ảnh.");
			setPhoto(null);
			return;
		}
		if (file.size > MAX_PHOTO_SIZE) {
			setPhotoError("Kích thước ảnh tối đa là 5MB.");
			setPhoto(null);
			return;
		}
		setPhotoError(null);
		setPhoto(file);
	};

	const resetPhoto = () => {
		setPhoto(null);
		setPhotoError(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const onSubmit = async (data: UserFormValues) => {
		try {
			await save(
				{
					pk: null,
					username: data.username,
					password: data.password,
					fullname: data.fullname,
					email: data.email,
					photo: null,
					phone: data.phone ?? null,
					address: data.address ?? null,
					disabled: false,
					roleRequest: { code: data.role },
				},
				photo ?? new File([], ""),
			);
			toast.success("Đã tạo người dùng mới thành công!", {
				description: `Tài khoản "${data.username}" đã được thêm vào hệ thống.`,
			});
			reset();
			resetPhoto();
			setOpen(false);
			onCreated?.();
		} catch {
			toast.error("Tạo người dùng thất bại. Vui lòng thử lại.");
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			reset();
			resetPhoto();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<PlusCircle className="h-4 w-4" />
					Thêm Người Dùng Mới
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Thêm Người Dùng</DialogTitle>
					<DialogDescription>
						Tạo tài khoản mới cho nhân viên hoặc người dùng.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="u-username">Tài khoản *</Label>
						<Input id="u-username" placeholder="nguyenvana" {...register("username")} aria-invalid={!!errors.username} />
						{errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="u-fullname">Họ tên *</Label>
						<Input id="u-fullname" placeholder="Nguyễn Văn A" {...register("fullname")} aria-invalid={!!errors.fullname} />
						{errors.fullname && <p className="text-xs text-destructive">{errors.fullname.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="u-email">Email *</Label>
						<Input id="u-email" type="email" placeholder="a@example.com" {...register("email")} aria-invalid={!!errors.email} />
						{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="u-password">Mật khẩu *</Label>
						<Input id="u-password" type="password" placeholder="••••••" {...register("password")} aria-invalid={!!errors.password} />
						{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="u-phone">Điện thoại</Label>
						<Input id="u-phone" placeholder="0901234567" {...register("phone")} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="u-address">Địa chỉ</Label>
						<Input id="u-address" placeholder="123 Đường ABC, TP.HCM" {...register("address")} />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="u-photo">Ảnh đại diện</Label>
						<Input
							id="u-photo"
							type="file"
							accept="image/*"
							ref={fileInputRef}
							onChange={handlePhotoChange}
						/>
						{photo && (
							<p className="text-xs text-muted-foreground">Đã chọn: {photo.name}</p>
						)}
						{photoError && <p className="text-xs text-destructive">{photoError}</p>}
					</div>
					<div className="grid gap-2">
						<Label>Vai trò *</Label>
						<Select
							defaultValue={RoleCode.USER}
							onValueChange={(v) => setValue("role", v as RoleCode)}>
							<SelectTrigger>
								<SelectValue placeholder="Chọn vai trò" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={RoleCode.ADMIN}>Quản trị viên (Admin)</SelectItem>
								<SelectItem value={RoleCode.USER}>Người dùng (User)</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
							Hủy
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Đang lưu..." : "Thêm Người Dùng"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}