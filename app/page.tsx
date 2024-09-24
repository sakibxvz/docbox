import { FileIcon, FolderIcon, MoreHorizontal, Search } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import FileContextMenu from '@/components/file-context-menu';

const allFiles = [
	{
		name: 'Dashboard tech requirements',
		size: '220 KB',
		type: 'docx',
		uploadedBy: 'Amélie Laurent',
		lastModified: 'Jan 4, 2024',
	},
	{
		name: 'Marketing site requirements',
		size: '300 KB',
		type: 'docx',
		uploadedBy: 'Ammar Polley',
		lastModified: 'Jan 5, 2024',
	},
	{
		name: 'Q4_2023 Reporting',
		size: '2 MB',
		type: 'ppt',
		uploadedBy: 'Amélie Laurent',
		lastModified: 'Jan 6, 2024',
	},
	{
		name: 'Q3_2023 Reporting',
		size: '1.8 MB',
		type: 'ppt',
		uploadedBy: 'Sienna Hewitt',
		lastModified: 'Jan 6, 2024',
	},
	{
		name: 'Q2_2023 Reporting',
		size: '1.7 MB',
		type: 'ppt',
		uploadedBy: 'Olly Brownlee',
		lastModified: 'Jan 6, 2024',
	},
	{
		name: 'Q1_2023 Reporting',
		size: '1.6 MB',
		type: 'ppt',
		uploadedBy: 'Marshall Lewis',
		lastModified: 'Jan 6, 2024',
	},
	{
		name: 'FY_2022-23 Financials',
		size: '500 KB',
		type: 'xls',
		uploadedBy: 'Amélie Laurent',
		lastModified: 'Jan 7, 2024',
	},
];

export default function Home() {
	return (
		<div>
			<h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
				Featured Files
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[
					{ name: 'UI Design', date: '03 Mar', size: '87 MB' },
					{ name: 'Proposal', date: '03 Mar', size: '93 MB' },
					{ name: 'DashLite Resource', date: '03 Mar', size: '93 MB' },
					{ name: '2019 Projects', date: '03 Mar', size: '93 MB' },
				].map((folder) => (
					<div
						key={folder.name}
						className='bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700'
					>
						<FolderIcon className='h-10 w-10 text-blue-500 mb-2' />
						<h3 className='font-medium text-slate-900 dark:text-slate-100'>
							{folder.name}
						</h3>
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							{folder.date} · {folder.size}
						</p>
					</div>
				))}
			</div>

			{/* Files Modified  */}

			<div className='my-5 flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>All files</h2>
				<div className='flex items-center gap-2'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input placeholder='Search' className='pl-8' />
					</div>
					<Select>
						<SelectTrigger className='w-[120px]'>
							<SelectValue placeholder='Filters' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Files</SelectItem>
							<SelectItem value='recent'>Recent</SelectItem>
							<SelectItem value='modified'>Modified</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>File name</TableHead>
						<TableHead>Uploaded by</TableHead>
						<TableHead>Last modified</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{allFiles.map((file) => (
						<TableRow key={file.name}>
							<TableCell>
								<div className='flex items-center gap-2'>
									<FileIcon className='h-4 w-4' />
									<span>{file.name}</span>
								</div>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<Avatar className='h-6 w-6'>
										<AvatarImage
											src={`https://i.pravatar.cc/150?u=${file.uploadedBy}`}
										/>
										<AvatarFallback>
											{file.uploadedBy
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<span>{file.uploadedBy}</span>
								</div>
							</TableCell>
							<TableCell>{file.lastModified}</TableCell>
							<TableCell>
								{/* File System Actions  */}

								<FileContextMenu />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className='mt-4 flex items-center justify-between'>
				<div className='text-sm text-muted-foreground'>
					Showing 1 to 7 of 7 results
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm'>
						Previous
					</Button>
					<Button variant='outline' size='sm'>
						Next
					</Button>
				</div>
			</div>

			{/* <FileUploader /> */}
		</div>
	);
}
