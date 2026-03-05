import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Database,
  PlayCircle,
  ShieldCheck,
  FileCode,
  Info,
  X,
  Layers,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const clinicalMenu = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, route: "/" },
    { label: "Lookup Search", icon: <Search size={18} />, route: "/finalmap" },
    { label: "All Mapping Data", icon: <Layers size={18} />, route: "/allmappingdata" },
    { label: "WHO Ayurveda Terms", icon: <Database size={18} />, route: "/ayurvedaterms" },
  ];

  const systemMenu = [
    { label: "Run Training", icon: <PlayCircle size={18} />, route: "/training" },
    { label: "Auto Validation", icon: <ShieldCheck size={18} />, route: "/autovalidation" },
    { label: "API Documentation", icon: <FileCode size={18} />, route: "/apidocs" },
    { label: "Platform About", icon: <Info size={18} />, route: "/about" },
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0F172A] text-slate-400 z-50 
          transform transition-all duration-300 ease-in-out border-r border-slate-800
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
      >
        {/* Dark Logo Section */}
        <div className="flex items-center gap-3 px-8 h-20 border-b border-slate-800/50 bg-[#0F172A]">
          <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-500/20">
            
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white leading-none tracking-tighter">
              Namaste<span className="text-indigo-500">.</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Medical Core</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden ml-auto p-2 text-slate-500 hover:bg-slate-800 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-8 px-4 custom-sidebar-scrollbar space-y-8">
          <section className="space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Terminology Core</p>
            {clinicalMenu.map((item, i) => (
              <SidebarLink key={i} item={item} closeMenu={() => setOpen(false)} />
            ))}
          </section>

          <section className="space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Intelligence System</p>
            {systemMenu.map((item, i) => (
              <SidebarLink key={i} item={item} closeMenu={() => setOpen(false)} />
            ))}
          </section>
        </div>

        {/* Dark Footer Card */}
        <div className="p-6 border-t border-slate-800/50">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <ShieldCheck size={20} />
             </div>
             <div>
                <p className="text-xs font-black text-slate-200 uppercase">Verified User</p>
                <p className="text-[10px] font-bold text-slate-500">Access: Standard</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ item, closeMenu }) => (
  <NavLink
    to={item.route}
    onClick={closeMenu}
    className={({ isActive }) =>
      `flex items-center justify-between px-4 py-3 rounded-2xl text-[13.5px] font-bold transition-all group ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
      }`
    }
  >
    <div className="flex items-center gap-3">
      <span className="transition-transform group-hover:scale-110">{item.icon}</span>
      {item.label}
    </div>
    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </NavLink>
);

export default Sidebar;