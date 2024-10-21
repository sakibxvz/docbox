// app/login/layout.tsx
export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>; // No need to wrap with <html> or <body> tags
}
