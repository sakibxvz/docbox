'use client';
import Link from 'next/link';
import {
	Bell,
	Folder,
	Home,
	LineChart,
	Package2,
	Plus,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { TreeView, TreeDataItem } from '@/components/ui/tree-view';
import { ScrollArea } from '../ui/scroll-area';
import { getChildrenFolders } from '@/services/api';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import UploadButton from '../upload-button';

const DashboardSidebar = () => {
	const [data, setData] = useState<TreeDataItem[]>([
		{
			id: '1',
			name: 'Libary',
			icon: Folder,
			openIcon: Folder,
			children: [],
			actions: <Link href='/folder/1'>View</Link>,
		},
	]);

	const transformData = (data: any[]): TreeDataItem[] => {
		return data
			.map((item) => {
				if (item.type === 'folder') {
					return {
						id: item.id.toString(),
						name: item.name,
						icon: Folder,
						openIcon: Folder,
						children: [], // Initialize as empty for folders
						actions: <Link href={`/folder/${item.id}`}>View</Link>, // Action for folders
					};
				} else if (item.type === 'document') {
					return {
						id: item.id.toString(),
						name: item.name,
						icon: File,
						actions: <button>View</button>, // Adjust as needed
					};
				}
				return null;
			})
			.filter(Boolean) as TreeDataItem[];
	};

	const fetchChildren = async (folderId: number, parentId: string) => {
		const response = await getChildrenFolders(folderId);

		if (response.success && response.data) {
			const transformedData = transformData(response.data);
			setData((prevData) => {
				// Use a helper function to add children recursively
				return addChildrenToParent(prevData, parentId, transformedData);
			});
		} else {
			console.error(response.message); // Handle error appropriately
		}
	};

	const addChildrenToParent = (
		currentData: TreeDataItem[],
		parentId: string,
		childrenToAdd: TreeDataItem[]
	): TreeDataItem[] => {
		return currentData.map((item) => {
			if (item.id === parentId) {
				// Only add children if not already present
				if (item.children.length === 0) {
					item.children = childrenToAdd; // Add new children
				}
			} else if (item.children) {
				// Recursively search in children
				item.children = addChildrenToParent(
					item.children,
					parentId,
					childrenToAdd
				);
			}
			return item;
		});
	};

	// Fetch initial children on component mount
	useEffect(() => {
		fetchChildren(1, '1'); // Call with the root folder ID
	}, []);

	// Handle selection change to expand folders and load documents
	const handleSelectChange = (item: TreeDataItem | undefined) => {
		if (item && item.children && item.children.length === 0) {
			// Fetch children only if there are no children already loaded
			fetchChildren(parseInt(item.id), item.id);
		}
	};

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

				<div className='flex-row '>
					<nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
						<UploadButton buttonClassName='my-3' />

						<Link
							href='/'
							className='flex bg-muted items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
						>
							<Home className='h-4 w-4' />
							Dashboard
						</Link>

						<span className='flex items-center py-2  rounded-lg  text-muted-foreground transition-all hover:text-primary'>
							<ScrollArea className='rounded-md flex-1'>
								<TreeView
									className=''
									data={data}
									onSelectChange={handleSelectChange}
								/>
							</ScrollArea>
						</span>
					</nav>
				</div>

				{/* <Separator className='my-2' />
				<ScrollArea className='rounded-md flex-1'>
					<TreeView
						className=''
						data={data}
						onSelectChange={handleSelectChange}
					/>
				</ScrollArea> */}

				{/* <Separator className='my-2 fixed' /> */}
				{/* <div className='mb-4 px-4 fixed bottom-0 '>
					<Separator className='my-2 fixed' />
					<div className='text-sm font-medium py-3'>Storage</div>

					<Progress value={33} />

					<div className='mt-2 text-sm text-slate-500'>
						12.47 GB of 25 GB used
					</div>
					<Button variant='outline' className='mt-2 h-auto p-2'>
						Upgrade Storage
					</Button>
				</div> */}
			</div>
		</div>
	);
};

export default DashboardSidebar;
