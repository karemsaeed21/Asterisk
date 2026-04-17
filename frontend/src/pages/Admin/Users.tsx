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
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Mocking user list as we don't have a dedicated endpoint yet
                // In production: const res = await api.get('/admin/users');
                const mockUsers = [
                    { id: '1', name: 'Dr. Ahmed Khaled', employee_id: 'prof_001', role: 'ADMIN', status: 'Active' },
                    { id: '2', name: 'Eng. Sarah Yasin', employee_id: 'eng_042', role: 'BRANCH_MANAGER', status: 'Active' },
                    { id: '3', name: 'Mona Hassan', employee_id: 'sec_012', role: 'SECRETARY', status: 'Away' },
                    { id: '4', name: 'Karim Saeed', employee_id: 'emp_999', role: 'EMPLOYEE', status: 'Active' },
                ];
                setUsers(mockUsers);
            } catch (err) {
                console.error('Failed to fetch users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

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
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{user.role.replace('_', ' ')}</span>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 text-white/20 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">
                                <MoreVertical size={16} />
                            </button>
                         </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-12 rounded-[4rem] bg-white/[0.01] border border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-6">
                <Activity size={32} className="text-white/10" />
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Operational Synchronization</p>
                    <p className="text-xs text-white/10 font-medium italic">"Identity integrity is the foundation of academic resource security."</p>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
