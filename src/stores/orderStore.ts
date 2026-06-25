import { create } from "zustand";
import { OrderStatus } from "@/enums/order-status.enum";
import { SortOrder } from "@/enums/sort-order.enum";
import type { OrderResponse } from "@/interfaces/responses/order-response.interface";
import type { PageResponse } from "@/interfaces/responses/page-response.interface";
import type { OrderRequest } from "@/interfaces/resquests/order-request.interface";
import { orderService } from "@/services/orderService";

interface OrderState {
	pages: Map<string, PageResponse<OrderResponse>>;

	loading: boolean;

	save: (request: OrderRequest) => Promise<OrderResponse>;

	deleteByPk: (pk: number) => Promise<void>;

	findByPk: (
		params: {
			keyword?: string | null;
			fromDate?: string | null;
			toDate?: string | null;
			status?: OrderStatus;
			expired?: boolean;
			deleted?: boolean;
			sortOrder?: SortOrder;
			pageNumber?: number;
			pageSize?: number;
		},
		pk: string,
	) => Promise<OrderResponse | undefined>;

	filter: (params: {
		keyword?: string | null;
		fromDate?: string | null;
		toDate?: string | null;
		status?: OrderStatus;
		expired?: boolean;
		deleted?: boolean;
		sortOrder?: SortOrder;
		pageNumber?: number;
		pageSize?: number;
	}) => Promise<PageResponse<OrderResponse> | undefined>;

	clearCache: () => void;
}

const useOrderStore = create<OrderState>((set, get) => ({
	pages: new Map<string, PageResponse<OrderResponse>>(),

	loading: false,

	save: async (request: OrderRequest): Promise<OrderResponse> => {
		try {
			set({ loading: true });
			return await orderService.save(request);
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
			await orderService.deleteByPk(pk);
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
			status = OrderStatus.PENDING,
			expired = false,
			deleted = false,
			sortOrder = SortOrder.DESC,
			pageNumber = 0,
			pageSize = 5,
		}: {
			keyword?: string | null;
			fromDate?: string | null;
			toDate?: string | null;
			status?: OrderStatus;
			expired?: boolean;
			deleted?: boolean;
			sortOrder?: SortOrder;
			pageNumber?: number;
			pageSize?: number;
		},
		pk: string,
	): Promise<OrderResponse | undefined> => {
		try {
			set({ loading: true });

			const key = [
				keyword,
				fromDate,
				toDate,
				status,
				expired,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");

			const page = get().pages.get(key);

			if (page) {
				return page.content.find((e) => e.pk === pk);
			}

			return await orderService.findByPk(Number(pk));
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
		status = OrderStatus.PENDING,
		expired = false,
		deleted = false,
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword?: string | null;
		fromDate?: string | null;
		toDate?: string | null;
		status?: OrderStatus;
		expired?: boolean;
		deleted?: boolean;
		sortOrder?: SortOrder;
		pageNumber?: number;
		pageSize?: number;
	}): Promise<PageResponse<OrderResponse> | undefined> => {
		try {
			set({ loading: true });
			const key = [
				keyword,
				fromDate,
				toDate,
				status,
				expired,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");
			const page = get().pages.get(key);
			if (page) {
				set((state) => {
					const newPage = state.pages;
					newPage.delete(key);
					newPage.set(key, page);
					return { pages: newPage };
				});
				return page;
			}

			const newPage = await orderService.filter({
				keyword,
				fromDate,
				toDate,
				status,
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
	}
}));

export default useOrderStore;
