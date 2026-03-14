
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#030303] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-fuchsia-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-[#030303]/80 backdrop-blur-xl border-white/10 py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <motion.a 
            href="/" 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full h-full bg-[#0a0a0a] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20" />
                <Sparkles className="text-white w-5 h-5 relative z-10" />
              </div>
            </div>
            <span className="text-xl font-bold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              PersonaMorph
            </span>
          </motion.a>
          
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50"
          >
            <a href="#" className="hover:text-white transition-colors">Showcase</a>
            <a href="#" className="hover:text-white transition-colors">Technology</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <button className="relative px-5 py-2.5 text-sm font-semibold rounded-full overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
              <div className="absolute inset-0 border border-white/20 rounded-full" />
              <span className="relative text-white">Get Pro</span>
            </button>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 relative z-10 flex flex-col">
        {children}
      </main>

      <footer className="relative z-10 py-8 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-medium">
            &copy; {new Date().getFullYear()} PersonaMorph AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white/30 text-xs font-medium">
            <span>Powered by Gemini 2.5 Flash</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
