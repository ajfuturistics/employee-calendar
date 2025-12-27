import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          WorkCal
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          The modern way to manage employee leaves and company holidays. 
          Timezone-aware, beautiful, and simple.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/register"
            className="px-8 py-4 bg-white text-gray-950 font-bold rounded-full hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="px-8 py-4 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-transform hover:scale-105 active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
