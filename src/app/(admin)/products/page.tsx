"use client";

import { Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { columns, type Product } from "./columns";
import { CreateProductDialog } from "./create-product-dialog";

// Dummy data
const data: Product[] = [
	{
		id: "PROD-001",
		nameVn: "Hoa Hồng Đỏ Bó Tròn",
		price: 350000,
		quantity: 45,
		available: true,
	},
	{
		id: "PROD-002",
		nameVn: "Giỏ Hoa Hướng Dương",
		price: 420000,
		quantity: 8,
		available: true,
	}, // Cảnh báo < 10
	{
		id: "PROD-003",
		nameVn: "Lan Hồ Điệp Trắng",
		price: 1200000,
		quantity: 15,
		available: true,
	},
	{
		id: "PROD-004",
		nameVn: "Hoa Tulip Nhập Khẩu",
		price: 850000,
		quantity: 0,
		available: false,
	},
	{
		id: "PROD-005",
		nameVn: "Kệ Hoa Khai Trương",
		price: 1500000,
		quantity: 5,
		available: true,
	},
];

export default function ProductsPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Quản lý Sản Phẩm
					</h1>
					<p className="text-muted-foreground text-sm">
						Thêm, sửa, xóa và quản lý kho hoa của bạn.
					</p>
				</div>
				<CreateProductDialog />
			</div>

			<div className="flex flex-col gap-4 mt-6">
				{/* Bộ lọc (Filters) */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1 md:w-1/3 md:flex-none">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Tìm theo tên sản phẩm..." className="pl-8" />
					</div>
					<Select defaultValue="all">
						<SelectTrigger className="w-45">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả trạng thái</SelectItem>
							<SelectItem value="active">Đang kinh doanh</SelectItem>
							<SelectItem value="inactive">Tạm ngưng</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
