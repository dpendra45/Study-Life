import React, { useState } from 'react';
import { BookOpenIcon, GoogleIcon, AppleIcon } from './icons';

interface LoginProps {
  onLogin: (email: string, password?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      // In a real app, you'd validate the password
      onLogin(email, password);
    } else {
      // Sign up logic
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      // Mocking signup by just logging in
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <BookOpenIcon className="h-12 w-12 text-primary mx-auto"/>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Welcome to Academia Planner</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isLoginView ? 'Sign in to continue to your dashboard.' : 'Create an account to get started.'}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
            <div className="space-y-4">
                <button onClick={() => onLogin('demo@google.com')} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <GoogleIcon className="w-6 h-6" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">Continue with Google</span>
                </button>
                <button onClick={() => onLogin('demo@apple.com')} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors">
                    <AppleIcon className="w-6 h-6" />
                    <span className="font-medium">Continue with Apple</span>
                </button>
            </div>
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                        placeholder="••••••••"
                    />
                </div>
                {!isLoginView && (
                    <div>
                        <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                            placeholder="••••••••"
                        />
                    </div>
                )}
                 <button type="submit" className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                    {isLoginView ? 'Sign In' : 'Create Account'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLoginView(!isLoginView)} className="ml-1 font-medium text-primary hover:underline">
                    {isLoginView ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
