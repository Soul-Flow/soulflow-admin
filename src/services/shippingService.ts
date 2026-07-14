import api from "../lib/api";

export interface CalculateFeeResponse {
	total: number;
	service_fee: number;
}

export const shippingService = {
	calculateFee: async (toDistrictId: number, toWardCode: string): Promise<CalculateFeeResponse> => {
		const response = await api.post("/user/shipping/calculate-fee", {
			toDistrictId,
			toWardCode,
			weight: 2000,
		}, {
			baseURL: api.defaults.baseURL ? api.defaults.baseURL.replace("/admin", "") : "http://localhost:8080",
		});
		
		const data = response.data as any;
		if (data?.data && typeof data.data.total === "number") {
			return { total: data.data.total, service_fee: data.data.service_fee || 0 };
		}
		if (data && typeof data.total === "number") {
			return { total: data.total, service_fee: data.service_fee || 0 };
		}
		
		return { total: 30000, service_fee: 0 };
	},
};
