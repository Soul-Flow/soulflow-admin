// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "@/components/ui/sonner";
// import "./globals.css";

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

// export const metadata: Metadata = {
// 	title: "SouFlow Admin",
// 	description: "Bảng điều khiển quản trị SouFlow",
// };

// export default function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	return (
// 		<html
// 			lang="vi"
// 			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
// 		>
// 			<body className="min-h-full flex flex-col">
// 				{children}
// 				<Toaster richColors position="top-right" />
// 			</body>
// 		</html>
// 	);
// }

import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// 1. Font cho chữ bình thường (Body)
const jakarta = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin", "vietnamese"],
});

// 2. Font cho Tiêu đề (Heading - cong cong điệu đà)
const playfair = Playfair_Display({
	variable: "--font-serif",
	subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
	title: "SouFlow Admin",
	description: "Bảng điều khiển quản trị SouFlow",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="vi"
			// Nhúng 2 biến font này vào thẻ html để toàn dự án nhận diện được
			className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
		>
			{/* Thêm class font-sans để mặc định mọi chữ đều dùng font Jakarta */}
			<body className="min-h-full flex flex-col font-sans">
				{children}
				<Toaster richColors position="top-right" expand={true} />
			</body>
		</html>
	);
}
