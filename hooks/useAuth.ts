import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Initial state is null (unknown)
	const [loading, setLoading] = useState(true); // Loading state
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		console.log('All cookies:', document.cookie);
		const sessionCookie = document.cookie
			.split('; ')
			.find((row) => row.startsWith('mydms_session='));
		
		console.log(sessionCookie);
		

		if (sessionCookie) {
			setIsAuthenticated(true); // Authenticated if cookie exists
		} else {
			setIsAuthenticated(false); // Not authenticated if no cookie
			if (pathname !== '/login') {
				router.push('/login'); // Redirect only if not on the login page
			}
		}
		setLoading(false); // Set loading to false after checking
	}, [router, pathname]);

	if (loading) {
		return null; // or some loading spinner
	}

	return isAuthenticated;
};


export default useAuth;
