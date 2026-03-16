import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import GPSView from './pages/GPSView';
import SwingAnalyst from './pages/SwingAnalyst';
import Layout from './components/Layout'; // Assuming you have a Layout component for your bottom Nav


const mockStats = { fir: 65, gir: 45, putts: 32, ballsLost: 2, upAndDowns: 40 };

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Router switch statement
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard stats={mockStats} handicap={12.4} />;
      case 'gps':
        return <GPSView />;
      case 'swing':
        return <SwingAnalyst />;
      // Note: You will need to create/extract the Leaderboard, PracticeLog, and Profile pages too
      case 'leaderboard':
        return <div className="text-white p-6">Leaderboard Component</div>;
      case 'practice':
        return <div className="text-white p-6">Practice Log Component</div>;
      case 'profile':
        return <div className="text-white p-6">Profile Component</div>;
      default:
        return <Dashboard stats={mockStats} handicap={12.4} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-0 md:p-8 selection:bg-blue-400/30">
      <div className="w-full h-full md:max-w-[430px] md:h-[850px] md:rounded-[55px] md:border-[12px] md:border-[#1a1a1a] md:shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(125,211,252,0.15)] relative overflow-hidden bg-[#0A0907] flex flex-col transition-all duration-700">
        
        {/* Fake iPhone notch for desktop preview */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a1a] rounded-b-3xl z-[1000]" />
        
        {/* Your app layout wrapper */}
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
        
      </div>
    </div>
  );
}