import type { CommentResponse } from "./comment-response.interface";
import type { DiscountResponse } from "./discount-response.interface";
import type { ProductImageResponse } from "./product-image-response.interface";

export interface ProductResponse {
	pk: string;
	code: string;
	nameVn: string;
	nameEng: string;
	descriptionVn: string;
	descriptionEng: string;
	price: string;
	createdDate: string;
	available: string;
	quantity: string;
	sales: string;
	categoryPk: string;
	customised: string;
	discountResponses: DiscountResponse[];
	productImageResponses: ProductImageResponse[];
	commentResponses: CommentResponse[];
}
