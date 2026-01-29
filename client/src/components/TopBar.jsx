import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { getCurrentUser } from '../services/api';

export default function TopBar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        // User not logged in or API error
        setCurrentUser(null);
      }
    };
    loadUser();
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SynergySphere</h1>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          aria-label="Search"
        />
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-white">{currentUser.username}</div>
                <div className="text-gray-500 dark:text-gray-400">{currentUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Not logged in</div>
            </div>
          )}
        </div>
        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Settings</button>
      </div>
    </header>
  );
}
