'use client'; // For Next.js client components

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// Button import removed - using styled HTML button instead
import { useAuth } from '@components/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Sign in user
      await login(email, password);
      
      // Redirect to dashboard
      router.push('/home');
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white font-noto-sans rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-extrabold leading-tight tracking-tight text-indigo-400 md:text-2xl">
            Sign in to your account
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-400 focus:border-indigo-400 block w-full p-2.5"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="h-10 items-center cursor-pointer font-medium rounded-lg text-m text-center focus:ring-2 focus:outline-none my-0 flex justify-center align-middle w-full px-5 bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-600 text-white"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm font-manrope text-gray-500 mt-5">
            Don't have an account?{" "}
            <a href="./sign-up" className="font-medium text-indigo-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;