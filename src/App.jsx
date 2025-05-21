import React, { useState } from 'react';
import './App.css';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './components/AdminDashboard';
import { Layout } from 'antd';
import HeroSection from "./components/HeroSection";
import SongList from "./components/SongList";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserManagement from "./pages/UserManagement";
import SongManagement from "./pages/SongManagement";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === 'admin';
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <Router>
      {isAdmin ? (
        <Layout style={{ minHeight: '100vh' }}>
          <AdminSidebar onLogout={handleLogout} />
          <Layout>
            <Layout.Content style={{ background: '#f4f6fa' }}>
              <Routes>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/songs" element={<SongManagement />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </Routes>
            </Layout.Content>
          </Layout>
        </Layout>
      ) : (
        <Routes>
          <Route path="/admin/users" element={<Navigate to="/" />} />
          <Route path="/" element={
            <div className="bg-gray-100 min-h-screen">
              <HeroSection />
              <SongList />
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}
