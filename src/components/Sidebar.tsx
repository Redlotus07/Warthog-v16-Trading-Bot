import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, TrendingUp, Shield, History, Settings, Bot } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold">Warthog v16</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
              isActive ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-400' : ''
            }`
          }
        >
          <Activity className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/trading"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
              isActive ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-400' : ''
            }`
          }
        >
          <TrendingUp className="w-5 h-5" />
          <span>Trading</span>
        </NavLink>
        
        <NavLink
          to="/risk"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
              isActive ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-400' : ''
            }`
          }
        >
          <Shield className="w-5 h-5" />
          <span>Risk Management</span>
        </NavLink>
        
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
              isActive ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-400' : ''
            }`
          }
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
              isActive ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-400' : ''
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
