import api from "../lib/api";

export interface SystemActivityLog {
	id: string;
	category: string;
	action: string;
	performedBy: string;
	role: string;
	target: string;
	details: string;
	ipAddress: string;
	timestamp: string;
}

export const logService = {
	getLogs: async (params?: {
		category?: string;
		keyword?: string;
		limit?: number;
	}): Promise<SystemActivityLog[]> => {
		const response = await api.get<SystemActivityLog[]>("/logs", { params });
		return response.data;
	},

	clearLogs: async (): Promise<void> => {
		await api.delete("/logs");
	},
};
