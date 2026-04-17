import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    Calendar as CalendarIcon, 
    Clock, 
    User, 
    AlertCircle,
    Loader2,
    CheckCircle2,
    Smartphone,
    Briefcase,
    Zap,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

const MultiPurposeForm = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<any[]>([]);
    const [slotConfig, setSlotConfig] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        roomId: '',
        date: '',
        slotId: '',
        multiPurposeDetails: {
            eventManagerName: '',
            eventManagerTitle: '',
            mobileNumber: '',
            purpose: '',
            needsMics: false,
            micQuantity: 1,
            needsLaptop: false,
            needsVideoConference: false
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, settingsRes] = await Promise.all([
                    api.get('/rooms?type=MULTI_PURPOSE'),
                    api.get('/admin/settings')
                ]);
                setRooms(roomsRes.data.rooms);
                setSlotConfig(settingsRes.data.slots);
            } catch (err) {
                console.error('Failed to fetch data');
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/bookings', {
                ...formData,
                type: 'MULTI_PURPOSE'
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
            <div className="w-12 h-12 rounded-2xl border-2 border-brand-primary border-t-transparent animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Configuring Protocol</span>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-24 space-y-12">
            <div className="flex items-center gap-6 mb-12">
                <button 
                    onClick={() => navigate('/request/new')}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-secondary font-bold text-[9px] uppercase tracking-[0.4em]">
                        <Zap size={14} fill="currentColor" />
                        Operation Center
                    </div>
                    <h1 className="text-5xl font-display font-medium tracking-tighter text-white">
                        Multi-Purpose <span className="text-white/20">Authorization</span>
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3 space-y-10">
                    {/* Section 1: Resource Deployment */}
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8"
                    >
                        <div className="flex items-center gap-4 text-brand-primary mb-2">
                            <div className="p-3 rounded-xl bg-brand-primary/10">
                                <CalendarIcon size={20} />
                            </div>
                            <h3 className="text-lg font-display font-bold uppercase tracking-widest text-white/80">Resource Mapping</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="form-label">Sector Assignment</label>
                                <select 
                                    name="roomId"
                                    value={formData.roomId}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Identify sector...</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="form-label">Deployment Date</label>
                                <input 
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="form-label">Temporal Slot</label>
                                <select 
                                    name="slotId"
                                    value={formData.slotId}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select slot...</option>
                                    {slotConfig.map(slot => (
                                        <option key={slot.id} value={slot.id}>Slot {slot.id} ({slot.startTime})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="form-label">Sequence Purpose</label>
                                <input 
                                    type="text"
                                    name="multiPurposeDetails.purpose"
                                    value={formData.multiPurposeDetails.purpose}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="e.g. Research Audit"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 2: Technical Configuration */}
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8"
                    >
                        <div className="flex items-center gap-4 text-brand-secondary mb-2">
                            <div className="p-3 rounded-xl bg-brand-secondary/10">
                                <Cpu size={20} />
                            </div>
                            <h3 className="text-lg font-display font-bold uppercase tracking-widest text-white/80">Infrastructure Requirements</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { name: 'needsMics', label: 'Audio Matrix', sub: 'Wireless Mics' },
                                { name: 'needsLaptop', label: 'Compute Core', sub: 'Presentation' },
                                { name: 'needsVideoConference', label: 'Uplink', sub: 'Streaming' }
                            ].map((tech) => (
                                <label key={tech.name} className="relative group cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        name={`multiPurposeDetails.${tech.name}`}
                                        checked={(formData.multiPurposeDetails as any)[tech.name]}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center gap-3 ${
                                        (formData.multiPurposeDetails as any)[tech.name] 
                                        ? 'bg-brand-secondary/20 border-brand-secondary/40 shadow-lg shadow-brand-secondary/10' 
                                        : 'bg-white/2 border-white/5 hover:border-white/10'
                                    }`}>
                                        <CheckCircle2 size={16} className={`transition-opacity ${
                                            (formData.multiPurposeDetails as any)[tech.name] ? 'opacity-100' : 'opacity-10'
                                        }`} />
                                        <div>
                                            <div className="text-xs font-bold text-white mb-0.5">{tech.label}</div>
                                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{tech.sub}</div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {formData.multiPurposeDetails.needsMics && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-4"
                            >
                                <label className="form-label">Hardware Count (Microphones)</label>
                                <div className="flex items-center gap-8">
                                    <input 
                                        type="range"
                                        name="multiPurposeDetails.micQuantity"
                                        value={formData.multiPurposeDetails.micQuantity}
                                        onChange={handleChange}
                                        min="1"
                                        max="10"
                                        className="flex-1 accent-brand-secondary"
                                    />
                                    <span className="text-4xl font-display font-medium text-brand-secondary w-12 tabular-nums">{formData.multiPurposeDetails.micQuantity}</span>
                                </div>
                            </motion.div>
                        )}
                    </motion.section>
                </div>

                <div className="lg:col-span-2 space-y-10">
                    {/* Section 3: Identity Management */}
                    <motion.section 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8"
                    >
                        <div className="flex items-center gap-4 text-white/40 mb-2">
                             <User size={18} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Personnel Assignment</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-1">
                                    <User size={14} className="text-white/20" />
                                    <label className="form-label !mb-0">Officer-in-Charge</label>
                                </div>
                                <input 
                                    type="text"
                                    name="multiPurposeDetails.eventManagerName"
                                    value={formData.multiPurposeDetails.eventManagerName}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Full Identity"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-1">
                                    <Briefcase size={14} className="text-white/20" />
                                    <label className="form-label !mb-0">Unit Rank/Title</label>
                                </div>
                                <input 
                                    type="text"
                                    name="multiPurposeDetails.eventManagerTitle"
                                    value={formData.multiPurposeDetails.eventManagerTitle}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Job Title"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-1">
                                    <Smartphone size={14} className="text-white/20" />
                                    <label className="form-label !mb-0">Comm. Frequency</label>
                                </div>
                                <input 
                                    type="tel"
                                    name="multiPurposeDetails.mobileNumber"
                                    value={formData.multiPurposeDetails.mobileNumber}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Mobile Number"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Submit Area */}
                    <div className="space-y-6">
                        {error && (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500 text-xs flex items-center gap-4">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <button 
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-4 bg-white text-black py-6 rounded-[2.5rem] font-bold text-sm tracking-widest hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all group disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 size={24} className="animate-spin text-black" />
                            ) : (
                                <>
                                    Transmit Protocol <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/5 text-center">
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] leading-relaxed">
                                Note: Multi-purpose requests require Branch Manager clearance. Temporal window: 48h Minimum.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MultiPurposeForm;
