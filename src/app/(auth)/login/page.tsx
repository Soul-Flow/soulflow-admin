"use client";

import { Flower2, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Trang đăng nhập Admin Panel — FlowerShop.
 *
 * === LUỒNG XÁC THỰC (Authentication Flow) ===
 *
 * 1. Admin nhập email + password → nhấn "Đăng nhập".
 * 2. [MOCK] Kiểm tra email/password hardcoded:
 *    - email: admin@flowershop.com
 *    - password: 123456
 * 3. Nếu đúng → Set cookie `admin_token` → Redirect đến /dashboard.
 * 4. Nếu sai → Hiển thị lỗi qua `sonner` toast.
 *
 * === KHI TÍCH HỢP BACKEND (Spring Boot) ===
 * - Gọi POST /api/v1/auth/admin/login với body { email, password }.
 * - Backend trả về JWT token trong response.
 * - Frontend lưu token vào cookie `admin_token`.
 * - Middleware sẽ kiểm tra cookie này ở mỗi request.
 * - Xem phần [REAL JWT LOGIC] bên dưới (đã comment out).
 */
export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// ─────────────────────────────────────────────────────────────────
			// [MOCK LOGIC] — Kiểm tra thông tin đăng nhập hardcoded
			// Xóa block này khi tích hợp backend thật
			// ─────────────────────────────────────────────────────────────────
			await new Promise((resolve) => setTimeout(resolve, 800)); // Giả lập API delay

			if (email === "admin@flowershop.com" && password === "123456") {
				// Đăng nhập thành công → Set cookie
				// path=/: cookie có hiệu lực trên toàn bộ app
				// max-age=86400: cookie hết hạn sau 24 giờ (1 ngày)
				// biome-ignore lint/suspicious/noDocumentCookie: Chỗ này đang mock JWT tạm thời
				document.cookie =
					"admin_token=mock_jwt_token_123; path=/; max-age=86400";

				toast.success("Đăng nhập thành công!", {
					description: "Chào mừng bạn quay trở lại FlowerShop Admin.",
				});

				// Chuyển hướng đến Dashboard
				router.push("/dashboard");
				return;
			}

			// Sai thông tin → Hiển thị lỗi
			toast.error("Đăng nhập thất bại!", {
				description: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
			});
			// ─────────────────────────────────────────────────────────────────

			// ─────────────────────────────────────────────────────────────────
			// [REAL JWT LOGIC] — Bỏ comment block này khi tích hợp Spring Boot
			// ─────────────────────────────────────────────────────────────────
			//
			// import axiosClient from "@/services/axiosClient"
			//
			// try {
			//   // Bước 1: Gọi API đăng nhập
			//   const response = await axiosClient.post("/api/v1/auth/admin/login", {
			//     email,
			//     password,
			//   })
			//
			//   // Bước 2: Lấy JWT token từ response
			//   // Cấu trúc response từ Spring Boot thường là:
			//   // { data: { accessToken: "eyJhbGciOiJIUzI1NiIs...", refreshToken: "..." } }
			//   const { accessToken } = response.data
			//
			//   // Bước 3: Lưu JWT token vào cookie
			//   // - HttpOnly cookie nên được set từ backend (Set-Cookie header)
			//   // - Nếu backend không set cookie, ta set ở client:
			//   document.cookie = `admin_token=${accessToken}; path=/; max-age=86400; SameSite=Strict`
			//
			//   // Bước 4: Redirect đến Dashboard
			//   toast.success("Đăng nhập thành công!")
			//   router.push("/dashboard")
			//
			// } catch (error: any) {
			//   // Bước 5: Xử lý lỗi từ backend
			//   const errorMessage =
			//     error?.response?.data?.message ||
			//     "Đã xảy ra lỗi. Vui lòng thử lại sau."
			//
			//   toast.error("Đăng nhập thất bại!", {
			//     description: errorMessage,
			//   })
			// }
			//
			// ─────────────────────────────────────────────────────────────────
		} catch {
			toast.error("Đã xảy ra lỗi!", {
				description: "Không thể kết nối đến server. Vui lòng thử lại sau.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Flower2 className="h-6 w-6 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold">SoulFlow Admin</CardTitle>
				<CardDescription>
					Đăng nhập để truy cập bảng điều khiển quản trị.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="login-email">Email</Label>
						<Input
							id="login-email"
							type="email"
							placeholder="admin@flowershop.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
							autoComplete="email"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="login-password">Mật khẩu</Label>
						<Input
							id="login-password"
							type="password"
							placeholder="••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
							autoComplete="current-password"
						/>
					</div>

					<Button type="submit" className="w-full mt-2" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Đang đăng nhập...
							</>
						) : (
							<>
								<LogIn className="mr-2 h-4 w-4" />
								Đăng nhập
							</>
						)}
					</Button>

					<p className="text-center text-xs text-muted-foreground mt-2">
						Tài khoản demo: <strong>admin@flowershop.com</strong> /{" "}
						<strong>123456</strong>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
