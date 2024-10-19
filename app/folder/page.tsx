'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Folder, FileText, MoreVertical, File } from 'lucide-react';
import Image from 'next/image';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const folders = [
	{ name: 'COMPUTER GRAPICHS' },
	{ name: 'Software Project' },
	{ name: 'SQA TEAM' },
	{ name: 'Financial' },
];

const files = [
	{
		name: 'SPDM MID.docx',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Project Proposal A...',
		type: 'pdf',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Software_Project-...',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Computer Graphic...',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Computer Graphic...',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Computer Graphic...',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Computer Graphic...',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
	{
		name: 'Computer Graphic...',
		type: 'word',
		preview: '/placeholder.svg?height=100&width=100',
	},
];

export default function FileManager() {
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
							<File size='20px' className='mr-1' />
							Breadcrumb
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className='p-4 mt-5 space-y-4'>
				<section>
					<h2 className='text-lg font-semibold mb-2'>Folders</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 '>
						{folders.map((folder) => (
							<Card
								className='dark:bg-slate-800 dark:border-slate-700'
								key={folder.name}
							>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 '>
									<CardTitle className='text-sm font-medium'>
										<Folder className='w-5 h-5 inline-block  text-blue-500 mr-2' />
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
							<Card key={file.name}>
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
									<Image
										src={file.preview}
										alt={`Preview of ${file.name}`}
										width={100}
										height={100}
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
