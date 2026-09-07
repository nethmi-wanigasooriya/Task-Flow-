import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon Graphic Container */}
      <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
        👑
      </div>

      {/* Brand Title and Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-purple-500 tracking-tight">
            TaskFlow Pro
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-500">
            ADMIN MODE
          </span>
        </div>
      </div>
    </div>
  );
}