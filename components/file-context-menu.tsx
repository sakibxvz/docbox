import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	ChevronRight,
	Download,
	Pencil,
	Copy,
	Share,
	FolderOpen,
	Info,
	Trash,
	MoreHorizontal,
} from 'lucide-react';

export default function FileContextMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon'>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' side='left'>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<FolderOpen className='mr-2 h-4 w-4' />
						<span>Open with</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<span>Notepad</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span>Visual Studio Code</span>
						</DropdownMenuItem>
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
						<DropdownMenuItem>
							<span>Email</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span>Message</span>
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<FolderOpen className='mr-2 h-4 w-4' />
						<span>Organize</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<span>Move to folder</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span>Create new folder</span>
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Info className='mr-2 h-4 w-4' />
						<span>File information</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<span>Properties</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span>Version history</span>
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Trash className='mr-2 h-4 w-4' />
					<span>Move to trash</span>
					<DropdownMenuShortcut>Delete</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
