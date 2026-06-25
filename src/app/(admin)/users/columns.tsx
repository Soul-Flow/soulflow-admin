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
import type { AccountResponse } from "@/interfaces/responses/account-response.interface";
import useAccountStore from "@/stores/accountStore";

function ActionCell({
	row,
	onMutated,
}: { row: Row<AccountResponse>; onMutated: () => void }) {
	const account = row.original;
	const { save, loading } = useAccountStore();
	const [showLockDialog, setShowLockDialog] = useState(false);
	const [showViewSheet, setShowViewSheet] = useState(false);

	const isDisabled = account.disabled === "true" || account.disabled === true as unknown as string;

	const handleToggleDisabled = async () => {
		try {
			await save(
				{
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
				},
				new File([], ""),
			);
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
					<DropdownMenuItem className="cursor-pointer" onSelect={() => setShowViewSheet(true)}>
						<Eye className="mr-2 h-4 w-4" />
						Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className={`cursor-pointer ${isDisabled ? "text-emerald-600 focus:text-emerald-600" : "text-red-600 focus:text-red-600"}`}
						onSelect={() => setShowLockDialog(true)}
					>
						{isDisabled ? (
							<><Unlock className="mr-2 h-4 w-4" />Mở khóa tài khoản</>
						) : (
							<><Lock className="mr-2 h-4 w-4" />Khóa tài khoản</>
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Người Dùng</SheetTitle>
						<SheetDescription>PK: {account.pk}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Họ tên:</span>
							<span className="col-span-2 font-medium">{account.fullname}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Username:</span>
							<span className="col-span-2">{account.username}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Email:</span>
							<span className="col-span-2">{account.email}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Điện thoại:</span>
							<span className="col-span-2">{account.phone}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Địa chỉ:</span>
							<span className="col-span-2">{account.address}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">Ngày tạo:</span>
							<span className="col-span-2">{account.createdDate}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">Vai trò:</span>
							<span className="col-span-2">
								<Badge variant="outline" className="bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400">
									{account.roleResponse?.nameVn ?? account.roleResponse?.code}
								</Badge>
							</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">Trạng thái:</span>
							<span className="col-span-2">
								{isDisabled ? (
									<Badge variant="outline" className="bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400">
										Đã khóa
									</Badge>
								) : (
									<Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400">
										Hoạt động
									</Badge>
								)}
							</span>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{isDisabled ? "Xác nhận mở khóa tài khoản" : "Xác nhận khóa tài khoản"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{isDisabled ? (
								<>Bạn có chắc chắn muốn mở khóa tài khoản của <strong>{account.fullname}</strong>?</>
							) : (
								<>Bạn có chắc chắn muốn khóa tài khoản của <strong>{account.fullname}</strong>? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.</>
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
							{loading ? "Đang xử lý..." : isDisabled ? "Mở khóa" : "Khóa tài khoản"}
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
			header: "PK",
			cell: ({ row }) => (
				<span className="font-mono text-xs font-medium">{row.getValue("pk")}</span>
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
					<Badge variant="outline" className="bg-violet-500/15 text-violet-700 border-violet-500/25 dark:text-violet-400">
						{account.roleResponse?.nameVn ?? account.roleResponse?.code}
					</Badge>
				);
			},
		},
		{
			accessorKey: "disabled",
			header: "Trạng thái",
			cell: ({ row }) => {
				const disabled = row.getValue("disabled");
				const isDisabled = disabled === "true" || disabled === true;
				return isDisabled ? (
					<Badge variant="outline" className="bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400">
						Đã khóa
					</Badge>
				) : (
					<Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400">
						Hoạt động
					</Badge>
				);
			},
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Hành động</span>,
			cell: ({ row }) => <ActionCell row={row} onMutated={onMutated} />,
		},
	];
}
