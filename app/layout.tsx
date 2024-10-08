'use client';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import DashboardWrapper from './dashboardWrapper';
import { Toaster } from '@/components/ui/toaster';

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
						<DashboardWrapper>{children}</DashboardWrapper>
					</ThemeProvider>
					<Toaster />
				</main>
			</body>
		</html>
	);
}
