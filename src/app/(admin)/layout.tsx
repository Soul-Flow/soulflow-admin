"use client";

import {
	BadgePercent,
	Bell,
	ExternalLink,
	Flower2,
	History,
	Layers,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	Shield,
	ShoppingCart,
	Sparkles,
	Truck,
	UserCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import useAccountStore from "@/stores/accountStore";
import useNotificationStore from "@/stores/notificationStore";
import { formatDateTime } from "@/lib/utils";

const NAV_GROUPS = [
	{
		title: "QUẢN LÝ VẬN HÀNH",
		items: [
			{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
			{
				href: "/processing-station",
				label: "Trạm Xử Lý Đơn",
				icon: Truck,
				badge: "LIVE",
			},
			{ href: "/orders", label: "Đơn Hàng", icon: ShoppingCart },
		],
	},
	{
		title: "DANH MỤC & KHO HOA",
		items: [
			{ href: "/products", label: "Sản Phẩm Hoa", icon: Flower2 },
			{ href: "/categories", label: "Danh Mục", icon: Layers },
			{ href: "/discounts", label: "Mã Khuyến Mãi", icon: BadgePercent },
		],
	},
	{
		title: "KHÁCH HÀNG & TƯƠNG TÁC",
		items: [
			{ href: "/users", label: "Người Dùng", icon: Users },
			{ href: "/comments", label: "Đánh Giá & Bình Luận", icon: MessageSquare },
		],
	},
	{
		title: "HỆ THỐNG & BẢO MẬT",
		items: [
			{ href: "/logs", label: "Nhật Ký Hoạt Động", icon: History, badge: "LIVE" },
		],
	},
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);
	const { rehydrate } = useAccountStore();
	const { connect, disconnect, notifications, unreadCount, markAllAsRead } =
		useNotificationStore();

	// Restore token from localStorage on every page load (client-side only)
	useEffect(() => {
		rehydrate();
	}, [rehydrate]);

	useEffect(() => {
		connect();
		return () => disconnect();
	}, [connect, disconnect]);

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	const linkClass = (href: string) =>
		`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
			isActive(href)
				? "bg-primary text-primary-foreground font-semibold shadow-xs"
				: "text-muted-foreground hover:text-foreground hover:bg-muted/70"
		}`;

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] bg-background">
			{/* Sidebar Desktop */}
			<div className="hidden border-r bg-card/60 backdrop-blur-md md:flex md:flex-col justify-between h-screen sticky top-0">
				<div className="flex flex-col h-full overflow-hidden">
					{/* Logo Header */}
					<div className="flex h-18 items-center border-b px-5 lg:px-6 shrink-0">
						<Link
							href="/dashboard"
							className="flex items-center gap-3 font-bold tracking-tight"
						>
							<div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
								<Flower2 className="h-5 w-5" />
							</div>
							<div className="flex flex-col">
								<span className="font-serif text-lg font-bold tracking-wider text-foreground">
									SouFlow
								</span>
								<div className="flex items-center gap-1.5 -mt-0.5">
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
									<span className="text-[10px] uppercase font-mono tracking-widest text-primary/80 font-bold">
										Admin v2.0
									</span>
								</div>
							</div>
						</Link>
					</div>

					{/* Navigation Links Grouped */}
					<div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
						{NAV_GROUPS.map((group) => (
							<div key={group.title} className="space-y-1.5">
								<span className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
									{group.title}
								</span>
								<div className="space-y-1">
									{group.items.map((item) => {
										const Icon = item.icon;
										return (
											<Link
												key={item.href}
												href={item.href}
												className={linkClass(item.href)}
											>
												<Icon className="h-4.5 w-4.5 shrink-0" />
												<span className="grow">{item.label}</span>
												{item.badge && (
													<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
														{item.badge}
													</span>
												)}
											</Link>
										);
									})}
								</div>
							</div>
						))}
					</div>

					{/* Bottom Action Card & Profile Footer */}
					<div className="p-3.5 border-t border-border/80 bg-muted/20 space-y-2.5 shrink-0">
						{/* Live Website Quick Link */}
						<a
							href="https://souflow.shop"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border/70 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all group"
						>
							<span className="flex items-center gap-2">
								<ExternalLink className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
								Xem Website Khách Hàng
							</span>
							<span className="text-[10px] text-muted-foreground/60">↗</span>
						</a>

						{/* Admin User Profile Mini Card */}
						<div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/80 shadow-xs">
							<div className="flex items-center gap-2.5 min-w-0">
								<div className="relative">
									<div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
										AD
									</div>
									<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
								</div>
								<div className="flex flex-col min-w-0">
									<span className="text-xs font-bold text-foreground truncate">
										Administrator
									</span>
									<span className="text-[10px] text-muted-foreground font-medium">
										Quản trị viên cấp cao
									</span>
								</div>
							</div>

							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
								title="Đăng xuất"
								onClick={() => {
									localStorage.removeItem("admin_token");
									document.cookie = "admin_token=; Max-Age=0; path=/";
									window.location.href = "/login";
								}}
							>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content & Mobile Header */}
			<div className="flex flex-col min-w-0">
				<header className="flex h-16 items-center gap-4 border-b bg-card/50 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-30">
					{/* Mobile Hamburger Sheet */}
					<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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
						<SheetContent
							side="left"
							className="flex flex-col p-4 w-80 max-h-screen overflow-y-auto"
						>
							<div className="flex items-center gap-3 pb-4 border-b">
								<div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
									<Flower2 className="h-5 w-5" />
								</div>
								<div className="flex flex-col">
									<span className="font-serif text-lg font-bold tracking-wider">
										SouFlow
									</span>
									<span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">
										Admin Portal
									</span>
								</div>
							</div>

							<div className="py-4 space-y-4">
								{NAV_GROUPS.map((group) => (
									<div key={group.title} className="space-y-1.5">
										<span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
											{group.title}
										</span>
										<nav className="grid gap-1">
											{group.items.map((item) => {
												const Icon = item.icon;
												return (
													<Link
														key={item.href}
														href={item.href}
														onClick={() => setMobileOpen(false)}
														className={linkClass(item.href)}
													>
														<Icon className="h-4.5 w-4.5 shrink-0" />
														<span className="grow">{item.label}</span>
														{item.badge && (
															<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
																{item.badge}
															</span>
														)}
													</Link>
												);
											})}
										</nav>
									</div>
								))}
							</div>
						</SheetContent>
					</Sheet>

					<div className="w-full flex-1"></div>

					{/* Notification Dropdown Trigger */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 rounded-xl relative border bg-card shadow-xs hover:bg-accent transition-all cursor-pointer"
							>
								<Bell className="h-5 w-5 text-foreground" />
								{unreadCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-background">
										{unreadCount > 9 ? "9+" : unreadCount}
									</span>
								)}
								<span className="sr-only">Toggle notifications</span>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align="end"
							className="w-96 sm:w-105 max-h-[85vh] p-0 overflow-hidden rounded-2xl shadow-xl border bg-card"
						>
							{/* Header */}
							<div className="flex items-center justify-between px-4 py-3.5 bg-muted/40 border-b">
								<div className="flex items-center gap-2">
									<span className="font-bold text-sm text-foreground">
										Thông Báo
									</span>
									{unreadCount > 0 && (
										<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
											{unreadCount} mới
										</span>
									)}
								</div>

								{unreadCount > 0 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={markAllAsRead}
										className="h-auto px-2 py-1 text-xs text-primary font-semibold hover:bg-primary/10 rounded-lg cursor-pointer"
									>
										Đánh dấu tất cả đã đọc
									</Button>
								)}
							</div>

							{/* Notification List */}
							<div className="max-h-[60vh] overflow-y-auto divide-y divide-border/60">
								{notifications.length === 0 ? (
									<div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-2">
										<div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground/60">
											<Bell className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium text-foreground">
											Chưa có thông báo nào
										</p>
										<p className="text-xs text-muted-foreground">
											Các hoạt động đơn hàng & cảnh báo tồn kho sẽ hiển thị tại đây.
										</p>
									</div>
								) : (
									notifications.map((notif, index) => {
										const isOrder = [
											"ORDER_PAID",
											"NEW_ORDER",
											"ORDER_STATUS_CHANGED",
										].includes(notif.type);
										const isStock = notif.type === "LOW_STOCK";

										return (
											<DropdownMenuItem
												key={`${notif.referenceId}-${index}`}
												className="cursor-pointer flex items-start gap-3 p-3.5 hover:bg-muted/50 transition-colors focus:bg-muted/60"
												onSelect={() => {
													if (isOrder) {
														router.push(
															`/processing-station?orderId=${notif.referenceId}`,
														);
													} else if (isStock) {
														router.push(
															`/products?keyword=${notif.referenceId}&action=view`,
														);
													}
												}}
											>
												<div
													className={`h-9 w-9 rounded-xl shrink-0 flex items-center justify-center ${
														isOrder
															? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
															: isStock
																? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
																: "bg-blue-500/15 text-blue-600 dark:text-blue-400"
													}`}
												>
													{isOrder ? (
														<ShoppingCart className="h-4.5 w-4.5" />
													) : isStock ? (
														<Flower2 className="h-4.5 w-4.5" />
													) : (
														<Sparkles className="h-4.5 w-4.5" />
													)}
												</div>

												<div className="flex flex-col min-w-0 grow">
													<div className="font-semibold text-sm text-foreground">
														{notif.title}
													</div>
													<div className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
														{notif.message}
													</div>
													<div className="text-[10px] text-muted-foreground/70 mt-1 font-mono">
														{formatDateTime(notif.timestamp, true)}
													</div>
												</div>
											</DropdownMenuItem>
										);
									})
								)}
							</div>
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
