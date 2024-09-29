/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://45.248.150.185/docbox/restapi/index.php/:path*', // Proxy to Backend
			},
		];
	},
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*', // Allow all origins
					},
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true', // Allow credentials
					},
				],
			},
		];
	},
};

export default nextConfig;
