'use client';

import { useState } from 'react';
import Link from 'next/link';
import API from '../../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/register', { name, role, email, password });
      alert('Registration successful! Please sign in.');
      window.location.href = '/';
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-[#131b2e] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center text-amber-500 text-3xl mb-1">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TaskFlow Engine</h1>
          <p className="text-xs text-slate-400">Create a new account to get started</p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="bg-[#0b0f19] p-1 rounded-xl flex items-center border border-slate-800">
          <Link
            href="/"
            className="flex-1 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 text-center transition-all"
          >
            Sign In
          </Link>
          <div className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white text-center shadow-md">
            Register
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              FULL NAME
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 relative z-20 pointer-events-auto"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              ACCOUNT ROLE
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 relative z-20 pointer-events-auto"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 relative z-20 pointer-events-auto"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 relative z-20 pointer-events-auto"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 text-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Bottom Redirect */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              href="/"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1"
            >
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}