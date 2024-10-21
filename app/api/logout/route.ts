import { logout } from '@/services/api';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// const { success, message, data } = await logout();
		// // Clear the cookie
		// if (success === true) {
		// 	const response = NextResponse.redirect('http://localhost:3000/login'); // Use absolute URL here
		// 	response.cookies.set('mydms_session', '', {
		// 		path: '/',
		// 		expires: new Date(0),
		// 	});
		// 	return response;
		// } else {
		// 	return new NextResponse(message, { status: 500 });
		// }
		const response = NextResponse.redirect('http://localhost:3000/login'); // Use absolute URL here
		response.cookies.set('mydms_session', '', {
			path: '/',
			expires: new Date(0),
		});
		return response;
	} catch (error) {
		console.error('Error in logout API:', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
