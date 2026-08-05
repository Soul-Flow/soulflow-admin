import { toast } from "sonner";
import { create } from "zustand";
import {
	type DashboardData,
	type DashboardFilter,
	type DashboardQueryParams,
	getDashboardSummary,
} from "@/services/dashboardService";

interface DashboardState {
	data: DashboardData | null;
	loading: boolean;
	error: string | null;

	fetchDashboard: (params?: DashboardQueryParams) => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set) => ({
	data: null,
	loading: true,
	error: null,

	fetchDashboard: async (params = { filter: "month" }) => {
		set({ loading: true, error: null });
		try {
			const data = await getDashboardSummary(params);
			set({ data, loading: false });
		} catch (error: any) {
			const msg = error.response?.data?.message || "Lỗi tải dữ liệu dashboard";
			set({ error: msg, loading: false });
			toast.error(msg);
		}
	},
}));

export default useDashboardStore;
