"use client";

import {
	Bell,
	Flower2,
	Home,
	LineChart,
	Menu,
	MessageSquare,
	Package,
	Package2,
	Search,
	ShoppingCart,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);
	const linkClass = (href: string) =>
		`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
			isActive(href)
				? "bg-slate-200 text-slate-900 font-bold dark:bg-slate-800 dark:text-white"
				: "text-muted-foreground hover:text-primary"
		}`;

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			{/* Sidebar Desktop */}
			<div className="hidden border-r bg-muted/40 md:block">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
						<Link href="/" className="flex items-center gap-2 font-semibold">
							<Flower2 className="h-6 w-6 text-primary" />
							<span className="">FlowerShop Admin</span>
						</Link>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="ml-auto h-8 w-8 relative"
								>
									<Bell className="h-4 w-4" />
									<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600"></span>
									<span className="sr-only">Toggle notifications</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								<DropdownMenuLabel>Thông báo</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="cursor-pointer"
									onSelect={() => router.push("/orders")}
								>
									Bạn có 1 đơn hàng mới (#ORD-001)
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onSelect={() => router.push("/products")}
								>
									Sản phẩm &quot;Hoa Hồng&quot; sắp hết hàng
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onSelect={() => router.push("/users")}
								>
									Người dùng mới vừa đăng ký
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex-1">
						<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
							<Link href="/dashboard" className={linkClass("/dashboard")}>
								<Home className="h-4 w-4" />
								Dashboard
							</Link>
							<Link href="/orders" className={linkClass("/orders")}>
								<ShoppingCart className="h-4 w-4" />
								Đơn hàng
							</Link>
							<Link href="/products" className={linkClass("/products")}>
								<Package className="h-4 w-4" />
								Sản phẩm
							</Link>
							<Link href="/categories" className={linkClass("/categories")}>
								<Package2 className="h-4 w-4" />
								Danh mục
							</Link>
							<Link href="/users" className={linkClass("/users")}>
								<Users className="h-4 w-4" />
								Người dùng
							</Link>
							<Link href="/discounts" className={linkClass("/discounts")}>
								<LineChart className="h-4 w-4" />
								Khuyến mãi
							</Link>
							<Link href="/comments" className={linkClass("/comments")}>
								<MessageSquare className="h-4 w-4" />
								Bình luận
							</Link>
						</nav>
					</div>
				</div>
			</div>

			{/* Main Content & Mobile Header */}
			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-15 lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 md:hidden"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 text-lg font-medium">
								<Link
									href="#"
									className="flex items-center gap-2 text-lg font-semibold"
								>
									<Flower2 className="h-6 w-6 text-primary" />
									<span className="sr-only">FlowerShop</span>
								</Link>
								{/* Lặp lại menu tương tự Sidebar Desktop ở đây nếu cần */}
							</nav>
						</SheetContent>
					</Sheet>

					<div className="w-full flex-1">
						<form>
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Tìm kiếm nhanh..."
									className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
								/>
							</div>
						</form>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-8 w-8"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src="" alt="Admin" />
									<AvatarFallback>AD</AvatarFallback>
								</Avatar>
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Tài khoản Admin</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onSelect={() => router.push("/profile")}
							>
								Hồ sơ của tôi
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onSelect={() => router.push("/settings")}
							>
								Cài đặt
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer text-red-600 focus:text-red-600"
								onClick={() => {
									// biome-ignore lint/suspicious/noDocumentCookie: Chỗ này đang mock JWT tạm thời
									document.cookie = "admin_token=; Max-Age=0; path=/";
									window.location.href = "/login";
								}}
							>
								Đăng xuất
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>

				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
