'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Folder, FileText, MoreVertical } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
	deleteDocument,
	deleteFolder,
	getFolderInfo,
	getFolderPath,
} from '@/services/api'; // getFolderPath API
import { useParams } from 'next/navigation';
import {
	FetchChildrenResponse,
	Folder as FolderType,
	Document as DocumentType,
} from '@/types/type'; // Import types
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import FileFolderMove from '@/components/file-move';
import FileUploader from '@/components/file-uploader';
import { useToast } from '@/hooks/use-toast';
import FileContextMenu from '@/components/file-context-menu';

export default function FolderPage() {
	const [folders, setFolders] = useState<FolderType[]>([]);
	const [files, setFiles] = useState<DocumentType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [breadcrumbPath, setBreadcrumbPath] = useState<
		{ id: string; name: string }[]
	>([]); // For breadcrumbs
	const { toast } = useToast();

	const params = useParams();
	const { id } = params;

	const handleMoveComplete = () => {
		// Refresh your file/folder list or update state as needed
		console.log('Move completed successfully');
	};

	// Handle Delete Document
	const handleDeleteDocument = async (documentId: number) => {
		const result = await deleteDocument(documentId);
		if (result.success) {
			toast({
				title: 'Document Deleted',
				description: 'The document has been deleted successfully.',
				variant: 'destructive', // Adjust the variant if your toast library supports it
				duration: 1000,
			});

			// Update the files state to remove the deleted document
			setFiles((prevFiles) =>
				prevFiles.filter((file) => file.id !== documentId)
			);
		} else {
			toast({
				title: 'Error',
				description: result.message,
				variant: 'default', // Adjust the variant if your toast library supports it
				duration: 1000,
			});
		}
	};

	// handle Delete Folder
	const handleDeleteFolder = async (folderId: number) => {
		const result = await deleteFolder(folderId);
		if (result.success) {
			toast({
				title: 'Folder Deleted',
				description: 'The folder has been deleted successfully.',
				variant: 'destructive', // Adjust the variant if your toast library supports it
				duration: 1000,
			});

			// Update the folders state to remove the deleted folder
			setFolders((prevFolders) =>
				prevFolders.filter((folder) => folder.id !== folderId)
			);
		} else {
			toast({
				title: 'Error',
				description: result.message,
				variant: 'default', // Adjust the variant if your toast library supports it
				duration: 1000,
			});
		}
	};

	useEffect(() => {
		console.log('Folder ID:', id);
		// Fetch folder info and path data from the API
		const fetchData = async () => {
			try {
				// Fetch the folder info (children)
				const response: FetchChildrenResponse = await getFolderInfo(Number(id));
				if (response.success) {
					// Separate folders and files
					const fetchedFolders =
						(response.data?.filter(
							(item) => item.type === 'folder'
						) as FolderType[]) || [];
					const fetchedFiles =
						(response.data?.filter(
							(item) => item.type === 'document'
						) as DocumentType[]) || [];
					setFolders(fetchedFolders);
					setFiles(fetchedFiles);
				} else {
					setError('Failed to fetch folder data.');
				}

				// Fetch the breadcrumb path
				const pathResponse = await getFolderPath(Number(id));
				if (pathResponse.success) {
					setBreadcrumbPath(pathResponse.data);
				} else {
					setError('Failed to fetch folder path.');
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError('An error occurred while fetching data.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (loading) return <Spinner className='items-center justify-between' />;
	if (error) return <p>{error}</p>;

	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/'>Home</BreadcrumbLink>
					</BreadcrumbItem>

					{breadcrumbPath.map((folder, index) => {
						const isLast = index === breadcrumbPath.length - 1;
						return (
							<React.Fragment key={folder.id}>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbLink
											href={`/folder/${folder.id}`}
											className='flex items-center justify-center'
										>
											<span className='flex font-normal text-foreground'>
												{folder.name}
											</span>
										</BreadcrumbLink>
									) : (
										<BreadcrumbLink
											href={`/folder/${folder.id}`}
											className='flex items-center justify-center'
										>
											{folder.name}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						);
					})}
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

											<FileContextMenu side='right' />
											{/* <DropdownMenu>
													<DropdownMenuTrigger>
														<MoreVertical className='w-4 h-4' />
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>
															<Link
																key={folder.id}
																href={`/folder/${folder.id}`}
																passHref
															>
																Open
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem>Rename</DropdownMenuItem>
														<FileFolderMove
															item={{
																type: 'folder',
																id: Number(folder.id),
															}}
															onMoveComplete={handleMoveComplete}
														/>
														<DropdownMenuItem
															onClick={() => handleDeleteFolder(folder.id)}
														>
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu> */}
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
									<Card key={file.name}>
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
											<DropdownMenu>
												<DropdownMenuTrigger>
													<MoreVertical className='h-4 w-4' />
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuItem>
														<Link
															href={`/document/${file.id}`}
															passHref
															className='cursor-pointer'
														>
															Open
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															window.open(
																`http://localhost:3000/docbox/document/${file.id}/content`,
																'_blank'
															);
														}}
													>
														Download
													</DropdownMenuItem>
													<DropdownMenuItem>Rename</DropdownMenuItem>
													<FileFolderMove
														item={{
															type: 'document',
															id: Number(file.id),
														}}
														onMoveComplete={handleMoveComplete}
													/>
													<DropdownMenuItem
														onClick={() => handleDeleteDocument(file.id)}
													>
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
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
				<FileUploader folderId={Number(id)} />
			</div>
		</div>
	);
}
