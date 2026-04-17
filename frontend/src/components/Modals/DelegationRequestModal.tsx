import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Calendar, User, Info, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/client';

interface DelegationRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DelegationRequestModal = ({ isOpen, onClose, onSuccess }: DelegationRequestModalProps) => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        substituteId: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const res = await api.get('/admin/users'); // Reuse admin endpoint or create a search one
            setUsers(res.data.users);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/delegations', form);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit delegation request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-xl bg-[#0a0a1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
                    >
                        {/* Status Overlay */}
                        <AnimatePresence>
                            {success && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 bg-[#0a0a1a] flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-3xl font-display font-medium text-white mb-4 text-white">Request Transmitted</h3>
                                    <p className="text-white/40 font-light leading-relaxed max-w-xs">
                                        Your delegation request has been submitted for administrative clearance.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-brand-secondary font-bold text-[9px] uppercase tracking-[0.4em] mb-2">
                                    <RefreshCw size={14} />
                                    Temporal Proxy
                                </div>
                                <h3 className="text-3xl font-display font-medium text-white">Designate Substitute</h3>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Substitute Identity</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-secondary transition-colors">
                                            <User size={18} />
                                        </div>
                                        <select 
                                            value={form.substituteId}
                                            onChange={(e) => setForm(prev => ({ ...prev, substituteId: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm text-white focus:outline-none focus:border-brand-secondary/50 transition-all appearance-none"
                                            required
                                        >
                                            <option value="" className="bg-[#0a0a1a]">Select personnel...</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id} className="bg-[#0a0a1a]">{u.name} ({u.employee_id})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Start Epoch</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-secondary transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <input 
                                                type="date"
                                                value={form.startDate}
                                                onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm text-white focus:outline-none focus:border-brand-secondary/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">End Epoch</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-secondary transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <input 
                                                type="date"
                                                value={form.endDate}
                                                onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm text-white focus:outline-none focus:border-brand-secondary/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-brand-secondary/5 border border-brand-secondary/10 flex gap-4 items-start">
                                <Info size={20} className="text-brand-secondary shrink-0" />
                                <p className="text-[10px] text-brand-secondary/60 leading-relaxed font-medium">
                                    During the active window, your substitute will inherit your full operational authority and process pending tasks in your absence. Requests require manual Admin clearance.
                                </p>
                            </div>

                            {error && (
                                <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <button 
                                disabled={isSubmitting}
                                className="w-full py-6 bg-brand-secondary text-black rounded-[2rem] font-bold text-sm tracking-widest hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCw size={20} /> Initiate Proxy Protocol</>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DelegationRequestModal;
