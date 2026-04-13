"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#1e1e1e] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-[#1e1e1e] font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl text-white">Helpdesk<span className="text-gray-400">System</span></span>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6">
            {/* Menu tetap untuk semua */}
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Beranda
            </Link>
            <Link href="/track" className="text-gray-300 hover:text-white transition">
              Lacak Tiket
            </Link>

            {/* Menu tambahan jika admin sudah login */}
            {session && (
              <>
                <Link href="/admin/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
                <Link href="/admin/tickets" className="text-gray-300 hover:text-white transition">
                  Tiket
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition text-sm"
                >
                  Logout
                </button>
              </>
            )}

            {/* Ikon gembok untuk login jika belum login */}
            {!session && (
              <Link href="/admin/login" className="text-gray-300 hover:text-white transition" title="Login Admin">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}