"use client";

import { Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { columns } from "./columns";
import { CreateUserDialog } from "./create-user-dialog";
import type { UserResponse } from "./user.dto";

// ─── Dummy data — thay bằng API call sau ────────────────────────────────────────

const data: UserResponse[] = [
	{
		id: "USR-001",
		username: "admin_hoa",
		fullname: "Nguyễn Thị Hoa",
		email: "hoa.nguyen@flowershop.com",
		role: "admin",
		status: "active",
	},
	{
		id: "USR-002",
		username: "tuan_manager",
		fullname: "Trần Văn Tuấn",
		email: "tuan.tran@flowershop.com",
		role: "admin",
		status: "active",
	},
	{
		id: "USR-003",
		username: "mai_le",
		fullname: "Lê Thị Mai",
		email: "mai.le@gmail.com",
		role: "customer",
		status: "active",
	},
	{
		id: "USR-004",
		username: "hung_pham",
		fullname: "Phạm Quốc Hùng",
		email: "hung.pham@yahoo.com",
		role: "customer",
		status: "active",
	},
	{
		id: "USR-005",
		username: "linh_do",
		fullname: "Đỗ Thùy Linh",
		email: "linh.do@outlook.com",
		role: "customer",
		status: "locked",
	},
	{
		id: "USR-006",
		username: "bao_vu",
		fullname: "Vũ Thanh Bảo",
		email: "bao.vu@gmail.com",
		role: "customer",
		status: "active",
	},
	{
		id: "USR-007",
		username: "an_hoang",
		fullname: "Hoàng Văn An",
		email: "an.hoang@gmail.com",
		role: "customer",
		status: "locked",
	},
	{
		id: "USR-008",
		username: "ngoc_bui",
		fullname: "Bùi Ngọc Ánh",
		email: "ngoc.bui@gmail.com",
		role: "customer",
		status: "active",
	},
	{
		id: "USR-009",
		username: "tan_huy",
		fullname: "Mai Tấn Huy",
		email: "huy.mai@gmail.com",
		role: "admin",
		status: "active",
	},
	{
		id: "USR-010",
		username: "anh_tuan",
		fullname: "Bùi Anh Tuấn",
		email: "tuan.anh@gmail.com",
		role: "customer",
		status: "locked",
	},
];

// ─── Page component ─────────────────────────────────────────────────────────────

export default function UsersPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Quản lý Người Dùng
					</h1>
					<p className="text-muted-foreground text-sm">
						Xem thông tin, khóa/mở khóa tài khoản người dùng trên hệ thống.
					</p>
				</div>
				<CreateUserDialog />
			</div>

			<div className="flex flex-col gap-4 mt-6">
				{/* Bộ lọc (Filters) */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1 md:w-1/3 md:flex-none">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Tìm theo tên hoặc email..." className="pl-8" />
					</div>
				</div>

				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
