import type { RoleCode } from "../enums/role-code.enum";
import { SortOrder } from "../enums/sort-order.enum";
import type { AccountResponse } from "../interfaces/responses/account-response.interface";
import type { AuthResponse } from "../interfaces/responses/auth-response.interface";
import type { PageResponse } from "../interfaces/responses/page-response.interface";
import type { AccountRequest } from "../interfaces/resquests/account-request.interface";
import type { AuthRequest } from "../interfaces/resquests/auth-request.interface";
import type { GoogleToken } from "../interfaces/resquests/google-token.interface";
import api from "../lib/api";

export const accountService = {
	login: async (request: AuthRequest): Promise<AuthResponse> => {
		const response = await api.post<AuthResponse>("/login", request);

		return response.data;
	},

	googleLogin: async (request: GoogleToken): Promise<AuthResponse> => {
		const response = await api.post<AuthResponse>("/google/login", request);

		return response.data;
	},

	save: async (
		account: AccountRequest,
		file?: File | null,
	): Promise<AccountResponse> => {
		const formData = new FormData();

		formData.append(
			"account",
			new Blob([JSON.stringify(account)], {
				type: "application/json",
			}),
		);

		if (file && file.size > 0) {
			formData.append("file", file);
		}

		const response = await api.post<AccountResponse>("/account", formData);

		return response.data;
	},

	deleteByPk: async (pk: number): Promise<void> => {
		await api.delete(`/account/${pk}`);
	},

	findByPk: async (pk: number): Promise<AccountResponse> => {
		const response = await api.get<AccountResponse>(`/account/${pk}`);

		return response.data;
	},

	findByUsername: async (username: string): Promise<AccountResponse> => {
		const response = await api.get<AccountResponse>(
			`/account/by-username/${username}`,
		);
		return response.data;
	},

	filter: async ({
		keyword = null,
		fromDate = null,
		toDate = null,
		deleted = false,
		disabled = null,
		role = null,
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		deleted: boolean;
		disabled?: boolean | null;
		role: RoleCode | null;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}): Promise<PageResponse<AccountResponse>> => {
		const params: Record<string, unknown> = {
			keyword,
			fromDate,
			toDate,
			deleted,
			role,
			sortOrder,
			pageNumber,
			pageSize,
		};
		if (disabled !== null && disabled !== undefined) {
			params.disabled = disabled;
		}
		const response = await api.get<PageResponse<AccountResponse>>("/account", {
			params,
		});

		return response.data;
	},
};
