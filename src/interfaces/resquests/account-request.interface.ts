import type { RoleRequest } from "./role-request.interface";

export interface AccountRequest {
	pk: number | null;
	username: string | null;
	password: string | null;
	fullname: string | null;
	email: string | null;
	photo: string | null;
	phone: string | null;
	address: string | null;
	disabled: boolean;
	roleRequest: RoleRequest;
}
