"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

// ===== SVG Icons =====
const CheckCircleIcon = () => (
  <svg className="w-20 h-20 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const NewTicketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-gray-400 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticket");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!ticketNumber) return;
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[#1e1e1e] px-6 py-5 text-center">
            <CheckCircleIcon />
            <h1 className="text-2xl font-bold text-white mt-3">Tiket Berhasil Dibuat!</h1>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-2">Nomor tiket Anda:</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <div className="flex items-center justify-center gap-3">
                <p className="font-mono text-2xl font-bold text-gray-800 tracking-wide">
                  {ticketNumber}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                  title="Salin nomor tiket"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2">✓ Nomor tiket disalin!</p>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-6">
              <MailIcon />
              <span>Email notifikasi telah dikirim ke alamat email Anda.</span>
            </div>
            
            <p className="text-gray-500 text-sm mb-6">
              Simpan nomor tiket ini untuk melacak status pengaduan.
            </p>
            
            <div className="space-y-3">
              <Link
                href="/track"
                className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-sm"
              >
                <TrackIcon />
                Lacak Pengajuan
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm"
              >
                <NewTicketIcon />
                Buat Tiket Baru
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Butuh bantuan? Hubungi support@helpdesk.com</p>
        </div>
      </div>
    </div>
  );
}