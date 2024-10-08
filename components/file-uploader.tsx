'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';
import { uploadDocument } from '@/services/api'; // Adjust the import path as necessary

interface FileUploaderProps {
	folderId: number; // Pass the folder ID where the document will be uploaded
}

export default function FileUploader({ folderId }: FileUploaderProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadMessage, setUploadMessage] = useState<string | null>(null);
	const [uploadedData, setUploadedData] = useState<{
		id: number;
		name: string;
	} | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(acceptedFiles);
		console.log('Files to upload:', acceptedFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleUpload = async () => {
		if (files.length === 0) {
			setUploadMessage('Please select a file to upload.');
			return;
		}

		setUploadMessage(null); // Reset message
		for (const file of files) {
			const result = await uploadDocument(folderId, file);
			setUploadMessage(result.message);
			if (result.success) {
				setUploadedData(result.data); // Store the uploaded document data
			}
		}
	};

	return (
		<div className='w-full max-w-md mx-auto'>
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
						: 'Click to upload or drag and drop'}
				</p>
			</div>
			{files.length > 0 && (
				<div className='mt-4'>
					<h3 className='font-semibold mb-2'>Selected Files:</h3>
					<ul className='list-disc pl-5'>
						{files.map((file) => (
							<li key={file.name} className='text-sm'>
								{file.name} ({(file.size / 1024).toFixed(2)} KB)
							</li>
						))}
					</ul>
					<Button className='mt-4' onClick={handleUpload}>
						Upload Files
					</Button>
					<Button className='mt-4' onClick={() => setFiles([])}>
						Clear Files
					</Button>
				</div>
			)}
			{uploadMessage && <p className='mt-2 text-sm'>{uploadMessage}</p>}
			{uploadedData && (
				<div className='mt-2'>
					<p>Document ID: {uploadedData.id}</p>
					<p>Document Name: {uploadedData.name}</p>
				</div>
			)}
		</div>
	);
}
