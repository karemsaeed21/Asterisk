import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Calendar, 
    PlusCircle, 
    History, 
    LogOut, 
    ShieldCheck, 
    Shield,
    Users,
    Menu,
    X,
    Sparkles,
    CalendarDays,
    Bell,
    AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';

const Layout: React.FC = () => {
    const { user, logout, isAuthenticated, activeDelegation } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated && (user?.role === Role.ADMIN || user?.role === Role.BRANCH_MANAGER)) {
            const fetchCount = async () => {
                try {
                    const res = await api.get('/admin/notifications/vip');
                    setNotificationCount(res.data.notifications.length);
                } catch (err) {
                    console.error('Failed to fetch notification count');
                }
            };
            fetchCount();
            const interval = setInterval(fetchCount, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const navigationGroups = [
        {
            title: 'Core Operations',
            items: [
                { name: 'Insights', path: '/', icon: LayoutDashboard, roles: [Role.ADMIN, Role.BRANCH_MANAGER, Role.EMPLOYEE, Role.SECRETARY] },
                { name: 'Initiate Request', path: '/request/new', icon: PlusCircle, roles: [Role.EMPLOYEE, Role.SECRETARY, Role.ADMIN, Role.BRANCH_MANAGER] },
                { name: 'My History', path: '/history', icon: History, roles: [Role.EMPLOYEE, Role.SECRETARY, Role.ADMIN, Role.BRANCH_MANAGER] },
            ]
        },
        {
            title: 'Room Management',
            items: [
                { name: 'Full Schedule', path: '/schedule', icon: Calendar, roles: [Role.ADMIN, Role.BRANCH_MANAGER] },
                { name: 'Semester Schedules', path: '/admin/schedules', icon: CalendarDays, roles: [Role.ADMIN, Role.BRANCH_MANAGER] },
                { name: 'Approval Queue', path: '/admin/requests', icon: ShieldCheck, roles: [Role.ADMIN, Role.BRANCH_MANAGER] },
            ]
        },
        {
            title: 'System Access',
            items: [
                { name: 'Directory', path: '/admin/users', icon: Users, roles: [Role.ADMIN, Role.BRANCH_MANAGER] },
                { 
                    name: 'Security Logs', 
                    path: '/admin/logs', 
                    icon: Shield, 
                    roles: [Role.ADMIN, Role.BRANCH_MANAGER],
                    badge: notificationCount > 0 ? notificationCount : null
                },
                { name: 'System Config', path: '/admin/settings', icon: Shield, roles: [Role.ADMIN, Role.BRANCH_MANAGER] },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg-deep text-white flex relative overflow-hidden font-display">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[10%] w-[800px] h-[800px] bg-brand-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[800px] h-[800px] bg-brand-secondary/[0.03] rounded-full blur-[150px] pointer-events-none" />

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside 
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-[280px] bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-50 fixed inset-y-0"
                    >
                        <div className="flex items-center gap-4 mb-16 px-2 group cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-black shadow-lg shadow-white/5 transition-transform group-hover:scale-110">
                                <Sparkles size={20} fill="black" />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tighter">Asterisk</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <nav className="space-y-8">
                                {navigationGroups.map((group) => {
                                    const filteredItems = group.items.filter(item => item.roles.includes(user!.role));
                                    if (filteredItems.length === 0) return null;

                                    return (
                                        <div key={group.title} className="space-y-3">
                                            <div className="px-5 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                {group.title}
                                            </div>
                                            <div className="space-y-1">
                                                {filteredItems.map((item) => {
                                                    const isActive = location.pathname === item.path;
                                                    return (
                                                        <Link 
                                                            key={item.name}
                                                            to={item.path}
                                                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                                                                isActive 
                                                                ? 'text-white' 
                                                                : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
                                                            }`}
                                                        >
                                                            {isActive && (
                                                                <motion.div 
                                                                    layoutId="nav-active"
                                                                    className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-2xl"
                                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                                />
                                                            )}
                                                            <item.icon size={20} className={`relative z-10 transition-colors ${isActive ? 'text-brand-primary' : ''}`} />
                                                            <span className="relative z-10 font-medium text-sm tracking-tight flex-1">{item.name}</span>
                                                            {item.badge && (
                                                                <span className="relative z-10 flex items-center justify-center w-5 h-5 bg-brand-primary text-black text-[10px] font-black rounded-lg shadow-[0_0_15px_-2px_rgba(255,255,255,0.4)]">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                            <div className="px-5 py-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">
                                        {user?.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-semibold truncate text-white/90">{user?.name}</span>
                                        <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mt-0.5">{user?.role.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={logout}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400/50 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 border border-transparent hover:border-red-400/10 group"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold text-xs uppercase tracking-widest">Terminate Session</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <main className={`flex-1 transition-all duration-500 ease-[0.16, 1, 0.3, 1] ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'}`}>
                {/* Global Header Bar */}
                <div className="absolute top-8 left-8 right-8 z-[100] flex items-center justify-between pointer-events-none">
                    <div className="flex-1 flex justify-center">
                        <AnimatePresence>
                            {activeDelegation && (
                                <motion.div 
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className="px-8 py-3 bg-brand-secondary text-black rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto border border-black/10"
                                >
                                    <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
                                        <AlertTriangle size={14} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Acting as Proxy for <span className="underline decoration-2 underline-offset-4">{activeDelegation.delegatorName}</span>
                                    </span>
                                    <div className="h-4 w-px bg-black/20" />
                                    <span className="text-[10px] font-bold opacity-60 italic">Enhanced Authorization Active</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="flex items-center gap-4 pointer-events-auto">
                        {isAuthenticated && (user?.role === Role.ADMIN || user?.role === Role.BRANCH_MANAGER) && (
                        <Link 
                            to="/admin/logs"
                            className="w-14 h-14 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-brand-primary hover:border-brand-primary/30 transition-all relative group"
                        >
                            <Bell size={24} className="group-hover:rotate-12 transition-transform" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-black text-[10px] font-black rounded-lg flex items-center justify-center animate-bounce">
                                    {notificationCount}
                                </span>
                            )}
                        </Link>
                    )}
                    </div>
                </div>

                {!isSidebarOpen && (
                   <motion.button 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed top-8 left-8 w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-2xl"
                   >
                        <Menu size={20} />
                   </motion.button>
                )}

                <div className="max-w-[1400px] mx-auto p-8 lg:p-16 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
