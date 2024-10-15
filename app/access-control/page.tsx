'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { PenIcon, TrashIcon } from 'lucide-react';

export default function AccessControlPage() {
	const [activeTab, setActiveTab] = useState('users');

	return (
		<div className='container mx-auto p-6 space-y-8'>
			<h1 className='text-3xl font-bold'>User Management System</h1>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-4'
			>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='users'>Users</TabsTrigger>
					<TabsTrigger value='roles'>Roles</TabsTrigger>
					<TabsTrigger value='access-control'>Access Control</TabsTrigger>
				</TabsList>
				<TabsContent value='users' className='space-y-4'>
					<div className='flex justify-between items-center'>
						<Input className='max-w-sm' placeholder='Search users' />
						<Button>Add User</Button>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[
								{
									name: 'John Doe',
									email: 'john@example.com',
									role: 'Admin',
									status: 'Active',
								},
								{
									name: 'Jane Smith',
									email: 'jane@example.com',
									role: 'User',
									status: 'Inactive',
								},
								{
									name: 'Bob Johnson',
									email: 'bob@example.com',
									role: 'Manager',
									status: 'Active',
								},
							].map((user) => (
								<TableRow key={user.email}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell>{user.status}</TableCell>
									<TableCell className='space-x-2'>
										<Button variant='ghost' size='icon'>
											<PenIcon className='h-4 w-4' />
										</Button>
										<Button variant='ghost' size='icon'>
											<TrashIcon className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TabsContent>
				<TabsContent value='roles' className='space-y-4'>
					<div className='flex justify-end'>
						<Button>Create Role</Button>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Role Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Users</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[
								{ name: 'Admin', description: 'Full system access', users: 2 },
								{
									name: 'Manager',
									description: 'Manage users and content',
									users: 5,
								},
								{ name: 'User', description: 'Basic access', users: 20 },
							].map((role) => (
								<TableRow key={role.name}>
									<TableCell>{role.name}</TableCell>
									<TableCell>{role.description}</TableCell>
									<TableCell>{role.users}</TableCell>
									<TableCell className='space-x-2'>
										<Button variant='ghost' size='icon'>
											<PenIcon className='h-4 w-4' />
										</Button>
										<Button variant='ghost' size='icon'>
											<TrashIcon className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TabsContent>
				<TabsContent value='access-control' className='space-y-4'>
					<div className='flex justify-between items-center'>
						<Select>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select Role' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='admin'>Admin</SelectItem>
								<SelectItem value='manager'>Manager</SelectItem>
								<SelectItem value='user'>User</SelectItem>
							</SelectContent>
						</Select>
						<Button>Update Permissions</Button>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Permission</TableHead>
								<TableHead>Create</TableHead>
								<TableHead>Read</TableHead>
								<TableHead>Update</TableHead>
								<TableHead>Delete</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{['Users', 'Roles', 'Groups'].map((permission) => (
								<TableRow key={permission}>
									<TableCell>{permission}</TableCell>
									<TableCell>
										<Checkbox />
									</TableCell>
									<TableCell>
										<Checkbox />
									</TableCell>
									<TableCell>
										<Checkbox />
									</TableCell>
									<TableCell>
										<Checkbox />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TabsContent>
			</Tabs>
		</div>
	);
}
