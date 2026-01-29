import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProjectRoom from './pages/ProjectRoom';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';

function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/project/:projectId" element={<Layout><ProjectRoom /></Layout>} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
