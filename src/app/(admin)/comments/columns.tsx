"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
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
import type { CommentResponse } from "@/interfaces/responses/comment-response.interface";
import useCommentStore from "@/stores/commentStore";

function ActionCell({
	row,
	onMutated,
}: {
	row: Row<CommentResponse>;
	onMutated: () => void;
}) {
	const comment = row.original;
	const { deleteByPk, loading } = useCommentStore();
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleDelete = async () => {
		try {
			await deleteByPk(Number(comment.pk));
			toast.success("Đã xóa bình luận thành công!");
			setShowDeleteDialog(false);
			onMutated();
		} catch {
			toast.error("Xóa bình luận thất bại. Vui lòng thử lại.");
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
						<Eye className="mr-2 h-4 w-4" /> Xem chi tiết
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" /> Xóa bình luận
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Bình Luận</SheetTitle>
						<SheetDescription>PK: {comment.pk}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Người dùng:
							</span>
							<span className="col-span-2 font-medium">{comment.fullname}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Username:
							</span>
							<span className="col-span-2">{comment.username}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Sản phẩm PK:
							</span>
							<span className="col-span-2">{comment.productPk}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Ngày đăng:
							</span>
							<span className="col-span-2">{comment.createdDate}</span>
						</div>
						<div className="flex flex-col gap-2 pt-2">
							<span className="font-medium text-muted-foreground">
								Nội dung:
							</span>
							<p className="p-3 bg-muted rounded-md text-foreground">
								{comment.content}
							</p>
						</div>
						{comment.replyResponses?.length > 0 && (
							<div className="flex flex-col gap-2 pt-2">
								<span className="font-medium text-muted-foreground">
									Phản hồi ({comment.replyResponses.length}):
								</span>
								{comment.replyResponses.map((reply) => (
									<div
										key={reply.pk}
										className="p-3 bg-muted/50 rounded-md text-sm border-l-2 border-primary/30"
									>
										<p className="font-medium text-xs text-muted-foreground mb-1">
											{reply.username} · {reply.createdDate}
										</p>
										<p>{reply.content}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa bình luận của khách hàng{" "}
							<strong>{comment.fullname}</strong>? Hành động này không thể hoàn
							tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
							{loading ? "Đang xóa..." : "Xóa bình luận"}
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
}): ColumnDef<CommentResponse>[] {
	return [
		{
			accessorKey: "pk",
			header: "PK",
			cell: ({ row }) => (
				<span className="font-mono text-xs">{row.getValue("pk")}</span>
			),
		},
		{
			accessorKey: "fullname",
			header: "Người dùng",
			cell: ({ row }) => (
				<span className="font-medium">{row.getValue("fullname")}</span>
			),
		},
		{
			accessorKey: "username",
			header: "Username",
			cell: ({ row }) => (
				<span className="font-mono text-sm text-muted-foreground">
					{row.getValue("username")}
				</span>
			),
		},
		{
			accessorKey: "productPk",
			header: "Sản phẩm PK",
			cell: ({ row }) => (
				<span className="font-mono text-xs">{row.getValue("productPk")}</span>
			),
		},
		{
			accessorKey: "content",
			header: "Nội dung",
			cell: ({ row }) => (
				<p className="text-muted-foreground line-clamp-2 max-w-[200px]">
					{row.getValue("content")}
				</p>
			),
		},
		{
			accessorKey: "createdDate",
			header: "Ngày đăng",
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.getValue("createdDate")}
				</span>
			),
		},
		{
			id: "replies",
			header: "Phản hồi",
			cell: ({ row }) => {
				const count = row.original.replyResponses?.length ?? 0;
				return <span className="text-muted-foreground text-sm">{count}</span>;
			},
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Hành động</span>,
			cell: ({ row }) => <ActionCell row={row} onMutated={onMutated} />,
		},
	];
}
