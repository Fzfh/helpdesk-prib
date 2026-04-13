"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Sembunyikan footer di halaman admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#1e1e1e] border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-white">Helpdesk System</h3>
            <p className="text-gray-400 text-sm">
              Solusi cepat untuk melaporkan dan melacak masalah Anda dengan dukungan AI.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3 text-white">Kontak</h3>
            <p className="text-gray-400 text-sm">Email: support@helpdesk.com</p>
            <p className="text-gray-400 text-sm">Telp: (021) 1234-5678</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3 text-white">Jam Operasional</h3>
            <p className="text-gray-400 text-sm">Senin - Jumat: 08:00 - 17:00</p>
            <p className="text-gray-400 text-sm">Sabtu - Minggu: Tutup</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; 2025 Helpdesk Ticketing System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}