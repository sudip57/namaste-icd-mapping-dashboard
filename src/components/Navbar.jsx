import React from "react";
import { Menu, Bell, UserCircle } from "lucide-react";

const Navbar = ({ onMenuClick, title }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0F172A] border-b border-slate-800 px-6 h-16 flex items-center justify-between shadow-2xl shadow-slate-900/10">
      <div className="flex items-center">
        {/* Mobile Menu Button - stylized for dark theme */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 mr-4 text-slate-400 hover:bg-slate-800 rounded-xl transition-all active:scale-95"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Page Context */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 rounded-full bg-indigo-500 hidden sm:block"></div>
          <h1 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            {title}
          </h1>
        </div>
      </div>

      {/* Action Icons & User Section */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/50 rounded-xl transition-all">
          <Bell size={18} />
        </button>
        
        <div className="h-6 w-[1px] bg-slate-800 mx-3"></div>
        
        <div className="flex items-center gap-2 pl-2">
          {/* User Details */}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white leading-none">Demo Admin</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Admin</p>
          </div>
          
          {/* High-Contrast User Avatar */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold border border-indigo-500/50 shadow-lg shadow-indigo-500/10">
            D
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;