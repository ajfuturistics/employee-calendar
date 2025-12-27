import { register } from '@/app/actions/auth';
import Link from 'next/link';

export default async function RegisterPage(props: { searchParams: Promise<{ callbackUrl?: string, code?: string }> }) {
  const searchParams = await props.searchParams;
  
  // Extract code from direct param OR callbackUrl if present
  let inviteCode = searchParams.code;
  if (!inviteCode && searchParams.callbackUrl) {
      try {
          const url = new URL(searchParams.callbackUrl, 'http://localhost');
          inviteCode = url.searchParams.get('code') || undefined;
      } catch (e) {
          // ignore invalid url
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-950 to-gray-950 text-white p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-gray-400 mt-2">Create your workspace & admin account</p>
        </div>

        <form action={register} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-500"
              placeholder="John Doe"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">
              Company / Workspace Name
            </label>
            <input
              name="companyName"
              type="text"
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-500"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-500"
              placeholder="john@acme.com"
            />
          </div>

          {/* New Invite Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Invite Code <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <input
              name="inviteCode"
              type="text"
              defaultValue={inviteCode || ''}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-500 font-mono tracking-wider"
              placeholder="XYZ123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            Create Workspace
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link 
            href={searchParams.callbackUrl ? `/login?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}` : '/login'} 
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
