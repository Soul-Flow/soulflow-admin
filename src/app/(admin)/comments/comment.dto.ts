export type CommentResponse = {
	id: string;
	productName: string;
	customerName: string;
	content: string;
	rating: number; // 1-5
	createdAt: string;
	hidden: boolean;
};
