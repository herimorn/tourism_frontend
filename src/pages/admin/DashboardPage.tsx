import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, Map, Calendar, DollarSign, TrendingUp, Hotel, Star } from 'lucide-react';
import { api } from '../../lib/api';

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: { total: 0, growth: [] },
    tours: { total: 0, stats: [], popularDestinations: [] },
    bookings: { total: 0, recent: [] },
    revenue: { total: 0, monthly: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [
          usersData,
          toursData,
          bookingsData,
          revenueData
        ] = await Promise.all([
          api.admin.getUserStats(),
          api.admin.getTourStats(),
          api.admin.getBookingStats(),
          api.admin.getRevenueStats()
        ]);

        setStats({
          users: usersData,
          tours: toursData,
          bookings: bookingsData,
          revenue: revenueData
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }

  const layout = [
    { i: 'stats', x: 0, y: 0, w: 12, h: 3 },
    { i: 'bookings', x: 0, y: 3, w: 6, h: 8 },
    { i: 'revenue', x: 6, y: 3, w: 6, h: 8 },
    { i: 'users', x: 0, y: 11, w: 6, h: 8 },
    { i: 'destinations', x: 6, y: 11, w: 6, h: 8 }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        margin={[20, 20]}
      >
        {/* Stats Overview */}
        <div key="stats" className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.users.total}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              change="+12%"
            />
            <StatCard
              title="Total Tours"
              value={stats.tours.total}
              icon={<Map className="h-6 w-6 text-green-600" />}
              change="+5%"
            />
            <StatCard
              title="Total Bookings"
              value={stats.bookings.total}
              icon={<Calendar className="h-6 w-6 text-purple-600" />}
              change="+8%"
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats.revenue.total.toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
              change="+15%"
            />
          </div>
        </div>

        {/* Bookings Chart */}
        <div key="bookings" className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
          <LineChart width={500} height={300} data={stats.bookings.recent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Revenue Chart */}
        <div key="revenue" className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue Analysis</h2>
          <BarChart width={500} height={300} data={stats.revenue.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* User Growth */}
        <div key="users" className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <LineChart width={500} height={300} data={stats.users.growth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Popular Destinations */}
        <div key="destinations" className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Popular Destinations</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.tours.popularDestinations}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stats.tours.popularDestinations.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

function StatCard({ title, value, icon, change }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        {icon}
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        <span className="text-green-500">{change}</span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
}