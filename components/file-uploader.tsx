'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	X,
	ChevronUp,
	ChevronDown,
	FileIcon,
	CheckCircle,
	UploadIcon,
} from 'lucide-react';
import { uploadDocument } from '@/services/api';
import { useTheme } from 'next-themes';

interface FileUploaderProps {
	folderId: number;
	onUploadComplete: () => void; // Add the callback prop
}

export default function FileUploader({
	folderId,
	onUploadComplete,
}: FileUploaderProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadProgress, setUploadProgress] = useState<number[]>([]);
	const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
	const [isMinimized, setIsMinimized] = useState(true);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showUploadProgress, setShowUploadProgress] = useState(false);
	const [bulkProgress, setBulkProgress] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const { theme } = useTheme();

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(acceptedFiles);
		setShowConfirmDialog(true);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: true,
	});

	const handleUpload = async () => {
		setShowConfirmDialog(false);
		setShowUploadProgress(true);
		setUploadProgress(files.map(() => 0));
		setIsMinimized(true);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				const result = await uploadDocument(
					folderId,
					file,
					{ docname: file.name, origfilename: file.name },
					(progressEvent: ProgressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress((prevProgress) => {
							const newProgress = [...prevProgress];
							newProgress[i] = percentCompleted;
							// Calculate total progress after updating
							const totalProgress =
								newProgress.reduce((a, b) => a + b, 0) / files.length;
							setBulkProgress(totalProgress);
							return newProgress;
						});
					}
				);
				if (result.success) {
					setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
				}
			} catch (error) {
				console.error('Upload failed:', error);
			}
		}
		// Trigger onUploadComplete after all files are uploaded
		onUploadComplete();
	};

	const handleMouseEnter = () => setIsHovering(true);
	const handleMouseLeave = () => setIsHovering(false);

	return (
		<>
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
					isDragActive
						? 'border-primary bg-primary/10'
						: 'border-muted-foreground'
				}`}
			>
				<input {...getInputProps()} />
				<UploadIcon className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
				<p className='text-sm text-muted-foreground'>
					{isDragActive
						? 'Drop the files here'
						: 'Click to upload or drag and drop multiple files'}
				</p>
			</div>

			<Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Upload</DialogTitle>
					</DialogHeader>
					<p>Are you sure you want to upload these files?</p>
					<ul className='list-disc pl-5'>
						{files.map((file) => (
							<li key={file.name}>{file.name}</li>
						))}
					</ul>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowConfirmDialog(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpload}>Upload</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{showUploadProgress && (
				<div
					className={`fixed bottom-4 right-4 w-64 rounded-lg shadow-lg overflow-hidden ${
						theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
					}`}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div
						className={`flex justify-between items-center p-2 ${
							theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
						}`}
					>
						<span className='font-semibold'>
							{isMinimized
								? `Uploading ${files.length} Files`
								: `${uploadedFiles.length} uploads complete`}
						</span>
						<div>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => setIsMinimized(!isMinimized)}
							>
								{isMinimized ? (
									<ChevronUp size={16} />
								) : (
									<ChevronDown size={16} />
								)}
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => {
									setFiles([]);
									setUploadProgress([]);
									setUploadedFiles([]);
									setShowUploadProgress(false);
								}}
							>
								<X size={16} />
							</Button>
						</div>
					</div>
					{isMinimized ? (
						<div className='p-2'>
							<Progress value={bulkProgress} className='w-full' />
						</div>
					) : (
						<div className='p-2'>
							{files.map((file, index) => (
								<div key={file.name} className='flex items-center mb-1'>
									<FileIcon size={16} className='mr-2' />
									<span className='text-sm flex-grow truncate'>
										{file.name}
									</span>
									{uploadedFiles.includes(file.name) ? (
										<CheckCircle size={16} className='text-green-500' />
									) : (
										<Progress value={uploadProgress[index]} className='w-12' />
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
}
