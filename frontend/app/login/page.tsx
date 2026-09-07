'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Route Protection & Redirect: දැනටමත් Token එකක් තිබේ නම් auto dashboard එකට redirect කරයි
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // පරණ error reset කරයි

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        window.location.href = '/dashboard';
      } else {
        // --- REGISTER LOGIC ---
        await axios.post('http://localhost:5000/api/auth/register', {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });

        alert('Registration successful! Please sign in with your credentials.');
        // Register වුණාට පසු Login Tab එකට මාරු කර Password රීසෙට් කරයි
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      // 2. Form Error Feedback
      setErrorMsg(err.response?.data?.message || 'Action failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <span className="text-4xl">⚡</span>
          <h1 className="text-2xl font-bold text-white">TaskFlow Engine</h1>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Sign in to access your workspace' : 'Create a new account to get started'}
          </p>
        </div>

        {/* Login / Register Toggle Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              !isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Inline Error Message Display */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium text-center flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register වෙන විට පමණක් පෙන්වන Full Name සහ Role */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            className="text-indigo-400 hover:underline font-semibold"
          >
            {isLogin ? 'Register now' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
}