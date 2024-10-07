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
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getChildrenFolders, getFolderInfo } from '@/services/api';
import { useParams } from 'next/navigation';
import {
	FetchChildrenResponse,
	Folder as FolderType,
	Document as DocumentType,
} from '@/types/type'; // Import types

export default function FolderPage() {
	const [folders, setFolders] = useState<FolderType[]>([]);
	const [files, setFiles] = useState<DocumentType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const params = useParams();
	const { id } = params;

	useEffect(() => {
		// Fetch data from the API
		const fetchData = async () => {
			try {
				const response: FetchChildrenResponse = await getFolderInfo(Number(id));
				if (response.success) {
					// Separate folders and files
					const fetchedFolders = response.data.filter(
						(item) => item.type === 'folder'
					) as FolderType[];
					const fetchedFiles = response.data.filter(
						(item) => item.type === 'document'
					) as DocumentType[];
					setFolders(fetchedFolders);
					setFiles(fetchedFiles);
				} else {
					setError('Failed to fetch data.');
				}
			} catch (err) {
				setError('An error occurred while fetching data.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]); // Added id as a dependency
	console.log(folders, files);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							href='/'
							className='flex items-center justify-center'
						>
							<Folder className='mr-1 w-5 h-5' />
							Folder A
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							href='/'
							className='flex items-center justify-center'
						>
							<Folder size='20px' className='mr-1' />
							Folder B
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className='flex items-center justify-center'>
							<FileText size='20px' className='mr-1' />
							Breadcrumb
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className='p-4 mt-5 space-y-4'>
				<section>
					<h2 className='text-lg font-semibold mb-2'>Folders</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						{folders.map((folder) => (
							<Card
								className='dark:bg-slate-800 dark:border-slate-700'
								key={folder.id}
							>
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
											<DropdownMenuItem>Open</DropdownMenuItem>
											<DropdownMenuItem>Rename</DropdownMenuItem>
											<DropdownMenuItem>Delete</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</CardHeader>
							</Card>
						))}
					</div>
				</section>

				<section className='pt-5'>
					<h2 className='text-lg font-semibold mb-4'>Files</h2>
					<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						{files.map((file) => (
							<Card key={file.id}>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<CardTitle className='text-sm font-medium'>
										<FileText className='w-5 h-5 inline-block mr-2' />
										{file.name}
									</CardTitle>
									<DropdownMenu>
										<DropdownMenuTrigger>
											<MoreVertical className='h-4 w-4' />
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>Open</DropdownMenuItem>
											<DropdownMenuItem>Rename</DropdownMenuItem>
											<DropdownMenuItem>Delete</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</CardHeader>
								<CardContent>
									<img
										src='/placeholder.svg' // You can change this to an actual file preview if needed
										alt={`Preview of ${file.name}`}
										className='w-full h-[15rem] object-cover rounded-md'
									/>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
