import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, ArrowRight, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';

const RequestTypeSelector = () => {
    const { user } = useAuth();
    
    const allTypes = [
        {
            title: 'Exceptional',
            subtitle: 'Lecture & Lab Synchronization',
            description: 'Intelligent blind booking for ad-hoc campus lectures, section adjustments, or urgent lab slot reassignments.',
            icon: BookOpen,
            path: '/request/exceptional',
            color: 'text-brand-primary',
            bg: 'bg-brand-primary/10',
            border: 'border-brand-primary/20',
            glow: 'shadow-brand-primary/20',
            restrictedRoles: [Role.SECRETARY]
        },
        {
            title: 'Multi-Purpose',
            subtitle: 'Semi-Permanent Technical Events',
            description: 'Advanced coordination for workshops, seminars, and organizational events requiring complex technical and AV configuration.',
            icon: Target,
            path: '/request/multi-purpose',
            color: 'text-brand-secondary',
            bg: 'bg-brand-secondary/10',
            border: 'border-brand-secondary/20',
            glow: 'shadow-brand-secondary/20',
            restrictedRoles: []
        }
    ];

    const types = allTypes.filter(t => !t.restrictedRoles.includes(user!.role));

    return (
        <div className="max-w-6xl mx-auto py-24 space-y-20">
            <div className="text-center space-y-4 max-w-2xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4"
                >
                    <Zap size={14} fill="currentColor" />
                    Resource Initiation
                </motion.div>
                <h1 className="text-6xl font-display font-medium tracking-tighter text-white">
                    Select <span className="text-white/20">Protocol</span>
                </h1>
                <p className="text-white/40 text-lg font-light leading-relaxed">
                    Identify the operational nature of your request to begin the authorization sequence.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 px-6">
                {types.map((type, i) => (
                    <motion.div
                        key={type.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link 
                            to={type.path}
                            className={`group relative p-12 rounded-[3.5rem] bg-white/[0.02] border ${type.border} block overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-2 hover:${type.glow}`}
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 pointer-events-none group-hover:scale-110 group-hover:rotate-12 translate-x-12 -translate-y-12">
                                <type.icon size={300} strokeWidth={1} />
                            </div>

                            <div className={`w-16 h-16 rounded-[1.5rem] ${type.bg} ${type.color} flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 shadow-lg`}>
                                <type.icon size={32} />
                            </div>
                            
                            <div className="space-y-2 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{type.subtitle}</span>
                                <h2 className="text-4xl font-display font-medium text-white group-hover:text-white transition-colors">
                                    {type.title}
                                </h2>
                            </div>

                            <p className="text-white/40 mb-12 leading-relaxed text-base font-light max-w-sm">
                                {type.description}
                            </p>

                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-all">
                                Launch Sequence <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                            </div>

                            {/* Hover Gradient Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-xl mx-auto text-center opacity-20">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic">
                   "All requests are prioritized based on academic precedence and technical infrastructure requirements."
                </p>
            </div>
        </div>
    );
};

export default RequestTypeSelector;
