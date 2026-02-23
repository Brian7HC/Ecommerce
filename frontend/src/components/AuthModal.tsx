import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { RonaldoMascot } from './RonaldoMascot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-zinc-950 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-zinc-800 min-h-[700px]"
          >
            {/* Background Image Wrapper for whole modal */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                   key={isLogin ? 'login-bg' : 'signup-bg'}
                   initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                   animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                   exit={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                   transition={{ duration: 0.8, ease: "easeInOut" }}
                   className="absolute inset-0"
                >
                  <img 
                    src={isLogin 
                      ? "https://images.unsplash.com/photo-1431324155629-1a6eda1f469a?auto=format&fit=crop&q=100&w=1600" 
                      : "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=100&w=1600"
                    } 
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
                    alt="Cristiano Ronaldo Background"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left Side: Text/Content Overlay */}
            <div className="hidden md:flex w-3/5 relative overflow-hidden z-10 flex-col justify-end p-16">
              <div className="absolute top-12 left-12">
                <span className="text-4xl font-black italic tracking-tighter text-white/20">CR7</span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-text' : 'signup-text'}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 30, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-1 w-20 bg-white mb-8" />
                  <h3 className="text-7xl font-black italic tracking-tighter text-white mb-4 uppercase leading-[0.8]">
                    {isLogin ? 'WELCOME\nBACK' : 'THE NEXT\nCHAPTER'}
                  </h3>
                  <p className="text-zinc-400 text-xs font-black tracking-[0.4em] uppercase mt-6 border-l-2 border-white/20 pl-6">
                    Join the global elite.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Form with Glassmorphism */}
            <div className="w-full md:w-2/5 p-8 md:p-12 bg-black/40 backdrop-blur-2xl flex flex-col justify-center relative z-20 border-l border-white/5">

              
              <div className="absolute inset-0 flex flex-col justify-end p-12 z-10">
                <motion.div
                  key={isLogin ? 'login-text' : 'signup-text'}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-5xl font-black italic tracking-tighter text-white mb-2 uppercase leading-none">
                    {isLogin ? 'The King\nReturns' : 'Step Into\nThe Legacy'}
                  </h3>
                  <p className="text-zinc-400 text-sm font-medium tracking-[0.2em] uppercase mt-4">
                    Professional Products for Professional People.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-2/5 p-8 md:p-12 bg-black/40 backdrop-blur-3xl flex flex-col justify-center relative z-20 border-l border-white/5 shadow-2xl">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-20 p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-form' : 'signup-form'}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <RonaldoMascot isHiding={isHiding} />

                  <div className="mb-10 text-center">
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">
                      {isLogin ? 'LOGIN' : 'SIGN UP'}
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                      {isLogin ? 'Back to Greatness' : 'Claim Your Legacy'}
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black ml-1">Identity</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                          <input 
                            type="text" 
                            placeholder="YOUR NAME"
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-white/40 focus:bg-black transition-all placeholder:text-zinc-800 text-sm font-bold tracking-widest"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black ml-1">Access Channel</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                        <input 
                          type="email" 
                          placeholder="EMAIL@DOMAIN.COM"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-white/40 focus:bg-black transition-all placeholder:text-zinc-800 text-sm font-bold tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black ml-1">Secret Key</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          onFocus={() => setIsHiding(true)}
                          onBlur={() => setIsHiding(false)}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-white/40 focus:bg-black transition-all placeholder:text-zinc-800 text-sm font-bold tracking-widest"
                        />
                      </div>
                    </div>

                    <button className="w-full bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] py-5 mt-8 hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group relative overflow-hidden">
                      <span className="relative z-10">{isLogin ? 'ENTER STADIUM' : 'SIGN CONTRACT'}</span>
                      <ArrowRight size={14} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                      <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </form>

                  <p className="text-center text-[10px] text-zinc-600 mt-8 uppercase tracking-[0.2em]">
                    {isLogin ? "New to the squad?" : "Already a member?"}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-white font-black hover:text-zinc-300 transition-colors"
                    >
                      {isLogin ? 'Create Account' : 'Back to Login'}
                    </button>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

