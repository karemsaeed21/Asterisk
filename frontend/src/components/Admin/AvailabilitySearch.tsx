import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Sparkles, Filter, Plus, Calendar as CalendarIcon, Clock, ChevronRight, Zap } from 'lucide-react';
import api from '../../api/client';

const AvailabilitySearch = () => {
    const [date, setDate] = useState('');
    const [slotId, setSlotId] = useState('');
    const [type, setType] = useState('LECTURE');
    const [rooms, setRooms] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setHasSearched(true);

        try {
            const res = await api.get('/rooms/availability', {
                params: { date, slotId, type }
            });
            setRooms(res.data.availableRooms);
        } catch (err) {
            console.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <section className="space-y-8 h-full">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-brand-primary">
                    <Sparkles size={18} fill="currentColor" />
                    <h3 className="text-2xl font-display font-medium text-white">Resource Scout</h3>
                </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <form onSubmit={handleSearch} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="form-label !mb-0 text-white/20">Temporal Target</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors">
                                    <CalendarIcon size={14} />
                                </div>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-primary/50 text-xs font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="form-label !mb-0 text-white/20">Slot Index</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors">
                                    <Clock size={14} />
                                </div>
                                <select 
                                    value={slotId}
                                    onChange={(e) => setSlotId(e.target.value)}
                                    required
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-primary/50 text-xs font-medium appearance-none"
                                >
                                    <option value="">Select index...</option>
                                    {[1, 2, 3, 4, 5, 6].map(s => (
                                        <option key={s} value={s}>Slot {s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="form-label !mb-0 text-white/20">Resource Classification</label>
                        <div className="flex gap-4">
                            {['LECTURE', 'MULTI_PURPOSE'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                        type === t 
                                        ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' 
                                        : 'bg-white/5 border-white/5 text-white/20 hover:text-white/40'
                                    }`}
                                >
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        disabled={isSearching}
                        className="w-full py-5 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 size={18} className="animate-spin text-black" /> : <Search size={18} />}
                        Initiate Sweep
                    </button>
                </form>

                <AnimatePresence mode="wait">
                    {hasSearched && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-8 border-t border-white/5 relative z-10"
                        >
                            <div className="flex items-center justify-between mb-2 px-2">
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20">Identified Resources</span>
                                <span className="text-[10px] font-bold text-brand-primary">{rooms.length} Located</span>
                            </div>

                            {rooms.length > 0 ? (
                                <div className="space-y-3">
                                    {rooms.map((room, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={room.id} 
                                            className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.06] hover:border-brand-primary/30 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <MapPin size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white/90 group-hover:text-white transition-colors">{room.name}</div>
                                                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">{room.capacity} Units</div>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/5 text-white/20 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
                                                <ChevronRight size={14} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                                    <Zap size={24} className="text-white/5" />
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/10 leading-loose">
                                        {isSearching ? 'Synchronizing Sensors...' : 'Zero matches found in this temporal/sector quadrant.'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default AvailabilitySearch;
