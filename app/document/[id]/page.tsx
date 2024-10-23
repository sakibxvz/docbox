'use client';

import { useEffect, useState } from 'react';
import {
	Loader2,
	Download,
	Printer,
	RotateCw,
	File,
	Hash,
	Lock,
	CloudDownload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'next/navigation';
import { Document } from '@/types/type';
import { Separator } from '@/components/ui/separator';
import byteSize from 'byte-size';
import DocumentPreview from './(component)/DocumentPreview';
import { useDocumentInfo, useDocumentContent } from '@/services/Query'; // Using hooks from Query.ts

export default function DocumentPage() {
	const params = useParams();
	const id = Array.isArray(params.id) ? params.id[0] : params.id;

	// Fetching document info and content using Query.ts hooks
	const {
		data: documentInfo,
		isLoading: isInfoLoading,
		error: infoError,
	} = useDocumentInfo(id);
	const {
		data: documentContent,
		isLoading: isContentLoading,
		error: contentError,
	} = useDocumentContent(id);

	// If still loading
	if (isInfoLoading || isContentLoading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	// If error occurred while fetching document info or content
	if (infoError || contentError || !documentInfo || !documentContent) {
		return <div className='text-center'>Failed to load document</div>;
	}

	// Document preview component with loaded data
	return (
		<div className='flex flex-col h-screen'>
			<div className='flex flex-1 overflow-hidden'>
				{/* Document Viewer */}
				<div className='flex-1 overflow-auto'>
					<div className='flex items-center justify-between p-4'>
						<h1 className='text-xl font-semibold'>{documentInfo.name}</h1>
						<div className='flex items-center space-x-2'>
							<Button variant='ghost' size='icon'>
								<Download className='h-4 w-4' />
							</Button>
							<Button variant='ghost' size='icon'>
								<Printer className='h-4 w-4' />
							</Button>
							<Button variant='ghost' size='icon'>
								<RotateCw className='h-4 w-4' />
							</Button>
						</div>
					</div>
					<Separator />
					<div className='w-full mx-auto shadow-lg rounded-lg p-4'>
						<DocumentPreview
							documentContent={documentContent} // Pass the Blob content here
							fileType={documentInfo.mimetype} // Pass the correct mimetype here
						/>
					</div>
				</div>
				{/* Sidebar */}
				<div className='w-80 border-l overflow-auto'>
					<Accordion type='single' collapsible className='w-full'>
						<AccordionItem value='properties'>
							<AccordionTrigger className='px-4'>Properties</AccordionTrigger>
							<AccordionContent>
								<div className='px-4 space-y-2'>
									<div className='flex'>
										<Hash className='w-4 h-4 inline-block mr-2 items-center' />
										<p className='w-fill text-xs items-center'>
											Document ID: {documentInfo.id}
										</p>
									</div>
									<div className='flex'>
										<File className='w-4 h-4 inline-block mr-2 items-center' />
										<p className='w-fill text-xs items-center'>
											Name: {documentInfo.name}
										</p>
									</div>
									<div className='flex'>
										<Lock className='w-4 h-4 inline-block mr-2 items-center' />
										<p className='w-fill text-xs items-center'>
											Locked: {documentInfo.islocked ? 'Yes' : 'No'}
										</p>
									</div>
									<div className='flex'>
										<CloudDownload className='w-4 h-4 inline-block mr-2 items-center' />
										<p className='w-fill text-xs items-center'>
											File size: {byteSize(documentInfo.size).toString()}
										</p>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='version'>
							<AccordionTrigger className='px-4'>Version</AccordionTrigger>
							<AccordionContent>
								<div className='px-4 space-y-2'>
									{documentInfo['version-attributes']?.map(
										(
											attribute: { id: string; value: string },
											index: number
										) => (
											<div className='flex' key={index}>
												<p className='w-fill text-xs items-center'>
													ID: {attribute.id}
												</p>
												<p className='w-fill text-xs items-center'>
													Value: {attribute.value}
												</p>
											</div>
										)
									)}
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='comments'>
							<AccordionTrigger className='px-4'>Comments</AccordionTrigger>
							<AccordionContent>
								<div className='px-4'>
									<p className='text-xs'>
										{documentInfo.comment ? documentInfo.comment : 'No Comment'}
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='attachments'>
							<AccordionTrigger className='px-4'>Attachments</AccordionTrigger>
							<AccordionContent>
								<div className='px-4'>{/* Add attachments content here */}</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	);
}
