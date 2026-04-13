"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  monthlyData: { month: string; total: number; closed: number }[];
  categoryData: { category: string; count: number; percent: number }[];
}

// SVG Icons Components (Heroicons style)
const TicketIcon = () => (
  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const OpenTicketIcon = () => (
  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ProgressIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClosedIcon = () => (
  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PieChartIcon = () => (
  <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


const grayscaleColors = [
  "#1f2937", "#374151", "#4b5563", "#6b7280", "#9ca3af",
  "#d1d5db", "#e5e7eb", "#9ca3af", "#111827", "#2d3748"
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const dashboardData = await res.json();
      const totalCount = dashboardData.categoryData.reduce((sum: number, item: any) => sum + item.count, 0);
      const categoryDataWithPercent = dashboardData.categoryData.map((item: any) => ({
        ...item,
        percent: totalCount > 0 ? parseFloat(((item.count / totalCount) * 100).toFixed(1)) : 0,
      }));
      setData({ ...dashboardData, categoryData: categoryDataWithPercent });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {session?.user?.name || "Admin"}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalTickets || 0}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <TicketIcon />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Open Tickets</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{data?.openTickets || 0}</p>
              </div>
              <div className="bg-yellow-50 rounded-full p-3">
                <OpenTicketIcon />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{data?.inProgressTickets || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-full p-3">
                <ProgressIcon />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Closed Tickets</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{data?.closedTickets || 0}</p>
              </div>
              <div className="bg-green-50 rounded-full p-3">
                <ClosedIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <BarChartIcon />
              <h3 className="text-lg font-semibold text-gray-800">Monthly Ticket Statistics</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#4b5563' }} />
                <YAxis tick={{ fill: '#4b5563' }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "total") return [`${value} tickets`, "Total Tickets"];
                    if (name === "closed") return [`${value} tickets`, "Closed Tickets"];
                    return [value, name];
                  }}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="total" fill="#374151" name="Total Tickets" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill="#9ca3af" name="Closed Tickets" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <PieChartIcon />
              <h3 className="text-lg font-semibold text-gray-800">Top Problem Categories</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.categoryData || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  nameKey="category"
                  label={({ payload }) => {
                    const item = payload as any;
                    return `${item.category}: ${item.percent}%`;
                  }}
                  labelLine={true}
                >
                  {(data?.categoryData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={grayscaleColors[index % grayscaleColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const percent = (props.payload as any).percent;
                    return [`${value} tickets (${percent}%)`, name];
                  }}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {(data?.categoryData || []).map((entry, index) => (
                <div key={entry.category} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grayscaleColors[index % grayscaleColors.length] }}></div>
                  <span className="text-sm text-gray-700">{entry.category}</span>
                  <span className="text-sm font-medium text-gray-500">({entry.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={async () => {
              const res = await fetch("/api/admin/export");
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "tickets_export.csv";
              a.click();
            }}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition flex items-center shadow-sm"
          >
            <DownloadIcon />
            Export Data (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}