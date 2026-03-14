
import React from 'react';
import { Download, Share2, Undo2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCanvasProps {
  imageUrl: string;
  originalUrl?: string | null;
  onUndo?: () => void;
  isGenerating: boolean;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({ 
  imageUrl, 
  originalUrl, 
  onUndo,
  isGenerating 
}) => {
  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center bg-[#050505] group">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md"
          >
            {/* Premium Scanning Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            />
            
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
              <div className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-[#0a0a0a] shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 animate-spin" style={{ animationDuration: '3s' }} />
                <Sparkles className="w-6 h-6 text-white/80 animate-pulse relative z-10" />
              </div>
            </div>
            <p className="text-white/60 font-medium tracking-widest uppercase text-xs">Synthesizing Pixels...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img 
        key={imageUrl}
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: isGenerating ? 0.3 : 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        src={imageUrl} 
        alt="Transformed" 
        className="w-full h-full object-contain relative z-10"
      />

      <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-30">
        {onUndo && (
          <button 
            onClick={onUndo}
            className="p-3 bg-[#0a0a0a]/80 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-xl transition-all text-white/70 hover:text-white shadow-xl"
            title="Undo last edit"
          >
            <Undo2 size={18} />
          </button>
        )}
        <button className="p-3 bg-[#0a0a0a]/80 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-xl transition-all text-white/70 hover:text-white shadow-xl">
          <Share2 size={18} />
        </button>
        <a 
          href={imageUrl} 
          download="personamorph-result.png"
          className="p-3 bg-white text-black hover:bg-white/90 rounded-xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center"
        >
          <Download size={18} />
        </a>
      </div>

      {originalUrl && !isGenerating && (
        <div className="absolute bottom-6 left-6 flex items-center gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold text-white/50 shadow-xl">
             Original Image Preserved
           </div>
        </div>
      )}
    </div>
  );
};
