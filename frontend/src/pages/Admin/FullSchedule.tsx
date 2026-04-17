import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
    ShieldCheck,
    Clock,
    BookOpen,
    Users,
    AlertCircle
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';

const FullSchedule = () => {
    const [searchParams] = useSearchParams();
    const [currentDate, setCurrentDate] = useState(() => searchParams.get('date') || new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [slotConfig, setSlotConfig] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const settingsRes = await api.get('/admin/settings');
                setSlotConfig(settingsRes.data.slots);
            } catch (err) {
                console.error("Failed to fetch settings");
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchDailyData = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/admin/schedules/daily?date=${currentDate}`);
                setRooms(res.data.rooms || []);
                setBookings(res.data.bookings || []);
            } catch (err) {
                console.error("Failed to fetch daily schedule");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDailyData();
    }, [currentDate]);

    const changeDate = (days: number) => {
        const dateObj = new Date(currentDate);
        dateObj.setDate(dateObj.getDate() + days);
        setCurrentDate(dateObj.toISOString().split('T')[0]);
    };

    const getBookingForCell = (roomId: string, slotId: number) => {
        return bookings.find(b => b.room_id === roomId && b.slot_id === slotId);
    };

    const renderCell = (booking: any) => {
        if (!booking) {
            return (
                <div className="w-full h-full min-h-[100px] bg-white/[0.01] rounded-2xl border border-white/5 border-dashed flex items-center justify-center group-hover:border-white/10 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-white/20 transition-colors">Available</span>
                </div>
            );
        }

        const isPending = booking.status === 'PENDING_ADMIN' || booking.status === 'PENDING_BRANCH_MGR';
        const isMultiPurpose = booking.type === 'MULTI_PURPOSE';

        if (isPending) {
            return (
                <div className="w-full h-full min-h-[100px] bg-amber-500/5 rounded-2xl border border-amber-500/20 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Clock size={12} />
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500/50">Pending</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-amber-500/80 truncate">Awaiting Clearance</p>
                        <p className="text-[9px] text-amber-500/40 uppercase tracking-widest mt-1 truncate">{booking.users?.name}</p>
                    </div>
                </div>
            );
        }

        if (isMultiPurpose) {
            return (
                <div className="w-full h-full min-h-[100px] bg-cyan-500/5 rounded-2xl border border-cyan-500/20 p-4 flex flex-col justify-between shadow-[0_0_20px_-5px_rgba(6,182,212,0.1)]">
                    <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <Users size={12} />
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-500/50">Event</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-cyan-500 truncate">{booking.multi_purpose_details?.purpose || 'Event'}</p>
                        <p className="text-[9px] text-cyan-500/60 uppercase tracking-widest mt-1 truncate">{booking.multi_purpose_details?.eventManagerName || booking.users?.name}</p>
                    </div>
                </div>
            );
        }

        // Academic (Fixed or Exceptional)
        return (
            <div className="w-full h-full min-h-[100px] bg-brand-primary/5 rounded-2xl border border-brand-primary/20 p-4 flex flex-col justify-between shadow-[0_0_20px_-5px_rgba(var(--brand-primary),0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5 translate-x-2 -translate-y-2">
                    <BookOpen size={64} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <span className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <ShieldCheck size={12} />
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-primary/50">Lecture</span>
                </div>
                <div className="relative z-10">
                    <p className="text-xs font-bold text-brand-primary truncate">{booking.academic_details?.subjectName || 'Academic Booking'}</p>
                    <p className="text-[9px] text-brand-primary/60 uppercase tracking-widest mt-1 truncate">{booking.academic_details?.faculty || booking.users?.name}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-[0.4em]">
                        <CalendarIcon size={14} />
                        Global Intelligence
                    </div>
                    <h1 className="text-5xl font-display font-medium tracking-tighter text-white">
                        Full <span className="text-white/20">Schedule</span>
                    </h1>
                </div>

                <div className="flex items-center p-2 bg-[#0a0a1a] border border-white/10 rounded-2xl">
                    <button 
                        onClick={() => changeDate(-1)}
                        className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="w-48 text-center">
                        <input 
                            type="date" 
                            className="bg-transparent border-none text-white text-sm font-bold font-mono tracking-widest focus:outline-none focus:ring-0 text-center w-full appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => changeDate(1)}
                        className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-32 gap-6 bg-[#030308] rounded-[3rem] border border-white/5 border-dashed">
                    <div className="w-12 h-12 rounded-2xl border-2 border-brand-primary border-t-transparent animate-spin" />
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Evaluating Telemetry</span>
                </div>
            ) : rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-32 gap-6 bg-[#030308] rounded-[3rem] border border-white/5">
                    <AlertCircle size={48} className="text-white/10" />
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">No Campus Sectors Online</span>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-x-auto rounded-[3rem] border border-white/5 bg-[#030308] p-8"
                >
                    <div className="min-w-[1000px]">
                        {/* Grid Header */}
                        <div className="grid grid-cols-[250px_1fr] gap-6 mb-6 px-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-end pb-4">
                                Sector Interface
                            </div>
                            <div className="grid grid-cols-6 gap-4">
                                {slotConfig.map(slot => (
                                    <div key={slot.id} className="text-center pb-4 border-b border-white/5">
                                        <p className="text-white font-bold text-sm">Slot {slot.id}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">{slot.startTime}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grid Body */}
                        <div className="space-y-4">
                            {rooms.map((room) => (
                                <div key={room.id} className="grid grid-cols-[250px_1fr] gap-6 items-center hover:bg-white/[0.01] p-4 rounded-3xl transition-colors group/row">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-white/20 group-hover/row:bg-white/40 transition-colors" />
                                            <h3 className="font-bold text-white text-sm">{room.name}</h3>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 pl-5">
                                            {room.type} • Cap: {room.capacity}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4">
                                        {slotConfig.map(slot => (
                                            <div key={slot.id} className="group">
                                                {renderCell(getBookingForCell(room.id, slot.id))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FullSchedule;
