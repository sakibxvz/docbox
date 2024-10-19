'use client';

import { useEffect, useState } from 'react';
import {
	Loader2,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	Download,
	Printer,
	Heart,
	RotateCw,
	File,
	Hash,
	Lock,
	User,
	CloudDownload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	getDocumentInfo,
	getDocumentContent,
	getUserInfo,
} from '@/services/api';
import { useParams } from 'next/navigation';
import { Document } from '@/types/type';
import { Separator } from '@/components/ui/separator';
import byteSize from 'byte-size';
import DocumentPreview from './(component)/DocumentPreview';

export default function DocumentPage() {
	const [documentInfo, setDocumentInfo] = useState<Document | null>(null);
	const [documentContent, setDocumentContent] = useState<Blob | null>(null);
	const [loading, setLoading] = useState(true);

	const params = useParams();
	const id = Array.isArray(params.id) ? params.id[0] : params.id;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [info, content] = await Promise.all([
					getDocumentInfo(id),
					getDocumentContent(id),
				]);

				// Log the content before setting it to state
				console.log(
					content
						? 'Document Content API is Fetching'
						: 'Document Content API is Not Fetching'
				);
				console.log(
					info
						? 'Document Info API is Fetching'
						: 'Document Info API is Not Fetching'
				);

				setDocumentInfo(info.data);

				// Set the document content directly without relying on documentInfo
				if (content !== null && info.data) {
					const contentBlob = new Blob([content], {
						type: info.data.mimetype, // Use info.data.mimetype directly
					});
					setDocumentContent(contentBlob);
					console.log('Document Content Blob:', contentBlob);
				} else {
					setDocumentContent(null);
				}
			} catch (error) {
				console.error('Error fetching document data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]); // Only depends on `id`

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	if (!documentInfo || !documentContent) {
		return <div className='text-center'>Failed to load document</div>;
	}

	return (
		<div className='flex flex-col h-screen'>
			{/* Header */}
			{/* <header className='flex items-center justify-between p-4 border-b'>
				<div className='flex items-center space-x-2'>
					<Button variant='ghost' size='icon'>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<Button variant='ghost' size='icon'>
						<ChevronRight className='h-4 w-4' />
					</Button>
					<ChevronDown className='h-4 w-4' />
					<div className='text-sm text-muted-foreground'>
						Energy Company &gt; 02. Procurement &gt; 01. Draft Contracts
					</div>
				</div>
				<Input className='max-w-sm' placeholder='Search...' />
			</header> */}

			<div className='flex flex-1 overflow-hidden'>
				{/* Document Viewer */}
				<div className='flex-1 overflow-auto'>
					<div className='flex items-center justify-between p-4 '>
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
						{documentContent && documentInfo ? (
							<DocumentPreview
								documentContent={documentContent} // Pass the Blob content here
								fileType={documentInfo.mimetype} // Pass the correct mimetype here
							/>
						) : (
							<p>Loading document...</p>
						)}
					</div>
				</div>
				{/* Sidebar */}
				<div className='w-80 border-l overflow-auto'>
					<Accordion type='single' collapsible className='w-full'>
						<AccordionItem value='actions'>
							<AccordionTrigger className='px-4'>Actions</AccordionTrigger>
							<AccordionContent>
								<div className='space-y-2 px-4'>
									<Button className='w-full justify-start' variant='ghost'>
										Start Collaboration Workflow
									</Button>
									<Button className='w-full justify-start' variant='ghost'>
										Share with External Users
									</Button>
									<Button className='w-full justify-start' variant='ghost'>
										Manage Linked Documents
									</Button>
									<Button className='w-full justify-start' variant='ghost'>
										Manage Status
									</Button>
									<Button className='w-full justify-start' variant='ghost'>
										Preview
									</Button>
									<Button className='w-full justify-start' variant='ghost'>
										Edit Online
									</Button>

									<Button className='w-full justify-start' variant='ghost'>
										Download
									</Button>
									<Button className='w-full justify-start' variant='ghost'>
										Manage Versions
									</Button>
								</div>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='properties'>
							<AccordionTrigger className='px-4'>Properties</AccordionTrigger>
							<AccordionContent>
								<div className='px-4 space-y-2 '>
									<div className='flex'>
										<Hash className='w-4 h-4 inline-block mr-2 items-center' />
										<p className='w-fill text-xs items-center'>
											Docuement ID: {documentInfo.id}
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
													Value: {'   '}
													{attribute.value}
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
