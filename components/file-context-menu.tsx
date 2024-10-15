'use client';
import { useState, useEffect, useRef } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Download,
	Pencil,
	Copy,
	Share,
	FolderOpen,
	Info,
	Trash,
	EllipsisVertical,
	FileText,
	Edit2,
} from 'lucide-react';

interface FileContextMenuProps {
	side: 'top' | 'right' | 'bottom' | 'left';
}

export default function FileContextMenu({ side }: FileContextMenuProps) {
	const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleFileInfoToggle = () => {
		setIsFileInfoOpen((prev) => !prev);
		setIsDropdownOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef}>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon'>
						<EllipsisVertical className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56' side={side}>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<FolderOpen className='mr-2 h-4 w-4' />
							<span>Open with</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Notepad</DropdownMenuItem>
							<DropdownMenuItem>Visual Studio Code</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem>
						<Download className='mr-2 h-4 w-4' />
						<span>Download</span>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Pencil className='mr-2 h-4 w-4' />
						<span>Rename</span>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Copy className='mr-2 h-4 w-4' />
						<span>Make a copy</span>
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Share className='mr-2 h-4 w-4' />
							<span>Share</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Email</DropdownMenuItem>
							<DropdownMenuItem>Message</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<FolderOpen className='mr-2 h-4 w-4' />
							<span>Organize</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Move to folder</DropdownMenuItem>
							<DropdownMenuItem>Create new folder</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem onSelect={handleFileInfoToggle}>
						<Info className='mr-2 h-4 w-4' />
						<span>File information</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<Trash className='mr-2 h-4 w-4' />
						<span>Move to trash</span>
						<DropdownMenuShortcut>Delete</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isFileInfoOpen} onOpenChange={setIsFileInfoOpen}>
				<DialogContent className='sm:max-w-[400px] h-[400px] flex flex-col justify-start'>
					{/* Dialog Header */}
					<DialogHeader>
						<DialogTitle>Document Preview</DialogTitle>
					</DialogHeader>

					{/* Tabs */}
					<div className='flex flex-col h-full'>
						{/* Fixed TabsList */}
						<Tabs defaultValue='preview' className='w-full'>
							<TabsList className='grid w-full grid-cols-3 h-10'>
								<TabsTrigger value='preview'>Preview</TabsTrigger>
								<TabsTrigger value='properties'>Properties</TabsTrigger>
								<TabsTrigger value='comments'>Comments</TabsTrigger>
							</TabsList>

							{/* Scrollable Tab Content */}
							<div className='flex-1 overflow-y-auto'>
								<TabsContent value='preview'>
									<div className='flex items-center justify-center h-64 bg-muted rounded-lg'>
										<FileText className='h-16 w-16 text-muted-foreground' />
									</div>
								</TabsContent>

								<TabsContent value='properties'>
									<div className='space-y-4'>
										<div className='flex items-center space-x-2'>
											<FileText className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm font-medium'>accounts.txt</span>
										</div>
										<div className='flex items-center space-x-2'>
											<Edit2 className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm'>Modified 2026/02/15</span>
										</div>
									</div>
								</TabsContent>

								<TabsContent value='comments'>
									<p className='text-sm text-muted-foreground'>
										No comments yet.
									</p>
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
