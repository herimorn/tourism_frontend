import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Users,
  Calendar,
  Settings,
  Building2,
  Camera,
  FileText,
  LogOut,
  CreditCard,
  BarChart,
  MessageSquare,
  Star,
  Compass
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function DashboardSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const getMenuItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        icon: LayoutDashboard,
        href: `/${user?.role}/dashboard`
      }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { name: 'Users', icon: Users, href: '/admin/users' },
          { name: 'Tours', icon: Map, href: '/admin/tours' },
          { name: 'Bookings', icon: Calendar, href: '/admin/bookings' },
          { name: 'Payments', icon: CreditCard, href: '/admin/payments' },
          { name: 'Analytics', icon: BarChart, href: '/admin/analytics' },
          { name: 'Settings', icon: Settings, href: '/admin/settings' }
        ];
      case 'guide':
        return [
          ...baseItems,
          { name: 'My Tours', icon: Map, href: '/guide/tours' },
          { name: 'Bookings', icon: Calendar, href: '/guide/bookings' },
          { name: 'Media', icon: Camera, href: '/guide/media' },
          { name: 'Reviews', icon: Star, href: '/guide/reviews' },
          { name: 'Messages', icon: MessageSquare, href: '/guide/messages' },
          { name: 'Earnings', icon: CreditCard, href: '/guide/earnings' }
        ];
      case 'agency':
        return [
          ...baseItems,
          { name: 'Properties', icon: Building2, href: '/agency/properties' },
          { name: 'Bookings', icon: Calendar, href: '/agency/bookings' },
          { name: 'Media', icon: Camera, href: '/agency/media' },
          { name: 'Reviews', icon: Star, href: '/agency/reviews' },
          { name: 'Reports', icon: FileText, href: '/agency/reports' },
          { name: 'Settings', icon: Settings, href: '/agency/settings' }
        ];
      case 'tourist':
        return [
          ...baseItems,
          { name: 'My Bookings', icon: Calendar, href: '/tourist/bookings' },
          { name: 'Saved Tours', icon: Map, href: '/tourist/saved' },
          { name: 'Reviews', icon: Star, href: '/tourist/reviews' },
          { name: 'Messages', icon: MessageSquare, href: '/tourist/messages' },
          { name: 'Settings', icon: Settings, href: '/tourist/settings' }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Compass className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TourVR</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {user?.avatar_url ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.avatar_url}
                alt={user.full_name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    transition-colors duration-150 ease-in-out
                    ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-150 ease-in-out
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Button */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 ease-in-out"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}