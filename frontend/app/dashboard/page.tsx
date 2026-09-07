'use client';

import { useState, useEffect } from 'react';
import API from '../../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assigned_to?: number | null;
  assigned_user_name?: string;
  created_at: string;
  due_date?: string;
}

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  // Theme Mode State (Light / Dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.log('Error fetching tasks:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.log('Error fetching users:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/tasks', {
        title,
        description,
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
        due_date: dueDate || null,
        status: 'todo',
      });

      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async (taskId: number, newUserId: string) => {
    try {
      const targetUser = users.find((u) => u.id === parseInt(newUserId));
      await API.put(`/tasks/${taskId}`, {
        assigned_to: newUserId ? parseInt(newUserId) : null,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assigned_to: newUserId ? parseInt(newUserId) : null,
                assigned_user_name: targetUser ? targetUser.name : undefined,
              }
            : t
        )
      );
    } catch (err) {
      alert('Failed to reassign user');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('taskId', id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: 'todo' | 'in-progress' | 'completed') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === parseInt(taskId) ? { ...t, status: newStatus } : t))
    );

    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      alert('Failed to update task status');
      fetchTasks();
    }
  };

  // Metrics Calculations
  const totalTasks = tasks.length;
  const unassignedCount = tasks.filter((t) => !t.assigned_to).length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const doneRatio = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const activeTeam = users.length;

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'todo') return t.status === 'todo';
    if (filter === 'doing') return t.status === 'in-progress';
    if (filter === 'done') return t.status === 'completed';
    if (filter === 'assigned-me') return t.assigned_to === currentUser?.id;
    if (filter === 'unassigned') return !t.assigned_to;

    return true;
  });

  // Empty state details per column
  const columnPlaceholders = {
    'todo': { icon: '📌', title: 'No pending items', subtitle: 'Drag tasks here or create new ones' },
    'in-progress': { icon: '🚀', title: 'Nothing in progress', subtitle: 'Drag tasks here or create new ones' },
    'completed': { icon: '🎉', title: 'No completed tasks yet', subtitle: 'Drag tasks here or create new ones' },
  };

  return (
    <div className={`min-h-screen p-6 font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0b0f19] text-slate-200' : 'bg-[#f3f6fc] text-slate-700'
    }`}>
      {/* Header Panel */}
      <div className={`rounded-3xl p-5 mb-6 shadow-sm border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-white/90 border-slate-100 backdrop-blur-md'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-purple-500 tracking-tight">TaskFlow Pro</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-500'
              }`}>
                ADMIN MODE
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Welcome back, <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{currentUser?.name || 'Admin'}</span>
              {currentUser?.email ? <span className="opacity-60"> ({currentUser.email})</span> : null}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-500/20">
            📊 Task Board
          </button>
          <button className={`text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition ${
            isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>
            👥 User Control
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/20 transition cursor-pointer"
          >
            + Task
          </button>
          <button
            onClick={handleLogout}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              isDarkMode ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-rose-50 text-rose-500 hover:bg-rose-100'
            }`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-5 rounded-3xl border shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-gradient-to-br from-white to-purple-50/40 border-slate-100'
        }`}>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">TOTAL TASKS</p>
          <h2 className={`text-3xl font-black my-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{totalTasks}</h2>
          <p className="text-[11px] text-slate-400">Across all status lanes</p>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-gradient-to-br from-white to-amber-50/40 border-slate-100'
        }`}>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">UNASSIGNED</p>
          <h2 className={`text-3xl font-black my-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{unassignedCount}</h2>
          <p className="text-[11px] text-amber-500 font-medium">Requires assignment</p>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-gradient-to-br from-white to-emerald-50/40 border-slate-100'
        }`}>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">DONE RATIO</p>
          <h2 className={`text-3xl font-black my-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{doneRatio}%</h2>
          <p className="text-[11px] text-slate-400">{completedCount} Completed</p>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-gradient-to-br from-white to-purple-50/40 border-slate-100'
        }`}>
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">ACTIVE TEAM</p>
          <h2 className={`text-3xl font-black my-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{activeTeam}</h2>
          <p className="text-[11px] text-purple-400">Registered Accounts</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className={`rounded-3xl p-3 mb-6 shadow-sm border flex flex-col md:flex-row items-center justify-between gap-3 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-white/90 border-slate-100 backdrop-blur-md'
      }`}>
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search tasks by title or body..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-2xl text-xs border focus:outline-none ${
              isDarkMode 
                ? 'bg-[#0b0f19] border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-200/80 text-slate-700 placeholder-slate-400 focus:border-indigo-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'todo', label: 'To Do' },
            { id: 'doing', label: 'Doing' },
            { id: 'done', label: 'Done' },
            { id: 'assigned-me', label: 'Assigned to Me' },
            { id: 'unassigned', label: 'Unassigned' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filter === btn.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { key: 'todo', label: 'BACKLOG / TO DO', color: 'bg-rose-500' },
          { key: 'in-progress', label: 'IN PROGRESS', color: 'bg-amber-500' },
          { key: 'completed', label: 'COMPLETED', color: 'bg-emerald-500' },
        ].map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
          const placeholder = columnPlaceholders[col.key as keyof typeof columnPlaceholders];

          return (
            <div
              key={col.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key as any)}
              className={`border rounded-3xl p-4 min-h-[500px] flex flex-col gap-4 transition-colors duration-300 ${
                isDarkMode ? 'bg-[#131b2e] border-slate-800' : 'bg-slate-100/60 border-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between pb-1 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h2 className={`text-xs font-black tracking-wider uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{col.label}</h2>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {colTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  /* Empty State Illustration Block */
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-2xl border-slate-200/40 my-2">
                    <div className="text-4xl mb-3 animate-bounce">{placeholder.icon}</div>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {placeholder.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {placeholder.subtitle}
                    </p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`border p-4 rounded-2xl shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing space-y-3 ${
                        isDarkMode ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{task.title}</h3>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-rose-500 text-xs transition"
                          title="Delete Task"
                        >
                          ✕
                        </button>
                      </div>

                      {task.description && (
                        <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                        <div className="flex items-center gap-1">
                          <span>🕒</span> {new Date(task.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {task.due_date && (
                          <div className={`font-semibold px-2 py-0.5 rounded-md border ${
                            isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600'
                          }`}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Admin Quick Re-assign Dropdown */}
                      <div className={`pt-2 border-t flex flex-col gap-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">Assignee:</span>
                          <span className="text-indigo-400 font-semibold">
                            {task.assigned_user_name || 'Unassigned'}
                          </span>
                        </div>

                        <div className="mt-1">
                          <label className="block text-[9px] font-black text-purple-400 uppercase tracking-wider mb-0.5">
                            ADMIN QUICK RE-ASSIGN:
                          </label>
                          <select
                            value={task.assigned_to || ''}
                            onChange={(e) => handleReassign(task.id, e.target.value)}
                            className={`w-full border px-2 py-1 rounded-lg text-xs focus:outline-none ${
                              isDarkMode ? 'bg-[#131b2e] border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <option value="">Unassigned</option>
                            {users.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 ${
            isDarkMode ? 'bg-[#131b2e] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <h2 className="text-base font-bold">Create New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none ${
                    isDarkMode ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  placeholder="Task details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none ${
                    isDarkMode ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ASSIGN TO
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    DUE DATE
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex justify-end gap-2 pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 text-xs rounded-xl font-bold ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl font-bold shadow-md shadow-purple-500/20 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}