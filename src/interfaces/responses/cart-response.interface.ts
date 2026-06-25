import type { ItemResponse } from "./item-response.interface";

export interface CartResponse {
	pk: string;

	code: string;

	total: string;

	createdDate: string;

	username: string;

	fullname: string;

	accountPk: string;

	itemResponses: ItemResponse[];
}
