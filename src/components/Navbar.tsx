import { useState, useEffect } from "react";
import { Bell, Search, Menu, User } from "lucide-react";
import NotificationDropdown from "./Navbar/NotificationDropdown";
import ProfileDropdown from "./Navbar/ProfileDropdown";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowProfile(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white p-3 shadow border-b relative">
      
      {/* Left */}
      <div className="flex items-center space-x-2">
        <Menu className="md:hidden" />
        <h1 className="text-xl font-bold hidden md:block">OpsVerse Dashboard</h1>
      </div>

      {/* Center Search */}
      <div className="flex-1 px-6 hidden md:block">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full shadow-inner w-full max-w-xl mx-auto">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center space-x-4 relative">
        
        <div className="relative" onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}>
          <Bell className="hover:text-blue-600 cursor-pointer" size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          {showNotifications && <NotificationDropdown />}
        </div>

        <div className="relative" onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); }}>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold cursor-pointer">
            U
          </div>
          {showProfile && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
