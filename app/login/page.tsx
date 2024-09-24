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

export default function Login() {
	return (
		<div className='flex items-center justify-center h-screen'>
			<div>
				<h2 className='text-center text-2xl p-5'>DocBox</h2>
				<Card className='mx-auto max-w-sm'>
					<CardHeader>
						<CardTitle className='text-2xl'>Login</CardTitle>
						<CardDescription>
							Enter your email below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
								/>
							</div>
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='password'>Password</Label>
								</div>
								<Input id='password' type='password' required />
							</div>
							<Button type='submit' className='w-full'>
								Login
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
