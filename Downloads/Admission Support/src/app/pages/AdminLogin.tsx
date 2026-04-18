import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = login(email, password);
      if (result.success) {
        if (result.role === "admin") {
          navigate("/admin");
        } else {
          setError("Access denied. This login is for administrators only.");
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0502] flex items-center justify-center p-4 selection:bg-[#D4A857]/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4A857]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A8742C]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1A0A02] border border-[#D4A857]/20 rounded-[40px] p-8 md:p-10 shadow-2xl shadow-[#D4A857]/5 backdrop-blur-sm">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-3xl shadow-xl shadow-[#D4A857]/10 mb-6 group transition-transform hover:scale-110 duration-500">
              <GraduationCap className="w-10 h-10 text-[#1A0A02]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-[#D4A857]/60 text-sm font-medium">Please sign in to manage the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A857]/40 group-focus-within:text-[#D4A857] transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admissionbondu.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:bg-white/[0.08] focus:border-[#D4A857]/50 focus:ring-4 focus:ring-[#D4A857]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-[#D4A857] uppercase tracking-wider hover:underline underline-offset-4">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A857]/40 group-focus-within:text-[#D4A857] transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:bg-white/[0.08] focus:border-[#D4A857]/50 focus:ring-4 focus:ring-[#D4A857]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4A857] to-[#A8742C] text-[#1A0A02] font-black py-4 rounded-2xl flex items-center justify-center gap-2 mt-6 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-[#D4A857]/10 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Access Control Center
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-white/30 text-xs font-bold hover:text-white transition-colors group">
              <span className="w-6 h-[1px] bg-white/10 group-hover:bg-[#D4A857] transition-all" />
              Back to Main Website
              <span className="w-6 h-[1px] bg-white/10 group-hover:bg-[#D4A857] transition-all" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
