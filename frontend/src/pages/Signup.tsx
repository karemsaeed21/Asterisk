import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Shield, 
    ChevronRight, 
    Lock, 
    User, 
    Briefcase, 
    CheckCircle2, 
    ArrowLeft,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        employee_id: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await api.post('/auth/signup', formData);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Identity registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#030308]">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-xl p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 text-center space-y-8 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-display font-medium text-white tracking-tight">Identity Registered</h2>
                            <p className="text-white/40 text-lg font-light leading-relaxed">
                                Your authorization request has been transmitted. Access will be granted upon <span className="text-white font-medium">Administrative Clearance</span>.
                            </p>
                        </div>
                        <div className="pt-8 flex flex-col gap-4">
                            <Link 
                                to="/login"
                                className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3"
                            >
                                Return to Access Portal
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                        Request <span className="text-white/20">Authorization.</span>
                    </h1>
                    <p className="text-white/30 text-xl max-w-md font-light leading-relaxed">
                        Register your personnel identity to access the unified room management infrastructure.
                    </p>
                </div>

                <div className="relative z-10 flex gap-12 text-[10px] font-black text-white/20 uppercase tracking-widest">
                    <span>Identity Verification</span>
                    <span>Role Assignment</span>
                    <span>Network Clearance</span>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex items-center justify-center p-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-12"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <Users size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Section 1: Initial Entry</span>
                        </div>
                        <h2 className="text-5xl font-display font-medium text-white tracking-tight">Identity Registry</h2>
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
                            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-4">Full Identity Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter full organizational name..."
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-4">Personnel ID Factor</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="text"
                                    required
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                                    placeholder="Organizational Employee ID..."
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-4">Access Authentication</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Secret Access Key..."
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="w-full py-6 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><ChevronRight size={18} /> Transmit Request</>}
                        </button>

                        <div className="text-center pt-8 border-t border-white/5">
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                Already a verified official? <Link to="/login" className="text-brand-primary hover:text-white transition-colors">Invoke Authorization</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
