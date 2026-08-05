import { create } from "zustand";
import { SortOrder } from "@/enums/sort-order.enum";
import type { DiscountResponse } from "@/interfaces/responses/discount-response.interface";
import type { PageResponse } from "@/interfaces/responses/page-response.interface";
import type { DiscountRequest } from "@/interfaces/resquests/discount-request.interface";
import { discountService } from "@/services/discountService";

interface DiscountState {
	pages: Map<string, PageResponse<DiscountResponse>>;

	loading: boolean;

	save: (request: DiscountRequest) => Promise<DiscountResponse>;

	deleteByPk: (pk: number) => Promise<void>;

	findByPk: (
		params: {
			keyword: string | null;
			fromDate: string | null;
			toDate: string | null;
			expired: boolean;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	) => Promise<DiscountResponse | undefined>;

	filter: (params: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		expired: boolean;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}) => Promise<PageResponse<DiscountResponse> | undefined>;

	clearCache: () => void;
}

const useDiscountStore = create<DiscountState>((set, get) => ({
	pages: new Map<string, PageResponse<DiscountResponse>>(),

	loading: false,

	save: async (request: DiscountRequest): Promise<DiscountResponse> => {
		try {
			set({ loading: true });
			const result = await discountService.save(request);
			get().clearCache();
			return result;
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
			await discountService.deleteByPk(pk);
			get().clearCache();
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	findByPk: async (
		{
			keyword = null,
			fromDate = null,
			toDate = null,
			expired = false,
			deleted = false,
			sortOrder = SortOrder.DESC,
			pageNumber = 0,
			pageSize = 5,
		}: {
			keyword: string | null;
			fromDate: string | null;
			toDate: string | null;
			expired: boolean;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	): Promise<DiscountResponse | undefined> => {
		try {
			set({ loading: true });
			const key = [
				keyword,
				fromDate,
				toDate,
				expired,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");
			const page = get().pages.get(key);
			if (page) return page.content.find((e) => e.pk === pk);
			return await discountService.findByPk(Number(pk));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	filter: async ({
		keyword = null,
		fromDate = null,
		toDate = null,
		expired = false,
		deleted = false,
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		expired: boolean;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}): Promise<PageResponse<DiscountResponse> | undefined> => {
		try {
			set({ loading: true });

			const key = [
				keyword,
				fromDate,
				toDate,
				expired,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");

			const page = get().pages.get(key);

			// Comment out strict caching to allow real-time updates for Admin
			// if (page) {
			// 	set((state) => {
			// 		const newMap = new Map(state.pages);
			// 		newMap.delete(key);
			// 		newMap.set(key, page);
			// 		return { pages: newMap };
			// 	});
			// 	return page;
			// }

			const newPage = await discountService.filter({
				keyword,
				fromDate,
				toDate,
				expired,
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

export default useDiscountStore;
