import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Settings as SettingsIcon, 
    Moon, 
    Sun, 
    Clock, 
    Save, 
    Loader2, 
    CheckCircle2,
    Zap,
    Shield,
    Activity,
    ArrowRight
} from 'lucide-react';
import api from '../../api/client';

const AdminSettings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [settings, setSettings] = useState<any>({
        slotMode: 'STANDARD',
        slots: []
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                setSettings(res.data);
            } catch (err) {
                console.error('Failed to fetch settings');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleModeChange = (mode: string) => {
        setSettings((prev: any) => ({ ...prev, slotMode: mode }));
    };

    const handleSlotChange = (id: number, field: string, value: any) => {
        const newSlots = settings.slots.map((s: any) => 
            s.id === id ? { ...s, [field]: value } : s
        );
        setSettings((prev: any) => ({ ...prev, slots: newSlots }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        try {
            await api.put('/admin/settings', settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error saving settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
            <div className="w-12 h-12 rounded-2xl border-2 border-brand-primary border-t-transparent animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Accessing Core Config</span>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-24 space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-3 text-brand-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                        <SettingsIcon size={16} fill="currentColor" />
                        System Architecture
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Global <span className="text-white/20">Configuration</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl font-light leading-relaxed">
                        Adjust global scheduling parameters, temporal slots, and seasonal overrides to maintain campus synchronization.
                    </p>
                </motion.div>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-5 gap-10 items-start">
                <div className="lg:col-span-3 space-y-10">
                    {/* Mode Selection */}
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-brand-primary">
                                <div className="p-3 rounded-xl bg-brand-primary/10">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-lg font-display font-bold uppercase tracking-widest text-white/80">Operational Mode</h3>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { id: 'STANDARD', label: 'Standard Protocol', sub: 'Baseline Academic Flow', icon: Sun, color: 'brand-primary' },
                                { id: 'RAMADAN', label: 'Ramadan Protocol', sub: 'Optimized Temporal Window', icon: Moon, color: 'brand-secondary' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => handleModeChange(mode.id)}
                                    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden group ${
                                        settings.slotMode === mode.id 
                                        ? `bg-${mode.color}/10 border-${mode.color}/40 text-${mode.color} shadow-2xl shadow-${mode.color}/5` 
                                        : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/10'
                                    }`}
                                >
                                    <div className="relative z-10 flex flex-col items-center">
                                        <mode.icon size={32} className={`mb-4 transition-transform group-hover:scale-110 ${settings.slotMode === mode.id ? 'opacity-100' : 'opacity-20'}`} />
                                        <span className="block font-bold text-xs uppercase tracking-[0.2em] mb-1">{mode.label}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{mode.sub}</span>
                                    </div>
                                    {settings.slotMode === mode.id && (
                                        <motion.div 
                                            layoutId="mode-bg"
                                            className={`absolute inset-0 bg-gradient-to-br from-${mode.color}/10 to-transparent`} 
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.section>

                    {/* Temporal Grid Configuration */}
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-10"
                    >
                        <div className="flex items-center gap-4 text-brand-secondary">
                            <div className="p-3 rounded-xl bg-brand-secondary/10">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-lg font-display font-bold uppercase tracking-widest text-white/80">Matrix Slot Index</h3>
                        </div>

                        <div className="grid gap-4">
                            {settings.slots.map((slot: any) => (
                                <div key={slot.id} className="group flex items-center gap-8 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-display font-black text-xl text-brand-primary group-hover:scale-105 transition-transform shadow-lg">
                                        {slot.id}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-10 flex-1">
                                        <div className="space-y-2">
                                            <label className="form-label !mb-0 text-white/20">Identified Display Time</label>
                                            <input 
                                                type="text"
                                                value={slot.startTime}
                                                onChange={(e) => handleSlotChange(slot.id, 'startTime', e.target.value)}
                                                className="w-full bg-transparent border-b border-white/5 focus:border-brand-primary focus:outline-none py-2 text-base font-medium text-white/80"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="form-label !mb-0 text-white/20">Validation Threshold (24h)</label>
                                            <input 
                                                type="number"
                                                step="0.5"
                                                value={slot.hour}
                                                onChange={(e) => handleSlotChange(slot.id, 'hour', parseFloat(e.target.value))}
                                                className="w-full bg-transparent border-b border-white/5 focus:border-brand-primary focus:outline-none py-2 text-base font-medium text-white/80 tabular-nums"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                <aside className="lg:col-span-2 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8"
                    >
                        <div className="flex items-center gap-4 text-white/20">
                            <Shield size={20} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Commit Sequence</h3>
                        </div>
                        
                        <p className="text-white/40 text-sm leading-relaxed font-light">
                            Updating global configuration will immediately resynchronize all campus sectors. Ensure all active sessions are considered before broadcasting changes.
                        </p>

                        <div className="space-y-4 pt-4">
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                                >
                                    <CheckCircle2 size={16} />
                                    {message}
                                </motion.div>
                            )}

                            <button 
                                disabled={isSaving}
                                className="w-full btn-glow flex items-center justify-center gap-4 py-6"
                            >
                                {isSaving ? <Loader2 size={24} className="animate-spin text-black" /> : (
                                    <>
                                        Broadcast Changes <Save size={20} className="text-black" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-dashed border-white/10 text-center space-y-4">
                        <Zap size={24} className="mx-auto text-white/10" />
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] leading-relaxed">
                            Synchronization Engine Version 2.4.1-Stable<br/>
                            Authored by Asterisk Core
                        </p>
                    </div>
                </aside>
            </form>
        </div>
    );
};

export default AdminSettings;
