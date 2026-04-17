import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, Role } from '../../context/AuthContext';
import { Plus, Clock, CheckCircle2, XCircle, ArrowRight, Zap, Calendar as CalendarIcon, Filter, Shield } from 'lucide-react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get('/bookings/my-requests');
                setRequests(res.data.requests);
                
                const s = res.data.requests.reduce((acc: any, curr: any) => {
                    if (curr.status.includes('PENDING')) acc.pending++;
                    else if (curr.status === 'APPROVED') acc.approved++;
                    else if (curr.status === 'REJECTED') acc.rejected++;
                    return acc;
                }, { pending: 0, approved: 0, rejected: 0 });
                setStats(s);
            } catch (err) {
                console.error('Failed to fetch requests');
            }
        };
        fetchRequests();
    }, []);

    const statCards = [
        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-400', glow: 'shadow-amber-400/20', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
        { label: 'Confirmed Access', value: stats.approved, icon: CheckCircle2, color: 'text-brand-primary', glow: 'shadow-brand-primary/20', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20' },
        { label: 'System Denied', value: stats.rejected, icon: XCircle, color: 'text-rose-400', glow: 'shadow-rose-400/20', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
    ];

    return (
        <div className="space-y-12 pb-24">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                        <Zap size={14} fill="currentColor" />
                        Live Intelligence
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Insights <span className="text-white/20">/</span> {user?.name.split(' ')[0]}
                    </h1>
                    <p className="text-white/40 text-lg max-w-lg font-light leading-relaxed">
                        Welcome to the command center. You currently have <span className="text-white font-medium">{stats.pending} active sequences</span> awaiting administrative clearance.
                    </p>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Link 
                        to="/request/new"
                        className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] font-bold text-sm transition-all hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Initiate Sequence
                    </Link>
                </motion.div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className={`group relative p-8 rounded-[2.5rem] bg-white/[0.03] border ${stat.border} transition-all duration-500 hover:bg-white/[0.06] hover:scale-[1.02] hover:${stat.glow}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                            <stat.icon size={28} />
                        </div>
                        <div className="text-5xl font-display font-medium text-white mb-2">{stat.value}</div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">{stat.label}</div>
                        
                        {/* Decorative Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                    </motion.div>
                ))}
            </div>

            {/* Main Activity Area */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-display font-medium text-white">Recent Log</h3>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                {requests.length} Entries
                            </span>
                        </div>
                        <Link to="/history" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-brand-primary flex items-center gap-2 transition-all">
                            Full History <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/[0.03] border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Resource</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Temporal Index</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {requests.length > 0 ? requests.slice(0, 5).map((req, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.05) }}
                                            key={req.id} 
                                            className="group hover:bg-white/[0.02] transition-all cursor-pointer"
                                        >
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/50 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all">
                                                        <CalendarIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white/90 group-hover:text-white transition-colors">Room {req.roomId}</div>
                                                        <div className="text-[9px] uppercase font-black text-white/20 tracking-[0.2em] mt-1">{req.type.replace('_', ' ')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="text-sm font-medium text-white/70">{req.date}</div>
                                                <div className="text-[10px] font-bold text-brand-primary/50 uppercase tracking-widest mt-0.5">Slot Index {req.slotId}</div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                                                    req.status === 'APPROVED' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                                                    req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    'bg-amber-400/10 text-amber-400 border-amber-400/20'
                                                }`}>
                                                    {req.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20 text-center text-white/10 uppercase tracking-[0.3em] font-bold text-xs">
                                                No intelligence data to display
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widget: Quick Actions / Tips */}
                <div className="space-y-6">
                    <h3 className="text-xl font-display font-medium px-2">Quick Commands</h3>
                    
                    {user?.role !== Role.EMPLOYEE && user?.role !== Role.SECRETARY && (
                        <div className="group p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-secondary/20 to-transparent border border-brand-secondary/20 hover:border-brand-secondary/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-6">
                                <Filter size={24} />
                            </div>
                            <h4 className="text-white font-bold mb-2">Availability Hub</h4>
                            <p className="text-white/40 text-sm leading-relaxed mb-6 font-light">
                                Search for high-priority resources across all branches in real-time.
                            </p>
                            <button className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/60 hover:text-white">
                                Launch Search Interface
                            </button>
                        </div>
                    )}

                    <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">System Notice</span>
                        </div>
                        <p className="text-white/30 text-xs leading-loose font-medium italic">
                            "Remember that all Multi-Purpose requests are processed with manual override by the Branch Manager. Ensure technical requirements are finalized before submission."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
