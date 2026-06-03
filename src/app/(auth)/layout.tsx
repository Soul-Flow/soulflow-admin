/**
 * Layout cho nhóm route (auth) — trang Login, Register, v.v.
 * KHÔNG có sidebar hoặc header admin.
 * Chỉ render nội dung con ở giữa màn hình.
 */
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			{children}
		</div>
	);
}
