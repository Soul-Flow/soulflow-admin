import type { OrderResponse } from "./order-response.interface";

export interface PaymentResponse {
	pk: string;
	amount: string;
	paymentDate: string;
	orderResponse: OrderResponse;
}
