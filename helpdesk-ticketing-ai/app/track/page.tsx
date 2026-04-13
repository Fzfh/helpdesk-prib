"use client";

import { useState } from "react";
import Link from "next/link";

interface TicketDetail {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  clientName: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  responses: Array<{
    message: string;
    createdAt: string;
    admin?: { username: string };
  }>;
}

// ===== SVG Icons =====
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const PriorityIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

export default function TrackPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [articleExpanded, setArticleExpanded] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket(null);

    const res = await fetch(`/api/tickets/track?ticketNumber=${ticketNumber}`);
    const data = await res.json();

    if (res.ok) {
      setTicket(data);
    } else {
      setError(data.error || "Tiket tidak ditemukan");
    }
    setLoading(false);
  };

  // Status badge style mapping
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
        return "text-gray-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm mb-4 shadow-sm border border-gray-200">
            <SearchIcon className="w-4 h-4" />
            <span>Track Your Ticket</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Lacak Pengajuan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Masukkan nomor tiket yang Anda terima via email untuk melihat status dan riwayat
          </p>
        </div>

        {/* Search Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-[#1e1e1e] px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TicketIcon />
              Cari Tiket
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                placeholder="Contoh: TIX-A9B3K2"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Mencari...
                  </>
                ) : (
                  <>
                    <SearchIcon className="w-5 h-5" />
                    Cari Tiket
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Ticket Detail Card */}
        {ticket && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header with title and status */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
                  <p className="text-sm font-mono text-gray-500 mt-1">{ticket.ticketNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            {/* Info grid */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <UserIcon />
                  <div>
                    <span className="text-gray-500 block text-xs">Pelapor</span>
                    <p className="font-medium text-gray-800">{ticket.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CategoryIcon />
                  <div>
                    <span className="text-gray-500 block text-xs">Kategori</span>
                    <p className="font-medium text-gray-800">{ticket.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityIcon />
                  <div>
                    <span className="text-gray-500 block text-xs">Prioritas</span>
                    <p className={`font-medium ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon />
                  <div>
                    <span className="text-gray-500 block text-xs">Tanggal Dibuat</span>
                    <p className="font-medium text-gray-800">{new Date(ticket.createdAt).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <span className="text-gray-500 text-xs block mb-1">Deskripsi</span>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Responses */}
            {ticket.responses.length > 0 && (
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <MessageIcon />
                  Riwayat Balasan
                </h3>
                <div className="space-y-4">
                  {ticket.responses.map((response, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span className="font-medium text-gray-700">Admin</span>
                        <span>{new Date(response.createdAt).toLocaleString("id-ID")}</span>
                      </div>
                      <p className="text-gray-700">{response.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Article Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => setArticleExpanded(!articleExpanded)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <SearchIcon className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Panduan Lacak Tiket</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Cara menggunakan fitur lacak tiket & informasi penting</p>
                </div>
              </div>
              <div className="text-gray-500">
                {articleExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${articleExpanded ? 'max-h-[800px]' : 'max-h-0'}`}>
              <div className="p-6 pt-0 border-t border-gray-100">
                <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                  <p className="text-base leading-relaxed">
                    <strong className="text-gray-900">Fitur Lacak Tiket (Ticket Tracking)</strong> adalah sistem yang memungkinkan Anda memantau status dan perkembangan laporan Anda secara <strong>real-time</strong>. Setiap tiket memiliki nomor unik yang dikirimkan ke email Anda saat pertama kali membuat laporan. Dengan nomor tersebut, Anda dapat melihat apakah tiket masih dalam antrian, sedang diproses, atau sudah selesai.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">📌 Cara Menggunakan Halaman Ini</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Masukkan Nomor Tiket</strong> – Cari email konfirmasi dari kami, lalu salin nomor tiket (contoh: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">TIX-A9B3K2</code>).</li>
                    <li><strong>Klik Tombol "Cari Tiket"</strong> – Sistem akan mencari data tiket yang cocok.</li>
                    <li><strong>Lihat Detail Tiket</strong> – Setelah ditemukan, Anda akan melihat judul, deskripsi, status, prioritas, kategori, dan seluruh riwayat balasan dari tim support.</li>
                    <li><strong>Pantau Perkembangan</strong> – Status tiket akan berubah dari <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs">Open</span> → <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">In Progress</span> → <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">Closed</span>. Anda bisa mengecek kapan saja tanpa perlu login.</li>
                  </ol>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">❓ Apa Itu Ticket Tracking?</h4>
                  <p>
                    Ticket tracking adalah fitur standar dalam sistem helpdesk modern yang memberikan transparansi penuh kepada pengguna. Alih-alih harus menelepon atau mengirim email berulang kali, Anda cukup memasukkan nomor tiket dan melihat status terkini. Ini menghemat waktu dan mengurangi frustrasi. Di sistem kami, Anda juga bisa melihat balasan dari admin secara kronologis, sehingga komunikasi tetap terpusat dan jelas.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-700 my-4">
                    <p className="text-sm italic text-gray-600">
                      💡 <strong>Tips:</strong> Simpan nomor tiket Anda di tempat aman. Jika lupa, Anda bisa meminta bantuan melalui email support@helpdesk.com dengan menyertakan alamat email yang digunakan saat membuat tiket.
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-400 border-t pt-4 mt-2">
                    Catatan: Data tiket disimpan dengan aman dan hanya dapat diakses menggunakan nomor tiket yang valid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}