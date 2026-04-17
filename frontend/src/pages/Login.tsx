import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-deep">
            {/* Ambient Animated Background elements */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[150px] pointer-events-none" 
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[440px] z-10 p-6"
            >
                <div className="flex flex-col items-center mb-12 text-center">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-20 h-20 rounded-[2.5rem] bg-white flex items-center justify-center text-black mb-8 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]"
                    >
                        <Sparkles size={38} fill="black" />
                    </motion.div>
                    <h1 className="text-5xl font-display font-medium tracking-tight mb-3">Asterisk</h1>
                    <p className="text-white/40 text-base font-light px-10">Premium Room Management & Reservation Portal for AAST Staff</p>
                </div>

                <div className="glass-card p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="form-label">Employee Identity</label>
                            <input 
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="form-input"
                                placeholder="Enter your ID (e.g. admin_001)"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Secret Key</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-center gap-3"
                            >
                                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <ShieldCheck size={14} />
                                </div>
                                {error}
                            </motion.div>
                        )}

                        <button 
                            disabled={isSubmitting}
                            className="btn-glow w-full flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <Loader2 size={20} className="animate-spin text-black" />
                            ) : (
                                <>
                                    Establish Session <ArrowRight size={20} className="text-black" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 flex flex-col items-center gap-6 opacity-30">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-center">
                        Unified Academic Operations
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
