import React, { useState } from 'react';
import { User, History, CreditCard, Settings as SettingsIcon, LogOut, ChevronLeft, Bell, Volume2, Moon, Shield, Zap } from 'lucide-react';
import { auth } from '../firebase';

interface ProfileProps {
  profile: any;
}

// Reusable Button Component for Profile Menu
function ProfileButton({ icon: Icon, label, danger, onClick }: { icon: any, label: string, danger?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full p-4 neo-card flex items-center justify-between group active:scale-[0.98] transition-all border border-transparent hover:border-white/10 ${danger ? "hover:bg-red-500/5" : "hover:bg-white/5"}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${danger ? "bg-red-500/10 text-red-400" : "bg-white/5 text-gray-400"}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm font-bold ${danger ? "text-red-400" : "text-gray-300"}`}>{label}</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-[#30C476] transition-colors" />
    </button>
  );
}

// Reusable Toggle for Settings Menu
function SettingsToggle({ icon: Icon, label, desc, enabled, onClick }: { icon: any, label: string, desc: string, enabled: boolean, onClick: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">{label}</p>
          <p className="text-[10px] text-gray-500 mt-1">{desc}</p>
        </div>
      </div>
      <button onClick={onClick} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${enabled ? "bg-[#30C476]" : "bg-zinc-800"}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}

// Reusable Link for Settings Menu
function SettingsLink({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ChevronLeft className="w-4 h-4 text-gray-700 rotate-180" />
    </div>
  );
}

// Sub-page: Settings View
function SettingsView({ onBack }: { onBack: () => void }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [nightMode, setNightMode] = useState(true);

  return (
    <div className="animate-in fade-in space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <h2 className="text-2xl font-serif italic text-white">App Settings</h2>
      </div>

      <div className="space-y-4">
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest px-2">Preference Engine</p>
        <div className="neo-card p-6 bg-zinc-900/40 border-white/5 space-y-6">
          <SettingsToggle icon={Bell} label="Push Notifications" desc="Alerts for group rankings" enabled={pushEnabled} onClick={() => setPushEnabled(!pushEnabled)} />
          <SettingsToggle icon={Volume2} label="Audible Caddie" desc="GPS distance callouts" enabled={voiceEnabled} onClick={() => setVoiceEnabled(!voiceEnabled)} />
          <SettingsToggle icon={Moon} label="Night Protocol" desc="OLED optimized interface" enabled={nightMode} onClick={() => setNightMode(!nightMode)} />
        </div>

        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest px-2 pt-4">Security & System</p>
        <div className="neo-card p-6 bg-zinc-900/40 border-white/5 space-y-6">
          <SettingsLink icon={Shield} label="Privacy Policy" />
          <SettingsLink icon={Zap} label="System Calibration" />
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Version</span>
            <span className="text-[10px] font-mono text-[#30C476]">FLUFF_ELITE_2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Profile Component
export default function Profile({ profile }: ProfileProps) {
  const [view, setView] = useState<'profile' | 'settings'>('profile');

  const handleLogout = () => {
    auth.signOut();
  };

  if (view === 'settings') {
    return <SettingsView onBack={() => setView('profile')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-24">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full border-2 border-[#30C476] p-1">
          <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-10 h-10 text-gray-600" />
            )}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-serif italic text-white">{profile.displayName}</h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Clubhouse Member</p>
        </div>
      </div>

      <div className="neo-card p-6 flex justify-between items-center bg-gradient-to-br from-[#1a1a1a] to-zinc-900 border border-white/5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Current Handicap</p>
          <h3 className="text-3xl font-serif italic text-white">{profile.handicap}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-[#30C476]" style={{ textShadow: "0 0 10px rgba(48,196,118,0.5)" }}>
            <span className="text-[10px] font-bold uppercase">Natural</span>
          </div>
          <p className="text-[8px] font-mono text-gray-600 uppercase tracking-tighter">Verified by Fluff Engine</p>
        </div>
      </div>

      <div className="space-y-2">
        <ProfileButton icon={History} label="Round History" />
        <ProfileButton icon={CreditCard} label="GHIN Uplink" />
        <ProfileButton icon={SettingsIcon} label="App Settings" onClick={() => setView('settings')} />
        <ProfileButton icon={LogOut} label="Logout" onClick={handleLogout} danger />
      </div>

      <div className="text-center opacity-20 mt-12">
        <p className="text-[8px] font-mono uppercase tracking-widest">Fluff Elite v2.4 • Built with Intention</p>
      </div>
    </div>
  );
}