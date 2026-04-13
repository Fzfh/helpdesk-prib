"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  clientName: string;
  status: string;
  priority: string;
  createdAt: string;
}

// ===== SVG Icons =====
const TicketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

export default function AdminTickets() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTickets();
    }
  }, [session]);

  useEffect(() => {
    // Filter tickets based on search and filters
    let filtered = tickets;
    
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Tiket</h1>
            <p className="text-gray-500 mt-1">Kelola dan pantau semua tiket pelanggan</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nomor tiket, judul, atau nama klien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon />
                </div>
              </div>
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white cursor-pointer"
                >
                  <option value="all">Semua Prioritas</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table (Desktop) */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Tiket</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Klien</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioritas</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <EmptyIcon />
                      <p className="mt-3 text-gray-500">Tidak ada tiket yang ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{ticket.ticketNumber}</td>
                      <td className="px-6 py-4 text-gray-700">{ticket.title}</td>
                      <td className="px-6 py-4 text-gray-700">{ticket.clientName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`/admin/tickets/${ticket.id}`}
                          className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-sm transition"
                        >
                          Detail <ChevronRightIcon />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tickets Cards (Mobile) */}
        <div className="md:hidden space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <EmptyIcon />
              <p className="mt-3 text-gray-500">Tidak ada tiket yang ditemukan</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900">{ticket.ticketNumber}</p>
                    <h3 className="font-medium text-gray-800 mt-1">{ticket.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Klien:</span>
                    <span className="text-gray-700">{ticket.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prioritas:</span>
                    <span className={`font-medium ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal:</span>
                    <span className="text-gray-700">{new Date(ticket.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <a
                    href={`/admin/tickets/${ticket.id}`}
                    className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-sm"
                  >
                    Lihat Detail <ChevronRightIcon />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredTickets.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 flex justify-between items-center">
            <span>Menampilkan {filteredTickets.length} dari {tickets.length} tiket</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-100 rounded-full"></span> Open
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-100 rounded-full"></span> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 rounded-full"></span> Closed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}