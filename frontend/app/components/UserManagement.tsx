'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/auth';

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Role Change (User <-> Admin)
  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('User role updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl mt-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            🛡️ User Management Panel
          </h2>
          <p className="text-xs text-slate-400">Manage registered system users & access permissions</p>
        </div>
        <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-semibold">
          Total Users: {users.length}
        </span>
      </div>

      {message && (
        <div className="mb-4 text-xs p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center font-medium">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-4">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-mono text-slate-500">#{u.id}</td>
                  <td className="p-3 font-semibold text-slate-200">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg border bg-slate-950 focus:outline-none cursor-pointer font-semibold ${
                        u.role === 'admin'
                          ? 'border-purple-500/40 text-purple-400 bg-purple-500/10'
                          : 'border-slate-800 text-slate-300'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-3 py-1 text-[11px] bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/20 transition font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}