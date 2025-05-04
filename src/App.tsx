import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToursPage } from './pages/ToursPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { TourDetailPage } from './pages/TourDetailPage';
import { AdminDashboardPage } from './pages/admin/DashboardPage';
import { GuideDashboardPage } from './pages/guide/DashboardPage';
import { AgencyDashboardPage } from './pages/agency/DashboardPage';
import { TouristDashboardPage } from './pages/tourist/DashboardPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'guide':
        return '/guide/dashboard';
      case 'agency':
        return '/agency/dashboard';
      case 'tourist':
        return '/tourist/dashboard';
      default:
        return '/';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tours" element={<ToursPage />} />
          <Route path="tours/:id" element={<TourDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Admin Routes */}
          <Route
            path="admin/dashboard"
            element={
              user?.role === 'admin' ? (
                <AdminDashboardPage />
              ) : (
                <Navigate to={getDashboardRoute()} />
              )
            }
          />

          {/* Guide Routes */}
          <Route
            path="guide/dashboard"
            element={
              user?.role === 'guide' ? (
                <GuideDashboardPage />
              ) : (
                <Navigate to={getDashboardRoute()} />
              )
            }
          />

          {/* Agency Routes */}
          <Route
            path="agency/dashboard"
            element={
              user?.role === 'agency' ? (
                <AgencyDashboardPage />
              ) : (
                <Navigate to={getDashboardRoute()} />
              )
            }
          />

          {/* Tourist Routes */}
          <Route
            path="tourist/dashboard"
            element={
              user?.role === 'tourist' ? (
                <TouristDashboardPage />
              ) : (
                <Navigate to={getDashboardRoute()} />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;