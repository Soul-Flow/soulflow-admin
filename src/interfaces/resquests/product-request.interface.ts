export interface ProductRequest {
	pk?: number;
	nameVn: string;
	nameEng: string;
	descriptionVn: string;
	descriptionEng: string;
	price: number;
	available: boolean;
	quantity: number;
	categoryPk: number;
	customised: boolean;
}
