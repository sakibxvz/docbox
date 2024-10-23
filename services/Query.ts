// Query.ts
import { useQuery } from '@tanstack/react-query';
import {
	getFolderInfo,
	getChildrenFolders,
	getFolderPath,
	account,
	getDocumentInfo,
	getDocumentContent,
} from './api'; // Adjust the imports based on your api.ts

// Fetch folder info
export const useFolderInfo = (folderId: number) => {
	return useQuery({
		queryKey: ['folder', folderId, 'info'], // Unique query key for folder info
		queryFn: () => getFolderInfo(folderId),
	});
};

// Fetch folder children
export const useFolderChildren = (folderId: number) => {
	return useQuery({
		queryKey: ['folder', folderId, 'children'], // Unique query key for folder children
		queryFn: () => getChildrenFolders(folderId),
	});
};

// Fetch folder path
export const useFolderPath = (folderId: number) => {
	return useQuery({
		queryKey: ['folder', folderId, 'path'], // Unique query key for folder path
		queryFn: () => getFolderPath(folderId),
	});
};

// Fetch account details
export const useAccount = () => {
	return useQuery({
		queryKey: ['account'],
		queryFn: account,
	});
};


// Hook for fetching document info
export const useDocumentInfo = (documentId: string) => {
	return useQuery({
		queryKey: ['documents', documentId], // This should match the key being invalidated
		queryFn: () => getDocumentInfo(documentId),
		enabled: !!documentId, // Only run if documentId is provided
		select: (data) => data.data, // Assuming API returns data in the shape { data: ... }
	});
};

// Hook for fetching document content (Blob)
export const useDocumentContent = (documentId: string) => {
	return useQuery({
		queryKey: ['documentContent', documentId],
		queryFn: () => getDocumentContent(documentId),
		enabled: !!documentId, // Only run if documentId is provided
		select: (data) => data, // Assuming getDocumentContent returns raw data
	});
};