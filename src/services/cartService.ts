import { SortOrder } from "../enums/sort-order.enum";
import type { CartResponse } from "../interfaces/responses/cart-response.interface";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { CartRequest } from "../interfaces/resquests/cart-resquest.interface";
import api from "../lib/api";

export const cartService = {
	save: async (request: CartRequest): Promise<CartResponse> => {
		const response = await api.post<CartResponse>("/cart", request);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/cart/${pk}`);
	},

	findByPk: async (pk: number): Promise<CartResponse> => {
		const response = await api.get<CartResponse>(`/cart/${pk}`);

		return response.data;
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
	}): Promise<PageResponse<CartResponse>> => {
		const response = await api.get<PageResponse<CartResponse>>("/cart", {
			params: {
				keyword,
				fromDate,
				toDate,
				expired,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			},
		});

		return response.data;
	},
};
