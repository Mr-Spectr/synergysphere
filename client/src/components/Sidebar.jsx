import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`bg-gray-100 h-full p-4 ${isCollapsed ? 'w-16' : 'w-64'} transition-width`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-4"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? '>' : '<'}
      </button>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`block p-2 rounded ${location.pathname === '/dashboard' ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
            >
              {isCollapsed ? '🏠' : 'Projects'}
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className={`block p-2 rounded ${location.pathname === '/tasks' ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
            >
              {isCollapsed ? '📋' : 'My Tasks'}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <button className="block w-full p-2 rounded hover:bg-gray-200">
          {isCollapsed ? '🌙' : 'Dark Mode'}
        </button>
        <div className="flex items-center mt-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
          {!isCollapsed && <span className="text-sm">you@demo.test</span>}
        </div>
      </div>
    </aside>
  );
}
