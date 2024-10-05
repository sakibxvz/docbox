/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/docbox/:path*',
				destination: 'http://45.248.150.185/docbox/restapi/index.php/:path*', // Proxy to Backend
			},
		];
	},
	async headers() {
		return [
			{
				source: '/docbox/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						// value: '*', // Avoid using '*', specify your frontend origin
						value: 'http://localhost:3000', // Update with your frontend domain
					},
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true', // Allow credentials (cookies)
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,POST,PUT,DELETE,OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization',
					},
				],
			},
		];
	},
};

export default nextConfig;
