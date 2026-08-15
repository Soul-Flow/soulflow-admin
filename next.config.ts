import type { NextConfig } from "next";

const nextConfig = {
	output: "standalone",
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	/* config options here */
	// @ts-expect-error
	allowedDevOrigins: ["shrubbery-surprise-dish.ngrok-free.dev"],
};

export default nextConfig;
