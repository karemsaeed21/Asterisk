import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CalendarDays, 
    Plus, 
    Trash2, 
    Clock, 
    LayoutTemplate,
    Shield,
    Loader2,
    Calendar,
    Search
} from 'lucide-react';
import api from '../../api/client';

const FixedSchedules = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('1');
    const [startDate, setStartDate] = useState('');
    const [weeks, setWeeks] = useState(16);
    const [faculty, setFaculty] = useState('');
    const [subjectName, setSubjectName] = useState('');
    
    // For deleting
    const [delRoom, setDelRoom] = useState('');
    const [delSlot, setDelSlot] = useState('1');
    const [delStartDate, setDelStartDate] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [roomsRes, schedulesRes] = await Promise.all([
                api.get('/rooms'),
                api.get('/admin/schedules/fixed')
            ]);
            setRooms(roomsRes.data.rooms.filter((r: any) => r.type === 'LECTURE'));
            setSchedules(schedulesRes.data.schedules || []);
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/admin/schedules/fixed', {
                roomId: selectedRoom,
                slotId: selectedSlot,
                startDate,
                weeks,
                academicDetails: { faculty, subjectName }
            });
            alert('Semester schedule successfully deployed.');
            // Reset form
            setSelectedRoom('');
            setSelectedSlot('1');
            setStartDate('');
            setWeeks(16);
            setFaculty('');
            setSubjectName('');
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to deploy structural schedule.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Are you certain you want to purge this 16-week cycle? This action cannot be undone.')) return;
        setIsDeleting(true);
        try {
            await api.delete('/admin/schedules/fixed', {
                params: {
                    roomId: delRoom,
                    slotId: delSlot,
                    startDate: delStartDate,
                    weeks: 16
                }
            });
            alert('Sector schedule purged successfully.');
            setDelRoom('');
            setDelSlot('1');
            setDelStartDate('');
            fetchData();
        } catch (err: any) {
             alert(err.response?.data?.message || 'Failed to purge structural schedule.');
        } finally {
            setIsDeleting(false);
        }
    };

    const groupedSchedules = schedules.reduce((acc, booking) => {
        const dateObj = new Date(booking.date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const key = `${booking.room_id}-${booking.slot_id}-${dayOfWeek}`;
        if (!acc[key]) {
            acc[key] = {
                id: key,
                roomName: booking.rooms?.name || 'Unknown Room',
                slotId: booking.slot_id,
                dayOfWeek,
                startDate: booking.date,
                count: 1,
                subjectName: booking.academic_details?.subjectName || 'N/A'
            };
        } else {
            acc[key].count += 1;
        }
        return acc;
    }, {} as Record<string, any>);

    const activeSequences = Object.values(groupedSchedules);

    return (
        <div className="max-w-6xl mx-auto pb-24 space-y-16">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-3 text-brand-secondary font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                        <CalendarDays size={16} />
                        Academic Blueprinting
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Semester <span className="text-white/20">Operations</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl font-light leading-relaxed">
                        Strategically deploy and revoke 16-week repeating academic structures across all campus sectors.
                    </p>
                </motion.div>
                <div className="flex gap-4">
                     <button className="px-6 py-3.5 bg-white/[0.03] text-white border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Search size={16} /> Locate Structure
                     </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Create Schedule Column */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
                        <LayoutTemplate size={120} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-display font-medium text-white">Deploy Scheme</h3>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Initiate 16-Week Cycle</p>
                        </div>

                        <form onSubmit={handleCreateSchedule} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Sector Allocation</label>
                                <select 
                                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all appearance-none"
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    required
                                >
                                    <option value="">Select Campus Sector...</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name} (Cap: {room.capacity})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Structural Slot</label>
                                    <select 
                                        className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all appearance-none"
                                        value={selectedSlot}
                                        onChange={(e) => setSelectedSlot(e.target.value)}
                                    >
                                        {[1,2,3,4,5,6].map(s => (
                                            <option key={s} value={s}>Slot {s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Duration (Weeks)</label>
                                    <input 
                                        type="number"
                                        value={weeks}
                                        onChange={(e) => setWeeks(Number(e.target.value))}
                                        min="1"
                                        max="52"
                                        className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all font-mono"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Commencement Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50" size={18} />
                                    <input 
                                        type="date"
                                        className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all appearance-none font-mono"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Faculty</label>
                                    <input 
                                        type="text"
                                        placeholder="Engineering..."
                                        value={faculty}
                                        onChange={(e) => setFaculty(e.target.value)}
                                        className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-2">Subject Name</label>
                                    <input 
                                        type="text"
                                        placeholder="Data Structures..."
                                        value={subjectName}
                                        onChange={(e) => setSubjectName(e.target.value)}
                                        className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={isSubmitting || isLoading}
                                className="w-full mt-4 py-4 bg-brand-primary text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                                {isSubmitting ? (
                                    <Loader2 size={18} className="animate-spin text-black relative z-10" />
                                ) : (
                                    <>
                                        <Plus size={18} className="relative z-10" />
                                        <span className="relative z-10">Deploy Architecture</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Revoke Schedule Column */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-rose-500/[0.02] border border-rose-500/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
                        <Shield size={120} className="text-rose-500" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-display font-medium text-white">Revoke Scheme</h3>
                            <p className="text-[10px] uppercase tracking-widest text-rose-400/60 font-bold mt-1">Purge Active Cycle</p>
                        </div>

                        <form onSubmit={handleDeleteSchedule} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-rose-500/40 ml-2">Sector Allocation</label>
                                <select 
                                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all appearance-none"
                                    value={delRoom}
                                    onChange={(e) => setDelRoom(e.target.value)}
                                    required
                                >
                                    <option value="">Select Campus Sector...</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name} (Cap: {room.capacity})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-rose-500/40 ml-2">Structural Slot</label>
                                <select 
                                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all appearance-none"
                                    value={delSlot}
                                    onChange={(e) => setDelSlot(e.target.value)}
                                >
                                    {[1,2,3,4,5,6].map(s => (
                                        <option key={s} value={s}>Slot {s}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-rose-500/40 ml-2">Initial Day Sequence</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500/50" size={18} />
                                    <input 
                                        type="date"
                                        className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all appearance-none font-mono"
                                        value={delStartDate}
                                        onChange={(e) => setDelStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-[9px] uppercase tracking-widest text-white/20 mt-2 ml-2">The system will locate and destroy 16 related instances originating from this exact date.</p>
                            </div>

                            <button 
                                disabled={isDeleting || isLoading}
                                className="w-full mt-4 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <Trash2 size={18} className="relative z-10" />
                                        <span className="relative z-10">Execute Sequence Purge</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Active Structures Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12 overflow-hidden relative"
            >
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-2xl font-display font-medium text-white flex items-center gap-3">
                            Active Sequences
                            <span className="px-2 py-0.5 rounded-lg bg-brand-primary/10 text-[9px] font-black text-brand-primary uppercase tracking-widest border border-brand-primary/20">Live</span>
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Currently Deployed 16-Week Structures</p>
                    </div>
                </div>

                <div className="relative z-10 overflow-x-auto">
                    {isLoading ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="animate-spin text-white/20" size={32} />
                        </div>
                    ) : activeSequences.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30 font-black">
                                    <th className="pb-4 pl-4 font-black">Subject</th>
                                    <th className="pb-4 font-black">Campus Sector</th>
                                    <th className="pb-4 font-black">Day of Week</th>
                                    <th className="pb-4 font-black">Structural Slot</th>
                                    <th className="pb-4 font-black">Initial Date</th>
                                    <th className="pb-4 pr-4 font-black text-right">Cycle Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeSequences.map((seq: any) => (
                                    <tr key={seq.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-6 pl-4 text-xs font-bold text-brand-primary/80">
                                            {seq.subjectName}
                                        </td>
                                        <td className="py-6 font-bold text-white text-sm flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_-2px_rgba(var(--brand-primary),0.5)]" />
                                            {seq.roomName}
                                        </td>
                                        <td className="py-6 text-xs text-white/80 font-medium">
                                            {seq.dayOfWeek}
                                        </td>
                                        <td className="py-6">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black text-white/60">
                                                Slot {seq.slotId}
                                            </span>
                                        </td>
                                        <td className="py-6 text-xs text-white/60 font-mono">
                                            {seq.startDate}
                                        </td>
                                        <td className="py-6 pr-4 text-right">
                                            <span className="text-sm font-black text-emerald-400">{seq.count}</span>
                                            <span className="text-[10px] text-white/30 uppercase tracking-widest ml-1">Weeks</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-16 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <LayoutTemplate size={32} className="mx-auto text-white/10 mb-4" />
                            <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">No Active structural sequences deployed.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default FixedSchedules;
