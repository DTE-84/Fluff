import React, { useState, useEffect } from 'react';
import { Trophy, Plus, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Leaderboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<any | null>(null);
  const [view, setView] = useState<'lobby' | 'create' | 'join' | 'live'>('lobby');
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [gameMode, setGameMode] = useState("Stroke Play");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [error, setError] = useState("");

  const GAME_MODES = ["Stroke Play", "Match Play", "Scramble", "Wolf", "Nassau", "Bingo Bango Bongo", "Handicap Tournament"];

  // Fetch active rooms from Firestore
  useEffect(() => {
    const q = query(collection(db, "rooms"), where("isActive", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(activeRooms);
      
      // Update current room if we are in one
      if (currentRoom) {
        const updatedCurrentRoom = activeRooms.find(r => r.id === currentRoom.id);
        if (updatedCurrentRoom) setCurrentRoom(updatedCurrentRoom);
      }
    });
    return () => unsubscribe();
  }, [currentRoom]);

  const handleCreateRoom = async () => {
    if (!roomName) return setError("Room name required");
    try {
      const newRoom = {
        name: roomName,
        password: password,
        adminId: auth.currentUser?.uid,
        gameMode: gameMode,
        createdAt: new Date().toISOString(),
        players: {
          [auth.currentUser?.uid || ""]: {
            userId: auth.currentUser?.uid,
            displayName: auth.currentUser?.displayName || "Player",
            totalScore: 0,
            thru: 0,
            handicap: 0,
            netScore: 0
          }
        },
        isActive: true
      };
      
      const docRef = await addDoc(collection(db, "rooms"), newRoom);
      setCurrentRoom({ id: docRef.id, ...newRoom });
      setView("live");
    } catch (err) {
      setError("Failed to create room");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="neo-card p-6 flex justify-between items-center bg-zinc-900/50">
        <div>
          <h3 className="font-serif italic text-2xl text-white tracking-tight">Leaderboard Hub</h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Real-time Group Play</p>
        </div>
        <Trophy className="text-golf-green/50 w-6 h-6" />
      </div>

      <AnimatePresence mode="wait">
        {view === 'lobby' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            
            <button onClick={() => setView('create')} className="w-full h-24 neo-card bg-zinc-900/40 border-white/5 flex items-center justify-between px-8 group hover:border-[#30C476]/30 transition-all">
              <div className="text-left">
                <h4 className="text-white font-bold">Create Group</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Start a new tournament</p>
              </div>
              <Plus className="text-[#30C476] group-hover:scale-110 transition-transform" />
            </button>

            <button onClick={() => setView('join')} className="w-full h-24 neo-card bg-zinc-900/40 border-white/5 flex items-center justify-between px-8 group hover:border-blue-400/30 transition-all">
              <div className="text-left">
                <h4 className="text-white font-bold">Join Group</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Enter a group code</p>
              </div>
              <UserPlus className="text-blue-400 group-hover:scale-110 transition-transform" />
            </button>

            <div className="pt-4">
              <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-4 px-2">Active Rooms</p>
              <div className="space-y-2">
                {rooms.map(room => (
                  <div key={room.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-white font-medium">{room.name}</span>
                      <p className="text-[9px] text-gray-500 uppercase mt-1">{room.gameMode}</p>
                    </div>
                    <button onClick={() => { setJoinRoomName(room.name); setView('join'); }} className="text-[9px] font-black text-[#30C476] uppercase">Join</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-4">
              <div className="neo-card p-6 bg-zinc-950/50 space-y-4">
                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Group Name</label>
                  <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#30C476]/50" placeholder="e.g. Masters Sunday" />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Password (Optional)</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#30C476]/50" placeholder="••••••" />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Game Mode</label>
                  <select value={gameMode} onChange={(e) => setGameMode(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
                    {GAME_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleCreateRoom} className="w-full h-14 bg-[#30C476] text-[#0A0907] rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#30C476]/20">Launch Tournament</button>
              <button onClick={() => setView('lobby')} className="w-full text-[10px] text-gray-500 uppercase tracking-widest font-black">Cancel</button>
            </div>
          </motion.div>
        )}

        {view === 'live' && currentRoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="neo-card p-6 bg-zinc-900/80 border-l-2 border-[#30C476]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-serif italic text-white">{currentRoom.name}</h4>
                  <span className="text-[9px] font-mono text-[#30C476] uppercase tracking-widest">{currentRoom.gameMode}</span>
                </div>
                <div className="bg-zinc-950 px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[9px] font-mono text-gray-400">ID: {currentRoom.id.slice(0, 5)}</span>
                </div>
              </div>
              
              {/* Scoreboard List */}
              <div className="space-y-3">
                {Object.values(currentRoom.players)
                  .sort((a: any, b: any) => a.totalScore - b.totalScore)
                  .map((player: any, index: number) => (
                  <div key={player.userId} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-gray-600">{(index + 1).toString().padStart(2, "0")}</span>
                      <span className="text-xs text-white font-bold">{player.displayName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-mono">Thru {player.thru}</p>
                        <p className={`text-sm font-black ${player.totalScore <= 0 ? "text-[#30C476]" : "text-red-400"}`}>
                          {player.totalScore > 0 ? `+${player.totalScore}` : player.totalScore === 0 ? "E" : player.totalScore}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setView('lobby')} className="w-full h-14 border border-white/10 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs">Exit Group</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}