import type { OrderStatus } from "../enums/order-status.enum";
import { SortOrder } from "../enums/sort-order.enum";
import type { OrderResponse } from "../interfaces/responses/order-response.interface";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { OrderRequest } from "../interfaces/resquests/order-request.interface";
import api from "../lib/api";

export const orderService = {
	save: async (request: OrderRequest): Promise<OrderResponse> => {
		const response = await api.post<OrderResponse>("/order", request);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/order/${pk}`);
	},

	findByPk: async (pk: number): Promise<OrderResponse> => {
		const response = await api.get<OrderResponse>(`/order/${pk}`);

		return response.data;
	},

	filter: async ({
		keyword = null,
		fromDate = null,
		toDate = null,
		status,
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
	}): Promise<PageResponse<OrderResponse>> => {
		const response = await api.get<PageResponse<OrderResponse>>("/order", {
			params: {
				keyword,
				fromDate,
				toDate,
				status,
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
