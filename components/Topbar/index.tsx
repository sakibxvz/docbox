'use client';
import Link from 'next/link';
import {
	CircleUser,
	FileText,
	Grip,
	Home,
	LineChart,
	Mail,
	Map,
	Menu,
	MessageSquare,
	Newspaper,
	Package,
	Package2,
	Search,
	ShoppingCart,
	Sparkles,
	Users,
	Video,
	LockKeyholeOpen,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const services = [
	{ name: 'Search', icon: Search, link: '/' }, // added link
	{ name: 'Control', icon: LockKeyholeOpen, link: '/access-control' },
	{ name: 'Maps', icon: Map, link: '/' },
	{ name: 'Gemini', icon: Sparkles, link: '/' },
	{ name: 'News', icon: Newspaper, link: '/' },
	{ name: 'Gmail', icon: Mail, link: '/' },
	{ name: 'Meet', icon: Video, link: '/' },
	{ name: 'Chat', icon: MessageSquare, link: '/' },
	{ name: 'Contacts', icon: Users, link: '/' },
	{ name: 'Drive', icon: FileText, link: '/' },
];

const DashboardTopBar = () => {
	const [isGripOpen, setIsGripOpen] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		try {
			// Call the API route to clear the cookie
			const response = await fetch('/api/logout', { method: 'GET' });

			// Check if the response was successful
			if (!response.ok) {
				throw new Error('Logout failed');
			}

			// Redirect to the login page
			router.push('/login');
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	return (
		<header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant='outline' size='icon' className='shrink-0 md:hidden'>
						<Menu className='h-5 w-5' />
						<span className='sr-only'>Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side='left' className='flex flex-col'>
					<nav className='grid gap-2 text-lg font-medium'>
						<Link
							href='#'
							className='flex items-center gap-2 text-lg font-semibold'
						>
							<Package2 className='h-6 w-6' />
							<span className='sr-only'>Acme Inc</span>
						</Link>
						<Link
							href='#'
							className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
						>
							<Home className='h-5 w-5' />
							Dashboard
						</Link>
						<Link
							href='#'
							className='mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground'
						>
							<ShoppingCart className='h-5 w-5' />
							Orders
							<Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
								6
							</Badge>
						</Link>
						<Link
							href='#'
							className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
						>
							<Package className='h-5 w-5' />
							Products
						</Link>
						<Link
							href='#'
							className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
						>
							<Users className='h-5 w-5' />
							Customers
						</Link>
						<Link
							href='#'
							className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
						>
							<LineChart className='h-5 w-5' />
							Analytics
						</Link>
					</nav>
					<div className='mt-auto'>
						<Card>
							<CardHeader>
								<CardTitle>Upgrade to Pro</CardTitle>
								<CardDescription>
									Unlock all features and get unlimited access to our support
									team.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button size='sm' className='w-full'>
									Upgrade
								</Button>
							</CardContent>
						</Card>
					</div>
				</SheetContent>
			</Sheet>
			<div className='w-full flex-1'>
				<form>
					<div className='flex items-center w-full max-w-3xl rounded-md'>
						<Select defaultValue='full-text'>
							<SelectTrigger className='w-[180px] border-none bg-background'>
								<SelectValue placeholder='Search Type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='full-text'>Full Text Search</SelectItem>
								<SelectItem value='standard'>Search</SelectItem>
							</SelectContent>
						</Select>
						<div className='relative flex-grow'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search Documents...'
								className='w-full appearance-none bg-background pl-8 focus-visible:ring-0 focus-visible:ring-offset-0'
							/>
						</div>
					</div>
				</form>
			</div>

			{/* Dark and Light Mode Toggle */}
			<ModeToggle />

			{/* Grid View Toggle */}
			<DropdownMenu open={isGripOpen} onOpenChange={setIsGripOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon'>
						<Grip className='h-[1.2rem] w-[1.2rem]' />
						<span className='sr-only'>Toggle Google services menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-[300px]'>
					<div className='grid grid-cols-3 gap-4 p-4'>
						{services.map((service) => {
							const Icon = service.icon;
							return (
								<DropdownMenuItem
									key={service.name}
									className='flex flex-col items-center justify-center p-2'
								>
									<Icon className='mb-2 h-6 w-6' />
									{service.link ? (
										<Link href={service.link}>
											<span className='text-xs'>{service.name}</span>
										</Link>
									) : (
										<span className='text-xs'>{service.name}</span> // Fallback without link
									)}
								</DropdownMenuItem>
							);
						})}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* User Dropdown Menu */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='secondary' size='icon' className='rounded-full'>
						<CircleUser className='h-5 w-5' />
						<span className='sr-only'>Toggle user menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>
						<Link
							href='/account'
							style={{ textDecoration: 'none', color: 'inherit' }}
						>
							My Account{' '}
						</Link>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>Support</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
};

export default DashboardTopBar;
