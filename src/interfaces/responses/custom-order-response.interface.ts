export interface CustomOrderResponse {
	id: string;
	customerName: string;
	phone: string;
	budget: string;
	occasion: string;
	preferredColors: string;
	flowerTypes: string;
	note: string;
	status: "PENDING" | "CONTACTED" | "ORDER_CREATED" | "SPAM";
	ipAddress: string;
	createdAt: string;
}
