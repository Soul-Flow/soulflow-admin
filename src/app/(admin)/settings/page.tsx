"use client";

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

export default function SettingsPage() {
	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h1>
				<p className="text-muted-foreground text-sm">
					Quản lý các thông số và thiết lập chung của cửa hàng.
				</p>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Cửa hàng</CardTitle>
						<CardDescription>
							Thông tin chung hiển thị trên website.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="storeName">Tên cửa hàng</Label>
								<Input id="storeName" defaultValue="FlowerShop" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Số điện thoại liên hệ</Label>
								<Input id="phone" defaultValue="0987654321" />
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="address">Địa chỉ</Label>
								<Input
									id="address"
									defaultValue="123 Đường Hoa, Phường 1, Quận 1, TP.HCM"
								/>
							</div>
						</div>
						<Button>Lưu cài đặt</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Cấu hình phí vận chuyển</CardTitle>
						<CardDescription>Thiết lập phí giao hàng mặc định.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="shippingFee">Phí vận chuyển cơ bản (VNĐ)</Label>
								<Input id="shippingFee" type="number" defaultValue="30000" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="freeShipping">
									Miễn phí vận chuyển từ (VNĐ)
								</Label>
								<Input id="freeShipping" type="number" defaultValue="500000" />
							</div>
						</div>
						<Button>Cập nhật phí</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
