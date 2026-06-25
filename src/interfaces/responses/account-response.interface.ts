import type { CartResponse } from "./cart-response.interface";
import type { OrderResponse } from "./order-response.interface";
import type { RoleResponse } from "./role-response.interface";

export interface AccountResponse {
	pk: string;

	username: string;

	fullname: string;

	email: string;

	photo: string;

	address: string;

	phone: string;

	createdDate: string;

	credentialExpiredDate: string;

	credentialExpired: string;

	disabled: string;

	roleResponse: RoleResponse;

	orderResponses: OrderResponse[];

	cartResponses: CartResponse[];
}
