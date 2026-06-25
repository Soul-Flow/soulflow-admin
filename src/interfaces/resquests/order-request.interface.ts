import type { OrderStatus } from "../../enums/order-status.enum";
import type { OrderDetailRequest } from "./order-detail-request.interface";

export interface OrderRequest {
	pk?: number;
	fullname: string;
	phone: string;
	address: string;
	status: OrderStatus;
	accountPk: number;
	orderDetailRequests: OrderDetailRequest[];
}
