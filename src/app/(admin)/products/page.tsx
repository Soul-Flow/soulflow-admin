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
	{
		id: "PROD-006",
		nameVn: "Bó Hoa Hướng Dương Mix Baby",
		price: 300000,
		quantity: 20,
		available: true,
	},
	{
		id: "PROD-007",
		nameVn: "Giỏ Hoa Hồng Vàng Tươi Sáng",
		price: 550000,
		quantity: 12,
		available: true,
	},
	{
		id: "PROD-008",
		nameVn: "Bó Hoa Cẩm Chướng Đỏ",
		price: 250000,
		quantity: 30,
		available: true,
	},
	{
		id: "PROD-009",
		nameVn: "Giỏ Hoa Mẫu Đơn Sang Trọng",
		price: 1500000,
		quantity: 5,
		available: true, // Cảnh báo < 10
	},
	{
		id: "PROD-010",
		nameVn: "Bó Hoa Cúc Họa Mi Tiết Trời Thu",
		price: 200000,
		quantity: 50,
		available: true,
	},
	{
		id: "PROD-011",
		nameVn: "Giỏ Hoa Đồng Tiền Chúc Mừng",
		price: 400000,
		quantity: 18,
		available: true,
	},
	{
		id: "PROD-012",
		nameVn: "Bó Hoa Tulip Hồng Ngọt Ngào",
		price: 850000,
		quantity: 0,
		available: false,
	},
	{
		id: "PROD-013",
		nameVn: "Giỏ Hoa Cát Tường Đa Sắc",
		price: 450000,
		quantity: 25,
		available: true,
	},
	{
		id: "PROD-014",
		nameVn: "Bó Hoa Thạch Thảo Tím Mộng Mơ",
		price: 180000,
		quantity: 40,
		available: true,
	},
	{
		id: "PROD-015",
		nameVn: "Giỏ Hoa Khai Trương Tông Đỏ Vàng",
		price: 1200000,
		quantity: 8,
		available: true, // Cảnh báo < 10
	},
	{
		id: "PROD-016",
		nameVn: "Bó Hoa Baby Trắng Tinh Khôi",
		price: 350000,
		quantity: 60,
		available: true,
	},
	{
		id: "PROD-017",
		nameVn: "Giỏ Hoa Hướng Dương Gắn Kết",
		price: 600000,
		quantity: 15,
		available: true,
	},
	{
		id: "PROD-018",
		nameVn: "Bó Hoa Baby Xanh Dương Khổng Lồ",
		price: 400000,
		quantity: 22,
		available: true,
	},
	{
		id: "PROD-019",
		nameVn: "Giỏ Hoa Ly Trắng Thanh Lịch",
		price: 750000,
		quantity: 10,
		available: true,
	},
	{
		id: "PROD-020",
		nameVn: "Bó Hoa Lan Hồ Điệp Cắt Cành",
		price: 900000,
		quantity: 4,
		available: true, // Cảnh báo < 10
	},
	{
		id: "PROD-021",
		nameVn: "Giỏ Hoa Hồng Cam Cổ Điển",
		price: 650000,
		quantity: 14,
		available: true,
	},
	{
		id: "PROD-022",
		nameVn: "Bó Hoa Cẩm Tú Cầu Xanh Mát",
		price: 280000,
		quantity: 35,
		available: true,
	},
	{
		id: "PROD-023",
		nameVn: "Giỏ Hoa Hồng Dâu Ngọt Ngào",
		price: 720000,
		quantity: 0,
		available: false,
	},
	{
		id: "PROD-024",
		nameVn: "Bó Hoa Cúc Tana Vintage",
		price: 220000,
		quantity: 45,
		available: true,
	},
	{
		id: "PROD-025",
		nameVn: "Giỏ Hoa Kỷ Niệm Tông Đỏ",
		price: 800000,
		quantity: 20,
		available: true,
	},
	{
		id: "PROD-026",
		nameVn: "Bó Hoa Sáp Thơm Lưu Hương",
		price: 300000,
		quantity: 100,
		available: true,
	},
	{
		id: "PROD-027",
		nameVn: "Giỏ Hoa Sen Trắng Truyền Thống",
		price: 500000,
		quantity: 12,
		available: true,
	},
	{
		id: "PROD-028",
		nameVn: "Bó Hoa Hồng Tỉ Muội",
		price: 150000,
		quantity: 55,
		available: true,
	},
	{
		id: "PROD-029",
		nameVn: "Giỏ Hoa Lan Vũ Nữ Sang Trọng",
		price: 950000,
		quantity: 7,
		available: true, // Cảnh báo < 10
	},
	{
		id: "PROD-030",
		nameVn: "Bó Hoa Mix Tổng Hợp Theo Mùa",
		price: 400000,
		quantity: 30,
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
