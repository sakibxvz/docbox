import axios from 'axios';

const apiClient = axios.create({
	baseURL: '/api', // Use the proxy path
	withCredentials: true, // Important for cookies
});

apiClient.interceptors.request.use((config) => {
	config.headers['Authorization'] = `Bearer 36e0b5372031b88a79047e34409a8612`;
	return config;
});

interface Credentials {
	user?: string; // Make user optional
	pass?: string; // Make pass optional
}

export const login = async (credentials: Credentials) => {
	const formData = new FormData();
	formData.append('user', credentials.user || '');
	formData.append('pass', credentials.pass || '');

	try {
		const response = await apiClient.post('/login', formData);
		console.log('Response Data:', response.data); // Log the response data
		return response.data; // Return just the data for ease of use
	} catch (error) {
		console.error('Login error:', error);
		throw error;
	}
};

export const logout = async () => {
	try {
		const response = await apiClient.get('/logout');
		return response.data;
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
};

export const getFolder = async (id: number) => {
	try {
		const response = await apiClient.get(`/folder/${id}`);
		return response.data;
	} catch (error) {
		console.error('Get folder error:', error);
		throw error;
	}
};
