import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// PREMIUM UPGRADE 1: Real Golf Math (Haversine Formula)
function getDistanceInYards(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 1.09361); // Convert meters to yards
}

// Target Hole Coordinates (Currently set to Augusta Hole 12)
const HOLE_LAT = 33.5020;
const HOLE_LNG = -82.0225;

export default function GPSView() {
  const [distance, setDistance] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setGpsError(null);
          
          // Calculate the real distance to the pin
          const dist = getDistanceInYards(latitude, longitude, HOLE_LAT, HOLE_LNG);
          setDistance(dist);
        },
        (err) => {
          console.error("GPS Error: ", err);
          setGpsError(err.message);
          // If we fail or are in a snowstorm/indoors, we might want to simulate for demo
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 } 
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setGpsError("Geolocation not supported");
    }
  }, []);

  // Simulation Mode for testing/demo when not on course
  const toggleSimulation = () => {
    if (!isSimulating) {
      setIsSimulating(true);
      setGpsError(null);
      let simulatedDist = 155;
      const interval = setInterval(() => {
        simulatedDist -= Math.floor(Math.random() * 2);
        if (simulatedDist < 0) simulatedDist = 0;
        setDistance(simulatedDist);
      }, 2000);
      (window as any).simInterval = interval;
    } else {
      setIsSimulating(false);
      clearInterval((window as any).simInterval);
      setDistance(null);
    }
  };

  // PREMIUM UPGRADE 3: Smart Voice Assistant
  const speakDistance = () => {
    if (distance) {
      const msg = new SpeechSynthesisUtterance(`You are ${distance} yards from the center of the green.`);
      msg.rate = 0.95;
      msg.pitch = 0.9;
      window.speechSynthesis.speak(msg);
    } else {
      const msg = new SpeechSynthesisUtterance("Calculating satellite distance, please wait.");
      window.speechSynthesis.speak(msg);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        speakDistance();
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* GPS Radar Visual */}
      <div className="relative rounded-[22px] overflow-hidden" style={{ background: "#141418", minHeight: 220 }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #2A2A36 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.55 }} />
        <div className="relative z-10 flex justify-center pt-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#4A4A5A]">Tracking Live GPS.</p>
        </div>
        
        <div className="relative z-10 flex justify-between items-end px-6 pb-6 pt-16">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5C5C6B] mb-2">To Center</p>
            <div className="flex items-center gap-2 mb-2">
              {distance ? (
                <span className="text-5xl font-serif italic text-[#FCF6EB] leading-none">{distance}</span>
              ) : (
                <>
                  <span className="block w-8 h-[3px] bg-[#FCF6EB]/25 rounded-full animate-pulse" />
                  <span className="block w-8 h-[3px] bg-[#FCF6EB]/25 rounded-full animate-pulse delay-75" />
                  <span className="block w-8 h-[3px] bg-[#FCF6EB]/25 rounded-full animate-pulse delay-150" />
                </>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#30C476]">Yards</p>
          </div>
          
          <button onClick={speakDistance} className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95" style={{ background: "#30C476", boxShadow: "0 0 28px 4px rgba(48,196,118,0.30)" }}>
            <Volume2 className="w-6 h-6 text-[#0A0907]" />
          </button>
        </div>
      </div>

      {/* Voice Assistant */}
      <div className="rounded-[22px] p-8 flex flex-col items-center gap-5" style={{ background: "#141418" }}>
        <motion.button onClick={toggleVoice} whileTap={{ scale: 0.93 }} className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? "bg-[#30C476]/15 border border-[#30C476]/60" : "bg-[#1E1E26] border border-[#2E2E3A]"}`}>
          <Mic className={`w-8 h-8 transition-colors duration-300 ${isListening ? "text-[#30C476] animate-pulse" : "text-[#6A6A7A]"}`} />
        </motion.button>
        <div className="text-center">
          <h4 className="text-sm font-semibold text-[#FCF6EB] mb-1">{isListening ? "Listening…" : "Tap for Voice Assistant"}</h4>
          <p className="text-xs text-[#4A4A5A] italic">"How far to the hole?"</p>
        </div>
      </div>

      {/* Location Info */}
      <div className="rounded-[22px] p-4 flex items-center gap-4" style={{ background: "#141418" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1E1E26" }}>
          <MapPin className="w-5 h-5 text-[#30C476]" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#FCF6EB] leading-tight">Augusta National GC</h4>
          <p className="text-xs text-[#4A4A5A] mt-0.5">Hole 12 • Par 3 • 155 Yards</p>
        </div>
        </div>

        {gpsError && !isSimulating && (
        <div className="rounded-[22px] p-4 bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-[10px] text-red-400 uppercase tracking-widest mb-3">Satellite Signal Lost: {gpsError}</p>
          <button 
            onClick={toggleSimulation}
            className="px-4 py-2 bg-[#30C476] text-black text-[10px] font-black uppercase tracking-widest rounded-lg"
          >
            Initialize Simulation
          </button>
        </div>
        )}

        {isSimulating && (
        <div className="rounded-[22px] p-4 bg-[#30C476]/10 border border-[#30C476]/20 text-center">
          <p className="text-[10px] text-[#30C476] uppercase tracking-widest mb-2">Simulated Telemetry Active</p>
          <button 
            onClick={toggleSimulation}
            className="text-[10px] text-gray-400 underline uppercase tracking-widest"
          >
            End Simulation
          </button>
        </div>
        )}
        </div>
        );
        }