import { create } from "zustand";
import { SortOrder } from "@/enums/sort-order.enum";
import type { CategoryResponse } from "@/interfaces/responses/category-response.interface";
import type { PageResponse } from "@/interfaces/responses/page-response.interface";
import type { CategoryRequest } from "@/interfaces/resquests/category-request.interface";
import { categoryService } from "@/services/categoryService";

interface CategoryState {
	pages: Map<string, PageResponse<CategoryResponse>>;

	loading: boolean;

	save: (category: CategoryRequest) => Promise<CategoryResponse>;

	deleteByPk: (pk: number) => Promise<void>;

	findByPk: (
		params: {
			keyword: string | null;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	) => Promise<CategoryResponse | undefined>;

	filter: (params: {
		keyword: string | null;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}) => Promise<PageResponse<CategoryResponse> | undefined>;

	clearCache: () => void;
}

const useCategoryStore = create<CategoryState>((set, get) => ({
	pages: new Map<string, PageResponse<CategoryResponse>>(),

	loading: false,

	save: async (category: CategoryRequest): Promise<CategoryResponse> => {
		try {
			set({ loading: true });
			return await categoryService.save(category);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
			get().clearCache();
		}
	},

	deleteByPk: async (pk: number): Promise<void> => {
		try {
			set({ loading: true });
			await categoryService.deleteByPk(pk);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
			get().clearCache();
		}
	},

	findByPk: async (
		{
			keyword = null,
			deleted = false,
			sortOrder = SortOrder.DESC,
			pageNumber = 0,
			pageSize = 5,
		}: {
			keyword: string | null;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	): Promise<CategoryResponse | undefined> => {
		try {
			set({ loading: true });
			const key = [keyword, deleted, sortOrder, pageNumber, pageSize].join("_");

			const page = get().pages.get(key);

			if (page) {
				return page.content.find((e) => e.pk === pk);
			}

			return categoryService.findByPk(Number(pk));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	filter: async ({
		keyword = null,
		deleted = false,
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword: string | null;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}): Promise<PageResponse<CategoryResponse> | undefined> => {
		try {
			set({ loading: true });

			const key = [keyword, deleted, pageNumber, pageSize].join("_");

			const page = get().pages.get(key);

			if (page) {
				set((state) => {
					const newMap = new Map(state.pages);
					newMap.delete(key);
					newMap.set(key, page);
					return { pages: newMap };
				});
				return page;
			}

			const newPage = await categoryService.filter({
				keyword,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			});

			set((state) => {
				const newMap = new Map(state.pages);
				if (newMap.size >= 10) {
					const firstKey = newMap.keys().next().value;
					if (firstKey) newMap.delete(firstKey);
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
	},
}));

export default useCategoryStore;
