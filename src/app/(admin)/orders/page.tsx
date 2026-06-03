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
import { columns, type Order } from "./columns";

const data: Order[] = [
	{
		id: "ORD-2025001",
		customerName: "Nguyễn Văn An",
		totalAmount: 850000,
		date: "01/06/2025",
		status: "completed",
	},
	{
		id: "ORD-2025002",
		customerName: "Trần Thị Bình",
		totalAmount: 1250000,
		date: "01/06/2025",
		status: "processing",
	},
	{
		id: "ORD-2025003",
		customerName: "Lê Hoàng Cường",
		totalAmount: 420000,
		date: "31/05/2025",
		status: "pending",
	},
	{
		id: "ORD-2025004",
		customerName: "Phạm Minh Đức",
		totalAmount: 2100000,
		date: "31/05/2025",
		status: "completed",
	},
	{
		id: "ORD-2025005",
		customerName: "Hoàng Thị Em",
		totalAmount: 680000,
		date: "30/05/2025",
		status: "cancelled",
	},
	{
		id: "ORD-2025006",
		customerName: "Vũ Quốc Phong",
		totalAmount: 3500000,
		date: "30/05/2025",
		status: "processing",
	},
	{
		id: "ORD-2025007",
		customerName: "Đặng Thùy Linh",
		totalAmount: 990000,
		date: "29/05/2025",
		status: "completed",
	},
	{
		id: "ORD-2025008",
		customerName: "Bùi Thanh Hải",
		totalAmount: 1750000,
		date: "28/05/2025",
		status: "pending",
	},
];

export default function OrdersPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Quản lý Đơn Hàng
					</h1>
					<p className="text-muted-foreground text-sm">
						Theo dõi và cập nhật trạng thái các đơn hàng gần đây.
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-6">
				{/* Bộ lọc (Filters) */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1 md:w-1/3 md:flex-none">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm theo mã đơn hoặc khách hàng..."
							className="pl-8"
						/>
					</div>
					<Select defaultValue="all">
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả trạng thái</SelectItem>
							<SelectItem value="pending">Chờ xử lý</SelectItem>
							<SelectItem value="processing">Đang xử lý</SelectItem>
							<SelectItem value="completed">Hoàn thành</SelectItem>
							<SelectItem value="cancelled">Đã hủy</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
