/**
 * Layout cho nhóm route (auth) — trang Login, Register, v.v.
 * KHÔNG có sidebar hoặc header admin.
 * Chỉ render nội dung con ở giữa màn hình.
 */

// Force dynamic rendering so the login page is never pre-rendered as static HTML.
// Static rendering prevents client components from hydrating, which causes
// the form to submit natively (GET with query params) instead of via JS.
export const dynamic = "force-dynamic";

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
