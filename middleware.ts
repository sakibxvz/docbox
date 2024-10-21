import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to check for mydms_session cookie
export function middleware(request: NextRequest) {
	// Check for the 'mydms_session' cookie in the request
	const mydmsSessionCookie = request.cookies.get('mydms_session');

	// Log the cookie for debugging
	console.log('mydms_session cookie:', mydmsSessionCookie);

	// Allow requests to API paths and /docbox/* paths
	const isApiPath = request.nextUrl.pathname.startsWith('/api');
	const isDocboxPath = request.nextUrl.pathname.startsWith('/docbox');
	const isLoginPath = request.nextUrl.pathname.startsWith('/login');

	// Allow access to static files (CSS, JS, images, etc.)
	const isStaticFile =
		/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/.test(
			request.nextUrl.pathname
		);

	// 1. If the user is logged in (has the mydms_session cookie) and trying to access /login, redirect to home (/)
	if (mydmsSessionCookie && isLoginPath) {
		console.log(
			'Redirecting from /login to / because mydms_session cookie is present.'
		);
		return NextResponse.redirect(new URL('/', request.url));
	}

	// 2. Allow the request to proceed if it's for allowed paths (API, docbox, static files) or the user is logged in
	if (mydmsSessionCookie || isApiPath || isDocboxPath || isStaticFile) {
		return NextResponse.next();
	} else {
		// 3. If the cookie is not present and the user is trying to access any other route, redirect to /login
		console.log(
			'Redirecting to /login because mydms_session cookie is not present.'
		);
		return NextResponse.rewrite(new URL('/login', request.url)); // Redirect to login page
	}
}

// Specify the paths to apply this middleware
export const config = {
	matcher: ['/((?!api|docbox|_next/static|_next/image).*)'], // Protect all routes except API, /docbox/*, and static files
};
