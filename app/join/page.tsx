import { getSession } from '@/lib/auth';
import { joinWorkspace } from '@/app/actions/workspace';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const session = await getSession();
  const { code } = await searchParams;

  if (!session) {
    const callbackUrl = encodeURIComponent(`/join?code=${code || ''}`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  if (!code) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h1>
                <p className="text-gray-600 mb-6">No invite code provided.</p>
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
  }

  const result = await joinWorkspace(code);

  if (result?.error) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-sm">
                <h1 className="text-xl font-bold text-red-600 mb-2">Join Failed</h1>
                <p className="text-gray-600 mb-6">{result.error}</p>
                <Link href="/dashboard" className="w-full block py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    ); 
  }

  // Success is handled by redirect in joinWorkspace or we redirect here if that function just returns success.
  // Ideally joinWorkspace redirects or we do it here. 
  // Looking at my implementation of joinWorkspace, it returns error or nothing (implied success).
  // But wait, joinWorkspace calls switchWorkspace which redirects. 
  // If joinWorkspace finishes without redirecting (e.g. if I removed redirect there), verify behavior.
  // My joinWorkspace implementation calls switchWorkspace at the end, which redirects to /dashboard.
  // So validation logic above is fine, successful path won't reach here.
  
  return null;
}
