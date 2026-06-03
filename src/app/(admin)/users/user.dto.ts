/**
 * DTO (Data Transfer Object) cho User.
 * Cấu trúc này khớp với response từ Spring Boot API: GET /api/v1/admin/users
 */

export type UserRole = "admin" | "customer";

export type UserStatus = "active" | "locked";

export type UserResponse = {
	id: string;
	username: string;
	fullname: string;
	email: string;
	role: UserRole;
	status: UserStatus;
};
