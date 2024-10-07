import {
	ErrorResponse,
	FetchAccountResponse,
	FetchChildrenResponse,
	FetchFolderResponse,
	Folder,
	FolderPath,
	GetFolderPathResponse,
	LoginResponse,
	User,
} from '@/types/type';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
	baseURL: '/docbox', // Proxy path
	withCredentials: true, // Allow sending and receiving cookies
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use((config) => {
	config.headers['Authorization'] = `Bearer 36e0b5372031b88a79047e34409a8612`;
	console.log('Request Headers:', config.headers); // Log headers
	return config;
});

export interface LoginCredentials {
	user: string;
	pass: string;
}

export const login = async (
	credentials: LoginCredentials
): Promise<LoginResponse> => {
	const formData = new FormData();
	formData.append('user', credentials.user || '');
	formData.append('pass', credentials.pass || '');

	try {
		const response = await apiClient.post('/login', formData, {
			withCredentials: true, // Include credentials (cookies)
		});

		// Check if the response status is successful and contains user data
		if (response.status === 200 && response.data.data?.id) {
			const user: User = response.data.data;

			// Extract the 'set-cookie' header from the response
			const cookies = response.headers['set-cookie'];

			// Log cookies for debugging
			console.log('Cookies from response:', cookies);

			if (cookies) {
				// Assuming cookies is an array, pick the first cookie (which should be the session cookie)
				const cookieValue = Array.isArray(cookies) ? cookies[0] : cookies;

				// Store the cookie with the correct value
				Cookies.set('mydms_session', cookieValue, {
					path: '/', // Cookie is valid throughout the site
					sameSite: 'None', // Allow cookies for cross-origin requests
					secure: true, // Set to true if your site runs over HTTPS
					expires: 7, // 7-day expiration for the cookie
				});

				// Log the cookie value immediately after setting it
				console.log('Stored Cookie Value:', Cookies.get('mydms_session'));
			}

			return user;
		} else {
			// Handle invalid login response
			return {
				success: false,
				message: response.data.message || 'Login failed. Invalid credentials.',
				data: '',
			} as ErrorResponse;
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data } = error.response;

			// Handle error response from the server
			return {
				success: false,
				message: data.message || 'Login failed',
				data: '',
			} as ErrorResponse;
		} else {
			return {
				success: false,
				message: 'An unexpected error occurred',
				data: '',
			} as ErrorResponse;
		}
	}
};

// Fetch account details
export const account = async (): Promise<FetchAccountResponse> => {
	try {
		const response = await axios.get('http://localhost:3000/docbox/account', {
			withCredentials: true,
		});

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200) {
			const accountData: User = response.data.data;
			return {
				success: true,
				message: '',
				data: accountData,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch account details.',
				data: null,
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			console.error('Error response:', data, 'Status Code:', status); // Log status
			return {
				success: false,
				message:
					data.message || 'An error occurred while fetching account details.',
				data: null,
			};
		} else {
			console.error('Unexpected error:', error);
			return {
				success: false,
				message: 'An unexpected error occurred',
				data: null,
			};
		}
	}
};

// API route handler
export const logout = async () => {
	try {
		await apiClient.get('/logout', {
			withCredentials: true, // Include this line to send cookies
		}); // Call the logout endpoint
	} catch (error) {
		console.error('Logout error:', error);
		throw error; // Rethrow error to handle it where you call this function
	}
};

// Get Children Folder
export const getChildrenFolders = async (
	folderId: number
): Promise<FetchChildrenResponse> => {
	try {
		const response = await axios.get(
			`http://localhost:3000/docbox/folder/${folderId}/children`,
			{
				withCredentials: true,
			}
		);

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200) {
			const childrenData: Folder[] = response.data.data.filter(
				(item: Folder) => item.type === 'folder'
			); // Filter only folders
			return {
				success: true,
				message: '',
				data: childrenData,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch children folders.',
				data: null,
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			console.error('Error response:', data, 'Status Code:', status); // Log status
			return {
				success: false,
				message:
					data.message || 'An error occurred while fetching children folders.',
				data: null,
			};
		} else {
			console.error('Unexpected error:', error);
			return {
				success: false,
				message: 'An unexpected error occurred',
				data: null,
			};
		}
	}
};

// Function to get folder data based on folderId
export const getFolderInfo = async (folderId: number): Promise<FetchFolderResponse> => {
	try {
		const response = await axios.get(
			`http://localhost:3000/docbox/folder/${folderId}/children`,
			{
				withCredentials: true,
			}
		);

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200) {
			return {
				success: true,
				message: '',
				data: response.data.data, // Return the data as is
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch folder data.',
				data: null,
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			console.error('Error response:', data, 'Status Code:', status); // Log status
			return {
				success: false,
				message:
					data.message || 'An error occurred while fetching folder data.',
				data: null,
			};
		} else {
			console.error('Unexpected error:', error);
			return {
				success: false,
				message: 'An unexpected error occurred',
				data: null,
			};
		}
	}
};

// Function to get Folder path based on the folderId
export const getFolderPath = async (
	folderId: number
): Promise<GetFolderPathResponse> => {
	try {
		const response = await axios.get(
			`http://localhost:3000/docbox/folder/${folderId}/path`,
			{
				withCredentials: true,
			}
		);

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200 && response.data.success) {
			const folderPathData: FolderPath[] = response.data.data;
			return {
				success: true,
				message: '',
				data: folderPathData,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch folder path.',
				data: [],
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			console.error('Error response:', data, 'Status Code:', status); // Log status
			return {
				success: false,
				message:
					data.message || 'An error occurred while fetching folder path.',
				data: [],
			};
		} else {
			console.error('Unexpected error:', error);
			return {
				success: false,
				message: 'An unexpected error occurred',
				data: [],
			};
		}
	}
};