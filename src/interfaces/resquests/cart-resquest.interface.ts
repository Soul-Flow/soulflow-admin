import type { ItemRequest } from "./item-request.interface";

export interface CartRequest {
	pk: number;
	accountPk: number;
	itemRequests: ItemRequest[];
}
