import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Filter, 
    ChevronRight,
    Loader2,
    Calendar as CalendarIcon,
    Users,
    Activity,
    Shield,
    Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import WeeklyGrid from '../../components/Calendar/WeeklyGrid';
import AvailabilitySearch from '../../components/Admin/AvailabilitySearch';
import MorningReportWidget from '../../components/Admin/MorningReportWidget';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ rooms: 0, pending: 0, approvalsToday: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pendingRes, roomsRes] = await Promise.all([
                    api.get('/admin/requests/pending'),
                    api.get('/rooms')
                ]);
                
                setPendingRequests(pendingRes.data.requests);
                setStats({
                    rooms: roomsRes.data.rooms.length,
                    pending: pendingRes.data.requests.length,
                    approvalsToday: 12 // Mocked for visual impact
                });
            } catch (err) {
                console.error('Failed to fetch admin data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.post(`/admin/bookings/${id}/approve`);
            setPendingRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert('Approval failed');
        }
    };

    const adminStats = [
        { label: 'Campus Resources', value: stats.rooms, icon: CalendarIcon, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
        { label: 'Pending Clearances', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { label: 'Active Personnel', value: 8, icon: Users, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
        { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ];

    return (
        <div className="space-y-16 pb-24">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-3 text-brand-secondary font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                        <Shield size={16} fill="currentColor" />
                        Administrative Authorization
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Command <span className="text-white/20">Center</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl font-light leading-relaxed">
                        Currently presiding over <span className="text-white font-medium">{stats.rooms} campus sectors</span>. Monitoring real-time synchronization of academic resources.
                    </p>
                </motion.div>

                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                        <Search size={16} /> Search Records
                    </button>
                    <button className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all">
                        Generate Audit
                    </button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-500"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="text-4xl font-display font-medium text-white mb-1">{stat.value}</div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid xl:grid-cols-3 gap-12 items-start">
                <div className="xl:col-span-2 space-y-12">
                     {/* Campus Schedule */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-display font-medium text-white flex items-center gap-3">
                                Sector Synchronization
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Active</span>
                            </h3>
                        </div>
                        <div className="overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl">
                             <WeeklyGrid />
                        </div>
                    </section>

                    {/* Quick Tools Collection */}
                    <div className="grid md:grid-cols-2 gap-8">
                         <div className="p-1 rounded-[3rem] bg-gradient-to-br from-brand-primary/20 via-transparent to-transparent">
                            <div className="bg-bg-deep rounded-[2.9rem] p-8 h-full border border-white/5">
                                <AvailabilitySearch />
                            </div>
                         </div>
                         <div className="p-1 rounded-[3rem] bg-gradient-to-br from-brand-secondary/20 via-transparent to-transparent">
                            <div className="bg-bg-deep rounded-[2.9rem] p-8 h-full border border-white/5">
                                <MorningReportWidget />
                            </div>
                         </div>
                    </div>
                </div>

                {/* Vertical Approval Sequence */}
                <aside className="space-y-8 h-full">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-display font-medium text-white">Sequence Queue</h3>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{pendingRequests.length} Operations</span>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 glass-card">
                                <Loader2 className="animate-spin text-brand-primary" size={32} />
                                <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Synchronizing...</span>
                            </div>
                        ) : pendingRequests.length > 0 ? pendingRequests.map((req, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={req.id}
                                className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all hover:border-white/10"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                                            <span className="text-[9px] uppercase text-white/30 font-black tracking-tighter">{req.date.split('-')[1]}</span>
                                            <span className="text-2xl font-display font-black text-white leading-none">{req.date.split('-')[2]}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-base text-white/90 truncate max-w-[120px]">UID: {req.requesterId}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 text-[8px] text-brand-primary uppercase tracking-widest font-black border border-brand-primary/20">
                                                    {req.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-8 text-xs text-white/40 font-medium">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Clock size={12} className="text-brand-primary" />
                                        Slot {req.slotId}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Shield size={12} className="text-brand-secondary" />
                                        Room {req.roomId}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleApprove(req.id)}
                                        className="flex-1 py-4 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all"
                                    >
                                        Authorize
                                    </button>
                                    <button className="px-6 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                                        Deny
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="p-16 rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10 text-center">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/20">
                                    <CheckCircle2 size={24} />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 leading-loose">
                                    Queue Clear.<br/>No pending authorizations.
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminDashboard;
