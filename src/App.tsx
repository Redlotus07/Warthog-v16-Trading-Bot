import React from 'react';
import { Activity, TrendingUp, Shield, History, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;