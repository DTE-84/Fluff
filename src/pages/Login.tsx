import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, LoaderCircle, ArrowRight, CircleAlert, CircleCheck, Zap } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Import from the firebase.ts file we created

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use": return "This email is already registered. Please sign in instead.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/weak-password": return "Password should be at least 6 characters long.";
      case "auth/user-not-found": return "No account found with this email. Please sign up first.";
      case "auth/wrong-password": return "Incorrect password. Please try again.";
      case "auth/invalid-credential": return "Invalid email or password. Please check your credentials.";
      default: return "Authentication failed. Please try again.";
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(false);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess(true);
      setTimeout(() => onLoginSuccess(), 800);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (!isLogin && name.trim().length < 2) {
      setError("Please enter your full name.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user && name.trim()) {
          await updateProfile(userCredential.user, { displayName: name.trim() });
        }
      }
      setSuccess(true);
      setTimeout(() => onLoginSuccess(), 800);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-start sm:items-center justify-center p-6 pt-20 sm:pt-12 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-20 blur-[160px] animate-pulse-slow" style={{ background: "radial-gradient(circle, rgba(48,196,118,0.2) 0%, rgba(48,196,118,0.05) 45%, transparent 75%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col gap-12 sm:gap-16 items-center mb-12 animate-in fade-in">
        <header className="flex flex-col items-center gap-10 text-center group w-full pt-4">
          <div className="relative flex items-center justify-center scale-[1.3] sm:scale-150">
            <div className="relative z-10 w-24 h-24 bg-zinc-900 border-2 border-[#30C476] rounded-[28px] flex items-center justify-center shadow-2xl shadow-[#30C476]/30 transition-all duration-500 group-hover:scale-105">
              <Zap className="text-[#30C476] w-12 h-12 fill-[#30C476]/10" />
            </div>
          </div>
          <div className="space-y-4 mt-10">
            <h1 className="text-6xl sm:text-8xl font-serif italic text-[#FCF6EB] tracking-tighter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] leading-none">Fluff</h1>
            <div className="h-[1px] w-24 bg-[#30C476]/20 mx-auto" />
            <p className="text-[10px] text-[#FCF6EB]/40 uppercase tracking-[0.5em] font-black">Elite AI Assistant</p>
          </div>
        </header>

        <div className="relative w-full">
          <div className="relative bg-[#141418] backdrop-blur-3xl rounded-[28px] p-8 sm:p-10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] border border-white/[0.05]">
            
            {/* Toggle Login/Signup */}
            <div className="flex rounded-2xl bg-black/40 p-1 mb-8 relative">
              <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-xl transition-all duration-300 ${isLogin ? "bg-[#30C476] text-[#0A0A0A] shadow-[0_4px_16px_-4px_rgba(48,196,118,0.5)]" : "text-white/30 hover:text-white/60"}`}>Sign In</button>
              <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-xl transition-all duration-300 ${!isLogin ? "bg-[#30C476] text-[#0A0A0A] shadow-[0_4px_16px_-4px_rgba(48,196,118,0.5)]" : "text-white/30 hover:text-white/60"}`}>Join</button>
            </div>

            {error && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <CircleAlert size={18} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-500 font-semibold tracking-tight">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-[#30C476]/10 border border-[#30C476]/20 rounded-2xl">
                <CircleCheck size={18} className="text-[#30C476] shrink-0" />
                <p className="text-xs text-[#30C476] font-semibold tracking-tight">{isLogin ? "Welcome back!" : "Account created successfully!"}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {!isLogin && (
                <div className="flex flex-col gap-3 group/name">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FCF6EB]/20 px-2 transition-colors group-focus-within/name:text-[#30C476]">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FCF6EB]/10 group-focus-within/name:text-[#30C476] transition-colors" />
                    <input type="text" placeholder="Player Handle" required value={name} onChange={e => setName(e.target.value)} disabled={isLoading || success} className="w-full bg-black/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-[#FCF6EB] border border-white/[0.05] outline-none focus:border-[#30C476]/50" />
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-3 group/email">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FCF6EB]/20 px-2 transition-colors group-focus-within/email:text-[#30C476]">Player ID</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FCF6EB]/10 group-focus-within/email:text-[#30C476] transition-colors" />
                  <input type="email" placeholder="pro@fluffgolf.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading || success} className="w-full bg-black/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-[#FCF6EB] border border-white/[0.05] outline-none focus:border-[#30C476]/50" />
                </div>
              </div>

              <div className="flex flex-col gap-3 group/password">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FCF6EB]/20 px-2 transition-colors group-focus-within/password:text-[#30C476]">Security Key</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FCF6EB]/10 group-focus-within/password:text-[#30C476] transition-colors" />
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading || success} className="w-full bg-black/50 rounded-2xl py-4 pl-12 pr-12 text-sm text-[#FCF6EB] border border-white/[0.05] outline-none focus:border-[#30C476]/50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading || success} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FCF6EB]/20 hover:text-[#30C476]">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading || success} className="mt-2 w-full h-14 flex items-center justify-center gap-4 bg-[#30C476] hover:bg-[#6EEEA8] text-[#0A0907] rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_8px_32px_-4px_rgba(48,196,118,0.45)] transition-all active:scale-[0.97]">
                {isLoading ? <LoaderCircle className="animate-spin" /> : <><span >{isLogin ? "Enter Clubhouse" : "Join the Tour"}</span><ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/[0.05] space-y-6">
              <button onClick={handleGoogleSignIn} disabled={isLoading || success} type="button" className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white/10 transition-all opacity-80 hover:opacity-100">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Google Sync
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}