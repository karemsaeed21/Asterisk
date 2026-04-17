import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    ChevronRight, 
    Lock, 
    Briefcase, 
    Loader2,
    AlertCircle,
    Key,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#030308]">
             {/* Left side: Visual Branding */}
             <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-[#0c0c1a] to-[#030308]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute -left-20 -top-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-brand-secondary font-black text-xs uppercase tracking-[0.5em] mb-8">
                        <Shield size={20} fill="currentColor" />
                        Asterisk Unified
                    </div>
                    <h1 className="text-7xl font-display font-medium text-white tracking-tighter leading-none mb-8">
                        Invoke <span className="text-white/20">Access.</span>
                    </h1>
                    <p className="text-white/30 text-xl max-w-md font-light leading-relaxed">
                        Authenticate your identity to enter the unified room management infrastructure.
                    </p>
                </div>

                <div className="relative z-10 flex gap-12 text-[10px] font-black text-white/20 uppercase tracking-widest">
                    <span>Identity Verification</span>
                    <span>Role Assignment</span>
                    <span>Network Clearance</span>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex items-center justify-center p-8 relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-12"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <Lock size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Section 1: Authentication</span>
                        </div>
                        <h2 className="text-5xl font-display font-medium text-white tracking-tight">Access Portal</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                         {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 items-center text-rose-500 text-xs font-medium"
                            >
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-4">Personnel ID Factor</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="text"
                                    required
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    placeholder="Organizational Employee ID..."
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-4">Access Authentication</label>
                            </div>
                            <div className="relative group/input">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Secret Access Key..."
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-16 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-6 flex items-center text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                                    {/* <div className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${isRememberMe ? 'bg-brand-primary border-brand-primary' : 'border-white/10 bg-white/5 group-hover/check:border-brand-primary/50'}`}>
                                        {isRememberMe && <div className="w-2 h-2 bg-black rounded-sm" />}
                                    </div> */}
                                </div>
                            </label>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><ChevronRight size={18} /> Initialize Portal</>}
                        </button>

                        <div className="text-center pt-8 border-t border-white/5">
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                New official? <Link to="/signup" className="text-brand-primary hover:text-white transition-colors">Request Access Factor</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;