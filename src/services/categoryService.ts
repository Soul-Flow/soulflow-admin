import { SortOrder } from "../enums/sort-order.enum";
import type { CategoryResponse } from "../interfaces/responses/category-response.interface";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { CategoryRequest } from "../interfaces/resquests/category-request.interface";
import api from "../lib/api";

export const categoryService = {
	save: async (request: CategoryRequest): Promise<CategoryResponse> => {
		const response = await api.post<CategoryResponse>("/category", request);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/category/${pk}`);
	},

	findByPk: async (pk: number): Promise<CategoryResponse> => {
		const response = await api.get<CategoryResponse>(`/category/${pk}`);

		return response.data;
	},

	findAll: async (): Promise<CategoryResponse[]> => {
		const response = await api.get<CategoryResponse[]>("/category/list");

		return response.data;
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
	}): Promise<PageResponse<CategoryResponse>> => {
		const response = await api.get<PageResponse<CategoryResponse>>(
			"/category",
			{
				params: {
					keyword,
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
