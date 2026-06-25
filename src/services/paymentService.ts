import type { PaymentResponse } from "../interfaces/responses/payment-response.interface";
import type { PaymentRequest } from "../interfaces/resquests/payment-request.interface";
import api from "../lib/api";

export const paymentService = {
	save: async (request: PaymentRequest): Promise<PaymentResponse> => {
		const response = await api.post<PaymentResponse>("/payment", request);

		return response.data;
	},
};
