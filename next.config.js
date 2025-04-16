/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		esmExternals: true,
	},
	env: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
	},
	webpack: (config) => {
		// Suprimir o aviso de depreciação do punycode
		config.ignoreWarnings = [
			{
				module: /node_modules\/punycode/,
				message: /The `punycode` module is deprecated/,
			},
		];
		return config;
	},
};

export default nextConfig;
