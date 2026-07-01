import { create } from "zustand";
import { SortOrder } from "@/enums/sort-order.enum";
import type { CommentResponse } from "@/interfaces/responses/comment-response.interface";
import type { PageResponse } from "@/interfaces/responses/page-response.interface";
import type { CommentRequest } from "@/interfaces/resquests/comment-request.interface";
import { commentService } from "@/services/commentService";

interface CommentState {
	pages: Map<string, PageResponse<CommentResponse>>;

	loading: boolean;

	save: (request: CommentRequest) => Promise<CommentResponse>;

	deleteByPk: (pk: number) => Promise<void>;

	findByPk: (
		params: {
			keyword: string | null;
			fromDate: string | null;
			toDate: string | null;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	) => Promise<CommentResponse | undefined>;

	filter: (params: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}) => Promise<PageResponse<CommentResponse> | undefined>;

	clearCache: () => void;
}

const useCommentStore = create<CommentState>((set, get) => ({
	pages: new Map<string, PageResponse<CommentResponse>>(),

	loading: false,

	save: async (request: CommentRequest): Promise<CommentResponse> => {
		try {
			set({ loading: true });
			return await commentService.save(request);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	deleteByPk: async (pk: number): Promise<void> => {
		try {
			set({ loading: true });
			await commentService.deleteByPk(pk);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	findByPk: async (
		{
			keyword = null,
			fromDate = null,
			toDate = null,
			deleted = false,
			sortOrder = SortOrder.DESC,
			pageNumber = 0,
			pageSize = 5,
		}: {
			keyword: string | null;
			fromDate: string | null;
			toDate: string | null;
			deleted: boolean;
			sortOrder: SortOrder;
			pageNumber: number;
			pageSize: number;
		},
		pk: string,
	): Promise<CommentResponse | undefined> => {
		try {
			set({ loading: true });
			const key = [
				keyword,
				fromDate,
				toDate,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			].join("_");

			const page = get().pages.get(key);

			if (page) {
				return page.content.find((e) => e.pk === pk);
			}

			return await commentService.findByPk(Number(pk));
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
		sortOrder = SortOrder.DESC,
		pageNumber = 0,
		pageSize = 5,
	}: {
		keyword: string | null;
		fromDate: string | null;
		toDate: string | null;
		deleted: boolean;
		sortOrder: SortOrder;
		pageNumber: number;
		pageSize: number;
	}): Promise<PageResponse<CommentResponse> | undefined> => {
		try {
			set({ loading: true });

			const key = [
				keyword,
				fromDate,
				toDate,
				deleted,
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

			const newPage = await commentService.filter({
				keyword,
				fromDate,
				toDate,
				deleted,
				sortOrder,
				pageNumber,
				pageSize,
			});

			set((state) => {
				const newMap = new Map(state.pages);
				if (newMap.size >= 10) {
					const firstKey = newMap.keys().next().value;
					if (firstKey) newMap.delete(firstKey);
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

export default useCommentStore;
