import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import api from '../../api/client';

const MonthlyHeatmap = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookingDensity, setBookingDensity] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDensity = async () => {
            setIsLoading(true);
            try {
                // In a real scenario, we'd have a specific aggregation endpoint.
                // For now, let's fetch all bookings for current month or mock the density based on reality.
                // const res = await api.get('/admin/analytics/monthly?month=' + (currentDate.getMonth() + 1));
                
                // Mocking density for visual demonstration of the feature
                const mockDensity: Record<string, number> = {};
                for (let i = 1; i <= 31; i++) {
                    mockDensity[i] = Math.floor(Math.random() * 5); // 0 to 4 level density
                }
                setBookingDensity(mockDensity);
            } catch (err) {
                console.error('Failed to fetch monthly analytics');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDensity();
    }, [currentDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const getDensityClass = (level: number) => {
        if (level === 0) return 'bg-white/[0.02] border-white/5';
        if (level === 1) return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500';
        if (level === 2) return 'bg-amber-500/20 border-amber-500/30 text-amber-500';
        if (level === 3) return 'bg-orange-500/30 border-orange-500/40 text-orange-500';
        return 'bg-rose-500/40 border-rose-500/50 text-rose-500';
    };

    return (
        <div className="space-y-8 p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden">
             {/* Header */}
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-medium text-white">{monthName} <span className="text-white/20">{year}</span></h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">Traffic Analytics</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                         onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-7 gap-3 relative z-10">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 text-center py-2">{day}</div>
                ))}
                
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const level = bookingDensity[day] || 0;
                    return (
                        <motion.div 
                            key={day}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={`aspect-square rounded-2xl border flex items-center justify-center text-xs font-display font-black transition-all ${getDensityClass(level)} hover:scale-105 cursor-pointer`}
                        >
                            {day}
                        </motion.div>
                    );
                })}
             </div>

             {/* Legend */}
             <div className="flex items-center justify-between pt-6 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/20">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-white/[0.02] border border-white/5" /> Quiet</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-rose-500/40 border border-rose-500/50" /> Peak</div>
                </div>
                <div className="flex items-center gap-2 italic">
                    <Info size={12} /> Resource saturation index
                </div>
             </div>
        </div>
    );
};

export default MonthlyHeatmap;
