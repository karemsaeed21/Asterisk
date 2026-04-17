import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/client';
import { BookingStatus } from '../../types/index';
import { Clock, Box, Shield, Zap, Plus } from 'lucide-react';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyGrid = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [slotConfig, setSlotConfig] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, bookingsRes] = await Promise.all([
                    api.get('/admin/settings'),
                    api.get('/admin/requests/pending') // In production, we'd fetch approved ones for the week
                ]);
                setSlotConfig(settingsRes.data.slots);
                setBookings(bookingsRes.data.requests);
            } catch (err) {
                console.error('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getBookingForSlot = (day: string, slotId: number) => {
        // Match by slotId and ideally by date/day (mocking day match for now)
        return bookings.find(b => b.slotId === slotId && b.status === BookingStatus.APPROVED);
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
            <div className="w-12 h-12 rounded-2xl border-2 border-brand-primary border-t-transparent animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Establishing Temporal Grid</span>
        </div>
    );

    return (
        <div className="relative group overflow-hidden bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[1200px]">
                    {/* Day Headers */}
                    <div className="grid grid-cols-8 border-b border-white/[0.03] bg-white/[0.02]">
                        <div className="p-8 flex items-center gap-3">
                            <Clock size={16} className="text-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Matrix Index</span>
                        </div>
                        {days.map(day => (
                            <div key={day} className="p-8 text-center border-l border-white/[0.03]">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{day}</span>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    {slotConfig.map((slot, sIdx) => (
                        <div key={slot.id} className="grid grid-cols-8 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors">
                            <div className="p-8 flex flex-col justify-center border-r border-white/[0.03] relative overflow-hidden group/slot">
                                <div className="absolute inset-y-0 left-0 w-1 bg-brand-primary/0 group-hover/slot:bg-brand-primary/40 transition-all" />
                                <span className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Zap size={10} fill="currentColor" />
                                    Slot {slot.id}
                                </span>
                                <span className="text-[11px] font-medium text-white/20 tabular-nums">{slot.startTime}</span>
                            </div>
                            
                            {days.map((day, dIdx) => {
                                const booking = getBookingForSlot(day, slot.id);
                                return (
                                    <div key={`${day}-${slot.id}`} className="p-2 border-l border-white/[0.03] min-h-[140px] relative group/cell">
                                        {booking ? (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`h-full w-full rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl relative overflow-hidden ${
                                                    booking.type === 'ACADEMIC_FIXED' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-brand-primary/5' :
                                                    booking.type === 'MULTI_PURPOSE' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 shadow-brand-secondary/5' :
                                                    'bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-amber-400/5'
                                                }`}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                                            <Box size={14} />
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Active</span>
                                                    </div>
                                                    <div className="font-bold text-sm tracking-tight mb-1 truncate">{booking.roomId}</div>
                                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 truncate">
                                                        {booking.type.replace('_', ' ')}
                                                    </div>
                                                </div>

                                                <div className="relative z-10 flex items-center justify-between pt-4 mt-auto border-t border-white/5">
                                                    <div className="flex -space-x-2">
                                                         <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[9px] font-bold">
                                                            {booking.requesterId.charAt(0)}
                                                         </div>
                                                    </div>
                                                    <Shield size={12} className="opacity-20" />
                                                </div>

                                                {/* Decorative background accent */}
                                                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 transition-transform group-hover/cell:rotate-45 duration-700">
                                                    <Box size={80} />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="w-full h-full rounded-[2rem] flex flex-col items-center justify-center opacity-0 group-hover/cell:opacity-100 bg-white/[0.02] border border-dashed border-white/10 transition-all duration-500 cursor-copy group-hover/cell:scale-[0.98]">
                                                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-2">
                                                    <Plus size={18} />
                                                 </div>
                                                 <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Initialize</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-6 bg-white/[0.02] border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Academic</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Multi-Purpose</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Exceptional</span>
                    </div>
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">
                    Real-time Synchronization Active
                </div>
            </div>
        </div>
    );
};

export default WeeklyGrid;
