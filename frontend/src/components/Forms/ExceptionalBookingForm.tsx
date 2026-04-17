import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    Calendar as CalendarIcon, 
    Clock, 
    AlertCircle,
    Loader2,
    Send,
    ArrowLeft,
    Shield,
    Info,
    CheckCircle2
} from 'lucide-react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

const ExceptionalBookingForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [slotConfig, setSlotConfig] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                setSlotConfig(res.data.slots);
            } catch (err) {
                console.error('Failed to fetch settings');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const [formData, setFormData] = useState<{
        date: string;
        slotId: string;
        type: string;
        roomId: string | null;
    }>({
        date: '',
        slotId: '',
        type: 'ACADEMIC_EXCEPTIONAL',
        roomId: null 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/bookings', formData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-32 h-32 rounded-[3.5rem] bg-brand-primary/20 text-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/20 border border-brand-primary/30"
                >
                    <CheckCircle2 size={56} />
                </motion.div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-display font-medium tracking-tighter">Request Broadcasted</h2>
                    <p className="text-white/40 text-lg font-light max-w-sm mx-auto">
                        The Administrative council is currently identifying an optimal sector for your sequence.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-brand-primary/40 text-[10px] font-black uppercase tracking-[0.4em]">
                    Redirecting to Command Center
                </div>
            </div>
        );
    }

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
            <div className="w-12 h-12 rounded-2xl border-2 border-brand-primary border-t-transparent animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Calibrating Parameters</span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-24 space-y-12">
            <div className="flex items-center gap-6 mb-12">
                <button 
                    onClick={() => navigate('/request/new')}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-primary font-bold text-[9px] uppercase tracking-[0.4em]">
                        <BookOpen size={14} fill="currentColor" />
                        Exceptional Protocol
                    </div>
                    <h1 className="text-5xl font-display font-medium tracking-tighter text-white">
                        Lecture <span className="text-white/20">Synchronization</span>
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-12 relative overflow-hidden"
                >
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] translate-x-12 -translate-y-12">
                        <Shield size={300} strokeWidth={1} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-4">
                            <label className="form-label">Sequence Date</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors">
                                    <CalendarIcon size={18} />
                                </div>
                                <input 
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="form-input pl-14"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="form-label">Preferred Temporal Slot</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors">
                                    <Clock size={18} />
                                </div>
                                <select 
                                    name="slotId"
                                    value={formData.slotId}
                                    onChange={handleChange}
                                    required
                                    className="form-input pl-14"
                                >
                                    <option value="">Identify slot...</option>
                                    {slotConfig.map(slot => (
                                        <option key={slot.id} value={slot.id}>Slot {slot.id} ({slot.startTime})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex gap-6 items-start relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-lg">
                            <Shield size={24} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-white/90 uppercase tracking-widest">Blind Booking Disclaimer</h4>
                            <p className="text-xs text-white/30 leading-relaxed font-light">
                                Exceptional requests do not allow direct sector selection. The Administration will perform a full-campus availability sweep to assign the most suitable resource for your specific temporal slot.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-6 max-w-md mx-auto">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500 text-xs flex items-center gap-4"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}

                    <button 
                        disabled={isSubmitting}
                        className="btn-glow w-full flex items-center justify-center gap-4 py-6"
                    >
                        {isSubmitting ? (
                            <Loader2 size={24} className="animate-spin text-black" />
                        ) : (
                            <>
                                Initiate Broadcast <Send size={20} className="text-black" />
                            </>
                        )}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => navigate('/request/new')}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
                    >
                        Abort Sequence
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExceptionalBookingForm;
