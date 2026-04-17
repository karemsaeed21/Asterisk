import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, Send, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import api from '../../api/client';

interface RejectionModalProps {
    bookingId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ bookingId, onClose, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [alternativeDate, setAlternativeDate] = useState('');
    const [alternativeSlot, setAlternativeSlot] = useState('');
    const [alternativeRoomId, setAlternativeRoomId] = useState('');
    const [rooms, setRooms] = useState<any[]>([]);
    const [slotConfig, setSlotConfig] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, settingsRes] = await Promise.all([
                    api.get('/rooms'),
                    api.get('/admin/settings')
                ]);
                setRooms(roomsRes.data.rooms);
                setSlotConfig(settingsRes.data.slots);
            } catch (err) {
                console.error('Failed to fetch modal dependencies');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/admin/bookings/${bookingId}/reject`, {
                reason,
                alternativeDate,
                alternativeTimeSlot: alternativeSlot,
                alternativeRoomId
            });
            onSuccess();
        } catch (err) {
            alert('Failed to transmit rejection protocol');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-[#0a0a1a] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-10 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-rose-500/10 to-transparent">
                    <div className="space-y-1">
                        <h3 className="text-3xl font-display font-medium text-white tracking-tight">Denial Protocol</h3>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500 font-black">Requires Alternative Suggestion</p>
                    </div>
                    <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                        <X size={28} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Reason for Rejection</label>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder="Identify scheduling conflicts or operational restrictions..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 text-sm text-white min-h-[120px] outline-none focus:border-rose-500/30 transition-all placeholder:text-white/10"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <Send size={16} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Proposed Alternatives</h4>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-white/10 ml-1">Alternative Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <input 
                                        type="date"
                                        value={alternativeDate}
                                        onChange={(e) => setAlternativeDate(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[10px] text-white outline-none focus:border-brand-primary/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-white/10 ml-1">Alternative Slot</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <select 
                                        value={alternativeSlot}
                                        onChange={(e) => setAlternativeSlot(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[10px] text-white outline-none focus:border-brand-primary/50"
                                    >
                                        <option value="">Select slot...</option>
                                        {slotConfig.map(s => <option key={s.id} value={s.id}>Slot {s.id}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-white/10 ml-1">Alternative Sector</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <select 
                                        value={alternativeRoomId}
                                        onChange={(e) => setAlternativeRoomId(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[10px] text-white outline-none focus:border-brand-primary/50"
                                    >
                                        <option value="">Select room...</option>
                                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 bg-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Abort
                        </button>
                        <button 
                            disabled={isSubmitting}
                            className="flex-[2] py-5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.5)] transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><AlertCircle size={18} /> Transmit Denial</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RejectionModal;
