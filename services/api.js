import axios from 'axios';

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	withCredentials: true, // If the backend uses cookies for sessions
});

export const login = (credentials) => apiClient.post('/login', credentials);
export const logout = () => apiClient.get('/logout');
export const getFolder = (id) => apiClient.get(`/folder/${id}`);
// Add other API methods similarly
