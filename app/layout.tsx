// app/layout.tsx
'use client';
import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import DashboardWrapper from './dashboardWrapper';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const queryClient = new QueryClient();

	// Check if the current path is "/login", then don't use DashboardWrapper
	const isLoginPage = pathname === '/login';

	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<main>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<QueryClientProvider client={queryClient}>
							<ReactQueryDevtools initialIsOpen={false} />
							{/* Conditionally apply the DashboardWrapper */}
							{isLoginPage ? (
								children
							) : (
								<DashboardWrapper>{children}</DashboardWrapper>
							)}
						</QueryClientProvider>
					</ThemeProvider>
					<Toaster />
				</main>
			</body>
		</html>
	);
}
