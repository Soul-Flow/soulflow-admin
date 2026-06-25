import axios from "axios";

const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Chỗ này để sau này nhét Token vào (Interceptor)
axiosClient.interceptors.request.use(
	(config) => {
		// TODO: Gắn token vào header Authorization ở đây
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Chỗ này để xử lý lỗi đồng loạt (ví dụ: hết hạn token thì văng ra trang login)
axiosClient.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		// TODO: Xử lý lỗi 401, 403...
		return Promise.reject(error);
	},
);

export default axiosClient;
