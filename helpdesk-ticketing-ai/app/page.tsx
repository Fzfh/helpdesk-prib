"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

const categories = [
  "Hardware",
  "Software",
  "Jaringan",
  "Akun & Akses",
  "Lainnya",
];

// ===== SVG Icons (Heroicons style) =====
const TicketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a9 9 0 1118 0v1a9 9 0 11-18 0V9zM5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
  </svg>
);

const AiIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    title: "",
    description: "",
    category: "",
  });

  // State for interactive article (accordion)
  const [articleExpanded, setArticleExpanded] = useState(false);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      alert("Harap verifikasi CAPTCHA terlebih dahulu!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        captchaToken: captchaToken,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/submit/success?ticket=${data.ticketNumber}`);
    } else {
      alert(data.error || "Gagal membuat tiket");
      setLoading(false);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section - No emojis */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm mb-4 shadow-sm border border-gray-200">
            <HeadsetIcon />
            <span>Layanan 24/7</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Helpdesk <span className="text-gray-600">Ticketing System</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Laporkan masalah Anda dengan mudah. Tim support kami akan segera merespon dengan bantuan Asisten AI.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
          <div className="bg-[#1e1e1e] px-6 py-5">
            <h2 className="text-xl font-bold text-white">Buat Tiket Baru</h2>
            <p className="text-gray-300 text-sm">Isi form di bawah untuk melaporkan masalah</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif *</label>
                  <input
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                    required
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  required
                  placeholder="Ringkasan masalah Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Rinci Masalah *</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  required
                  placeholder="Jelaskan masalah Anda secara detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center py-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleCaptchaChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Memproses..." : "Kirim Laporan"}
              </button>
            </form>
          </div>
        </div>

        {/* Feature Section - Icons instead of emojis */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-gray-100 transition hover:shadow-lg">
          <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Asisten AI</h3>
          <p className="text-gray-500 text-sm">Prioritas dan kategorisasi tiket otomatis dengan AI</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-gray-100 transition hover:shadow-lg">
          <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Notifikasi Email</h3>
          <p className="text-gray-500 text-sm">Dapatkan update status tiket via email</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-gray-100 transition hover:shadow-lg">
          <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Lacak Tiket</h3>
          <p className="text-gray-500 text-sm">Pantau status tiket kapan saja dengan nomor tiket</p>
        </div>
      </div>

        {/* Interactive Article Section - What is Helpdesk? */}
        <div className="mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => setArticleExpanded(!articleExpanded)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <TicketIcon />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Apa itu Helpdesk Ticketing System?</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Panduan lengkap tentang sistem tiket modern</p>
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
                    <strong className="text-gray-900">Helpdesk Ticketing System</strong> adalah platform terpusat yang digunakan untuk mencatat, melacak, dan menyelesaikan masalah atau permintaan dari pengguna (karyawan, pelanggan, atau klien). Setiap laporan diubah menjadi <strong>"tiket"</strong> unik yang memungkinkan tim support untuk mengelola prioritas, status, dan riwayat komunikasi secara efisien.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Mengapa Sistem Tiket Penting?</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>✅ <strong>Terstruktur & Akuntabel</strong> – Setiap masalah terdokumentasi dengan jelas, tidak ada yang terlewat.</li>
                    <li>⚡ <strong>Prioritas Otomatis</strong> – Tiket darurat bisa langsung ditangani lebih cepat.</li>
                    <li>📊 <strong>Analitik & Pelaporan</strong> – Lihat tren masalah, kinerja tim, dan SLA.</li>
                    <li>🤝 <strong>Kolaborasi Tim</strong> – Banyak agen bisa bekerja pada satu tiket tanpa konflik.</li>
                    <li>🔒 <strong>Keamanan & Privasi</strong> – Hanya pihak berwenang yang dapat mengakses detail tiket.</li>
                  </ul>
                  <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Fitur Modern dalam Sistem Kami</h4>
                  <p>
                    Selain form pelaporan standar, sistem ini dilengkapi dengan <strong>Asisten AI</strong> yang secara otomatis mengkategorikan dan merekomendasikan prioritas tiket. Anda juga akan menerima <strong>notifikasi email</strong> real-time setiap ada perubahan status. Dan dengan nomor tiket, Anda bisa <strong>melacak progres</strong> kapan saja melalui halaman lacak khusus.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-700 my-4">
                    <p className="text-sm italic text-gray-600">
                      💡 <strong>Tips:</strong> Semakin detail deskripsi yang Anda berikan, semakin cepat tim support kami memahami dan menyelesaikan masalah Anda. Jangan ragu melampirkan screenshot jika diperlukan (fitur upload akan segera hadir).
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 border-t pt-4 mt-2">
                    Terakhir diperbarui: April 2026 — Sistem Helpdesk generasi baru dengan kecerdasan buatan.
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