'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, FolderIcon, FileIcon } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
	getFolderInfo,
	getChildrenFolders,
	moveFolder,
	moveFile,
} from '@/services/api';

interface ItemToMove {
	type: 'document' | 'folder';
	id: number;
}

interface FolderInfo {
	type: 'folder';
	id: number;
	name: string;
	comment: string;
	date: string;
}

interface DocumentInfo {
	type: 'document';
	id: number;
	name: string;
	comment: string;
	date: string;
	mimetype: string;
	size: number;
}

type Item = FolderInfo | DocumentInfo;

interface FileMoveModalProps {
	itemToMove: ItemToMove;
	onMoveComplete: () => void;
}

function FileMoveModal({ itemToMove, onMoveComplete }: FileMoveModalProps) {
	const [items, setItems] = useState<Item[]>([]);
	const [currentPath, setCurrentPath] = useState<FolderInfo[]>([]);
	const [isMoving, setIsMoving] = useState(false);
	const [itemName, setItemName] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			fetchInitialData();
		}
	}, [isOpen]);

	const fetchInitialData = async () => {
		try {
			setLoading(true);
			const rootFolder = await getFolderInfo(1);
			if (rootFolder.success && rootFolder.data) {
				setCurrentPath([rootFolder.data]);
				fetchChildrenFolders(1);
			}

			if (itemToMove.type === 'folder') {
				const folderInfo = await getFolderInfo(itemToMove.id);
				if (folderInfo.success && folderInfo.data) {
					setItemName(folderInfo.data.name);
				}
			} else {
				const parentFolderInfo = await getFolderInfo(1);
				if (parentFolderInfo.success && parentFolderInfo.data) {
					const children = await getChildrenFolders(parentFolderInfo.data.id);
					if (children.success && children.data) {
						const file = children.data.find(
							(item): item is Document =>
								item.type === 'document' && item.id === itemToMove.id
						);
						if (file) {
							setItemName(file.name);
						}
					}
				}
			}
		} catch (error) {
			console.error('Error fetching initial data:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchFolderInfo = async (folderId: number) => {
		try {
			setLoading(true);
			const response = await getFolderInfo(folderId);
			if (response.success && response.data) {
				setCurrentPath([...currentPath, response.data]);
				fetchChildrenFolders(folderId);
			}
		} catch (error) {
			console.error('Error fetching folder info:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchChildrenFolders = async (folderId: number) => {
		try {
			setLoading(true);
			const response = await getChildrenFolders(folderId);
			if (response.success && response.data) {
				setItems(response.data);
			}
		} catch (error) {
			console.error('Error fetching children folders:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleItemClick = (item: Item) => {
		if (item.type === 'folder') {
			fetchFolderInfo(item.id);
		}
	};

	const handleBackClick = () => {
		if (currentPath.length > 1) {
			const newPath = [...currentPath];
			newPath.pop();
			setCurrentPath(newPath);
			fetchChildrenFolders(newPath[newPath.length - 1].id);
		}
	};

	const handleMove = async () => {
		setIsMoving(true);
		const destinationFolderId = currentPath[currentPath.length - 1].id;
		try {
			if (itemToMove.type === 'folder') {
				await moveFolder(itemToMove.id, destinationFolderId);
			} else {
				await moveFile(itemToMove.id, destinationFolderId);
			}
			onMoveComplete();
			setIsOpen(false);
		} catch (error) {
			console.error('Error moving item:', error);
		} finally {
			setIsMoving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='ghost'>Move</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Move "{itemName}"</DialogTitle>
				</DialogHeader>
				<div className='py-4'>
					<div className='flex items-center mb-4'>
						<Button
							variant='ghost'
							onClick={handleBackClick}
							disabled={currentPath.length <= 1}
						>
							← Back
						</Button>
						<span className='ml-2'>
							{currentPath.map((folder, index) => (
								<span key={folder.id}>
									{index > 0 && ' > '}
									{folder.name}
								</span>
							))}
						</span>
					</div>
					{loading ? (
						<div className='flex justify-center'>
							<Spinner />
						</div>
					) : (
						items.map((item) => (
							<div
								key={item.id}
								className='flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
								onClick={() => handleItemClick(item)}
							>
								<div className='flex items-center'>
									{item.type === 'folder' ? (
										<FolderIcon className='mr-2' />
									) : (
										<FileIcon className='mr-2' />
									)}
									{item.name}
								</div>
								{item.type === 'folder' && <ChevronRight />}
							</div>
						))
					)}
				</div>
				<div className='flex justify-end space-x-2'>
					<Button variant='outline' onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleMove} disabled={isMoving}>
						{isMoving ? 'Moving...' : 'Move'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface FileFolderMoveProps {
	item: ItemToMove;
	onMoveComplete: () => void;
}

export default function FileFolderMove({
	item,
	onMoveComplete,
}: FileFolderMoveProps) {
	return <FileMoveModal itemToMove={item} onMoveComplete={onMoveComplete} />;
}
