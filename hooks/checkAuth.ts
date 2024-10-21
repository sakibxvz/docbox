import { cookies } from 'next/headers';

// Function to check if specified cookies exist
const useServerCookies = (cookieNames) => {
	const cookieStore = cookies(); // Get the cookie store
	const allCookiesExist = cookieNames.every((cookie) => {
		return cookieStore.get(cookie) !== undefined; // Check for each cookie
	});

	return allCookiesExist;
};

export default useServerCookies;
