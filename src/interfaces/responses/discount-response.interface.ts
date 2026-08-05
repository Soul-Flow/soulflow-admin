import type { ProductResponse } from "./product-response.interface";

export interface DiscountResponse {
	pk: string;
	code: string;
	percentage: string;
	minOrderAmount: string;
	usageLimit: string;
	currentUsage: string;
	description: string;
	createdDate: string;
	expiredDate: string;
	expired: string;
	productResponses: ProductResponse[];
}
