import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import mammoth from 'mammoth'; // Import Mammoth

interface DocumentPreviewProps {
	documentContent: Blob; // Ensure documentContent is a Blob
	fileType: string;
}

const DocumentPreview: FC<DocumentPreviewProps> = ({
	documentContent,
	fileType,
}) => {
	const DocViewer = dynamic(() => import('react-doc-viewer'), { ssr: false });
	const [contentUrl, setContentUrl] = useState<string | null>(null);
	const [htmlContent, setHtmlContent] = useState<string | null>(null); // To store HTML from Mammoth
	const [error, setError] = useState<string | null>(null);

	// Create a URL from the Blob when documentContent changes
	useEffect(() => {
		if (documentContent instanceof Blob) {
			const url = URL.createObjectURL(documentContent);
			setContentUrl(url);

			// Clean up the object URL to avoid memory leaks
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	}, [documentContent]);

	// Convert DOCX to HTML using Mammoth
	const convertDocxToHtml = async (blob: Blob) => {
		try {
			const arrayBuffer = await blob.arrayBuffer(); // Get the ArrayBuffer from Blob
			const { value } = await mammoth.convertToHtml({ arrayBuffer });
			setHtmlContent(value); // Set the HTML content from Mammoth
		} catch (err) {
			console.error('Error converting DOCX to HTML:', err);
			setError('Unable to convert DOCX to HTML. Please try again.');
		}
	};

	useEffect(() => {
		if (documentContent instanceof Blob && fileType.includes('word')) {
			convertDocxToHtml(documentContent); // Convert DOCX to HTML
		}
	}, [documentContent, fileType]);

	const renderPreview = () => {
		if (error) {
			return <p>Error loading document: {error}</p>;
		}

		if (!contentUrl && !htmlContent) {
			return <p>Loading document preview...</p>;
		}

		switch (fileType) {
			case 'application/pdf':
				return (
					<div className='flex-grow border-0 m-0 p-0 h-full'>
						<iframe
							src={contentUrl}
							title='PDF Preview'
							className='w-full h-full'
							style={{ border: 'none' }} // Optional: remove border if needed
						/>
					</div>
				);

			case 'image/png':
			case 'image/jpeg':
			case 'image/jpg':
				return (
					<div className='image-preview-container w-full h-full'>
						<Image
							src={contentUrl}
							alt='Image Preview'
							width={800}
							height={600}
							layout='responsive'
							objectFit='contain'
						/>
					</div>
				);

			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			case 'application/msword':
				return (
					<div
						className='w-full h-full border-0 m-0 p-0'
						dangerouslySetInnerHTML={{ __html: htmlContent || '' }} // Render HTML from Mammoth
					/>
				);

			default:
				return <p>Preview not available for this file type.</p>;
		}
	};

	return (
		<div
			className='document-preview'
			style={{ width: '100%', height: '100vh' }}
		>
			{renderPreview()}
		</div>
	);
};

export default DocumentPreview;
