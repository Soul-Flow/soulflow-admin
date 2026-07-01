import type { ProductResponse } from "./product-response.interface";

export interface DiscountResponse {
	pk: string;
	code: string;
	percentage: string;
	description: string;
	createdDate: string;
	expiredDate: string;
	expired: string;
	productResponses: ProductResponse[];
}
