"use client";

import { Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { columns } from "./columns";
import type { CommentResponse } from "./comment.dto";

const data: CommentResponse[] = [
	{
		id: "CMT-001",
		productName: "Hoa Hồng Đỏ Bó Tròn",
		customerName: "Nguyễn Thị Mai",
		content: "Hoa rất đẹp, tươi lâu, giao hàng nhanh. Sẽ ủng hộ tiếp!",
		rating: 5,
		createdAt: "01/06/2025",
		hidden: false,
	},
	{
		id: "CMT-002",
		productName: "Giỏ Hoa Hướng Dương",
		customerName: "Trần Văn Hùng",
		content: "Giỏ hoa đẹp nhưng giao hơi chậm so với dự kiến.",
		rating: 3,
		createdAt: "01/06/2025",
		hidden: false,
	},
	{
		id: "CMT-003",
		productName: "Lan Hồ Điệp Trắng",
		customerName: "Lê Thị Hương",
		content: "Lan rất đẹp, cây khỏe mạnh. Đóng gói cẩn thận, rất hài lòng.",
		rating: 5,
		createdAt: "31/05/2025",
		hidden: false,
	},
	{
		id: "CMT-004",
		productName: "Kệ Hoa Khai Trương",
		customerName: "Phạm Quốc Bảo",
		content: "Kệ hoa hoành tráng, đối tác rất thích. Giá hợp lý.",
		rating: 4,
		createdAt: "30/05/2025",
		hidden: false,
	},
	{
		id: "CMT-005",
		productName: "Hoa Tulip Nhập Khẩu",
		customerName: "Hoàng Minh Tú",
		content: "Hoa héo nhanh quá, chỉ được 2 ngày. Thất vọng!",
		rating: 1,
		createdAt: "29/05/2025",
		hidden: true,
	},
	{
		id: "CMT-006",
		productName: "Bó Hoa Sinh Nhật",
		customerName: "Đặng Thùy Linh",
		content: "Bó hoa xinh xắn, người nhận rất vui. Cảm ơn shop!",
		rating: 5,
		createdAt: "28/05/2025",
		hidden: false,
	},
	{
		id: "CMT-007",
		productName: "Hoa Cúc Đại Đóa",
		customerName: "Vũ Thanh Sơn",
		content: "Spam quảng cáo, không liên quan đến sản phẩm.",
		rating: 1,
		createdAt: "27/05/2025",
		hidden: true,
	},
	{
		id: "CMT-008",
		productName: "Giỏ Hoa Chúc Mừng",
		customerName: "Bùi Ngọc Ánh",
		content: "Giỏ hoa rất sang trọng, phù hợp tặng sếp. Giao đúng hẹn.",
		rating: 4,
		createdAt: "26/05/2025",
		hidden: false,
	},
];

export default function CommentsPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Quản lý Bình Luận
					</h1>
					<p className="text-muted-foreground text-sm">
						Xem, kiểm duyệt và quản lý bình luận của khách hàng.
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-6">
				{/* Bộ lọc (Filters) */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1 md:w-1/3 md:flex-none">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm theo tên khách hàng hoặc sản phẩm..."
							className="pl-8"
						/>
					</div>
				</div>

				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
