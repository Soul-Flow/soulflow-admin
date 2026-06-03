export type DiscountStatus = "active" | "expired" | "upcoming";

export type DiscountResponse = {
	id: string;
	code: string;
	description: string;
	discountPercent: number;
	minOrderAmount: number;
	startDate: string;
	endDate: string;
	status: DiscountStatus;
};

export type CreateDiscountRequest = {
	code: string;
	description: string;
	discountPercent: number;
	minOrderAmount: number;
	startDate: string;
	endDate: string;
};
