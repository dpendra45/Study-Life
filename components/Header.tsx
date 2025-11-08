
import React from 'react';
import { SunIcon, MoonIcon, BookOpenIcon, LogoutIcon } from './icons';
import { User } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, user, onLogout }) => {
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <BookOpenIcon className="h-8 w-8 text-primary"/>
            <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Academia Planner</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
            {user && (
              <div className="flex items-center space-x-2">
                  <img className="h-8 w-8 rounded-full" src={user.avatar} alt="User avatar" />
                  <span className="hidden sm:block font-medium text-gray-700 dark:text-gray-300 capitalize">{user.name}</span>
                  <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <LogoutIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
