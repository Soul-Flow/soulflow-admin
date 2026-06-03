"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";
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

export function CreateUserDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right">
							Tài khoản
						</Label>
						<Input
							id="username"
							placeholder="nguyenvana"
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="fullname" className="text-right">
							Họ tên
						</Label>
						<Input
							id="fullname"
							placeholder="Nguyễn Văn A"
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="email" className="text-right">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="a@example.com"
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="password" className="text-right">
							Mật khẩu
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="***"
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="role" className="text-right">
							Vai trò
						</Label>
						<div className="col-span-3">
							<Select defaultValue="customer">
								<SelectTrigger>
									<SelectValue placeholder="Chọn vai trò" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
									<SelectItem value="customer">
										Khách hàng (Customer)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Hủy
					</Button>
					<Button onClick={() => setOpen(false)}>Thêm Người Dùng</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
