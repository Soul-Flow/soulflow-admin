import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const adminToken = request.cookies.get("admin_token")?.value;

	// Trạng thái 1: CHƯA có vé và đang đi lung tung (không phải ở login) -> Đẩy về Login
	if (!adminToken && pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Trạng thái 2: ĐÃ CÓ vé rồi nhưng lại quay ra trang Login -> Đẩy thẳng vào Dashboard
	if (adminToken && pathname === "/login") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Các trường hợp hợp lệ (Chưa có vé và đang đứng ngoan ở form login, HOẶC đã có vé và đang ở admin)
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/orders/:path*",
		"/products/:path*",
		"/categories/:path*",
		"/users/:path*",
		"/discounts/:path*",
		"/comments/:path*",
		"/login",
	],
};
