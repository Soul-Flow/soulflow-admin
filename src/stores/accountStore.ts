import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { RoleCode } from "@/enums/role-code.enum";
import { SortOrder } from "@/enums/sort-order.enum";
import type { AccountResponse } from "@/interfaces/responses/account-response.interface";
import type { AuthResponse } from "@/interfaces/responses/auth-response.interface";
import type { PageResponse } from "@/interfaces/responses/page-response.interface";
import type { AccountRequest } from "@/interfaces/resquests/account-request.interface";
import type { AuthRequest } from "@/interfaces/resquests/auth-request.interface";
import { registerTokenGetter } from "../lib/api";
import { accountService } from "../services/accountService";

interface JwtPayload {
	sub: string;
	roleCode: string;
	exp: number;
	iat: number;
}

interface AccountState {
	username: string | null;
	role: RoleCode | null;
	expiredDate: number | null;
	auth: AuthResponse | null;
	pages: Map<string, PageResponse<AccountResponse>>;
	loading: boolean;

	rehydrate: () => void;
	login: (request: AuthRequest) => Promise<void>;
	save: (account: AccountRequest, file?: File | null) => Promise<AccountResponse>;
	deleteByPk: (pk: number) => Promise<void>;
	findByPk: (
		params: {
			keyword: string | null;
			fromDate: string | null;
			toDate: string | null;
			deleted: boolean;
			disabled: boolean;
			role: RoleCode;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	) => Promise<AccountResponse | undefined>;

	filter: (params: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		deleted: boolean;
		disabled?: boolean | null;
		role: RoleCode | null;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}) => Promise<PageResponse<AccountResponse> | undefined>;

	clearCache: () => void;
}

const useAccountStore = create<AccountState>((set, get) => ({
	username: null,
	role: null,
	expiredDate: null,
	auth: null,
	pages: new Map<string, PageResponse<AccountResponse>>(),
	loading: false,

	// Call this once in a useEffect on the client to restore token from localStorage
	rehydrate: () => {
		try {
			const token = localStorage.getItem("admin_token");
			if (!token) return;
			const decoded = jwtDecode<JwtPayload>(token);
			if (decoded.exp * 1000 <= Date.now()) {
				localStorage.removeItem("admin_token");
				document.cookie = "admin_token=; Max-Age=0; path=/";
				return;
			}
			set({
				auth: {
					token,
					pk: "",
					fullname: "",
					email: "",
					photo: "",
				} as AuthResponse,
				username: decoded.sub,
				role: decoded.roleCode as RoleCode,
				expiredDate: decoded.exp,
			});
		} catch {
			// ignore parse errors
		}
	},

	login: async (request: AuthRequest) => {
		try {
			set({ loading: true });
			const authResponse = await accountService.login(request);
			const decoded = jwtDecode<JwtPayload>(authResponse.token);

			if (decoded.roleCode !== "ADMIN") {
				throw new Error("ACCESS_DENIED");
			}

			set({
				username: decoded.sub,
				role: decoded.roleCode as RoleCode,
				expiredDate: decoded.exp,
				auth: authResponse,
			});
			localStorage.setItem("admin_token", authResponse.token);
			document.cookie = `admin_token=${authResponse.token}; path=/; max-age=${2 * 60 * 60}; SameSite=Strict`;
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	save: async (
		account: AccountRequest,
		file?: File | null,
	): Promise<AccountResponse> => {
		try {
			set({ loading: true });
			return await accountService.save(account, file);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
			get().clearCache();
		}
	},

	deleteByPk: async (pk: number): Promise<void> => {
		try {
			set({ loading: true });
			await accountService.deleteByPk(pk);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
			get().clearCache();
		}
	},

	findByPk: async (
		{
			keyword = null,
			fromDate = null,
			toDate = null,
			deleted = false,
			disabled = false,
			role = RoleCode.USER,
			sortOrder = SortOrder.DESC,
			pageNumber = 0,
			pageSize = 5,
		},
		pk: string,
	): Promise<AccountResponse | undefined> => {
		try {
			set({ loading: true });
			const key = [
				keyword,
				fromDate,
				toDate,
				deleted,
				disabled,
				role,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");
			const page = get().pages.get(key);
			if (page) return page.content.find((e) => e.pk === pk);
			return accountService.findByPk(Number(pk));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
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
	}): Promise<PageResponse<AccountResponse> | undefined> => {
		try {
			set({ loading: true });
			const key = [
				keyword,
				fromDate,
				toDate,
				deleted,
				disabled,
				role,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");
			const page = get().pages.get(key);
			if (page) {
				set((state) => {
					const newMap = new Map(state.pages);
					newMap.delete(key);
					newMap.set(key, page);
					return { pages: newMap };
				});
				return page;
			}
			const newPage = await accountService.filter({
				keyword,
				fromDate,
				toDate,
				deleted,
				disabled,
				role,
				sortOrder,
				pageNumber,
				pageSize,
			});
			set((state) => {
				const newMap = new Map(state.pages);
				if (newMap.size >= 10) {
					const firstKey = newMap.keys().next().value;
					if (firstKey !== undefined) newMap.delete(firstKey);
				}
				newMap.set(key, newPage);
				return { pages: newMap };
			});
			return newPage;
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	clearCache: () => {
		set({ pages: new Map() });
	},
}));

// Break circular dependency: api → accountStore → accountService → api
// The getter is lazy — reads current state at request time, not at registration time
registerTokenGetter(() => useAccountStore.getState().auth?.token);

export default useAccountStore;
