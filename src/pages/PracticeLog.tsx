import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Clock, MapPin } from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function PracticeLog() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSession, setNewSession] = useState({ type: "Range Session", duration: "60m", location: "" });

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, "practice"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc"),
      limit(20)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(logs);
    });
    
    return () => unsubscribe();
  }, []);

  const saveSession = async () => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "practice"), {
        userId: auth.currentUser.uid,
        ...newSession,
        date: new Date().toISOString()
      });
      setShowForm(false);
      setNewSession({ type: "Range Session", duration: "60m", location: "" });
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return { month: months[d.getMonth()], day: d.getDate() };
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-serif italic text-white">Practice Log</h3>
        <button onClick={() => setShowForm(!showForm)} className="w-10 h-10 rounded-full bg-[#30C476] text-[#0A0907] flex items-center justify-center shadow-lg shadow-[#30C476]/20 active:scale-95 transition-transform">
          {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

      {showForm && (
        <div className="neo-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-gray-500">Session Type</label>
            <select value={newSession.type} onChange={e => setNewSession({...newSession, type: e.target.value})} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#30C476]">
              <option value="Range Session">Range Session</option>
              <option value="Putting Green">Putting Green</option>
              <option value="Short Game">Short Game</option>
              <option value="Full Round">Full Round</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-gray-500">Location</label>
            <input type="text" placeholder="e.g. Augusta National" value={newSession.location} onChange={e => setNewSession({...newSession, location: e.target.value})} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[#30C476]" />
          </div>
          <button onClick={saveSession} className="w-full h-12 bg-[#30C476] text-[#0A0907] rounded-xl font-bold shadow-lg shadow-[#30C476]/20">Save Session</button>
        </div>
      )}

      <div className="space-y-4">
        {sessions.length > 0 ? sessions.map(session => {
          const { month, day } = formatDate(session.date);
          return (
            <div key={session.id} className="neo-card p-5 flex items-center gap-4 group hover:border-[#30C476]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-[#30C476]">
                <span className="text-[10px] font-mono font-bold uppercase">{month}</span>
                <span className="text-lg font-serif italic leading-none">{day}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{session.type}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <Clock className="w-3 h-3" /> {session.duration}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <MapPin className="w-3 h-3" /> {session.location}
                  </div>
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-[#30C476] transition-colors" />
            </div>
          );
        }) : (
          <div className="neo-card p-12 text-center text-gray-600">
            <p className="text-xs font-mono uppercase tracking-widest">No sessions logged yet</p>
          </div>
        )}
      </div>

      <div className="neo-card p-6 bg-gradient-to-br from-golf-card to-zinc-900">
        <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Monthly Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-serif italic text-white">{sessions.length || 12}</p>
            <p className="text-[8px] font-mono uppercase text-gray-600">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-serif italic text-white">18.5</p>
            <p className="text-[8px] font-mono uppercase text-gray-600">Hours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-serif italic text-white">4</p>
            <p className="text-[8px] font-mono uppercase text-gray-600">Rounds</p>
          </div>
        </div>
      </div>
    </div>
  );
}