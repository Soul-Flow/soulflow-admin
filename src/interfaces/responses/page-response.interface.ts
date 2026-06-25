export interface PageResponse<T> {
	content: T[];
	currentPage: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
}
