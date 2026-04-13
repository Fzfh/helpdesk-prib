"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Admin {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAdmins();
    }
  }, [session]);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const url = editingAdmin ? "/api/admin/users" : "/api/admin/users";
    const method = editingAdmin ? "PUT" : "POST";
    const payload = editingAdmin ? { ...form, id: editingAdmin.id } : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: "success", text: editingAdmin ? "Admin berhasil diupdate" : "Admin baru berhasil dibuat" });
      setShowModal(false);
      setEditingAdmin(null);
      setForm({ username: "", email: "", password: "", isActive: true });
      fetchAdmins();
    } else {
      setMessage({ type: "error", text: data.error || "Terjadi kesalahan" });
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Hapus admin "${username}"?`)) return;

    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage({ type: "success", text: "Admin berhasil dihapus" });
      fetchAdmins();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Gagal menghapus admin" });
    }
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setForm({
      username: admin.username,
      email: admin.email,
      password: "",
      isActive: admin.isActive,
    });
    setShowModal(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manajemen Admin</h2>
          <button
            onClick={() => {
              setEditingAdmin(null);
              setForm({ username: "", email: "", password: "", isActive: true });
              setShowModal(true);
            }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Tambah Admin Baru
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terakhir Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{admin.username}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {admin.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(admin)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button onClick={() => handleDelete(admin.id, admin.username)} className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingAdmin ? "Edit Admin" : "Tambah Admin Baru"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingAdmin ? "(kosongkan jika tidak diubah)" : "*"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  required={!editingAdmin}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Aktif</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
                  {editingAdmin ? "Update" : "Simpan"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}