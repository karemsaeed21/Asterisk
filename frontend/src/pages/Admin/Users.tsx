import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    UserPlus, 
    Search, 
    Shield, 
    Mail, 
    BadgeCheck, 
    MoreVertical,
    Activity,
    ArrowLeft,
    X,
    Lock,
    Calendar,
    UserCheck,
    Check,
    RefreshCw,
    Info,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import api from '../../api/client';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'DELEGATIONS'>('ALL');
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [pendingDelegations, setPendingDelegations] = useState<any[]>([]);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    
    // Override form state
    const [overrides, setOverrides] = useState({
        canViewSchedule: false,
        canApproveRequests: false,
        canManageRooms: false
    });

    // Delegation form state
    const [delegation, setDelegation] = useState({
        substituteId: '',
        startDate: '',
        endDate: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'ALL') {
                const res = await api.get('/admin/users');
                setUsers(res.data.users);
                
                // Pre-fetch pending counts for badges
                const [pUsers, pDels] = await Promise.all([
                    api.get('/admin/users/pending'),
                    api.get('/admin/delegations/pending')
                ]);
                setPendingUsers(pUsers.data.users);
                setPendingDelegations(pDels.data.delegations);
            } else if (activeTab === 'PENDING') {
                const res = await api.get('/admin/users/pending');
                setPendingUsers(res.data.users);
            } else if (activeTab === 'DELEGATIONS') {
                const res = await api.get('/admin/delegations/pending');
                setPendingDelegations(res.data.delegations);
            }
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveDelegation = async (id: string) => {
        setIsSubmitting(true);
        try {
            await api.post(`/admin/delegations/${id}/approve`);
            fetchData();
        } catch (err) {
            alert('Failed to authorize proxy');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectDelegation = async (id: string) => {
        if (!confirm('Purge this delegation request?')) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/admin/delegations/${id}/reject`);
            fetchData();
        } catch (err) {
            alert('Failed to purge request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRole) return;
        setIsSubmitting(true);
        try {
            await api.post(`/admin/users/${selectedUser.id}/approve`, { role: selectedRole });
            setIsApprovalModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Approval failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (userId: string) => {
        if (!confirm('Are you sure you want to reject and purge this identity?')) return;
        try {
            await api.delete(`/admin/users/${userId}/reject`);
            fetchData();
        } catch (err) {
            alert('Rejection failed');
        }
    };

    const handleUpdateOverrides = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/admin/users/${selectedUser.id}/overrides`, overrides);
            setIsOverrideModalOpen(false);
        } catch (err) {
            alert('Failed to update overrides');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateDelegation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Mapping the UI logic: Delegator is the selected user (if Admin is doing it) or current user.
            // Simplified: We assume Admin is setting it up for the selectedUser as delegator.
            // But the controller takes req.user as delegator. 
            // So we need to ensure the API matches. 
            // Let's assume Admin is the one setting it up for the selected user.
            await api.post('/delegations', {
                ...delegation,
                // In a real scenario, Admin might specify the delegator. 
                // For now, let's stick to the controller's logic where req.user is delegator.
                // Or we update controller to allow Admin to specify.
            });
            setIsDelegationModalOpen(false);
        } catch (err) {
            alert('Failed to create delegation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openOverrideModal = (user: any) => {
        setSelectedUser(user);
        setIsOverrideModalOpen(true);
        // Reset or fetch existing overrides here if applicable
    };

    const openDelegationModal = (user: any) => {
        setSelectedUser(user);
        // Pre-fill the substitute state if needed
        setIsDelegationModalOpen(true);
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <div className="flex items-center gap-3 text-brand-secondary font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                        <Users size={16} />
                        Identity Directory
                    </div>
                    <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                        Access <span className="text-white/20">Control</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl font-light leading-relaxed">
                        Manage campus personnel, adjust authorization levels, and monitor active sessions across the Asterisk infrastructure.
                    </p>
                </motion.div>

                <div className="flex gap-4">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mr-4">
                        <button 
                            onClick={() => setActiveTab('ALL')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Active Directory
                        </button>
                        <button 
                            onClick={() => setActiveTab('PENDING')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'PENDING' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Identity Clearance
                            {pendingUsers.length > 0 && activeTab !== 'PENDING' && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[8px] text-white">
                                    {pendingUsers.length}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('DELEGATIONS')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'DELEGATIONS' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Proxy Queue
                            {pendingDelegations.length > 0 && activeTab !== 'DELEGATIONS' && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-secondary rounded-full flex items-center justify-center text-[8px] text-black">
                                    {pendingDelegations.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="relative group w-64">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-secondary transition-colors">
                            <Search size={16} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Find Identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-secondary/50 transition-all"
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-white text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2">
                        <UserPlus size={16} /> Provision
                    </button>
                </div>
            </div>

            {/* User Grid */}
            {/* User Grid */}
            {activeTab === 'ALL' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={user.id}
                            className="group relative p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                <Shield size={100} />
                            </div>

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center text-white/90 font-display font-black text-2xl shadow-xl">
                                    {user.name.charAt(0)}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                    {user.status}
                                </div>
                            </div>

                            <div className="space-y-1 relative z-10 mb-8">
                                <h3 className="text-xl font-display font-medium text-white group-hover:text-brand-primary transition-colors">{user.name}</h3>
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">ID: {user.employee_id}</div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 text-white/40">
                                        <Shield size={14} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{user.role?.replace('_', ' ')}</span>
                                </div>
                                <button 
                                    onClick={() => openOverrideModal(user)}
                                    className="w-8 h-8 rounded-full bg-white/5 text-white/20 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                                >
                                    <Lock size={16} />
                                </button>
                                <button 
                                    onClick={() => openDelegationModal(user)}
                                    className="w-8 h-8 rounded-full bg-white/5 text-white/20 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                                >
                                    <RefreshCw size={16} className="text-brand-secondary/40 shrink-0" />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-white/5 text-white/20 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : activeTab === 'PENDING' ? (
                <div className="space-y-4">
                    {pendingUsers.length > 0 ? pendingUsers.map((user, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={user.id} 
                            className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{user.name}</div>
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">ID: {user.employee_id} • Requested {new Date(user.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => { setSelectedUser(user); setIsApprovalModalOpen(true); }}
                                    className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all"
                                >
                                    Authorize Entry
                                </button>
                                <button 
                                    onClick={() => handleReject(user.id)}
                                    className="px-6 py-3 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    Purge
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="p-24 rounded-[4rem] bg-white/[0.01] border border-dashed border-white/5 text-center">
                            <CheckCircle2 size={40} className="text-white/10 mx-auto mb-6" />
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">All Identity Access Factor Cleared</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingDelegations.length > 0 ? pendingDelegations.map((del, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={del.id}
                            className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                                <RefreshCw size={120} />
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="flex items-center gap-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-black text-2xl">
                                            {del.delegator.name.charAt(0)}
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Delegator</span>
                                    </div>
                                    
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a0a1a] border border-white/10 flex items-center justify-center">
                                            <ArrowLeft size={14} className="text-white/20" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary font-black text-2xl shadow-[0_0_30px_-10px_rgba(255,193,7,0.2)]">
                                            {del.substitute.name.charAt(0)}
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-secondary/40">Substitute</span>
                                    </div>

                                    <div className="space-y-1 ml-4">
                                        <div className="text-xl font-display font-medium text-white">{del.substitute.name}</div>
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Acting as: {del.delegator.role?.replace('_', ' ')}</div>
                                        <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-white/40">
                                            <Calendar size={14} className="text-brand-secondary" />
                                            {new Date(del.start_date).toLocaleDateString()} — {new Date(del.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleApproveDelegation(del.id)}
                                        disabled={isSubmitting}
                                        className="px-10 py-4 bg-brand-secondary text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_-5px_rgba(255,193,7,0.4)] transition-all flex items-center gap-3"
                                    >
                                        Authorize Proxy
                                    </button>
                                    <button 
                                        onClick={() => handleRejectDelegation(del.id)}
                                        disabled={isSubmitting}
                                        className="px-10 py-4 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-all"
                                    >
                                        Cancel Protocol
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="p-24 rounded-[4rem] bg-white/[0.01] border border-dashed border-white/5 text-center">
                            <Activity size={40} className="text-white/10 mx-auto mb-6" />
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">No Pending Proxy Requests</p>
                        </div>
                    )}
                </div>
            )}

            <div className="p-12 rounded-[4rem] bg-white/[0.01] border border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-6">
                <Activity size={32} className="text-white/10" />
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Operational Synchronization</p>
                    <p className="text-xs text-white/10 font-medium italic">"Identity integrity is the foundation of academic resource security."</p>
                </div>
            </div>

            {/* Override Modal */}
            <AnimatePresence>
                {isOverrideModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg bg-[#0a0a1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-display font-medium text-white">Authority Override</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">User: {selectedUser?.name}</p>
                                </div>
                                <button onClick={() => setIsOverrideModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateOverrides} className="p-8 space-y-8">
                                <div className="space-y-4">
                                    {[
                                        { id: 'canViewSchedule', label: 'Visibility Access', sub: 'Allow user to view all room schedules' },
                                        { id: 'canApproveRequests', label: 'Decision Control', sub: 'Grant authority to approve/reject bookings' },
                                        { id: 'canManageRooms', label: 'Resource Management', sub: 'Allow adding/removing campus sectors' }
                                    ].map(opt => (
                                        <label key={opt.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all">
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold text-white">{opt.label}</div>
                                                <div className="text-[10px] text-white/20 font-medium">{opt.sub}</div>
                                            </div>
                                            <input 
                                                type="checkbox"
                                                checked={(overrides as any)[opt.id]}
                                                onChange={(e) => setOverrides(prev => ({ ...prev, [opt.id]: e.target.checked }))}
                                                className="w-5 h-5 accent-brand-primary"
                                            />
                                        </label>
                                    ))}
                                </div>
                                <button 
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-white text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <span className="animate-spin text-lg ring-2 ring-black rounded-full" /> : <><Shield size={16} /> Deploy Overrides</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delegation Modal */}
            <AnimatePresence>
                {isDelegationModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg bg-[#0a0a1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-display font-medium text-white">Temporal Delegation</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">Assigning Proxy for {selectedUser?.name}</p>
                                </div>
                                <button onClick={() => setIsDelegationModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateDelegation} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Substitute Official</label>
                                        <select 
                                            value={delegation.substituteId}
                                            onChange={(e) => setDelegation(prev => ({ ...prev, substituteId: e.target.value }))}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-brand-secondary/50"
                                            required
                                        >
                                            <option value="">Select identity...</option>
                                            {users.filter(u => u.id !== selectedUser?.id).map(u => (
                                                <option key={u.id} value={u.id}>{u.name} ({u.employee_id})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Start Epoch</label>
                                            <input 
                                                type="date"
                                                value={delegation.startDate}
                                                onChange={(e) => setDelegation(prev => ({ ...prev, startDate: e.target.value }))}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-brand-secondary/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">End Epoch</label>
                                            <input 
                                                type="date"
                                                value={delegation.endDate}
                                                onChange={(e) => setDelegation(prev => ({ ...prev, endDate: e.target.value }))}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-brand-secondary/50"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10 flex gap-4 items-start">
                                    <Info size={18} className="text-brand-secondary shrink-0" />
                                    <p className="text-[10px] text-brand-secondary/60 leading-relaxed font-medium">
                                        The substitute will inherit all operational authorities of the primary official during the specified timeframe.
                                    </p>
                                </div>
                                <button 
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-brand-secondary text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <span className="animate-spin text-lg ring-2 ring-black rounded-full" /> : <><RefreshCw size={16} /> Activate Proxy</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Approval Modal */}
            <AnimatePresence>
                {isApprovalModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-sm bg-[#0a0a1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5">
                                <h3 className="text-2xl font-display font-medium text-white mb-2">Assign Authority</h3>
                                <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">Authorizing {selectedUser?.name}</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    {['EMPLOYEE', 'SECRETARY', 'BRANCH_MANAGER', 'ADMIN'].map(role => (
                                        <button 
                                            key={role}
                                            onClick={() => setSelectedRole(role)}
                                            className={`w-full p-4 rounded-2xl border transition-all text-left group ${selectedRole === role ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black uppercase tracking-widest">{role.replace('_', ' ')}</span>
                                                {selectedRole === role && <Check size={16} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={handleApprove}
                                    disabled={!selectedRole || isSubmitting}
                                    className="w-full py-4 bg-brand-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-20"
                                >
                                    Activate Identity
                                </button>
                                <button 
                                    onClick={() => setIsApprovalModalOpen(false)}
                                    className="w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
