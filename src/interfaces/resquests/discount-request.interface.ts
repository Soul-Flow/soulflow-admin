import type { ProductRequest } from "./product-request.interface";

export interface DiscountRequest {
	pk?: number;
	code?: string;
	percentage: number;
	minOrderAmount?: number;
	usageLimit?: number;
	descriptionVn: string;
	descriptionEng: string;
	expiredDate: string;
	productRequests: ProductRequest[];
}
