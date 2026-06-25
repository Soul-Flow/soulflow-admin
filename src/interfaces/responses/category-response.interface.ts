import type { ProductResponse } from "./product-response.interface";

export interface CategoryResponse {
	pk: string;
	code: string;
	nameVn: string;
	nameEng: string;
	descriptionVn: string;
	descriptionEng: string;
	productResponses: ProductResponse[];
}
