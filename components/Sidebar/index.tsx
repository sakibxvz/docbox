'use client';
import Link from 'next/link';
import { Bell, Folder, Home, LineChart, Package2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { TreeView, TreeDataItem } from '@/components/ui/tree-view';
import { ScrollArea } from '../ui/scroll-area';
import { getChildrenFolders } from '@/services/api';
import { useEffect, useState } from 'react';

const data: TreeDataItem[] = [
	{
		id: '1',
		name: 'Document Management System',
		icon: Folder,
		openIcon: Folder,
		children: [],
	},
];

const transformData = (
	folders: TreeDataItem[],
	setFolderData: React.Dispatch<React.SetStateAction<TreeDataItem[]>>
): TreeDataItem[] => {
	return folders.map((folder) => ({
		id: folder.id.toString(),
		name: folder.name,
		children: folder.children || [], // Initialize children
		onClick: async () => {
			console.log(`Fetching children for Folder: ${folder.name}`);
			const result = await getChildrenFolders(Number(folder.id)); // Fetch children when clicked
			if (result.success && result.data) {
				setFolderData((prevData) =>
					prevData.map((item) =>
						item.id === folder.id
							? {
									...item,
									children: transformData(result.data.map(folder => ({ ...folder, id: folder.id.toString() })) || [], setFolderData),
							  } // Update children for the clicked folder
							: item
					)
				);
			} else {
				console.error('Error fetching children folders data:', result.message);
			}
		},
	}));
};

const DashboardSidebar = () => {
	const [folderData, setFolderData] = useState<TreeDataItem[]>(data);

	useEffect(() => {
		const fetchData = async () => {
			const folderId = 1;
			const result = await getChildrenFolders(folderId);
			if (result.success) {
				setFolderData((prevData) =>
					prevData.map((item) => ({
						...item,
						children: result.data
							? transformData(result.data || [], setFolderData)
							: [],
					}))
				);
			} else {
				console.error('Error fetching children folders data:', result.message);
			}
		};

		fetchData();
	}, []);

	return (
		<div className='hidden border-r bg-muted/40 md:block h-full'>
			<div className='flex flex-col h-screen sticky top-0 max-h-screen'>
				<div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
					<Link href='/' className='flex items-center gap-2 font-semibold'>
						<Package2 className='h-6 w-6' />
						<span className='text-2xl'>DocBox</span>
					</Link>
					<Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
						<Bell className='h-4 w-4' />
						<span className='sr-only'>Toggle notifications</span>
					</Button>
				</div>

				<div className='flex-row p-4'>
					<nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
						<Link
							href='/'
							className='flex bg-muted items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
						>
							<Home className='h-4 w-4' />
							Dashboard
						</Link>
						<Link
							href='/folder'
							className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
						>
							<Folder className='h-4 w-4' />
							All Folders
						</Link>
						<Link
							href='#'
							className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
						>
							<Users className='w-4 h-4' />
							Teams
							<Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
								6
							</Badge>
						</Link>

						<Link
							href='#'
							className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
						>
							<LineChart className='h-4 w-4' />
							Analytics
						</Link>
					</nav>
				</div>

				<Separator className='my-2' />
				<h2 className='text-lg px-4 font-medium'>Folder Structure</h2>
				<ScrollArea className='rounded-md flex-1'>
					<TreeView className='' data={folderData} />
				</ScrollArea>

				<Separator className='my-2' />
				<div className='mb-4 px-4'>
					<div className='text-sm font-medium py-3'>Storage</div>

					<Progress value={33} />

					<div className='mt-2 text-sm text-slate-500'>
						12.47 GB of 25 GB used
					</div>
					<Button variant='outline' className='mt-2 h-auto p-2'>
						Upgrade Storage
					</Button>
				</div>
			</div>
		</div>
	);
};

export default DashboardSidebar;
