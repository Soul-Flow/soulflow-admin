import type { ReplyResponse } from "./reply-response.interface";

export interface CommentResponse {
	pk: string;
	username: string;
	fullname: string;
	photo: string;
	content: string;
	createdDate: string;
	productPk: string;
	accountPk: string;
	replyResponses: ReplyResponse[];
}
