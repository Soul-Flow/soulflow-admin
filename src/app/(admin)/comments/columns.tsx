"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, EyeOff, MoreHorizontal, Star, Trash } from "lucide-react";
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
import type { CommentResponse } from "./comment.dto";

function ActionCell({ row }: { row: Row<CommentResponse> }) {
	const comment = row.original;
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showHideDialog, setShowHideDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleToggleHidden = () => {
		setShowHideDialog(false);
		if (comment.hidden) {
			toast.success("Đã hiện bình luận thành công!");
		} else {
			toast.success("Đã ẩn bình luận thành công!");
		}
	};

	const handleDelete = () => {
		setShowDeleteDialog(false);
		toast.success("Đã xóa bình luận thành công!");
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
						className="cursor-pointer"
						onSelect={() => setShowHideDialog(true)}
					>
						{comment.hidden ? (
							<>
								<Eye className="mr-2 h-4 w-4" />
								Hiện bình luận
							</>
						) : (
							<>
								<EyeOff className="mr-2 h-4 w-4" />
								Ẩn bình luận
							</>
						)}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600"
						onSelect={() => setShowDeleteDialog(true)}
					>
						<Trash className="mr-2 h-4 w-4" />
						Xóa bình luận
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Chi Tiết Bình Luận</SheetTitle>
						<SheetDescription>ID: {comment.id}</SheetDescription>
					</SheetHeader>
					<div className="mt-6 space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Khách hàng:
							</span>
							<span className="col-span-2 font-medium">
								{comment.customerName}
							</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Sản phẩm:
							</span>
							<span className="col-span-2">{comment.productName}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2">
							<span className="font-medium text-muted-foreground">
								Ngày đăng:
							</span>
							<span className="col-span-2">{comment.createdAt}</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">
								Đánh giá:
							</span>
							<span className="col-span-2 flex items-center">
								<RatingStars rating={comment.rating} />
							</span>
						</div>
						<div className="grid grid-cols-3 gap-2 border-b pb-2 items-center">
							<span className="font-medium text-muted-foreground">
								Trạng thái:
							</span>
							<span className="col-span-2">
								{comment.hidden ? (
									<Badge
										variant="outline"
										className="bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400"
									>
										Đã ẩn
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400"
									>
										Hiển thị
									</Badge>
								)}
							</span>
						</div>
						<div className="flex flex-col gap-2 pt-2">
							<span className="font-medium text-muted-foreground">
								Nội dung:
							</span>
							<p className="p-3 bg-muted rounded-md text-foreground">
								{comment.content}
							</p>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog open={showHideDialog} onOpenChange={setShowHideDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Xác nhận {comment.hidden ? "hiện" : "ẩn"} bình luận
						</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn {comment.hidden ? "hiện" : "ẩn"} bình luận
							của khách hàng <strong>{comment.customerName}</strong> về sản phẩm{" "}
							<strong>{comment.productName}</strong>?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction onClick={handleToggleHidden}>
							{comment.hidden ? "Hiện bình luận" : "Ẩn bình luận"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa bình luận của khách hàng{" "}
							<strong>{comment.customerName}</strong>? Hành động này không thể
							hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							Xóa bình luận
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

function RatingStars({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1">
			<div className="flex">
				{Array.from({ length: 5 }).map((_, i) => (
					<Star
						key={crypto.randomUUID()}
						className={`h-4 w-4 ${
							i < rating ? "text-amber-500" : "text-muted-foreground/30"
						}`}
					/>
				))}
			</div>
			<span className="text-xs text-muted-foreground ml-1">{rating}/5</span>
		</div>
	);
}

export const columns: ColumnDef<CommentResponse>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-mono text-xs">{row.getValue("id")}</span>
		),
	},
	{
		accessorKey: "productName",
		header: "Sản phẩm",
		cell: ({ row }) => (
			<span className="font-medium">{row.getValue("productName")}</span>
		),
	},
	{
		accessorKey: "customerName",
		header: "Khách hàng",
	},
	{
		accessorKey: "content",
		header: "Nội dung",
		cell: ({ row }) => (
			<p className="text-muted-foreground line-clamp-2 max-w-62.5">
				{row.getValue("content")}
			</p>
		),
	},
	{
		accessorKey: "rating",
		header: "Đánh giá",
		cell: ({ row }) => <RatingStars rating={row.getValue("rating")} />,
	},
	{
		accessorKey: "createdAt",
		header: "Ngày đăng",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.getValue("createdAt")}</span>
		),
	},
	{
		accessorKey: "hidden",
		header: "Trạng thái",
		cell: ({ row }) => {
			const hidden = row.getValue("hidden") as boolean;
			return hidden ? (
				<Badge
					variant="outline"
					className="bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400"
				>
					Đã ẩn
				</Badge>
			) : (
				<Badge
					variant="outline"
					className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400"
				>
					Hiển thị
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
