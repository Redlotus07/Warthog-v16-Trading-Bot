import React from 'react';
import { Activity, TrendingUp, Shield, History, Settings, Bot } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold">Warthog v16</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <SidebarLink icon={<Activity />} text="Dashboard" active />
        <SidebarLink icon={<TrendingUp />} text="Trading" />
        <SidebarLink icon={<Shield />} text="Risk Management" />
        <SidebarLink icon={<History />} text="History" />
        <SidebarLink icon={<Settings />} text="Settings" />
      </nav>
    </div>
  );
};

const SidebarLink = ({ icon, text, active = false }) => {
  return (
    <a
      href="#"
      className={`flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
        active ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-400' : ''
      }`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
};

export default Sidebar;