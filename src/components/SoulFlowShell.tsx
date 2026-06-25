"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

type SoulFlowShellProps = {
	children: ReactNode;
};

export function SoulFlowShell({ children }: SoulFlowShellProps) {
	const pathname = usePathname();
	const [isCartOpen, setIsCartOpen] = useState(false);

	const routeVariants = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
	};

	return (
		<div className="min-h-screen flex flex-col justify-between bg-sf-bg text-sf-fg transition-colors duration-300">
			<Navbar onOpenCart={() => setIsCartOpen(true)} />
			<CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

			<main className="grow">
				<AnimatePresence mode="wait">
					<motion.div
						key={pathname}
						initial="initial"
						animate="animate"
						exit="exit"
						variants={routeVariants}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			</main>

			<Footer />
		</div>
	);
}
