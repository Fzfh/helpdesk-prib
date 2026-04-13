"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  category: string;
  priority: string;
  status: string;
  attachment: string | null;
  createdAt: string;
  responses: Response[];
  aiSuggestion: AiSuggestion | null;
}

interface Response {
  id: string;
  message: string;
  createdAt: string;
  admin: { username: string };
}

interface AiSuggestion {
  summary: string;
  suggestedCategory: string;
  suggestedPriority: string;
  isApproved: boolean | null;
}

// ===== SVG Icons =====
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DescriptionIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const StatusIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PriorityIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AiIcon = () => (
  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function TicketDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchTicket();
    }
  }, [session, params.id]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/admin/tickets/${params.id}`);
      const data = await res.json();
      setTicket(data);
      
      if (data.aiSuggestion) {
        setAiSuggestion(data.aiSuggestion);
      } else {
        generateAiSuggestion(data.description);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateAiSuggestion = async (description: string) => {
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const suggestion = await res.json();
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("AI generate error:", error);
    }
  };

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`/api/admin/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      fetchTicket();
    }
  };

  const updatePriority = async (newPriority: string) => {
    const res = await fetch(`/api/admin/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });
    if (res.ok) {
      fetchTicket();
    }
  };

  const approveAiSuggestion = async () => {
    if (!aiSuggestion) return;
    
    await updatePriority(aiSuggestion.suggestedPriority);
    await fetch(`/api/admin/tickets/${params.id}/ai-approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    
    alert("Sugesti AI telah disetujui!");
    fetchTicket();
  };

  const sendResponse = async () => {
    if (!responseMessage.trim()) return;
    
    setSending(true);
    const res = await fetch(`/api/admin/tickets/${params.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: responseMessage }),
    });
    
    if (res.ok) {
      setResponseMessage("");
      fetchTicket();
      alert("Balasan terkirim dan email notifikasi telah dikirim ke klien!");
    }
    setSending(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Closed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Low": return "text-gray-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="text-center">
          <TicketIcon />
          <p className="mt-3 text-gray-600">Tiket tidak ditemukan</p>
          <a href="/admin/tickets" className="mt-4 inline-block text-gray-700 underline">Kembali ke daftar tiket</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <a
              href="/admin/tickets"
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <BackIcon />
              <span>Kembali</span>
            </a>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Tiket</h1>
              <p className="text-sm font-mono text-gray-500 mt-0.5">{ticket.ticketNumber}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main Info & Responses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Ticket Info */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{ticket.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserIcon />
                  <div>
                    <span className="text-gray-500 text-sm block">Pelapor</span>
                    <p className="text-gray-800">{ticket.clientName}</p>
                    <p className="text-gray-500 text-sm">{ticket.clientEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CategoryIcon />
                  <div>
                    <span className="text-gray-500 text-sm block">Kategori</span>
                    <p className="text-gray-800">{ticket.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarIcon />
                  <div>
                    <span className="text-gray-500 text-sm block">Tanggal Dibuat</span>
                    <p className="text-gray-800">{new Date(ticket.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DescriptionIcon />
                  <div className="flex-1">
                    <span className="text-gray-500 text-sm block">Deskripsi</span>
                    <div className="mt-1 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response History */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageIcon />
                <h3 className="text-lg font-semibold text-gray-800">Riwayat Balasan</h3>
              </div>
              {ticket.responses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Belum ada balasan</p>
              ) : (
                <div className="space-y-4">
                  {ticket.responses.map((resp) => (
                    <div key={resp.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span className="font-medium text-gray-700">Admin: {resp.admin.username}</span>
                        <span>{new Date(resp.createdAt).toLocaleString("id-ID")}</span>
                      </div>
                      <p className="text-gray-700">{resp.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Form */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Balas Tiket</h3>
              <textarea
                rows={4}
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Tulis balasan Anda di sini..."
              />
              <button
                onClick={sendResponse}
                disabled={sending || !responseMessage.trim()}
                className="mt-4 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Kirim Balasan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Status & AI */}
          <div className="space-y-6">
            {/* Status Controls */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <StatusIcon />
                <h3 className="text-lg font-semibold text-gray-800">Status Tiket</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => updatePriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            {aiSuggestion && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AiIcon />
                  <h3 className="text-lg font-semibold text-gray-800">Asisten AI</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Ringkasan:</span>
                    <p className="mt-1 text-gray-600">{aiSuggestion.summary}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Rekomendasi Kategori:</span>
                    <p className="text-gray-600">{aiSuggestion.suggestedCategory}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Rekomendasi Prioritas:</span>
                    <p className={`font-medium ${getPriorityStyle(aiSuggestion.suggestedPriority)}`}>
                      {aiSuggestion.suggestedPriority}
                    </p>
                  </div>
                </div>
                {ticket.priority !== aiSuggestion.suggestedPriority && (
                  <button
                    onClick={approveAiSuggestion}
                    className="mt-5 w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                  >
                    Gunakan Rekomendasi AI
                  </button>
                )}
                {ticket.priority === aiSuggestion.suggestedPriority && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-green-600 text-sm">
                    <CheckIcon />
                    <span>Rekomendasi AI sudah diterapkan</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}