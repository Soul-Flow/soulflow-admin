import { SortOrder } from "../enums/sort-order.enum";
import type { DiscountResponse } from "../interfaces/responses/discount-response.interface";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { DiscountRequest } from "../interfaces/resquests/discount-request.interface";
import api from "../lib/api";

export const discountService = {
	save: async (request: DiscountRequest): Promise<DiscountResponse> => {
		const response = await api.post<DiscountResponse>("/discount", request);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/discount/${pk}`);
	},

	findByPk: async (pk: number): Promise<DiscountResponse> => {
		const response = await api.get<DiscountResponse>(`/discount/${pk}`);

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
	}): Promise<PageResponse<DiscountResponse>> => {
		const response = await api.get<PageResponse<DiscountResponse>>(
			"/discount",
			{
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
			},
		);

		return response.data;
	},
};
