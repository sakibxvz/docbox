import {
	ErrorResponse,
	FetchAccountResponse,
	FetchChildrenResponse,
	FetchFolderResponse,
	Folder,
	FolderPath,
	GetFolderPathResponse,
	LoginResponse,
	MoveFileResponse,
	MoveFolderResponse,
	User,
	Document,
} from '@/types/type';
import axios, { AxiosProgressEvent } from 'axios';

const apiClient = axios.create({
	baseURL: '/docbox', // Proxy path
	withCredentials: true, // Allow sending and receiving cookies
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use((config) => {
	config.headers['Authorization'] = `Bearer 36e0b5372031b88a79047e34409a8612`;
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
		return {
			success: false,
			message: 'An unexpected error occurred',
			data: '',
		} as ErrorResponse;
	}
};

// Fetch account details
export const account = async (): Promise<FetchAccountResponse> => {
	try {
		const response = await axios.get('http://localhost:3000/docbox/account', {
			withCredentials: true,
		});

		console.log('Response:', response.data); // Log the response datadocument

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
		console.error('Unexpected error:', error);
		return {
			success: false,
			message: 'An unexpected error occurred',
			data: null,
		};
	}
};

// API route handler
export const logout = async () => {
	try {
		const response = await apiClient.get(
			'http://localhost:3000/docbox/logout',
			{
				withCredentials: true, // Include this line to send cookies
			}
		);

		if (response.status === 200) {
			console.log('Logout Succeffully');
			return response.data;
		} else {
			console.log('Unexpected response status:', response.status);
			console.log('Logout Failed');
		}
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
		console.error('Unexpected error:', error);
		return {
			success: false,
			message: 'An unexpected error occurred',
			data: null,
		};
	}
};

// Function to get folder data based on folderId
export const getFolderInfo = async (
	folderId: number
): Promise<FetchFolderResponse> => {
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

// Move a Folder to a new destination
export const moveFolder = async (
	folderIdToMove: number,
	destinationFolderId: number
): Promise<MoveFolderResponse> => {
	try {
		const response = await axios.post(
			`http://localhost:3000/docbox/folder/${folderIdToMove}/move/${destinationFolderId}`,
			{}, // Since it's a POST request, passing an empty object as the body.
			{
				withCredentials: true,
			}
		);

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200) {
			return {
				success: true,
				message: response.data.message || '',
				data: response.data.data,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to move the folder.',
				data: null,
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			console.error('Error response:', data, 'Status Code:', status); // Log status
			return {
				success: false,
				message: data.message || 'An error occurred while moving the folder.',
				data: null,
			};
		} else {
			console.error('Unexpected error:', error);
			return {
				success: false,
				message: 'An unexpected error occurred.',
				data: null,
			};
		}
	}
};

// Move a File to a new destination
export const moveFile = async (
	fileId: number,
	destinationFolderId: number
): Promise<MoveFileResponse> => {
	try {
		const response = await axios.post(
			`http://localhost:3000/docbox/document/${fileId}/move/${destinationFolderId}`,
			{}, // Passing an empty object as the body for the POST request
			{
				withCredentials: true,
			}
		);

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200) {
			return {
				success: true,
				message: response.data.message || '',
				data: response.data.data,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to move the file.',
				data: null,
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			console.error('Error response:', data, 'Status Code:', status); // Log status
			return {
				success: false,
				message: data.message || 'An error occurred while moving the file.',
				data: null,
			};
		} else {
			console.error('Unexpected error:', error);
			return {
				success: false,
				message: 'An unexpected error occurred.',
				data: null,
			};
		}
	}
};

// Delete Folder
export const deleteFolder = async (
	folderId: number
): Promise<{ success: boolean; message: string }> => {
	try {
		const response = await axios.delete(
			`http://localhost:3000/docbox/folder/${folderId}`, // Update the endpoint for deleting a folder
			{
				withCredentials: true,
			}
		);

		return {
			success: response.data.success,
			message: response.data.message,
		};
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				message: error.response.data.message || 'Failed to delete the folder.',
			};
		} else {
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the folder.',
			};
		}
	}
};

// Get a document info

