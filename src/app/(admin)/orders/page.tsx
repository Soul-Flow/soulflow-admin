"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Loader2,
	Search,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@/enums/order-status.enum";
import { SortOrder } from "@/enums/sort-order.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import useOrderStore from "@/stores/orderStore";
import { columns } from "./columns";

import { CreateCustomOrderDialog } from "./create-custom-order-dialog";

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

function OrdersPageContent() {
	const { filter, loading } = useOrderStore();
	const searchParams = useSearchParams();

	const [keyword, setKeyword] = useState<string>(
		searchParams.get("keyword") || "",
	);
	const [searchKeyword, setSearchKeyword] = useState<string>(
		searchParams.get("keyword") || "",
	);
	const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
	const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [pageSize, setPageSize] = useState<PageSize>(5);

	const [data, setData] = useState<OrderResponse[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [totalElements, setTotalElements] = useState<number>(0);

	// Initialize from URL when navigating from notification
	useEffect(() => {
		if (searchParams.get("action") === "view") {
			const keywordParam = searchParams.get("keyword") || "";
			setKeyword(keywordParam);
			setSearchKeyword(keywordParam);
			setStatus("ALL");
			setPageNumber(0);
		}
	}, [searchParams]);

	const fetchOrders = useCallback(
		async (params: {
			keyword: string;
			status: OrderStatus | "ALL";
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		}) => {
			const page = await filter({
				keyword: params.keyword.trim() || null,
				fromDate: null,
				toDate: null,
				status: params.status === "ALL" ? undefined : params.status,
				expired: undefined,
				deleted: false,
				sortOrder: params.sortOrder,
				pageNumber: params.pageNumber,
				pageSize: params.pageSize,
			});
			setData(page?.content ?? []);
			setTotalPages(page?.totalPages ?? 1);
			setTotalElements(page?.totalElements ?? 0);
		},
		[filter],
	);

	useEffect(() => {
		fetchOrders({
			keyword: searchKeyword,
			status,
			sortOrder,
			pageNumber,
			pageSize,
		});
	}, [searchKeyword, status, sortOrder, pageNumber, pageSize, fetchOrders]);

	const handleSearch = () => {
		setSearchKeyword(keyword);
		setPageNumber(0);
	};

	const handleKeywordChange = (value: string) => {
		setKeyword(value);
	};
	const handleStatusChange = (value: string) => {
		setStatus(value as OrderStatus | "ALL");
		setPageNumber(0);
	};
	const handleSortOrderChange = (value: string) => {
		setSortOrder(value as SortOrder);
		setPageNumber(0);
	};
	const handlePageSizeChange = (value: string) => {
		setPageSize(Number(value) as PageSize);
		setPageNumber(0);
	};

	const onMutated = () =>
		fetchOrders({
			keyword: searchKeyword,
			status,
			sortOrder,
			pageNumber,
			pageSize,
		});

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
				<CreateCustomOrderDialog onCreated={onMutated} />
			</div>

			<div className="flex flex-col gap-4 mt-6">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative flex-1 md:w-64 md:flex-none flex items-center gap-2">
						<div className="relative flex-1">
							{loading ? (
								<Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
							) : (
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							)}
							<Input
								placeholder="Tìm theo mã đơn hoặc khách hàng..."
								className="pl-8"
								value={keyword}
								onChange={(e) => handleKeywordChange(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								disabled={loading}
							/>
						</div>
						<Button
							onClick={handleSearch}
							disabled={loading}
							variant="secondary"
						>
							Tìm
						</Button>
					</div>

					<Select
						value={status}
						onValueChange={handleStatusChange}
						disabled={loading}
					>
						<SelectTrigger className="w-44">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">Tất cả trạng thái</SelectItem>
							<SelectItem value={OrderStatus.PENDING}>Chờ xử lý</SelectItem>
							<SelectItem value={OrderStatus.PROCESSING}>Đang xử lý</SelectItem>
							<SelectItem value={OrderStatus.DELIVERED}>Hoàn tất</SelectItem>
							<SelectItem value={OrderStatus.CANCELLED}>Đã hủy</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={sortOrder}
						onValueChange={handleSortOrderChange}
						disabled={loading}
					>
						<SelectTrigger className="w-44">
							<SelectValue placeholder="Sắp xếp" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={SortOrder.DESC}>Mới nhất trước</SelectItem>
							<SelectItem value={SortOrder.ASC}>Cũ nhất trước</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<DataTable columns={columns({ onMutated })} data={data} />

				<div className="flex items-center justify-between px-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>Hiển thị</span>
						<Select
							value={String(pageSize)}
							onValueChange={handlePageSizeChange}
							disabled={loading}
						>
							<SelectTrigger className="w-16">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PAGE_SIZE_OPTIONS.map((s) => (
									<SelectItem key={s} value={String(s)}>
										{s}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<span>/ {totalElements} mục</span>
					</div>

					<div className="flex items-center gap-2">
						<span className="w-28 text-center text-sm font-medium">
							Trang {pageNumber + 1} / {totalPages || 1}
						</span>
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => setPageNumber(0)}
								disabled={loading || pageNumber === 0}
							>
								<span className="sr-only">Trang đầu</span>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
								disabled={loading || pageNumber === 0}
							>
								<span className="sr-only">Trang trước</span>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() =>
									setPageNumber((p) => Math.min(totalPages - 1, p + 1))
								}
								disabled={loading || pageNumber >= totalPages - 1}
							>
								<span className="sr-only">Trang sau</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => setPageNumber(totalPages - 1)}
								disabled={loading || pageNumber >= totalPages - 1}
							>
								<span className="sr-only">Trang cuối</span>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default function OrdersPage() {
	return (
		<Suspense
			fallback={
				<div className="p-4 text-center text-sm text-muted-foreground">
					Đang tải...
				</div>
			}
		>
			<OrdersPageContent />
		</Suspense>
	);
}
