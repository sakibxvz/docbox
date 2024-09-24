'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';

export default function FileUploader() {
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(acceptedFiles);
		// Here you would typically handle the file upload to your server
		console.log('Files to upload:', acceptedFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
					<Button className='mt-4' onClick={() => setFiles([])}>
						Clear Files
					</Button>
				</div>
			)}
		</div>
	);
}
