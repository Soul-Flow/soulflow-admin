import { SortOrder } from "../enums/sort-order.enum";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { ProductResponse } from "../interfaces/responses/product-response.interface";
import type { ProductRequest } from "../interfaces/resquests/product-request.interface";
import api from "../lib/api";

export const productService = {
	save: async (
		request: ProductRequest,
		files: File[],
	): Promise<ProductResponse> => {
		const formData = new FormData();

		formData.append(
			"request",
			new Blob([JSON.stringify(request)], {
				type: "application/json",
			}),
		);

		if (files && files.length > 0) {
			for (const file of files) {
				formData.append("files", file);
			}
		}

		const response = await api.post<ProductResponse>("/product", formData);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/product/${pk}`);
	},

	findByPk: async (pk: number): Promise<ProductResponse> => {
		const response = await api.get<ProductResponse>(`/product/${pk}`);

		return response.data;
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
	}): Promise<PageResponse<ProductResponse>> => {
		const response = await api.get<PageResponse<ProductResponse>>("/product", {
			params: {
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
			},
		});

		return response.data;
	},
};
