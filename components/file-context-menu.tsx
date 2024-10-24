'use client';
import { useState, useEffect, useRef } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
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
	Share,
	FolderOpen,
	Info,
	Trash,
	EllipsisVertical,
	FileText,
	Edit2,
	FolderCog,
	Hash,
	Calendar,
	Lock,
} from 'lucide-react';
import Link from 'next/link';
import { useDeleteDocument, useDeleteFolder } from '@/services/Mutation';
import { useFolderInfo, useDocumentInfo } from '@/services/Query';
import { useToast } from '@/hooks/use-toast';

interface FileContextMenuProps {
	side: 'top' | 'right' | 'bottom' | 'left';
	type: 'folder' | 'file';
	id: number;
}

export default function FileContextMenu({
	side,
	type,
	id,
}: FileContextMenuProps) {
	const { toast } = useToast();

	const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Mutation for deletion (conditionally uses folder or document mutation)
	const deleteMutation =
		type === 'folder' ? useDeleteFolder() : useDeleteDocument();

	// Fetch folder or file details based on the type
	const folderDetails = useFolderInfo(type === 'folder' ? id : null);
	const documentDetails = useDocumentInfo(type === 'file' ? id : null);
	const details = type === 'folder' ? folderDetails.data : documentDetails.data;

	// Toggle file info dialog
	const handleFileInfoToggle = () => {
		setIsFileInfoOpen((prev) => !prev);
		setIsDropdownOpen(false);
	};

	// Handle delete action
	const handleDelete = () => {
		// Trigger the delete mutation without confirmation
		deleteMutation.mutate(id, {
			onSuccess: () => {
				// Show success toast
				toast({
					title: `${type === 'folder' ? 'Folder' : 'File'} Deleted`,
					description: `${
						type === 'folder' ? 'Folder' : 'File'
					} deleted successfully!`,
					variant: 'destructive', // Optional: depends on your toast library
				});
			},
			onError: (error) => {
				console.error('Error deleting:', error);
				// Show error toast
				toast({
					title: `Failed to Delete ${type === 'folder' ? 'Folder' : 'File'}`,
					description: `Error: ${error.message || 'Something went wrong.'}`,
					variant: 'destructive', // Optional: Use 'destructive' for error toasts
				});
			},
		});

		// Close dropdown after deletion is initiated
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
					<DropdownMenuItem>
						<FolderOpen className='mr-2 h-4 w-4' />
						<Link
							href={type === 'folder' ? `/folder/${id}` : `/document/${id}`}
						>
							<span>Open</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Download className='mr-2 h-4 w-4' />
						<span>Download</span>
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
						<span>{type === 'folder' ? 'Folder' : 'File'} Information</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem onSelect={handleDelete}>
						<Trash className='mr-2 h-4 w-4' />
						<span>Delete {type === 'folder' ? 'Folder' : 'File'}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isFileInfoOpen} onOpenChange={setIsFileInfoOpen}>
				<DialogContent className='sm:max-w-[400px] h-[400px] flex flex-col justify-start'>
					{/* Dialog Header */}
					<DialogHeader>
						<DialogTitle>
							{type === 'folder' ? 'Folder' : 'Document'} Preview
						</DialogTitle>
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
											<span className='text-sm font-medium'>
												{details?.name}
											</span>
										</div>
										<div className='flex items-center space-x-2'>
											<Hash className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm font-medium'>
												ID: {details?.id}
											</span>
										</div>
										<div className='flex items-center space-x-2'>
											<Calendar className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm font-medium'>
												Date: {details?.date}
											</span>
										</div>
										<div className='flex items-center space-x-2'>
											<Lock className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm font-medium'>
												{details?.islocked ? 'Locked' : 'Unlocked'}
											</span>
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
