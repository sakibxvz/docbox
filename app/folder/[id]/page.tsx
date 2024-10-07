'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { getFolderInfo, getFolderPath } from '@/services/api'; // getFolderPath API
import { useParams } from 'next/navigation';
import {
	FetchChildrenResponse,
	Folder as FolderType,
	Document as DocumentType,
} from '@/types/type'; // Import types
import { Spinner } from '@/components/ui/Spinner';
import Link from 'next/link';

export default function FolderPage() {
	const [folders, setFolders] = useState<FolderType[]>([]);
	const [files, setFiles] = useState<DocumentType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [breadcrumbPath, setBreadcrumbPath] = useState<
		{ id: string; name: string }[]
	>([]); // For breadcrumbs

	const params = useParams();
	const { id } = params;

	useEffect(() => {
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
			{/* Breadcrumb */}
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />

					{/* Dynamically generate breadcrumb items from the folder path */}
					{breadcrumbPath.map((folder, index) => (
						<>
							<BreadcrumbItem key={folder.id}>
								<BreadcrumbLink
									href={`/folder/${folder.id}`}
									className='flex items-center justify-center'
								>
									<Folder className='mr-1 w-5 h-5' />
									{folder.name}
								</BreadcrumbLink>
							</BreadcrumbItem>
							{index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
						</>
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
									<Link key={folder.id} href={`/folder/${folder.id}`} passHref>
										<Card className='dark:bg-slate-800 dark:border-slate-700 cursor-pointer'>
											<CardHeader className='flex flex-row items-center justify-between space-y-0'>
												<CardTitle className='text-sm font-medium'>
													<Folder className='w-5 h-5 inline-block text-blue-500 mr-2' />
													{folder.name}
												</CardTitle>
												<DropdownMenu>
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
														<DropdownMenuItem>Delete</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</CardHeader>
										</Card>
									</Link>
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
											<CardTitle className='text-sm font-medium'>
												<FileText className='w-5 h-5 inline-block mr-2' />
												{file.name}
											</CardTitle>
											<DropdownMenu>
												<DropdownMenuTrigger>
													<MoreVertical className='h-4 w-4' />
												</DropdownMenuTrigger>
												<DropdownMenuContent>
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
													<DropdownMenuItem>Delete</DropdownMenuItem>
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
		</div>
	);
}
