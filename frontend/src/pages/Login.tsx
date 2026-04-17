import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, Loader2, User, Key, AlertCircle, Eye, EyeOff, Lock, Home, Info, Layers, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/login', {
                employee_id: employeeId,
                password
            });

            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-[#050510] text-gray-200 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Header / Navbar - More Vivid */}
            <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-500 ease-out">
                        <Sparkles className="text-white" size={26} fill="white" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white drop-shadow-sm">
                        Asterisk<span className="text-indigo-500">.</span>
                    </span>
                </div>
                
                <nav className="hidden lg:flex items-center gap-12">
                    {[
                        { name: 'Home', icon: Home, active: false },
                        { name: 'About', icon: Info, active: false },
                        { name: 'Dashboard', icon: Layers, active: true },
                    ].map((item) => (
                        <a 
                            key={item.name} 
                            href="#" 
                            className={`text-sm font-bold flex items-center gap-2.5 transition-all hover:scale-105 ${item.active ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <item.icon size={18} className={item.active ? 'text-indigo-400' : 'text-gray-500'} />
                            {item.name}
                        </a>
                    ))}
                    <div className="h-4 w-[1px] bg-white/10 mx-2" />
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.3em]">System Status</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                </nav>

                <div className="flex items-center gap-5">
                    <button className="text-sm font-bold text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-xl">Login</button>
                    <button className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transform transition-all active:scale-95 shadow-lg">
                        Sign Up
                    </button>
                </div>
            </header>

            {/* Hyper-Colorful Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.4, 0.3],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(79,70,229,0.3)_0%,transparent_70%)] blur-[100px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.5, 0.2],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle,rgba(168,85,247,0.25)_0%,transparent_70%)] blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 360]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] blur-[80px]" 
                />
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20">
                {/* 3D-esque Icon Section */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-10 relative"
                >
                    <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse" />
                    <div className="relative p-7 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden group">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg,transparent,rgba(99,102,241,0.8),transparent)]" 
                        />
                        <Fingerprint size={56} className="text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" strokeWidth={1.2} />
                    </div>
                </motion.div>

                {/* Welcome Heading - Colorful Typography */}
                <div className="text-center mb-12 space-y-4">
                    <motion.h2 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-7xl font-black text-white tracking-tight"
                    >
                        Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">Back</span>
                        <motion.span
                            className="inline-block ml-4"
                            animate={{ rotate: [0, 15, -15, 15, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            👋
                        </motion.span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-indigo-200/50 font-medium tracking-wide"
                    >
                        Ready to optimize your reservation workflow? 🚀
                    </motion.p>
                </div>

                {/* Ultra-Modern Login Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", damping: 20 }}
                    className="w-full max-w-[540px] relative"
                >
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 rounded-[2.5rem] blur-[2px]" />
                    
                    <div className="relative overflow-hidden bg-[#0a0a1a]/80 backdrop-blur-2xl p-12 md:p-14 border border-white/10 rounded-[2.5rem] shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl pointer-events-none" />
                        
                        <form onSubmit={handleSubmit} className="relative z-20 space-y-10">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-indigo-400/80 uppercase tracking-[0.3em] ml-2">
                                        Employee Identity
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg group-focus-within/input:bg-indigo-500/20 transition-colors">
                                                <User size={20} className="text-indigo-400 group-focus-within/input:text-white transition-colors" />
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all shadow-inner"
                                            placeholder="admin_001"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-purple-400/80 uppercase tracking-[0.3em] ml-2">
                                        Security Credentials
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                            <div className="p-2 bg-purple-500/10 rounded-lg group-focus-within/input:bg-purple-500/20 transition-colors">
                                                <Key size={20} className="text-purple-400 group-focus-within/input:text-white transition-colors" />
                                            </div>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-16 py-5 text-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all shadow-inner"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-6 flex items-center text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <label className="flex items-center gap-3 cursor-pointer group/check">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={isRememberMe}
                                            onChange={() => setIsRememberMe(!isRememberMe)}
                                        />
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${isRememberMe ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-white/10 bg-white/5 hover:border-indigo-500/30'}`}>
                                            {isRememberMe && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 group-hover/check:text-white transition-colors">Stay logged in</span>
                                </label>
                                <a href="#" className="relative text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:scale-105 transition-transform">
                                    Lost access?
                                    <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-indigo-400 to-transparent" />
                                </a>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-300 text-sm font-medium shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                                    >
                                        <AlertCircle size={22} className="shrink-0 text-red-500" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative py-6 group/btn overflow-hidden rounded-[1.5rem] shadow-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-500 group-hover/btn:scale-110" />
                                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] transition-opacity" />
                                
                                <span className="relative z-10 flex items-center justify-center gap-4 text-white font-black text-xl tracking-tight">
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={28} />
                                    ) : (
                                        <>
                                            <Fingerprint size={24} />
                                            Initialize Portal
                                            <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-16 flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-4 px-8 py-3 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#050510] bg-indigo-500/20 flex items-center justify-center`}>
                                    <ShieldCheck size={14} className="text-white/60" />
                                </div>
                            ))}
                        </div>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                            Academic Encrypted Link
                        </span>
                    </div>
                    <p className="text-[12px] text-gray-400 font-bold tracking-widest opacity-40">
                        &copy; 2026 Asterisk. Unified Framework
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default Login;