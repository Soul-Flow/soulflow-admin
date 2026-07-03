"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Trash, Pencil, Send, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import type { CommentResponse } from "@/interfaces/responses/comment-response.interface";
import useCommentStore from "@/stores/commentStore";
import useReplyStore from "@/stores/replyStore";
import useProductStore from "@/stores/productStore";

function ProductNameRenderer({ pk }: { pk: string }) {
	const { getByPk } = useProductStore();
	const [name, setName] = useState<string>("Đang tải...");

	useEffect(() => {
		let isMounted = true;
		getByPk({} as any, pk)
			.then((product) => {
				if (isMounted) {
					setName(product?.nameVn || "SP không tồn tại");
				}
			})
			.catch(() => {
				if (isMounted) setName("Lỗi tải SP");
			});
		return () => {
			isMounted = false;
		};
	}, [pk, getByPk]);

	return <span className="font-medium text-sm text-primary">{name}</span>;
}

export function CommentExpandedRow({
	row,
	onMutated,
}: {
	row: Row<CommentResponse>;
	onMutated: () => void;
}) {
	const comment = row.original;
	console.log("DEBUG COMMENT DATA:", comment);
	const { save: saveReply, deleteByPk: deleteReply, loading: replying } = useReplyStore();
	const [replyContent, setReplyContent] = useState("");
	const [editingReplyPk, setEditingReplyPk] = useState<number | null>(null);

	const handleSaveReply = async () => {
		if (!replyContent.trim()) return;
		try {
			await saveReply({
				pk: editingReplyPk || undefined,
				content: replyContent,
				commentPk: Number(comment.pk),
			});
			toast.success(editingReplyPk ? "Cập nhật phản hồi thành công" : "Đã gửi phản hồi");
			setReplyContent("");
			setEditingReplyPk(null);
			onMutated();
		} catch {
			toast.error("Lưu phản hồi thất bại");
		}
	};

	const handleDeleteReply = async (pk: number) => {
		if (!confirm("Bạn có chắc muốn xóa phản hồi này?")) return;
		try {
			await deleteReply(pk);
			toast.success("Đã xóa phản hồi");
			onMutated();
		} catch {
			toast.error("Xóa phản hồi thất bại");
		}
	};

	const startEditReply = (pk: number, content: string) => {
		setEditingReplyPk(pk);
		setReplyContent(content);
	};

	const cancelEdit = () => {
		setEditingReplyPk(null);
		setReplyContent("");
	};

	return (
		<div className="p-4 bg-muted/10 border-b shadow-inner flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<span className="font-semibold text-sm text-foreground">Nội dung bình luận đầy đủ:</span>
				<p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
			</div>

			<div className="flex flex-col gap-3 pt-4 border-t">
				<span className="font-semibold text-sm flex items-center justify-between">
					<span>Phản hồi ({comment.replyResponses?.length || 0}):</span>
				</span>
				
				{comment.replyResponses?.map((reply) => {
					const isAdmin = reply.role === "ADMIN";
					return (
						<div
							key={reply.pk}
							className={`p-3 rounded-md text-sm border-l-4 ${isAdmin ? 'bg-primary/5 border-primary' : 'bg-muted/50 border-muted-foreground/30'}`}
						>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<span className="font-medium text-foreground">
										{reply.fullname || reply.username}
									</span>
									{isAdmin && (
										<Badge variant="destructive" className="text-[10px] h-5 px-1.5">
											Quản trị viên
										</Badge>
									)}
									<span className="text-xs text-muted-foreground">
										{reply.createdDate}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => startEditReply(Number(reply.pk), reply.content)}>
										<Pencil className="h-3 w-3" />
									</Button>
									<Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteReply(Number(reply.pk))}>
										<Trash className="h-3 w-3" />
									</Button>
								</div>
							</div>
							<p className="text-foreground whitespace-pre-wrap">{reply.content}</p>
						</div>
					);
				})}

				<div className="mt-2 flex flex-col gap-2 max-w-3xl">
					<Textarea 
						placeholder="Viết phản hồi..." 
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
						rows={2}
						className="resize-none"
						disabled={replying}
					/>
					<div className="flex justify-end gap-2">
						{editingReplyPk && (
							<Button variant="ghost" size="sm" onClick={cancelEdit} disabled={replying}>
								Hủy
							</Button>
						)}
						<Button size="sm" onClick={handleSaveReply} disabled={replying || !replyContent.trim()}>
							{replying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
							{editingReplyPk ? "Lưu" : "Gửi phản hồi"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ActionCell({
	row,
	onMutated,
}: {
	row: Row<CommentResponse>;
	onMutated: () => void;
}) {
	const comment = row.original;
	const { deleteByPk: deleteComment, loading: deletingComment } = useCommentStore();
	const [showViewSheet, setShowViewSheet] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleDelete = async () => {
		try {
			await deleteComment(Number(comment.pk));
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
								Sản phẩm:
							</span>
							<span className="col-span-2"><ProductNameRenderer pk={comment.productPk} /></span>
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
							<p className="p-3 bg-muted rounded-md text-foreground whitespace-pre-wrap">
								{comment.content}
							</p>
						</div>
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
							disabled={deletingComment}
						>
							{deletingComment ? "Đang xóa..." : "Xóa bình luận"}
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
			id: "expander",
			header: () => null,
			cell: ({ row }) => {
				return (
					<Button
						variant="ghost"
						className="h-8 w-8 p-0"
						onClick={row.getToggleExpandedHandler()}
					>
						{row.getIsExpanded() ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</Button>
				);
			},
		},
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
			header: "Sản phẩm",
			cell: ({ row }) => <ProductNameRenderer pk={row.getValue("productPk")} />
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
