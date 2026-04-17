import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, Laptop, Video, Info, Zap, ChevronRight, MapPin } from 'lucide-react';
import api from '../../api/client';

const MorningReportWidget = () => {
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get('/admin/reports/morning');
                setReport(res.data);
            } catch (err) {
                console.error('Failed to fetch morning report');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (isLoading) return null;

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-brand-secondary">
                    <Zap size={18} fill="currentColor" />
                    <h3 className="text-2xl font-display font-medium text-white">Morning Insight</h3>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    {report?.date || 'Temporal Index: Current'}
                </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                 <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary shrink-0 shadow-lg">
                        <Info size={28} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none mt-1">Maintenance Deviations</h4>
                        <p className="text-sm text-white/30 font-light leading-relaxed max-w-lg">
                            Anomalous sector activity detected. Preparation required for high-priority technical sequences today.
                        </p>
                    </div>
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {report?.outliers.length > 0 ? report.outliers.map((item: any, i: number) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 group/entry hover:bg-white/[0.06] hover:border-brand-secondary/30 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-bg-deep border border-white/10 flex items-center justify-center text-brand-secondary group-hover/entry:scale-110 transition-transform">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-display font-black text-white">{item.room}</div>
                                        <div className="text-[10px] font-black text-brand-secondary/60 uppercase tracking-widest mt-0.5">Slot {item.slotId}</div>
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 text-white/20">
                                    <ChevronRight size={14} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20">Authorized Official</span>
                                    <span className="text-[10px] font-bold text-white/60 truncate max-w-[120px]">{item.requester}</span>
                                </div>
                                
                                {item.techNeeds && (
                                    <div className="flex gap-2">
                                        {item.techNeeds.mics && <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 text-[9px] font-black uppercase tracking-widest"><Cpu size={10} /> Audio</div>}
                                        {item.techNeeds.laptop && <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/10 text-[9px] font-black uppercase tracking-widest"><Laptop size={10} /> Compute</div>}
                                        {item.techNeeds.video && <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/10 text-[9px] font-black uppercase tracking-widest"><Video size={10} /> Uplink</div>}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
                             <FileText size={32} className="text-white/5" />
                             <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/10 leading-loose">
                                Zero anomalies detected.<br/>Standard academic synchronization in effect.
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MorningReportWidget;
