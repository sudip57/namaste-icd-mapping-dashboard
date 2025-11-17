import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ onMenuClick, title }) => {
  return (
    <nav className="w-full bg-gray-800 text-white shadow px-6 py-4 flex items-center justify-between">
      
      {/* Hamburger Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg border"
      >
        <Menu size={22} />
      </button>

      {/* LOGO */}
      <div></div>
      <h1 className="text-xl font-bold">{title}</h1>

      <div></div> {/* placeholder for right side */}
    </nav>
  );
};

export default Navbar;
