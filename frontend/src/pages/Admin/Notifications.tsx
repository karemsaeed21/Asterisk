import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Bell, 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    Shield, 
    ArrowRight,
    RefreshCw,
    Search
} from 'lucide-react';
import api from '../../api/client';

interface Notification {
    id: string;
    type: 'APPROVAL' | 'MODIFICATION';
    message: string;
    timestamp: string;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/notifications/vip');
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filtered = notifications.filter(n => {
        if (filter === 'ALL') return true;
        if (filter === 'ALERTS') return n.type === 'MODIFICATION';
        if (filter === 'APPROVALS') return n.type === 'APPROVAL';
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto pb-24 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-2">
                        <Shield size={14} fill="currentColor" />
                        Oversight & Audit
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Security <span className="text-white/20">Protocol Logs</span>
                    </h1>
                    <p className="text-white/40 text-lg font-light max-w-xl">
                        Real-time audit trails of Branch Manager overrides and high-priority resource escalations.
                    </p>
                </div>
                <button 
                    onClick={fetchNotifications}
                    className="group px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={18} className={`text-brand-primary ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white">Refresh Stream</span>
                </button>
            </div>

            <div className="flex items-center gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-[2rem] w-fit mx-auto md:mx-0">
                {['ALL', 'ALERTS', 'APPROVALS'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === f 
                            ? 'bg-brand-primary text-black' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid gap-6">
                    {filtered.map((notification, i) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-8 rounded-[3rem] bg-white/[0.01] border border-white/5 hover:border-brand-primary/20 hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                {notification.type === 'MODIFICATION' ? <AlertTriangle size={120} /> : <CheckCircle2 size={120} />}
                            </div>

                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl ${
                                notification.type === 'MODIFICATION' 
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}>
                                {notification.type === 'MODIFICATION' ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                        notification.type === 'MODIFICATION' ? 'text-rose-500' : 'text-emerald-500'
                                    }`}>
                                        {notification.type === 'MODIFICATION' ? 'Security Alert' : 'Authorization Finalized'}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/20">
                                        <Clock size={12} />
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <h3 className="text-xl font-medium tracking-tight text-white/80 group-hover:text-white transition-colors">
                                    {notification.message}
                                </h3>
                            </div>

                            <button className="md:px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                                Details <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-32 rounded-[4rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] flex items-center justify-center text-white/10">
                        <Bell size={40} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-display font-medium text-white/40">Clean Slate</h4>
                        <p className="text-white/20 text-sm max-w-xs mx-auto">
                            No high-priority notifications recorded in the current temporal window.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
