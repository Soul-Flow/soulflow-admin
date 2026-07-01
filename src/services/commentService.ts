import { SortOrder } from "../enums/sort-order.enum";
import type { CommentResponse } from "../interfaces/responses/comment-response.interface";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { CommentRequest } from "../interfaces/resquests/comment-request.interface";
import api from "../lib/api";

export const commentService = {
	save: async (request: CommentRequest): Promise<CommentResponse> => {
		const response = await api.post<CommentResponse>("/comment", request);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/comment/${pk}`);
	},

	findByPk: async (pk: number): Promise<CommentResponse> => {
		const response = await api.get<CommentResponse>(`/comment/${pk}`);

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
	}): Promise<PageResponse<CommentResponse>> => {
		const response = await api.get<PageResponse<CommentResponse>>("/comment", {
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
