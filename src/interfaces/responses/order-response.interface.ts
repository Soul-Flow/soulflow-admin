import type { OrderDetailResponse } from "./order-detail-response.interface";

export interface OrderResponse {
	pk: string;

	code: string;

	fullname: string;

	phone: string;

	address: string;

	total: string;

	shippingFee: string;

	paymentMethod: string;

	createdDate: string;

	expiredDate: string;

	status: string;

	accountPk: string;

	discountCode: string | null;

	discountAmount: number;

	orderDetailResponses: OrderDetailResponse[];
}
