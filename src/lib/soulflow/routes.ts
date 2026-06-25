export const soulFlowRoutes = {
	home: "/",
	catalog: "/catalog",
	product: (id: string) => `/catalog/${id}`,
	//bespoke: "/bespoke",
	checkout: "/checkout",
	account: "/account",
	contact: "/contact",
	about: "/about",
	privacy: "/privacy",
	terms: "/terms",
	login: "/login",
	register: "/register",
} as const;

export type SoulFlowRouteKey = keyof typeof soulFlowRoutes;
