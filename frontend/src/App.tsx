import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Database, ShieldCheck, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex flex-col gap-4 text-left"
  >
    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-brand-primary">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold font-display">{title}</h3>
    <p className="text-white/60 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

function App() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Check backend connectivity
    fetch('/api/status')
      .then(res => res.json())
      .then(() => setServerStatus('connected'))
      .catch(() => setServerStatus('error'));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-2 font-display text-2xl font-bold tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">
            <Sparkles size={18} fill="black" />
          </div>
          Asterisk
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/60 hover:text-white transition-colors">Documentation</a>
          <a href="https://github.com/karemsaeed21/Asterisk" className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Github size={20} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-white/40"
          >
            Full-Stack Starter Kit
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-medium tracking-tight max-w-4xl"
          >
            Build your next <span className="text-brand-primary">vision</span> with precision.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/50 max-w-2xl"
          >
            A high-performance boilerplate featuring Vite, React, Node.js, and Firebase. 
            Engineered for speed, aesthetics, and type-safe scalability.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mt-4"
          >
            <button className="btn-primary flex items-center gap-2">
              Start Project <ExternalLink size={18} />
            </button>
            <div className="px-4 py-3 glass-card flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                serverStatus === 'connected' ? 'bg-green-400' : 
                serverStatus === 'error' ? 'bg-red-400' : 'bg-orange-400 animate-pulse'
              }`} />
              Backend: {serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1)}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Terminal} 
            title="TypeScript Core" 
            description="End-to-end type safety across your entire stack. Catch bugs early and develop with confidence."
          />
          <FeatureCard 
            icon={Database} 
            title="Firebase Power" 
            description="Real-time document storage and seamless authentication integrated into both server and client."
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Secure Backend" 
            description="Node.js Express server utilizing Firebase Admin SDK for privileged secure operations."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-white/5 flex justify-between items-center text-white/30 text-sm">
        <div>© 2026 Asterisk Template</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">License</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
