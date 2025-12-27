import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch full user data if needed, for now session has basic info
  // In a real app we might fetch the user from DB to get fresh data
  const user = session; 

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <AppHeader user={user} />
        <main className="flex-1 overflow-auto p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
}
