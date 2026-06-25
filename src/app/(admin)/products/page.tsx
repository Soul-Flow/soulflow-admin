"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Loader2,
	Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { SortOrder } from "@/enums/sort-order.enum";
import type { ProductResponse } from "@/interfaces/responses/product-response.interface";
import useProductStore from "@/stores/productStore";
import { columns } from "./columns";
import { CreateProductDialog } from "./create-product-dialog";

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export default function ProductsPage() {
	const { filter, loading } = useProductStore();

	const [keyword, setKeyword] = useState<string>("");
	const [available, setAvailable] = useState<boolean>(true);
	const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [pageSize, setPageSize] = useState<PageSize>(5);

	const [data, setData] = useState<ProductResponse[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [totalElements, setTotalElements] = useState<number>(0);

	const fetchProducts = useCallback(
		async (params: {
			keyword: string;
			available: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		}) => {
			const page = await filter({
				keyword: params.keyword.trim() || null,
				minPrice: null,
				maxPrice: null,
				fromDate: null,
				toDate: null,
				categoryPk: null,
				available:params.available,
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
		const timer = setTimeout(
			() => fetchProducts({ keyword, available, sortOrder, pageNumber, pageSize }),
			keyword !== "" ? 400 : 0,
		);
		return () => clearTimeout(timer);
	}, [keyword, available, sortOrder, pageNumber, pageSize, fetchProducts]);

	const handleKeywordChange = (value: string) => { setKeyword(value); setPageNumber(0); };
	const handleAvailableChange = (value: string) => {
		setAvailable(value === "true" ? true : false);
		setPageNumber(0);
	};
	const handleSortOrderChange = (value: string) => { setSortOrder(value as SortOrder); setPageNumber(0); };
	const handlePageSizeChange = (value: string) => { setPageSize(Number(value) as PageSize); setPageNumber(0); };

	const onMutated = () => fetchProducts({ keyword, available, sortOrder, pageNumber, pageSize });

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Quản lý Sản Phẩm</h1>
					<p className="text-muted-foreground text-sm">
						Thêm, sửa, xóa và quản lý kho hoa của bạn.
					</p>
				</div>
				<CreateProductDialog onCreated={onMutated} />
			</div>

			<div className="flex flex-col gap-4 mt-6">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative flex-1 md:w-64 md:flex-none">
						{loading ? (
							<Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
						) : (
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						)}
						<Input
							placeholder="Tìm theo tên sản phẩm..."
							className="pl-8"
							value={keyword}
							onChange={(e) => handleKeywordChange(e.target.value)}
							disabled={loading}
						/>
					</div>

					<Select value={String(available)} onValueChange={handleAvailableChange} disabled={loading}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="true">Đang kinh doanh</SelectItem>
							<SelectItem value="false">Tạm ngưng</SelectItem>
						</SelectContent>
					</Select>

					<Select value={sortOrder} onValueChange={handleSortOrderChange} disabled={loading}>
						<SelectTrigger className="w-44">
							<SelectValue placeholder="Sắp xếp" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={SortOrder.DESC}>Mới nhất trước</SelectItem>
							<SelectItem value={SortOrder.ASC}>Cũ nhất trước</SelectItem>
							<SelectItem value={SortOrder.PRICE_ASC}>Giá thấp → cao</SelectItem>
							<SelectItem value={SortOrder.PRICE_DESC}>Giá cao → thấp</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<DataTable columns={columns({ onMutated })} data={data} />

				<div className="flex items-center justify-between px-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>Hiển thị</span>
						<Select value={String(pageSize)} onValueChange={handlePageSizeChange} disabled={loading}>
							<SelectTrigger className="w-16">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PAGE_SIZE_OPTIONS.map((s) => (
									<SelectItem key={s} value={String(s)}>{s}</SelectItem>
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
							<Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => setPageNumber(0)} disabled={loading || pageNumber === 0}>
								<span className="sr-only">Trang đầu</span>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button variant="outline" className="h-8 w-8 p-0"
								onClick={() => setPageNumber((p) => Math.max(0, p - 1))} disabled={loading || pageNumber === 0}>
								<span className="sr-only">Trang trước</span>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button variant="outline" className="h-8 w-8 p-0"
								onClick={() => setPageNumber((p) => Math.min(totalPages - 1, p + 1))} disabled={loading || pageNumber >= totalPages - 1}>
								<span className="sr-only">Trang sau</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => setPageNumber(totalPages - 1)} disabled={loading || pageNumber >= totalPages - 1}>
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
