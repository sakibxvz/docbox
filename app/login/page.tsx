'use client';
import { useState, FormEvent, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';

export default function Login() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const result = await login({ user: username, pass: password });

			if ('id' in result) {
				// If the result contains an `id`, it's a User object (successful login)
				console.log('Login successful:', result);
			
				router.push('/login'); // Redirect after successful login
			} else {
				// If result does not have an `id`, it's an ErrorResponse
				setError(result.message); // Set error message from the ErrorResponse
			}
		} catch (error) {
			console.error('Login error:', error);
			setError('An unexpected error occurred.'); // Update error state
		}
	};

	return (
		<div className='flex items-center justify-center h-screen'>
			<div>
				<h2 className='text-center text-4xl p-5'>DocBox</h2>
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
