import { SoulFlowShell } from "@/components/SoulFlowShell";

export default function SoulFlowLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <SoulFlowShell>{children}</SoulFlowShell>;
}
