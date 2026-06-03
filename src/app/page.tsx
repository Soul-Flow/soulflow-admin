import { redirect } from "next/navigation";

/**
 * Root page — trang gốc của ứng dụng.
 * Tự động chuyển hướng người dùng đến Dashboard.
 * Middleware sẽ kiểm tra xác thực trước khi cho phép truy cập /dashboard.
 */
export default function RootPage() {
	redirect("/dashboard");
}
