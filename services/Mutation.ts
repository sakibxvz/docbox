import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	login,
	createFolder,
	deleteFolder,
	moveFile,
	moveFolder,
	deleteDocument,
	uploadDocument,
} from './api'; // Adjust the imports based on your api.ts

// POST: Login
export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: login,
		onSuccess: () => {
			// Invalidate and refetch account details after login
			queryClient.invalidateQueries({ queryKey: ['account'] });
		},
	});
};

// POST: Create a new folder
export const useCreateFolder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			parentFolderId,
			folderName,
			comment,
			sequence,
			attributes,
		}: {
			parentFolderId: number;
			folderName: string;
			comment: string;
			sequence: string;
			attributes: any;
		}) =>
			createFolder(
				parentFolderId,
				folderName,
				comment,
				Number(sequence),
				attributes
			),
		onSuccess: () => {
			// Invalidate folder-related queries to refetch data after creation
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});
};

// DELETE: Delete a folder
export const useDeleteFolder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (folderId: number) => deleteFolder(folderId),
		onMutate: async (folderId: number) => {
			await queryClient.cancelQueries({ queryKey: ['folder', folderId, 'children'] });
			await queryClient.cancelQueries({ queryKey: ['folder', folderId, 'info'] });

			const previousFolders = queryClient.getQueryData(['folders']) || [];

			queryClient.setQueryData(['folders'], (oldFolders: any[]) => {
				if (!oldFolders) return [];
				return oldFolders.filter((folder) => folder.id !== folderId);
			});

			return { previousFolders };
		},
		onError: (err, folderId, context: any) => {
			queryClient.setQueryData(['folders'], context.previousFolders);
		},
		onSettled: () => {
			// Invalidate queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: ['folders'] });
			queryClient.invalidateQueries({ queryKey: ['folder'] }); // Invalidate all folder-related queries
		},
	});
};

// DELETE: Delete a document
export const useDeleteDocument = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (documentId: number) => deleteDocument(documentId),
		// Optimistic Update
		onMutate: async (documentId: number) => {
			await queryClient.cancelQueries({ queryKey: ['folder', documentId, 'children'] });
			await queryClient.cancelQueries({ queryKey: ['folder', documentId, 'info'] });

			const previousDocuments = queryClient.getQueryData(['documents']) || [];

			queryClient.setQueryData(['documents'], (oldDocuments: any[]) => {
				if (!oldDocuments) return [];
				return oldDocuments.filter((doc) => doc.id !== documentId);
			});

			return { previousDocuments };
		},
		// Rollback in case of failure
		onError: (err, documentId, context: any) => {
			queryClient.setQueryData(['documents'], context.previousDocuments);
		},
		// Refetch after mutation
		onSettled: () => {
			// Invalidate all related queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: ['documents'] });
			queryClient.invalidateQueries({ queryKey: ['folder', 'children'] }); // Refetch the folder children query
			queryClient.invalidateQueries({ queryKey: ['folder'] }); // Invalidate folder queries as well
		},
	});
};

// POST: Move a file
export const useMoveFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			fileId,
			targetFolderId,
		}: {
			fileId: number;
			targetFolderId: number;
		}) => moveFile(fileId, targetFolderId),
		onSuccess: () => {
			// Invalidate file and folder-related queries to refetch data after moving
			queryClient.invalidateQueries({ queryKey: ['files'] });
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});
};

// POST: Move a folder
export const useMoveFolder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ folderId, targetFolderId }: { folderId: number; targetFolderId: number }) =>
			moveFolder(folderId, targetFolderId),
		onSuccess: () => {
			// Invalidate queries related to folder structure
			queryClient.invalidateQueries({ queryKey: ['folders'] });
			queryClient.invalidateQueries({ queryKey: ['folder'] }); // Invalidate all folder-related queries
		},
	});
};

// POST: Upload a document
export const useUploadDocument = (
	onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			parentFolderId,
			file,
			metadata,
		}: {
			parentFolderId: number;
			file: File;
			metadata?: {
				docname?: string;
				origfilename?: string;
			};
		}) => uploadDocument(parentFolderId, file, metadata, onUploadProgress),
		onSuccess: () => {
			// Invalidate document and folder-related queries to refetch data after upload
			queryClient.invalidateQueries({ queryKey: ['documents'] });
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});
};
