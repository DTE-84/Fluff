import React from 'react';
import { motion } from 'motion/react';
import { Home, Map as MapIcon, Trophy, User, Camera, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const tabs = [
    { id: 'home',        icon: Home,      label: 'Home' },
    { id: 'gps',         icon: MapIcon,   label: 'GPS' },
    { id: 'swing',       icon: Camera,    label: 'Swing' },
    { id: 'leaderboard', icon: Trophy,    label: 'Leaderboard' },
    { id: 'practice',   icon: BookOpen,  label: 'Log' },
    { id: 'profile',     icon: User,      label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl">

      {/* ── Top Header ── */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-center z-10 bg-[#0A0A0A]">
        <div className="flex flex-col">
          <h1 className="font-serif italic text-2xl text-[#30C476] tracking-tighter select-none">
            Fluff
          </h1>
          <a 
            href="https://dte-84.github.io/DTE-Solutions-Hub/fluff-breakdown.html" 
            className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#4A4A5A] hover:text-[#30C476] transition-colors mt-1"
          >
            &larr; Exit to Overview
          </a>
        </div>
        <button className="flex items-center gap-2 group">
          <BookOpen className="w-[18px] h-[18px] text-[#4A4A5A] group-hover:text-[#30C476] transition-colors" />
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#4A4A5A] group-hover:text-[#30C476] transition-colors">
            Personal Caddie
          </span>
        </button>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto pb-28 px-4 scrollbar-hide">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* ── Bottom Navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20"
        style={{
          background: 'rgba(14, 14, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex justify-around items-stretch px-2 pb-safe pt-3 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center gap-[5px] flex-1 py-1 group"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active top-line indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#30C476]"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}

                {/* Icon wrapper */}
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#30C476]/12'
                      : 'bg-transparent group-hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive
                        ? 'text-[#30C476] fill-[#30C476]/15'
                        : 'text-[#4A4A5A] group-hover:text-[#787888]'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[9px] uppercase font-bold tracking-[0.12em] transition-colors duration-200 ${
                    isActive ? 'text-[#30C476]' : 'text-[#4A4A5A]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
