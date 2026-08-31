import api from "@/lib/api";
import type { CustomOrderResponse } from "@/interfaces/responses/custom-order-response.interface";

export const customOrderService = {
	getAll: async (): Promise<CustomOrderResponse[]> => {
		const res = await api.get<CustomOrderResponse[]>("/custom-orders");
		return res.data;
	},
	updateStatus: async (
		id: string,
		status: "PENDING" | "CONTACTED" | "ORDER_CREATED" | "SPAM",
	): Promise<CustomOrderResponse> => {
		const res = await api.put<CustomOrderResponse>(
			`/custom-orders/${id}/status`,
			{ status },
		);
		return res.data;
	},
	delete: async (id: string): Promise<void> => {
		await api.delete(`/custom-orders/${id}`);
	},
};
