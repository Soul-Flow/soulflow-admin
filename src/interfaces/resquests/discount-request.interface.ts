import type { ProductRequest } from "./product-request.interface";

export interface DiscountRequest {
	pk?: number;
	percentage: number;
	descriptionVn: string;
	descriptionEng: string;
	expiredDate: string;
	productRequests: ProductRequest[];
}
