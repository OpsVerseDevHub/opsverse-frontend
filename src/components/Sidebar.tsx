import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, Calendar, FileText, Briefcase, Layers, HelpCircle, Users, Settings,
  Inbox, ChevronRight, ChevronDown, Mail, MessageSquare, LayoutDashboard, BarChart2
} from "lucide-react";
import SpaceList from "./SpaceList";

export default function Sidebar() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setExpandedSection(section);
    setActiveIcon(section);
  };

  const handleMenuSelect = () => {
    setExpandedSection(null);
  };

  return (
    <div className="flex h-screen">

      {/* Left Icon Strip */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
        <NavLink
        to="/"
        className={`hover:text-blue-400 ${activeIcon === 'home' ? 'text-blue-400' : ''}`}
        title="Home"
        onClick={() => handleToggle('home')}
        >
            <Home size={24} />
        </NavLink>


        <button
          onClick={() => handleToggle('inbox')}
          className={`hover:text-blue-400 ${activeIcon === 'inbox' ? 'text-blue-400' : ''}`}
          title="Inbox"
        >
          <Inbox size={24} />
        </button>

        <button
          onClick={() => handleToggle('calendar')}
          className={`hover:text-blue-400 ${activeIcon === 'calendar' ? 'text-blue-400' : ''}`}
          title="Calendar"
        >
          <Calendar size={24} />
        </button>

        <button
          onClick={() => handleToggle('files')}
          className={`hover:text-blue-400 ${activeIcon === 'files' ? 'text-blue-400' : ''}`}
          title="Files"
        >
          <FileText size={24} />
        </button>

        <button
          onClick={() => handleToggle('companies')}
          className={`hover:text-blue-400 ${activeIcon === 'companies' ? 'text-blue-400' : ''}`}
          title="Companies"
        >
          <Briefcase size={24} />
        </button>

        <button
          onClick={() => handleToggle('tasks')}
          className={`hover:text-blue-400 ${activeIcon === 'tasks' ? 'text-blue-400' : ''}`}
          title="Tasks"
        >
          <Layers size={24} />
        </button>

        <button
          onClick={() => handleToggle('help')}
          className={`hover:text-blue-400 ${activeIcon === 'help' ? 'text-blue-400' : ''}`}
          title="Help"
        >
          <HelpCircle size={24} />
        </button>

        <button
          onClick={() => handleToggle('spaces')}
          className={`hover:text-blue-400 ${activeIcon === 'spaces' ? 'text-blue-400' : ''}`}
          title="Spaces"
        >
          <Users size={24} />
        </button>

        <button
          onClick={() => handleToggle('settings')}
          className={`hover:text-blue-400 ${activeIcon === 'settings' ? 'text-blue-400' : ''}`}
          title="Settings"
        >
          <Settings size={24} />
        </button>

      </div>

      {/* Expand Area with Animation */}
      {expandedSection && (
        <div className="w-64 bg-gray-100 p-4 border-l flex flex-col animate-fade-in">
          
          {expandedSection === 'home' && (
            <>
              <h2 className="font-bold mb-2">Home</h2>
              <NavLink to="/dashboard" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">Dashboard</NavLink>
              <NavLink to="/reports" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">Reports</NavLink>
            </>
          )}

          {expandedSection === 'inbox' && (
            <>
              <h2 className="font-bold mb-2">Inbox</h2>
              <NavLink to="/mail" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200 flex items-center gap-2">
                <Mail size={16} /> Mail
              </NavLink>
              <NavLink to="/inbox" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200 flex items-center gap-2">
                <MessageSquare size={16} /> Slack Messages
              </NavLink>
            </>
          )}

          {expandedSection === 'calendar' && (
            <>
              <h2 className="font-bold mb-2">Calendar</h2>
              <NavLink to="/calendar" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">Calendar View</NavLink>
            </>
          )}

          {expandedSection === 'files' && (
            <>
              <h2 className="font-bold mb-2">Files</h2>
              <NavLink to="/files" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">Documents</NavLink>
            </>
          )}

          {expandedSection === 'companies' && (
            <>
              <h2 className="font-bold mb-2">Companies</h2>
              <NavLink to="/companies" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">List View</NavLink>
            </>
          )}

          {expandedSection === 'tasks' && (
            <>
              <h2 className="font-bold mb-2">Tasks</h2>
              <NavLink to="/tasks" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">All Tasks</NavLink>
            </>
          )}

          {expandedSection === 'help' && (
            <>
              <h2 className="font-bold mb-2">Help & FAQs</h2>
              <NavLink to="/help" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">Help Center</NavLink>
            </>
          )}

          {expandedSection === 'spaces' && (
            <>
              <h2 className="font-bold mb-2">Spaces</h2>
              <SpaceList isOpen={true} />
            </>
          )}

          {expandedSection === 'settings' && (
            <>
              <h2 className="font-bold mb-2">Settings</h2>
              <NavLink to="/settings" onClick={handleMenuSelect} className="block py-2 px-2 rounded hover:bg-gray-200">Profile & Preferences</NavLink>
            </>
          )}

        </div>
      )}
    </div>
  );
}
