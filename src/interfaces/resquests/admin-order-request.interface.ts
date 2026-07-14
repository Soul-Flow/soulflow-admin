import type { OrderStatus } from "../../enums/order-status.enum";
import type { OrderDetailRequest } from "./order-detail-request.interface";

export interface AdminOrderRequest {
	accountPk: number;
	fullname: string;
	phone: string;
	address: string;
	paymentMethod: string;
	shippingFee: number;
	status?: OrderStatus;
	total?: number;
	orderDetailRequests: (OrderDetailRequest & { price?: number })[];
}
