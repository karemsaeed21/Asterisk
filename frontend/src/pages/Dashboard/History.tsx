import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    History as HistoryIcon, 
    ArrowLeft, 
    Search, 
    Filter, 
    Calendar as CalendarIcon, 
    Clock, 
    Shield, 
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

const History = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/bookings/my-requests');
                setRequests(res.data.requests);
            } catch (err) {
                console.error('Failed to fetch history');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredRequests = requests.filter(req => 
        req.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
            <div className="w-12 h-12 rounded-2xl border-2 border-brand-primary border-t-transparent animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Retrieving Archive</span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-24 space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-3 text-white/30 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                        <HistoryIcon size={16} />
                        Temporal Logs
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Operation <span className="text-white/20">Archive</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl font-light leading-relaxed">
                        Complete historical record of all resource allocation requests and authorization sequences initiated by your identity.
                    </p>
                </motion.div>

                <div className="relative group w-full md:w-80">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search operation index..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-6 mb-2">
                    <div className="flex items-center gap-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Sequence Context</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Temporal Index</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Verification</span>
                </div>

                {filteredRequests.length > 0 ? filteredRequests.map((req, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={req.id}
                        className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all hover:border-white/10 flex items-center justify-between"
                    >
                         <div className="flex items-center gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all">
                                    <CalendarIcon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-bold text-lg text-white/90 group-hover:text-white transition-colors">Sector {req.roomId}</div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                            req.type === 'MULTI_PURPOSE' ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                        }`}>
                                            {req.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-white/60 font-medium text-sm">
                                    <Clock size={14} className="text-white/20" />
                                    {req.date}
                                </div>
                                <div className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-5">
                                    Slot Index {req.slotId}
                                </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-8">
                            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl ${
                                req.status === 'APPROVED' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-brand-primary/5' :
                                req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5' :
                                'bg-amber-400/10 text-amber-400 border-amber-400/20 shadow-amber-400/5'
                            }`}>
                                {req.status.replace('_', ' ')}
                            </span>
                            <div className="p-2 rounded-xl bg-white/5 text-white/20 group-hover:text-white transition-all">
                                <ChevronRight size={18} />
                            </div>
                         </div>
                    </motion.div>
                )) : (
                    <div className="p-32 rounded-[3.5rem] bg-white/[0.01] border border-dashed border-white/10 text-center flex flex-col items-center gap-6">
                        <Shield size={48} className="text-white/5" />
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/10 max-w-xs leading-loose">
                            Null matching sequence identified in search quadrant.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
