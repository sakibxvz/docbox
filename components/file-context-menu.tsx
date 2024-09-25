'use client';
import { useState } from 'react';
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
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {
	Download,
	Pencil,
	Copy,
	Share,
	FolderOpen,
	Info,
	Trash,
	EllipsisVertical,
	MoreVertical,
	Eye,
	Edit2,
	MessageSquare,
	Share2,
	Trash2,
	FileText,
} from 'lucide-react';

export default function FileContextMenu() {
	const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);

	const handleFileInfoOpen = () => {
		setIsFileInfoOpen(true);
	};

	const handleFileInfoClose = () => {
		setIsFileInfoOpen(false);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon'>
						<EllipsisVertical className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56' side='left'>
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

					<DropdownMenuItem onClick={handleFileInfoOpen}>
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

			<Sheet open={isFileInfoOpen} onOpenChange={handleFileInfoClose}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle className='flex justify-between items-center text-foreground'>
							File Details
						</SheetTitle>
					</SheetHeader>
					<div className='mt-6 space-y-6'>
						<div className='bg-muted p-6 rounded-lg flex items-center space-x-4'>
							<div className='bg-background p-2 rounded'>
								<FileText className='h-8 w-8 text-blue-500' />
							</div>
							<div>
								<h3 className='font-semibold text-xl text-blue-500'>Editor</h3>
								<p className='font-bold text-foreground'>accounts.txt</p>
								<p className='text-sm text-muted-foreground'>
									Modified 2026/02/15
								</p>
							</div>
						</div>
						<div>
							<h3 className='font-semibold mb-4 text-foreground'>
								File Overview
							</h3>
							<div className='space-y-4'>
								{[
									{ icon: Eye, label: 'Total Views', value: 198 },
									{ icon: Edit2, label: 'Edits', value: 16 },
									{ icon: MessageSquare, label: 'Comments', value: 11 },
									{ icon: Share2, label: 'Share', value: 87 },
									{ icon: Trash2, label: 'Deletes', value: 77 },
								].map((item) => (
									<div
										key={item.label}
										className='flex items-center justify-between'
									>
										<div className='flex items-center space-x-2'>
											<item.icon className='h-4 w-4 text-muted-foreground' />
											<span className='text-foreground'>{item.label}</span>
										</div>
										<span className='font-semibold text-foreground'>
											{item.value}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
