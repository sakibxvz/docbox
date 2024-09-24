import DashboardSidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/Topbar';

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
			{/* Sidebar */}
			<DashboardSidebar />
			<div className='flex flex-col'>
				{/* topbar  */}
				<DashboardTopBar />
				{/* main content */}
				<main className='flex flex-1 flex-col gap-4'>
					<div className=' flex flex-auto flex-col gap-4  md:gap-8 md:p-8'>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardWrapper;
