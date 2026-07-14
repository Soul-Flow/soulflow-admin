export interface CategoryRequest {
	pk?: number;
	nameVn: string;
	nameEng: string;
	descriptionVn: string;
	descriptionEng: string;
	delIf?: boolean | number;
	deleted?: boolean;
}
