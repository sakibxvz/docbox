'use client';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { account } from '@/services/api';
import { FetchAccountResponse, User } from '@/types/type';
import { Spinner } from '@/components/ui/Spinner';
import { Label } from '@/components/ui/label';

export default function MyAccount() {
	const [activeTab, setActiveTab] = useState('user-information');

	const [accountData, setAccountData] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAccount = async () => {
			const response: FetchAccountResponse = await account();
			console.log(response);

			if (response.success) {
				setAccountData(response.data);
			} else {
				setError(response.message);
			}
			setLoading(false);
		};

		fetchAccount();
	}, []);

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>My Account</h1>
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
					<TabsTrigger value='user-information'>User Information</TabsTrigger>
					<TabsTrigger value='edit-user-details'>Edit User Details</TabsTrigger>
					<TabsTrigger value='users'>Users</TabsTrigger>
					<TabsTrigger value='groups'>Groups</TabsTrigger>
				</TabsList>

				{/*  User Information */}
				<TabsContent value='user-information'>
					{error && (
						<div className='absolute inset-0 flex items-center justify-center bg-white opacity-75 z-10'>
							<div className='bg-red-500 text-white p-4 rounded'>{error}</div>
						</div>
					)}

					<Card>
						<CardHeader>
							<CardTitle>User Information</CardTitle>
							<CardDescription>View your account details</CardDescription>
						</CardHeader>
						{loading ? (
							<div className='flex justify-center items-center gap-3 mb-7'>
								<Spinner size='medium' />
							</div>
						) : (
							<CardContent>
								<div className='flex flex-col md:flex-row items-start gap-4'>
									<div className='flex-shrink-0'>
										<Avatar className='w-32 h-32'>
											<AvatarImage
												src='/placeholder.svg?height=128&width=128'
												alt='User'
											/>
											<AvatarFallback>
												{accountData?.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</div>
									<div className='flex-grow ml-4'>
										<div className='flex flex-col'>
											{/** Each label and span pair wrapped in a div for alignment **/}
											{[
												{ label: 'Name:', value: accountData?.name },
												{ label: 'User ID:', value: accountData?.id },
												{ label: 'Email:', value: accountData?.email },
												{ label: 'Role:', value: accountData?.role.name },
											].map(({ label, value }) => (
												<div key={label} className='flex items-center gap-2'>
													<Label className='font-semibold'>{label}</Label>
													<span>{value}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</CardContent>
						)}
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
