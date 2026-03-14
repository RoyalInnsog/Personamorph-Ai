
import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { ImageCanvas } from './components/ImageCanvas';
import { GeminiService } from './services/geminiService';
import { ImageState, GenerationStatus } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  UserCircle2, 
  Wand2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  X,
  ImageIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageState>({
    original: null,
    current: null,
    history: []
  });

  const [status, setStatus] = useState<GenerationStatus>({
    loading: false,
    error: null,
    message: ''
  });

  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages({
          original: result,
          current: result,
          history: []
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFemaleVersion = async () => {
    if (!images.original) return;
    
    setStatus({ loading: true, error: null, message: 'Analyzing facial features...' });
    try {
      const result = await GeminiService.generateFemaleVersion(images.original);
      setImages(prev => ({
        ...prev,
        current: result,
        history: [prev.current!, ...prev.history]
      }));
      setStatus({ loading: false, error: null, message: 'Transformation complete!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, error: err.message || "Failed to generate image", message: '' });
    }
  };

  const generateMaleVersion = async () => {
    if (!images.original) return;
    
    setStatus({ loading: true, error: null, message: 'Analyzing facial features...' });
    try {
      const result = await GeminiService.generateMaleVersion(images.original);
      setImages(prev => ({
        ...prev,
        current: result,
        history: [prev.current!, ...prev.history]
      }));
      setStatus({ loading: false, error: null, message: 'Transformation complete!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, error: err.message || "Failed to generate image", message: '' });
    }
  };

  const handleCustomEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !images.current) return;

    setStatus({ loading: true, error: null, message: 'Applying magic...' });
    try {
      const result = await GeminiService.editImage(images.current, prompt);
      setImages(prev => ({
        ...prev,
        current: result,
        history: [prev.current!, ...prev.history]
      }));
      setPrompt('');
      setStatus({ loading: false, error: null, message: 'Magic applied!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, error: err.message || "Failed to edit image", message: '' });
    }
  };

  const undoLastAction = () => {
    if (images.history.length === 0) return;
    const newHistory = [...images.history];
    const previous = newHistory.shift();
    setImages(prev => ({
      ...prev,
      current: previous || prev.original,
      history: newHistory
    }));
  };

  const reset = () => {
    setImages({ original: null, current: null, history: [] });
    setStatus({ loading: false, error: null, message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center w-full min-h-[80vh] justify-center">
        
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!images.original && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8 max-w-3xl w-full relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-4"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Powered by Gemini 2.5 Flash</span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter font-heading leading-[1.1]">
                Reimagine <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                  Every Persona
                </span>
              </h1>
              <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                Upload a photo and instantly generate its opposite gender counterpart or use natural language to edit textures, backgrounds, and styles with unprecedented realism.
              </p>
              
              <motion.div 
                className="pt-10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all flex items-center gap-3 mx-auto shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10 text-lg">Start with a Photo</span>
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                  />
                </button>
                <p className="mt-6 text-white/30 text-xs uppercase tracking-widest font-medium">
                  High-res PNG, JPG or WebP supported
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Interface */}
        <AnimatePresence>
          {images.original && (
            <motion.div 
              key="editor"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Left Column: Canvas */}
              <motion.div variants={itemVariants} className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">Studio Workspace</span>
                  </div>
                  <button 
                    onClick={reset}
                    className="text-xs font-medium text-white/40 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
                  >
                    <X size={14} /> Close Session
                  </button>
                </div>

                <div className="relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-black/50 group">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none z-10" />
                  <ImageCanvas 
                    imageUrl={images.current!} 
                    originalUrl={images.original}
                    isGenerating={status.loading}
                    onUndo={images.history.length > 0 ? undoLastAction : undefined}
                  />
                </div>
              </motion.div>

              {/* Right Column: Controls */}
              <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                
                {/* Primary Action: Identity Shift */}
                <div className="relative bg-[#0a0a0a]/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                        <UserCircle2 className="text-purple-400 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white/90 tracking-tight">Identity Shift</h3>
                        <p className="text-xs text-white/40 font-medium">Neural gender transformation</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/50 mb-8 leading-relaxed font-light">
                      Transform this person into their opposite gender equivalent. This fully alters the anatomy, including hair, eyes, cheeks, neck, chest, shoulders, hands, and fingers to match the target genetics.
                    </p>

                    <div className="flex flex-col gap-4">
                      <button 
                        disabled={status.loading}
                        onClick={generateFemaleVersion}
                        className="relative w-full py-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10 overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        {status.loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-pink-400 relative z-10" />
                        )}
                        <span className="relative z-10 text-white/90">Transform to Female</span>
                      </button>

                      <button 
                        disabled={status.loading}
                        onClick={generateMaleVersion}
                        className="relative w-full py-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10 overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        {status.loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-blue-400 relative z-10" />
                        )}
                        <span className="relative z-10 text-white/90">Transform to Male</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Action: AI Prompt Edit */}
                <div className="relative bg-[#0a0a0a]/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                        <Wand2 className="text-blue-400 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white/90 tracking-tight">Neural Instruction</h3>
                        <p className="text-xs text-white/40 font-medium">Custom text-to-image edit</p>
                      </div>
                    </div>

                    <form onSubmit={handleCustomEdit} className="space-y-5">
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
                        <textarea 
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g. 'Add a cinematic neon rim light', 'Make it look like a renaissance oil painting'"
                          className="relative w-full h-32 bg-[#030303] border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-white/20 resize-none placeholder:text-white/20 text-white/80 shadow-inner"
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] text-white/20 font-mono uppercase tracking-widest">
                          Gemini 2.5
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={status.loading || !prompt.trim()}
                        className="w-full py-4 bg-white text-black disabled:bg-white/10 disabled:text-white/30 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-white/20"
                      >
                        Execute Instruction
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Status & Messages */}
                <AnimatePresence>
                  {status.error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4 items-start backdrop-blur-md"
                    >
                      <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                      <div className="text-sm text-red-200/80 leading-relaxed">
                        <span className="font-bold text-red-400 block mb-1 tracking-tight">Processing Error</span>
                        {status.error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {status.message && !status.error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-2"
                    >
                      <p className="text-xs font-bold text-white/30 tracking-widest uppercase flex items-center justify-center gap-2">
                        {status.loading && <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-ping" />}
                        {status.message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default App;
