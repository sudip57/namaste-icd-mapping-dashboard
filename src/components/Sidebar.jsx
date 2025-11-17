import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Database,
  PlayCircle,
  ShieldCheck,
  FileText,
  Info,
  X,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, route: "/" },
    { label: "Lookup Search", icon: <Search size={20} />, route: "/finalmap" },
    { label: "All Mapping Data", icon: <Database size={20} />, route: "/allmappingdata" },
    { label: "WHO Ayurveda Terms", icon: <Database size={20} />, route: "/ayurvedaterms" },
    { label: "Run Training", icon: <PlayCircle size={20} />, route: "/training" },
    { label: "Auto Validation", icon: <ShieldCheck size={20} />, route: "/autovalidation" },
    { label: "API DOCS", icon: <FileText size={20} />, route: "/apidocs" },
    { label: "About", icon: <Info size={20} />, route: "/about" },
  ];

  return (
    <>
      {/* Background overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white  shadow-sm z-50 
          transform transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        {/* Close icon (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex h-[80px] items-center justify-center p-2 gap-3 mb-10 bg-gray-500">
          <p className="text-xl text-white font-bold">Namaste-ICD</p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.route}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto text-gray-400 text-xs px-4 pt-6 pb-6">
          © {new Date().getFullYear()} Namaste ICD
        </div>
      </div>
    </>
  );
};

export default Sidebar;
