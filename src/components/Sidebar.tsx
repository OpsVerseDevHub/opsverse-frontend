import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, Calendar, FileText, Briefcase, Layers, HelpCircle, Users,
  Inbox, ChevronRight, ChevronDown, Mail, MessageSquare, LayoutDashboard, BarChart2
} from "lucide-react";
import SpaceList from "./SpaceList";

export default function Sidebar() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  return (
    <div className="flex h-screen">

      {/* Left Icon Strip */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
        <button onClick={() => handleToggle('home')} className="hover:text-blue-400">
          <Home size={24} />
        </button>
        <button onClick={() => handleToggle('inbox')} className="hover:text-blue-400">
          <Inbox size={24} />
        </button>
        <button onClick={() => handleToggle('calendar')} className="hover:text-blue-400">
          <Calendar size={24} />
        </button>
        <button onClick={() => handleToggle('files')} className="hover:text-blue-400">
          <FileText size={24} />
        </button>
        <button onClick={() => handleToggle('companies')} className="hover:text-blue-400">
          <Briefcase size={24} />
        </button>
        <button onClick={() => handleToggle('tasks')} className="hover:text-blue-400">
          <Layers size={24} />
        </button>
        <button onClick={() => handleToggle('help')} className="hover:text-blue-400">
          <HelpCircle size={24} />
        </button>
        <button onClick={() => handleToggle('spaces')} className="hover:text-blue-400">
          <Users size={24} />
        </button>
      </div>

      {/* Expand Area with Animation */}
      {expandedSection && (
        <div className="w-64 bg-gray-100 p-4 border-l flex flex-col animate-fade-in">
          
          {expandedSection === 'home' && (
            <>
              <h2 className="font-bold mb-2 flex justify-between items-center">
                Home {expandedSection ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </h2>
              <NavLink to="/dashboard" className="block py-2 px-2 rounded hover:bg-gray-200">Dashboard</NavLink>
              <NavLink to="/reports" className="block py-2 px-2 rounded hover:bg-gray-200">Reports</NavLink>
            </>
          )}

          {expandedSection === 'inbox' && (
            <>
              <h2 className="font-bold mb-2">Inbox</h2>
              <NavLink to="/mail" className="block py-2 px-2 rounded hover:bg-gray-200 flex items-center gap-2">
                <Mail size={16} /> Mail
              </NavLink>
              <NavLink to="/messages" className="block py-2 px-2 rounded hover:bg-gray-200 flex items-center gap-2">
                <MessageSquare size={16} /> Slack Messages
              </NavLink>
            </>
          )}

          {expandedSection === 'calendar' && (
            <>
              <h2 className="font-bold mb-2">Calendar</h2>
              <NavLink to="/calendar" className="block py-2 px-2 rounded hover:bg-gray-200">Calendar View</NavLink>
            </>
          )}

          {expandedSection === 'files' && (
            <>
              <h2 className="font-bold mb-2">Files</h2>
              <NavLink to="/files" className="block py-2 px-2 rounded hover:bg-gray-200">Documents</NavLink>
            </>
          )}

          {expandedSection === 'companies' && (
            <>
              <h2 className="font-bold mb-2">Companies</h2>
              <NavLink to="/companies" className="block py-2 px-2 rounded hover:bg-gray-200">List View</NavLink>
            </>
          )}

          {expandedSection === 'tasks' && (
            <>
              <h2 className="font-bold mb-2">Tasks</h2>
              <NavLink to="/tasks" className="block py-2 px-2 rounded hover:bg-gray-200">All Tasks</NavLink>
            </>
          )}

          {expandedSection === 'help' && (
            <>
              <h2 className="font-bold mb-2">Help & FAQs</h2>
              <NavLink to="/help" className="block py-2 px-2 rounded hover:bg-gray-200">Help Center</NavLink>
            </>
          )}

          {expandedSection === 'spaces' && (
            <>
              <h2 className="font-bold mb-2">Spaces</h2>
              <SpaceList isOpen={true} />
            </>
          )}

        </div>
      )}
    </div>
  );
}
