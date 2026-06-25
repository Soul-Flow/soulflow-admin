import { create } from "zustand";
import { SortOrder } from "@/enums/sort-order.enum";
import type { PageResponse } from "@/interfaces/responses/page-response.interface";
import type { ProductResponse } from "@/interfaces/responses/product-response.interface";
import type { ProductRequest } from "@/interfaces/resquests/product-request.interface";
import { productService } from "@/services/productService";

interface ProductState {
	pages: Map<string, PageResponse<ProductResponse>>;

	loading: boolean;

	save: (
		product: ProductRequest,
		files: File[],
	) => Promise<ProductResponse | undefined>;

	deleteByPk: (pk: number) => Promise<void>;

	getByPk: (
		params: {
			keyword: string | null;
			minPrice: number | null;
			maxPrice: number | null;
			fromDate: string | null;
			toDate: string | null;
			categoryPk: number | null;
			available: boolean;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	) => Promise<ProductResponse | undefined>;
	
	filter: (params: {
		keyword: string | null;
		minPrice: number | null;
		maxPrice: number | null;
		fromDate: string | null;
		toDate: string | null;
		categoryPk: number | null;
		available: boolean;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}) => Promise<PageResponse<ProductResponse> | undefined>;

	clearCache: () => void;
}

const useProductStore = create<ProductState>((set, get) => ({
	pages: new Map<string, PageResponse<ProductResponse>>(),

	loading: false,

	save: async (
		product: ProductRequest,
		files: File[],
	): Promise<ProductResponse | undefined> => {
		try {
			set({ loading: true });
			const productResponse = await productService.save(product, files);
			return productResponse;
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	deleteByPk: async (pk: number): Promise<void> => {
		try {
			set({ loading: true });
			productService.deleteByPk(pk);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: true });
		}
	},

	getByPk: async (
		params: {
			keyword: string | null;
			minPrice: number | null;
			maxPrice: number | null;
			fromDate: string | null;
			toDate: string | null;
			categoryPk: number | null;
			available: boolean;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	): Promise<ProductResponse | undefined> => {
		try {
			set({ loading: true });
			const {
				keyword,
				minPrice,
				maxPrice,
				fromDate,
				toDate,
				categoryPk,
				available = false,
				deleted = false,
				sortOrder = "DESC",
				pageNumber = 0,
				pageSize = 5,
			} = params;
			const key = [
				keyword,
				minPrice,
				maxPrice,
				fromDate,
				toDate,
				categoryPk,
				available,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");
			const page = get().pages.get(key);
			if (page) {
				return page.content.find((e) => e.pk === pk);
			}
			return await productService.findByPk(Number(pk));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	filter: async ({
		keyword = null,
		minPrice = null,
		maxPrice = null,
		fromDate = null,
		toDate = null,
		categoryPk = null,
		available = false,
		deleted = false,
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword: string | null;
		minPrice: number | null;
		maxPrice: number | null;
		fromDate: string | null;
		toDate: string | null;
		categoryPk: number | null;
		available: boolean;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}): Promise<PageResponse<ProductResponse> | undefined> => {
		try {
			set({ loading: true });

			const key = [
				keyword,
				minPrice,
				maxPrice,
				fromDate,
				toDate,
				categoryPk,
				available,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");

			const page = get().pages.get(key);

			if (page) {
				set((state) => {
					const newMap = state.pages;
					newMap.delete(key);
					newMap.set(key, page);
					return { pages: newMap };
				});
				return page;
			}

			const newPage = await productService.filter({
				keyword,
				minPrice,
				maxPrice,
				fromDate,
				toDate,
				categoryPk,
				available,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			});

			set((state) => {
				const newMap = state.pages;
				if (newMap.size >= 10) {
					const firstKey = newMap.keys().next().value;
					if (firstKey) {
						newMap.delete(firstKey);
					}
				}
				newMap.set(key, newPage);
				return { pages: newMap };
			});

			return newPage;
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	clearCache: () => {
		set({ pages: new Map() });
	}
}));

export default useProductStore;
