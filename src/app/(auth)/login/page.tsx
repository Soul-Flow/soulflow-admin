"use client";

import { Flower2, Loader2, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import useAccountStore from "@/stores/accountStore";

export default function LoginPage() {
	const { login, loading } = useAccountStore();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleLogin = async (
		overrideUsername?: string,
		overridePassword?: string,
	) => {
		const loginUsername = String(overrideUsername ?? username).trim();
		const loginPassword = String(overridePassword ?? password);

		// reset
		setUsernameError("");
		setPasswordError("");

		let valid = true;
		if (!loginUsername) {
			setUsernameError("Tên đăng nhập là bắt buộc");
			valid = false;
		}
		if (!loginPassword) {
			setPasswordError("Mật khẩu là bắt buộc");
			valid = false;
		}
		if (!valid) return;

		try {
			await login({ username: loginUsername, password: loginPassword });
			toast.success("Đăng nhập thành công!");
			window.location.href = "/dashboard";
		} catch {
			toast.error("Đăng nhập thất bại!", {
				description: "Tên đăng nhập hoặc mật khẩu không chính xác.",
			});
		}
	};

	useEffect(() => {
		const queryUsername = searchParams.get("username")?.trim();
		const queryPassword = searchParams.get("password")?.trim();

		if (!queryUsername || !queryPassword) {
			return;
		}

		setUsername(queryUsername);
		setPassword(queryPassword);
		router.replace("/login");
		void handleLogin(queryUsername, queryPassword);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router, searchParams]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") void handleLogin();
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Flower2 className="h-6 w-6 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold">SouFlow Admin</CardTitle>
				<CardDescription>
					Đăng nhập để truy cập bảng điều khiển quản trị.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="login-username">Tên đăng nhập</Label>
						<Input
							id="login-username"
							type="text"
							placeholder="admin"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={loading}
							autoComplete="username"
							aria-invalid={!!usernameError}
						/>
						{usernameError && (
							<p className="text-xs text-destructive">{usernameError}</p>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="login-password">Mật khẩu</Label>
						<Input
							id="login-password"
							type="password"
							placeholder="••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={loading}
							autoComplete="current-password"
							aria-invalid={!!passwordError}
						/>
						{passwordError && (
							<p className="text-xs text-destructive">{passwordError}</p>
						)}
					</div>

					<Button
						type="button"
						className="w-full mt-2"
						disabled={loading}
						onClick={() => void handleLogin()}
					>
						{loading ? (
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
				</div>
			</CardContent>
		</Card>
	);
}