export const getDocumentInfo = async (
	documentId: string
): Promise<{ success: boolean; message: string; data: Document | null }> => {
	try {
		const response = await axios.get(
			`http://localhost:3000/docbox/document/${documentId}`,
			{
				withCredentials: true,
			}
		);

		if (response.status === 200) {
			const documentData: Document = response.data.data;
			return {
				success: true,
				message: '',
				data: documentData,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch document details.',
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
					data.message || 'An error occurred while fetching document details.',
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

// Get a document content
export const getDocumentContent = async (documentId: string) => {
	try {
		const response = await axios.get(
			`http://localhost:3000/docbox/document/${documentId}/content`,
			{
				withCredentials: true,
				responseType: 'blob',
			}
		);

		if (response.status === 200) {
			console.log(response.data);
			return response.data;
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch document content.',
				content: null,
			};
		}
	} catch (error) {
		console.error('Unexpected error:', error);
		return {
			success: false,
			message: 'An unexpected error occurred',
			content: null,
		};
	}
};

// Delete a document
export const deleteDocument = async (
	documentId: number
): Promise<{ success: boolean; message: string }> => {
	try {
		const response = await axios.delete(
			`http://localhost:3000/docbox/document/${documentId}`,
			{
				withCredentials: true,
			}
		);

		return {
			success: response.data.success,
			message: response.data.message,
		};
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				message:
					error.response.data.message || 'Failed to delete the document.',
			};
		} else {
			return {
				success: false,
				message: 'An unexpected error occurred while deleting the document.',
			};
		}
	}
};

// Upload a document to a folder
/**
 * Function to upload a document with metadata.
 *
 * @param folderId - The ID of the folder where the document will be uploaded
 * @param file - The file to upload
 * @param metadata - An object containing additional metadata for the document
 * @param onUploadProgress - Optional callback to track upload progress using AxiosProgressEvent
 * @returns A promise with the response of the upload
 */
export const uploadDocument = async (
	folderId: number,
	file: File,
	metadata: {
		docname?: string;
		comment?: string;
		keywords?: string;
		sequence?: number;
		expdate?: string;
		version_comment?: string;
		reqversion?: number;
		origfilename?: string;
		categories?: number[];
		owner?: number; // ID of the owner if admin
		attributes?: { [key: string]: string };
	} = {},
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void // Use AxiosProgressEvent here
): Promise<{
	success: boolean;
	message: string;
	data?: { id: number; name: string };
}> => {
	try {
		const formData = new FormData();
		formData.append('file', file); // Attach the file

		// Append metadata if provided
		if (metadata.docname) formData.append('name', metadata.docname);
		if (metadata.comment) formData.append('comment', metadata.comment);
		if (metadata.keywords) formData.append('keywords', metadata.keywords);
		if (metadata.sequence)
			formData.append('sequence', metadata.sequence.toString());
		if (metadata.expdate) formData.append('expdate', metadata.expdate); // Format: YYYY-MM-DD
		if (metadata.version_comment)
			formData.append('version_comment', metadata.version_comment);
		if (metadata.reqversion)
			formData.append('reqversion', metadata.reqversion.toString());
		if (metadata.origfilename)
			formData.append('origfilename', metadata.origfilename);
		if (metadata.categories && metadata.categories.length > 0) {
			metadata.categories.forEach((cat) =>
				formData.append('categories[]', cat.toString())
			);
		}
		if (metadata.owner) formData.append('owner', metadata.owner.toString());
		if (metadata.attributes) {
			Object.entries(metadata.attributes).forEach(([attrdefid, attribute]) => {
				formData.append(`attributes[${attrdefid}]`, attribute);
			});
		}

		const response = await axios.post(
			`http://localhost:3000/docbox/folder/${folderId}/document`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
				onUploadProgress, // Use AxiosProgressEvent here
			}
		);

		return {
			success: response.data.success,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				message: error.response.data.message || 'Upload failed.',
			};
		} else {
			return {
				success: false,
				message: 'An unexpected error occurred during upload.',
			};
		}
	}
};

// Create a fodler
export const createFolder = async (
	parentFolderId: number,
	folderName: string,
	comment?: string,
	sequence?: number,
	attributes?: Record<string, any>
): Promise<{ success: boolean; message: string; data?: any }> => {
	try {
		const response = await axios.post(
			`http://localhost:3000/docbox/folder/${parentFolderId}/folder`,
			{
				name: folderName,
				comment: comment || '',
				sequence: sequence || undefined,
				attributes: attributes || {},
			},
			{
				withCredentials: true,
			}
		);

		return {
			success: response.data.success,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error) {
		return {
			success: false,
			message:
				axios.isAxiosError(error) && error.response
					? error.response.data.message || 'Failed to create the folder.'
					: 'Failed to create the folder.',
		};
	}
};

// Get User Info
export const getUserInfo = async (
	userId: number
): Promise<{ success: boolean; message: string; data: User | null }> => {
	try {
		const response = await axios.get(
			`http://localhost:3000/docbox/users/${userId}`,
			{
				withCredentials: true,
			}
		);

		console.log('Response:', response.data); // Log the response data

		if (response.status === 200) {
			const userData: User = response.data.data;
			return {
				success: true,
				message: '',
				data: userData,
			};
		} else {
			console.log('Unexpected response status:', response.status);
			return {
				success: false,
				message: response.data.message || 'Failed to fetch user details.',
				data: null,
			};
		}
	} catch (error) {
		return {
			success: false,
			message: 'An error occurred while fetching user details.',
			data: null,
		};
	}
};
