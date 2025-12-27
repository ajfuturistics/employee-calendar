'use client';

export function AppHeader({ user }: { user: any }) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div>
        {/* Breadcrumb or Page Title can go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {user?.name?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
