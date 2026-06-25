import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8080/admin",
	timeout: 16000
});

// Token getter registered by accountStore after it initialises.
// This breaks the circular dependency:
//   api.ts → accountStore.ts → accountService.ts → api.ts
let getToken: (() => string | null | undefined) = () => null;

export function registerTokenGetter(fn: () => string | null | undefined) {
	getToken = fn;
}

api.interceptors.request.use(
	(config) => {
		const token = getToken();

		const language =
			typeof window !== "undefined"
				? (sessionStorage.getItem("lang") ?? "vi")
				: "vi";

		if (token) config.headers.Authorization = `Bearer ${token}`;
		config.headers["Accept-Language"] = language;

		return config;
	},
	(error) => Promise.reject(error),
);

api.interceptors.response.use(
	(response) => {
		console.log("Response:", {
			url: response.config.url,
			method: response.config.method,
			status: response.status,
			data: response.data,
		});

		return response;
	},
	(error) => {
		console.error("API Error:", {
			url: error.config?.url,
			method: error.config?.method,
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});

		return Promise.reject(error);
	},
);

export default api;
