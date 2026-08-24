import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Read token from cookie (set by accountStore after successful login)
	const token = request.cookies.get("admin_token")?.value;

	// No token and not on login → redirect to login
	if (!token && pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Already has token but visiting login → redirect to dashboard
	if (token && pathname === "/login") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/processing-station/:path*",
		"/orders/:path*",
		"/products/:path*",
		"/categories/:path*",
		"/discounts/:path*",
		"/custom-orders/:path*",
		"/users/:path*",
		"/comments/:path*",
		"/logs/:path*",
		"/profile/:path*",
		"/settings/:path*",
		"/login",
	],
};
