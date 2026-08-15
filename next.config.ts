import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.googleusercontent.com",
			},
			{
				protocol: "http",
				hostname: "**.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "qr.sepay.vn",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "9000",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "s3.souflow.shop",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "s3.souflow.shop",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
