"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Hồ sơ của tôi</h1>
				<p className="text-muted-foreground text-sm">
					Quản lý thông tin cá nhân và bảo mật tài khoản.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Thông tin cá nhân</CardTitle>
						<CardDescription>
							Cập nhật tên và ảnh đại diện của bạn.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src="" alt="Admin" />
								<AvatarFallback className="text-xl">AD</AvatarFallback>
							</Avatar>
							<Button variant="outline">Đổi ảnh</Button>
						</div>
						<div className="space-y-2">
							<Label htmlFor="fullname">Họ và tên</Label>
							<Input id="fullname" defaultValue="Admin Hoa" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								defaultValue="admin@flowershop.com"
								disabled
							/>
						</div>
						<Button>Lưu thay đổi</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Đổi mật khẩu</CardTitle>
						<CardDescription>
							Đảm bảo tài khoản của bạn sử dụng mật khẩu mạnh.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="current">Mật khẩu hiện tại</Label>
							<Input id="current" type="password" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="new">Mật khẩu mới</Label>
							<Input id="new" type="password" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
							<Input id="confirm" type="password" />
						</div>
						<Button>Cập nhật mật khẩu</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
