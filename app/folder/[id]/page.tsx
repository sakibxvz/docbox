'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, FileText } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import FileUploader from '@/components/file-uploader';
import FileContextMenu from '@/components/file-context-menu';
import { useToast } from '@/hooks/use-toast';
import { useFolderInfo, useFolderPath } from '@/services/Query';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

// Define TypeScript types for the folder and file objects
type FolderItem = {
	id: number;
	name: string;
	type: 'folder' | 'document';
};

export default function FolderPage() {
	const { toast } = useToast();
	const params = useParams();
	const { id } = params as { id: string }; // Ensure type safety
	const queryClient = useQueryClient(); // Initialize query client

	// Fetch folder information and children using Tanstack Query
	const {
		data: folderData,
		isLoading: isFolderLoading,
		error: folderError,
	} = useFolderInfo(Number(id));

	// Fetch breadcrumb path using Tanstack Query
	const {
		data: pathData,
		isLoading: isPathLoading,
		error: pathError,
	} = useFolderPath(Number(id));

	const handleMoveComplete = () => {
		toast({ title: 'Move completed successfully' });
	};

	// Function to invalidate the folder query after upload
	const handleUploadComplete = () => {
		queryClient.invalidateQueries(['folder-info', Number(id)]);
	};

	if (isFolderLoading || isPathLoading) {
		return <Spinner className='flex items-center justify-center' />;
	}
	if (folderError || pathError) {
		return <p className='text-red-500'>Failed to load folder information.</p>;
	}

	// Separate folders and files from the fetched folder data
	const folders: FolderItem[] =
		folderData?.data?.filter((item: FolderItem) => item.type === 'folder') ||
		[];
	const files: FolderItem[] =
		folderData?.data?.filter((item: FolderItem) => item.type === 'document') ||
		[];
	const breadcrumbPathData = pathData?.data || [];

	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/'>Home</BreadcrumbLink>
					</BreadcrumbItem>

					{breadcrumbPathData.map((folder) => (
						<React.Fragment key={folder.id}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink
									href={`/folder/${folder.id}`}
									className='flex items-center'
								>
									<span className='flex font-normal text-foreground'>
										{folder.name}
									</span>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			<div className='p-4 mt-5 space-y-4'>
				{/* Folders section */}
				<section>
					{folders.length ? (
						<>
							<h2 className='text-lg font-semibold mb-2'>Folders</h2>
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								{folders.map((folder) => (
									<Card
										key={folder.id}
										className='dark:bg-slate-800 dark:border-slate-700 cursor-pointer'
									>
										<CardHeader className='flex flex-row items-center justify-between space-y-0'>
											<Link href={`/folder/${folder.id}`} passHref>
												<CardTitle className='text-sm font-medium cursor-pointer'>
													<Folder className='w-5 h-5 inline-block text-blue-500 mr-2' />
													{folder.name}
												</CardTitle>
											</Link>

											<FileContextMenu
												id={folder.id}
												type='folder'
												side='right'
											/>
										</CardHeader>
									</Card>
								))}
							</div>
						</>
					) : (
						<p className='text-gray-500'>No folders available.</p>
					)}
				</section>

				{/* Files section */}
				<section className='pt-5'>
					{files.length ? (
						<>
							<h2 className='text-lg font-semibold mb-4'>Files</h2>
							<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
								{files.map((file) => (
									<Card key={file.id}>
										<CardHeader className='flex flex-row items-center justify-between space-y-0'>
											<CardTitle className='text-sm font-medium truncate'>
												<FileText className='w-5 h-5 inline-block mr-2' />
												<Link
													href={`/document/${file.id}`}
													passHref
													className='cursor-pointer'
												>
													{file.name}
												</Link>
											</CardTitle>
											<FileContextMenu id={file.id} type='file' side='right' />
										</CardHeader>
									</Card>
								))}
							</div>
						</>
					) : (
						<p className='text-gray-500'>No files available.</p>
					)}
				</section>
			</div>

			<div>
				{/* Pass the upload complete handler to FileUploader */}
				<FileUploader
					folderId={Number(id)}
					onUploadComplete={handleUploadComplete}
				/>
			</div>
		</div>
	);
}
