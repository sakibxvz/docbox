'use client';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/services/api'; // Import the login function
import { useRouter } from 'next/navigation';

interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		type: string;
		id: number;
		name: string;
		login: string;
		email: string;
		role: {
			id: string;
			name: string;
		};
	};
}

export default function Login() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null); // Clear any previous errors

		try {
			// Call the login API with the form data
			const response = await login({ user: username, pass: password });
			const data: LoginResponse = response.data;
			console.log(response);

			if (data.success) {
				// On success, redirect to a protected page (e.g., dashboard)
				router.push('/login');
				// getFolder(1);
			} else {
				// On failure, set error message
				setError('Login failed. Please check your credentials.');
			}
		} catch (error) {
			setError('An error occurred during login. Please try again.');
		}
	};

	return (
		<div className='flex items-center justify-center h-screen'>
			<div>
				<h2 className='text-center text-2xl p-5'>DocBox</h2>
				<Card className='mx-auto max-w-sm'>
					<CardHeader>
						<CardTitle className='text-2xl'>Login</CardTitle>
						<CardDescription>
							Enter your User Name below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit}>
							<div className='grid gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='username'>User Name</Label>
									<Input
										id='username'
										type='text'
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='password'>Password</Label>
									<Input
										id='password'
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>
								{error && <div className='text-red-500'>{error}</div>}
								<Button type='submit' className='w-full'>
									Login
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
