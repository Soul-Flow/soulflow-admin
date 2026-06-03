"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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

export function CreateProductDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<PlusCircle className="h-4 w-4" />
					Thêm Sản Phẩm Mới
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-screen">
				<DialogHeader>
					<DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
					<DialogDescription>
						Điền thông tin chi tiết để thêm sản phẩm mới vào hệ thống.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4 mt-4">
					<div className="grid gap-2">
						<Label>Tên Sản Phẩm</Label>
						<Input placeholder="VD: Hoa Hồng Đỏ..." />
					</div>
					<div className="grid gap-2">
						<Label>Giá (VNĐ)</Label>
						<Input type="number" placeholder="VD: 350000" />
					</div>
					<div className="grid gap-2">
						<Label>Số lượng (Tồn kho)</Label>
						<Input type="number" placeholder="VD: 50" />
					</div>
					<div className="grid gap-2">
						<Label>Danh mục</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Chọn danh mục" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="c1">Hoa bó</SelectItem>
								<SelectItem value="c2">Hoa lẵng</SelectItem>
								<SelectItem value="c3">Hoa khai trương</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="pt-4 flex justify-end gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Hủy
						</Button>
						<Button onClick={() => setOpen(false)}>Thêm Sản Phẩm</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
