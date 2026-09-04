"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Lock, MoreHorizontal, Unlock, User } from "lucide-react";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { RoleCode } from "@/enums/role-code.enum";
import type { AccountResponse } from "@/interfaces/responses/account-response.interface";
import { formatDateTime } from "@/lib/utils";
import useAccountStore from "@/stores/accountStore";

function StatusCell({
	row,
	onMutated,
}: {
	row: Row<AccountResponse>;
	onMutated: () => void;
}) {
	const account = row.original;
	const { save } = useAccountStore();
	const isDisabled = String(account.disabled) === "true";
	const [isUpdating, setIsUpdating] = useState(false);

	const handleStatusChange = async (val: string) => {
		const newDisabledStatus = val === "true";
		setIsUpdating(true);
		try {
			await save({
				pk: Number(account.pk),
				username: account.username,
				password: null,
				fullname: account.fullname,
				email: account.email,
				photo: account.photo,
				phone: account.phone,
				address: account.address,
				disabled: newDisabledStatus,
				roleRequest: { code: account.roleResponse?.code ?? "USER" },
			});
			toast.success(
				newDisabledStatus
					? `Đã khóa tài khoản "${account.fullname}" thành công!`
					: `Đã mở khóa tài khoản "${account.fullname}" thành công!`,
			);
			onMutated();
		} catch {
			toast.error("Thao tác thất bại. Vui lòng thử lại.");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Select
			value={String(isDisabled)}
			onValueChange={handleStatusChange}
			disabled={isUpdating}
		>
			<SelectTrigger
				className={`h-7 w-[120px] text-xs font-medium ${isDisabled ? "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400"}`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="false" className="text-xs">
					Hoạt động
				</SelectItem>
				<SelectItem value="true" className="text-xs">
					Đã khóa
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function ActionCell({
	row,
	onMutated,
}: {
	row: Row<AccountResponse>;
	onMutated: () => void;
}) {
	const account = row.original;
	const { save, loading } = useAccountStore();
	const [showLockDialog, setShowLockDialog] = useState(false);
	const [showViewSheet, setShowViewSheet] = useState(false);

	const isDisabled = String(account.disabled) === "true";

	const handleToggleDisabled = async () => {
		try {
			await save({
				pk: Number(account.pk),
				username: account.username,
				password: null,
				fullname: account.fullname,
				email: account.email,
				photo: account.photo,
				phone: account.phone,
				address: account.address,
				disabled: !isDisabled,
				roleRequest: { code: account.roleResponse?.code ?? "USER" },
			});
			setShowLockDialog(false);
			toast.success(
				isDisabled
					? `Đã mở khóa tài khoản "${account.fullname}" thành công!`
					: `Đã khóa tài khoản "${account.fullname}" thành công!`,
			);
			onMutated();
		} catch {
			toast.error("Thao tác thất bại. Vui lòng thử lại.");
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
						className={`cursor-pointer ${isDisabled ? "text-emerald-600 focus:text-emerald-600" : "text-red-600 focus:text-red-600"}`}
						onSelect={() => setShowLockDialog(true)}
					>
						{isDisabled ? (
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
				<SheetContent className="overflow-y-auto w-full sm:max-w-lg md:max-w-xl p-6">
					<SheetHeader className="pb-3 border-b">
						<SheetTitle className="text-xl font-bold flex items-center gap-2">
							<User className="h-5 w-5 text-primary" />
							<span>Chi Tiết Người Dùng</span>
						</SheetTitle>
						<SheetDescription>
							PK: {account.pk} • Ngày đăng ký: {formatDateTime(account.createdDate)}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-5 space-y-4 text-sm">
						<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
							<h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider border-b pb-1.5">
								Thông tin cá nhân
							</h4>
							<div className="grid grid-cols-3 gap-2 text-xs border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Họ tên:
								</span>
								<span className="col-span-2 font-semibold text-foreground">
									{account.fullname}
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-xs border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Username:
								</span>
								<span className="col-span-2 font-mono">{account.username}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-xs border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Email:
								</span>
								<span className="col-span-2">{account.email}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-xs border-b pb-2">
								<span className="font-medium text-muted-foreground">
									Điện thoại:
								</span>
								<span className="col-span-2 font-mono">{account.phone || "-"}</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-xs">
								<span className="font-medium text-muted-foreground">
									Địa chỉ:
								</span>
								<span className="col-span-2">{account.address || "-"}</span>
							</div>
						</div>

						<div className="p-4 border rounded-xl bg-card text-card-foreground shadow-2xs space-y-3">
							<h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider border-b pb-1.5">
								Phân quyền & Trạng thái
							</h4>
							<div className="grid grid-cols-3 gap-2 text-xs border-b pb-2 items-center">
								<span className="font-medium text-muted-foreground">
									Vai trò:
								</span>
								<span className="col-span-2">
									<Badge
										variant="outline"
										className="bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400"
									>
										{account.roleResponse?.nameVn ?? account.roleResponse?.code}
									</Badge>
								</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-xs items-center">
								<span className="font-medium text-muted-foreground">
									Trạng thái:
								</span>
								<span className="col-span-2">
									{isDisabled ? (
										<Badge
											variant="outline"
											className="bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400"
										>
											Đã khóa
										</Badge>
									) : (
										<Badge
											variant="outline"
											className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400"
										>
											Hoạt động
										</Badge>
									)}
								</span>
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{isDisabled
								? "Xác nhận mở khóa tài khoản"
								: "Xác nhận khóa tài khoản"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{isDisabled ? (
								<>
									Bạn có chắc chắn muốn mở khóa tài khoản của{" "}
									<strong>{account.fullname}</strong>?
								</>
							) : (
								<>
									Bạn có chắc chắn muốn khóa tài khoản của{" "}
									<strong>{account.fullname}</strong>? Người dùng sẽ không thể
									đăng nhập cho đến khi được mở khóa.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant={isDisabled ? "default" : "destructive"}
							onClick={handleToggleDisabled}
							disabled={loading}
						>
							{loading
								? "Đang xử lý..."
								: isDisabled
									? "Mở khóa"
									: "Khóa tài khoản"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export function columns({
	onMutated,
}: {
	onMutated: () => void;
}): ColumnDef<AccountResponse>[] {
	return [
		{
			accessorKey: "pk",
			header: "Mã TK",
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className="font-mono text-xs font-semibold bg-muted/50 text-muted-foreground border-border/60 px-2 py-0.5"
				>
					#{row.getValue("pk")}
				</Badge>
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
				<span className="font-medium max-w-[150px] truncate inline-block align-middle">
					{row.getValue("fullname")}
				</span>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => (
				<span className="text-muted-foreground max-w-[200px] truncate inline-block align-middle">
					{row.getValue("email")}
				</span>
			),
		},
		{
			accessorKey: "phone",
			header: "Điện thoại",
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.getValue("phone")}</span>
			),
		},
		{
			id: "role",
			header: "Vai trò",
			cell: ({ row }) => {
				const account = row.original;
				return (
					<Badge
						variant="outline"
						className="bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400"
					>
						{account.roleResponse?.nameVn ?? account.roleResponse?.code}
					</Badge>
				);
			},
		},
		{
			accessorKey: "disabled",
			header: "Trạng thái",
			cell: ({ row }) => <StatusCell row={row} onMutated={onMutated} />,
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Hành động</span>,
			cell: ({ row }) => <ActionCell row={row} onMutated={onMutated} />,
		},
	];
}
