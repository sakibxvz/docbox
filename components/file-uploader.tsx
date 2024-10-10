'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Import the Progress component
import { UploadIcon } from 'lucide-react';
import { uploadDocument } from '@/services/api'; // Adjust the import path as necessary

interface FileUploaderProps {
	folderId: number; // Pass the folder ID where the document will be uploaded
}

export default function FileUploader({ folderId }: FileUploaderProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadMessage, setUploadMessage] = useState<string | null>(null);
	const [uploadedData, setUploadedData] = useState<
		{ id: number; name: string }[] | null
	>(null);
	const [uploadProgress, setUploadProgress] = useState<number[]>([]); // Track progress for multiple files

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(acceptedFiles);
		setUploadProgress(acceptedFiles.map(() => 0)); // Reset progress for all files
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: true, // Allow multiple file uploads
	});

	// Handle upload of all files
	const handleUpload = async () => {
		if (files.length === 0) {
			setUploadMessage('Please select files to upload.');
			return;
		}

		setUploadMessage(null); // Reset message
		const uploadedResults: { id: number; name: string }[] = [];

		// Iterate through all files and upload them one by one
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const customFileName = `${file.name.split('.')[0]}.${file.name
				.split('.')
				.pop()}`; // Example of custom filename

			try {
				const result = await uploadDocument(
					folderId,
					file, // Pass file directly
					{
						docname: customFileName, // Pass the custom file name
						origfilename: file.name, // Include original filename
					},
					(progressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress((prevProgress) => {
							const newProgress = [...prevProgress];
							newProgress[i] = percentCompleted; // Update the progress for the specific file
							return newProgress;
						});
					}
				);

				if (result.success) {
					uploadedResults.push(result.data); // Store uploaded data for each file
				}
				setUploadMessage(result.message);
			} catch (error) {
				setUploadMessage('Error occurred during upload.');
				console.error(error);
			}
		}

		// Store the uploaded document data once all uploads are done
		setUploadedData(uploadedResults);
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
						: 'Click to upload or drag and drop multiple files'}
				</p>
			</div>

			{/* Show selected files */}
			{files.length > 0 && (
				<div className='mt-4'>
					<h3 className='font-semibold mb-2'>Selected Files:</h3>
					<ul className='list-disc pl-5'>
						{files.map((file, index) => (
							<li key={file.name} className='text-sm'>
								{file.name} ({(file.size / 1024).toFixed(2)} KB)
								{/* Progress Bar for each file */}
								{uploadProgress[index] > 0 && (
									<div className='mt-2'>
										<Progress value={uploadProgress[index]} />
										<p className='text-sm mt-1'>
											{uploadProgress[index]}% uploaded
										</p>
									</div>
								)}
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

			{/* Upload message */}
			{uploadMessage && <p className='mt-2 text-sm'>{uploadMessage}</p>}

			{/* Uploaded files info */}
			{uploadedData && (
				<div className='mt-2'>
					<h3>Uploaded Documents:</h3>
					<ul>
						{uploadedData.map((data) => (
							<li key={data.id}>
								Document ID: {data.id}, Name: {data.name}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
