"use client";

import { Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { columns } from "./columns";
import { CreateDiscountDialog } from "./create-discount-dialog";

import type { DiscountResponse } from "./discount.dto";

const data: DiscountResponse[] = [
	{
		id: "DC-001",
		code: "SUMMER2025",
		description: "Giảm giá mùa hè 2025",
		discountPercent: 15,
		minOrderAmount: 500000,
		startDate: "01/06/2025",
		endDate: "31/08/2025",
		status: "active",
	},
	{
		id: "DC-002",
		code: "WELCOME10",
		description: "Ưu đãi khách hàng mới",
		discountPercent: 10,
		minOrderAmount: 200000,
		startDate: "01/01/2025",
		endDate: "31/12/2025",
		status: "active",
	},
	{
		id: "DC-003",
		code: "TET2025",
		description: "Khuyến mãi Tết Nguyên Đán",
		discountPercent: 25,
		minOrderAmount: 1000000,
		startDate: "15/01/2025",
		endDate: "15/02/2025",
		status: "expired",
	},
	{
		id: "DC-004",
		code: "VALENTINE",
		description: "Giảm giá Valentine",
		discountPercent: 20,
		minOrderAmount: 300000,
		startDate: "10/02/2025",
		endDate: "15/02/2025",
		status: "expired",
	},
	{
		id: "DC-005",
		code: "AUTUMN25",
		description: "Ưu đãi mùa thu",
		discountPercent: 12,
		minOrderAmount: 400000,
		startDate: "01/09/2025",
		endDate: "30/11/2025",
		status: "upcoming",
	},
	{
		id: "DC-006",
		code: "XMAS2025",
		description: "Giảm giá Giáng sinh",
		discountPercent: 30,
		minOrderAmount: 800000,
		startDate: "20/12/2025",
		endDate: "26/12/2025",
		status: "upcoming",
	},
];

export default function DiscountsPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Quản lý Khuyến Mãi
					</h1>
					<p className="text-muted-foreground text-sm">
						Tạo, chỉnh sửa và quản lý các mã giảm giá cho cửa hàng.
					</p>
				</div>
				<CreateDiscountDialog />
			</div>

			<div className="flex flex-col gap-4 mt-6">
				{/* Bộ lọc (Filters) */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1 md:w-1/3 md:flex-none">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Tìm theo mã giảm giá..." className="pl-8" />
					</div>
				</div>

				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
