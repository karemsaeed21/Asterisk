import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, Loader2, User, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505] text-[#e0e0e0] font-sans selection:bg-brand-primary/30 selection:text-white">
            {/* --- Premium Background Logic --- */}
            <div className="absolute inset-0 z-0">
                {/* Fixed Mesh Gradient Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,0,255,0.05),transparent_70%)]" />

                {/* Floating Animated Orbs */}
                <motion.div
                    animate={{
                        x: [0, 40, -20, 0],
                        y: [0, -60, 30, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none"
                />

                <motion.div
                    animate={{
                        x: [0, -30, 50, 0],
                        y: [0, 40, -70, 0],
                        scale: [1, 0.8, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 2
                    }}
                    className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-brand-secondary/15 rounded-full blur-[120px] pointer-events-none"
                />

                {/* Grid Overlay for Technical "Asterisk" feel */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10 px-6 py-12"
            >
                {/* Branding Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative w-20 h-20 mb-6"
                    >
                        <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-full h-full rounded-3xl bg-white flex items-center justify-center text-black shadow-2xl overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-10 bg-[conic-gradient(from_0deg,transparent,black)]"
                            />
                            <Sparkles size={38} className="relative z-10" fill="currentColor" />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl font-display font-bold tracking-tight text-white mb-3">
                        Asterisk<span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium tracking-wide max-w-[280px]">
                        AAST Room Management & Reservation Portal
                    </p>
                </div>

                {/* Login Card */}
                <div className="relative group">
                    {/* Subtle outer glow on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                    <div className="relative glass-card p-8 md:p-10 border-white/5 bg-white/[0.02]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 ml-1 font-bold">
                                    <User size={12} className="text-brand-primary/60" />
                                    Employee ID
                                </label>
                                <div className="relative group/input">
                                    <input
                                        type="text"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all duration-300"
                                        placeholder="Enter your ID (e.g. admin_001)"
                                        required
                                    />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-brand-primary group-focus-within/input:w-3/4 transition-all duration-500 opacity-50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 ml-1 font-bold">
                                    <Key size={12} className="text-brand-secondary/60" />
                                    Secret Key
                                </label>
                                <div className="relative group/input">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-secondary/50 focus:bg-white/[0.06] transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-brand-secondary group-focus-within/input:w-3/4 transition-all duration-500 opacity-50" />
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-400 text-xs flex items-center gap-3">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative w-full h-14 group/btn overflow-hidden rounded-2xl bg-white text-black font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-0 group-hover/btn:opacity-10 transition-opacity" />

                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Establishing Connection...
                                        </>
                                    ) : (
                                        <>
                                            Establish Session
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Logic */}
                <div className="mt-12 flex flex-col items-center space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/10" />
                        <ShieldCheck size={14} className="text-white/20" />
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/10" />
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/20 text-center">
                        Unified Academic Operations Framework
                    </p>
                </div>
            </motion.div>

            {/* Custom Blur Background Decoration */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full pointer-events-none" />
        </div>
    );
};

export default Login;