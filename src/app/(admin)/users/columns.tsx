"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Lock, MoreHorizontal, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import type { UserResponse, UserRole, UserStatus } from "./user.dto";

// ─── Badge config cho Role ──────────────────────────────────────────────────────

const roleConfig: Record<UserRole, { label: string; className: string }> = {
	admin: {
		label: "Admin",
		className:
			"bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400",
	},
	customer: {
		label: "Khách hàng",
		className:
			"bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-400",
	},
};

// ─── Badge config cho Status ────────────────────────────────────────────────────

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
	active: {
		label: "Hoạt động",
		className:
			"bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
	},
	locked: {
		label: "Đã khóa",
		className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400",
	},
};

// ─── Action component ───────────────────────────────────────────────────────────

function ActionCell({ row }: { row: Row<UserResponse> }) {
	const user = row.original;
	const [showLockDialog, setShowLockDialog] = useState(false);
	const [showViewSheet, setShowViewSheet] = useState(false);

	const isLocked = user.status === "locked";

	const handleToggleLock = () => {
		setShowLockDialog(false);
		if (isLocked) {
			toast.success(`Đã mở khóa tài khoản "${user.fullname}" thành công!`, {
				description: "Người dùng có thể đăng nhập lại bình thường.",
			});
		} else {
			toast.success(`Đã khóa tài khoản "${user.fullname}" thành công!`, {
				description:
					"Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.",
			});
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Mở menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Hành động</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => setShowViewSheet(true)}
					>
						<Eye className="mr-2 h-4 w-4" />
						Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className={`cursor-pointer ${isLocked ? "text-emerald-600 focus:text-emerald-600" : "text-red-600 focus:text-red-600"}`}
						onSelect={() => setShowLockDialog(true)}
					>
						{isLocked ? (
							<>
								<Unlock className="mr-2 h-4 w-4" />
								Mở khóa tài khoản
							</>
						) : (
							<>
								<Lock className="mr-2 h-4 w-4" />
								Khóa tài khoản
							</>
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Người Dùng</SheetTitle>
						<SheetDescription>ID: {user.id}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Họ tên:</span>
							<span className="col-span-2 font-medium">{user.fullname}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Username:
							</span>
							<span className="col-span-2">{user.username}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Email:</span>
							<span className="col-span-2">{user.email}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">
								Vai trò:
							</span>
							<span className="col-span-2">
								<Badge
									variant="outline"
									className={roleConfig[user.role].className}
								>
									{roleConfig[user.role].label}
								</Badge>
							</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">
								Trạng thái:
							</span>
							<span className="col-span-2">
								<Badge
									variant="outline"
									className={statusConfig[user.status].className}
								>
									{statusConfig[user.status].label}
								</Badge>
							</span>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{isLocked
								? "Xác nhận mở khóa tài khoản"
								: "Xác nhận khóa tài khoản"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{isLocked ? (
								<>
									Bạn có chắc chắn muốn mở khóa tài khoản của{" "}
									<strong>{user.fullname}</strong>? Người dùng sẽ có thể đăng
									nhập và sử dụng hệ thống trở lại.
								</>
							) : (
								<>
									Bạn có chắc chắn muốn khóa tài khoản của{" "}
									<strong>{user.fullname}</strong>? Người dùng sẽ không thể đăng
									nhập cho đến khi được mở khóa.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant={isLocked ? "default" : "destructive"}
							onClick={handleToggleLock}
						>
							{isLocked ? "Mở khóa" : "Khóa tài khoản"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

// ─── Column definitions ─────────────────────────────────────────────────────────

export const columns: ColumnDef<UserResponse>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-mono text-xs font-medium">
				{row.getValue("id")}
			</span>
		),
	},
	{
		accessorKey: "username",
		header: "Username",
		cell: ({ row }) => (
			<span className="font-mono text-sm">{row.getValue("username")}</span>
		),
	},
	{
		accessorKey: "fullname",
		header: "Họ tên",
		cell: ({ row }) => (
			<span className="font-medium">{row.getValue("fullname")}</span>
		),
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.getValue("email")}</span>
		),
	},
	{
		accessorKey: "role",
		header: "Vai trò",
		cell: ({ row }) => {
			const role = row.getValue("role") as UserRole;
			const config = roleConfig[role];
			return (
				<Badge variant="outline" className={config.className}>
					{config.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => {
			const status = row.getValue("status") as UserStatus;
			const config = statusConfig[status];
			return (
				<Badge variant="outline" className={config.className}>
					{config.label}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Hành động</span>,
		cell: ({ row }) => <ActionCell row={row} />,
	},
];
