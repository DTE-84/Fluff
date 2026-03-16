import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Send, Zap, History, TriangleAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from "@google/generative-ai";


const GEMINI_API_KEY = "AIzaSyDffIitZGWuLjESRkbdUiRfPC4DTLW-hRE";

export default function SwingAnalyst() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUri(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeSwing = async () => {
    if (!imageUri) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      
      const base64Data = imageUri.split(",")[1];
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an elite PGA-certified biomechanics analyst. 
        Initialize Analysis this golf swing frame with professional precision. 
        
        STRUCTURE YOUR REPORT:
        1. BIOMECHANIC DATA: Estimate Spine Angle, Wrist Cock, and Hip Rotation degrees.
        2. KINETIC CHAIN: Identify the sequence of movement and any leaks in power.
        3. PRIMARY FIX: Provide ONE high-fidelity corrective drill.
        4. ANALYST VERDICT: A single sentence describing the "Swing DNA" (e.g., 'Aggressive Draw Bias').

        TONE: Sophisticated, clinical, and data-driven.
      `;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
      ]);
      
      const responseText = result.response.text() || "Analysis complete, formatting data...";
      
      // Extract the short verdict for the history log
      const match = responseText.match(/VERDICT:\s*(.*)/i);
      const verdict = match ? match[1].replace(/[*_~`]/g, "").trim() : "Analysis Initialized";

      setResult(responseText);
      setHistory(prev => [{ date: new Date().toLocaleDateString(), verdict }, ...prev]);
    } catch (error) {
      console.error("Analysis error:", error);
      setResult(`## System Error\nUnable to reach AI biomechanics engine. Please verify your GEMINI_API_KEY.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="neo-card p-6 flex justify-between items-center bg-zinc-900/50">
        <div>
          <h3 className="font-serif italic text-2xl text-white">Kinetic Swing Lab</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-[#30C476] animate-pulse" />
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Biomechanic Engine Active</p>
          </div>
        </div>
        <Zap className="text-[#30C476] w-6 h-6 opacity-50" />
      </div>

      <div className="neo-card overflow-hidden aspect-[3/4] relative bg-zinc-950 border border-white/5 flex items-center justify-center">
        {imageUri ? (
          <img src={imageUri} alt="Swing" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-4 text-gray-700">
            <Camera className="w-16 h-16 opacity-10" />
            <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Input Biomechanic Frame</p>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        
        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 h-14 bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-zinc-800">
            <RefreshCw className="w-4 h-4" /> {imageUri ? "Rescan Frame" : "Initiate Capture"}
          </button>
          
          {imageUri && !isAnalyzing && (
            <button onClick={analyzeSwing} className="flex-1 h-14 bg-[#30C476] text-[#0A0907] rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#30C476]/20">
              <Send className="w-4 h-4" /> Initialize Analysis
            </button>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="neo-card p-10 flex flex-col items-center gap-6 animate-in fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#30C476]/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-[#30C476] border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-xs font-mono text-[#30C476] uppercase tracking-[0.2em] mb-2 font-black">Syncing Kinetic Chain</p>
            <p className="text-[10px] text-gray-500 italic">Calculating spine angle and wrist release...</p>
          </div>
        </div>
      )}

      {result && (
        <div className="neo-card p-8 bg-zinc-900/80 backdrop-blur-md border-l-2 border-[#30C476] animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#30C476]/10 rounded-lg">
              <TriangleAlert className="w-4 h-4 text-[#30C476]" />
            </div>
            <h4 className="text-xs font-mono font-black uppercase tracking-widest text-white">Analyst Report 01</h4>
          </div>
          <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-[#30C476] prose-headings:font-serif prose-headings:italic prose-p:text-xs prose-p:leading-relaxed max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}