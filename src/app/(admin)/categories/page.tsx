"use client";

import { Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { type Category, columns } from "./columns";
import { CreateCategoryDialog } from "./create-category-dialog";

const data: Category[] = [
	{
		id: "CAT-001",
		nameVn: "Hoa Tươi",
		nameEn: "Fresh Flowers",
		description:
			"Các loại hoa tươi theo mùa, nhập hàng ngày từ Đà Lạt và các vùng trồng hoa trọng điểm.",
	},
	{
		id: "CAT-002",
		nameVn: "Bó Hoa",
		nameEn: "Bouquets",
		description:
			"Bó hoa được thiết kế theo chủ đề, phù hợp cho sinh nhật, kỷ niệm, và các dịp đặc biệt.",
	},
	{
		id: "CAT-003",
		nameVn: "Giỏ Hoa",
		nameEn: "Flower Baskets",
		description:
			"Giỏ hoa nghệ thuật kết hợp nhiều loại hoa, thích hợp làm quà tặng doanh nghiệp.",
	},
	{
		id: "CAT-004",
		nameVn: "Lan Hồ Điệp",
		nameEn: "Orchids",
		description:
			"Lan Hồ Điệp nhập khẩu và nội địa, nhiều màu sắc, phù hợp trang trí và làm quà.",
	},
	{
		id: "CAT-005",
		nameVn: "Kệ Hoa Khai Trương",
		nameEn: "Grand Opening Stands",
		description:
			"Kệ hoa chúc mừng khai trương, khánh thành, với thiết kế sang trọng và bắt mắt.",
	},
	{
		id: "CAT-006",
		nameVn: "Hoa Khô & Hoa Giả",
		nameEn: "Dried & Artificial Flowers",
		description:
			"Hoa khô trang trí và hoa giả cao cấp, bền đẹp theo thời gian, không cần chăm sóc.",
	},
];

export default function CategoriesPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Quản lý Danh Mục
					</h1>
					<p className="text-muted-foreground text-sm">
						Thêm, sửa, xóa và quản lý các danh mục sản phẩm hoa.
					</p>
				</div>
				<CreateCategoryDialog />
			</div>

			<div className="flex flex-col gap-4 mt-6">
				{/* Bộ lọc (Filters) */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1 md:w-1/3 md:flex-none">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Tìm theo tên danh mục..." className="pl-8" />
					</div>
				</div>

				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
