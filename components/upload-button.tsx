import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Folder, FileUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFolder } from '@/services/api';

interface UploadButtonProps {
	buttonClassName?: string;
	dialogContentClassName?: string;
	inputClassName?: string;
	dialogFooterClassName?: string;
	dropdownMenuClassName?: string;
}

export default function UploadButton({
	buttonClassName = '',
	dialogContentClassName = '',
	inputClassName = '',
	dialogFooterClassName = '',
	dropdownMenuClassName = '',
}: UploadButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [folderName, setFolderName] = useState('Untitled folder');
	const [folderComment, setFolderComment] = useState('');
	const [folderSequence, setFolderSequence] = useState<number | undefined>(undefined);
	const [folderMessage, setFolderMessage] = useState<string | null>(null);

	const params = useParams();
	const parentFolderId = Number(params.id) || 1; // Set the parent folder ID accordingly

	const queryClient = useQueryClient();

	// useMutation for folder creation
	const createFolderMutation = useMutation({
		mutationFn: ({ folderName, folderComment, folderSequence }: { folderName: string; folderComment: string; folderSequence?: number }) => 
			createFolder(parentFolderId, folderName, folderComment, folderSequence),
		onSuccess: () => {
			// Invalidate the query that fetches folder data
			queryClient.invalidateQueries(['folder-children', parentFolderId]); // Ensure this matches your query keys
			setFolderMessage('Folder created successfully!');
			closeDialog(); // Close the dialog after creating the folder
		},
		onError: (error: any) => {
			setFolderMessage(error.message || 'Failed to create folder.');
		},
	});

	const closeDialog = () => {
		setIsDialogOpen(false);
		setFolderName('Untitled folder');
		setFolderComment('');
		setFolderSequence(undefined);
		setFolderMessage(null); // Reset message
		setTimeout(() => setIsDropdownOpen(false), 100);
	};

	const handleCreateFolder = () => {
		createFolderMutation.mutate({
			folderName,
			folderComment,
			folderSequence,
		});
	};

	return (
		<>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						className={`bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-dark-foreground hover:bg-primary/90 dark:hover:bg-primary-dark/90 shadow-sm border border-primary/10 dark:border-primary-dark/10 ${buttonClassName}`}
					>
						<Plus className='mr-2 h-4 w-4 text-primary-foreground dark:text-primary-dark-foreground cursor-pointer' />
						<p className='text-primary-foreground dark:text-primary-dark-foreground cursor-pointer'>
							New Upload
						</p>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className={`w-56 ${dropdownMenuClassName}`}
					side='left'
					align='start'
				>
					<DropdownMenuItem
						onSelect={(e) => {
							e.preventDefault();
							setIsDropdownOpen(false);
							setIsDialogOpen(true);
						}}
					>
						<Folder className='mr-2 h-4 w-4' />
						<span>New folder</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<FileUp className='mr-2 h-4 w-4' />
						<span>File upload</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className={`sm:max-w-[425px] ${dialogContentClassName}`}>
					<DialogHeader>
						<DialogTitle>New folder</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<Input
							id='name'
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
							className={`col-span-3 ${inputClassName}`}
						/>
						{/* Optional comment input */}
						<Input
							id='comment'
							value={folderComment}
							onChange={(e) => setFolderComment(e.target.value)}
							placeholder='Comment (optional)'
							className={`col-span-3 ${inputClassName}`}
						/>
					</div>
					<DialogFooter className={dialogFooterClassName}>
						<Button variant='outline' onClick={closeDialog}>
							Cancel
						</Button>
						<Button onClick={handleCreateFolder} disabled={createFolderMutation.isLoading}>
							{createFolderMutation.isLoading ? 'Creating...' : 'Create'}
						</Button>
					</DialogFooter>
					{folderMessage && <p>{folderMessage}</p>}{' '}
					{/* Display folder creation message */}
				</DialogContent>
			</Dialog>
		</>
	);
}
