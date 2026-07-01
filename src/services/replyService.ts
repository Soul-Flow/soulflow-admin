import { SortOrder } from "../enums/sort-order.enum";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { ReplyResponse } from "../interfaces/responses/reply-response.interface";
import type { ReplyRequest } from "../interfaces/resquests/reply-request.interface";
import api from "../lib/api";

export const replyService = {
	save: async (request: ReplyRequest): Promise<ReplyResponse> => {
		const response = await api.post<ReplyResponse>("/reply", request);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/reply/${pk}`);
	},

	findByPk: async (pk: number): Promise<ReplyResponse> => {
		const response = await api.get<ReplyResponse>(`/reply/${pk}`);

		return response.data;
	},

	filter: async ({
		keyword = null,
		fromDate = null,
		toDate = null,
		deleted = false,
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}): Promise<PageResponse<ReplyResponse>> => {
		const response = await api.get<PageResponse<ReplyResponse>>("/reply", {
			params: {
				keyword,
				fromDate,
				toDate,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			},
		});

		return response.data;
	},
};
