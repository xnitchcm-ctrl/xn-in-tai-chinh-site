import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Cpu, Eye } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
  key?: string;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('ĐANG KHỞI TẠO THIẾT BI BẢO MẬT...');

  useEffect(() => {
    // Fast increment simulation with realistic pacing changes (tech feeling)
    let current = 0;
    const interval = setInterval(() => {
      // Add random small increments
      current += Math.floor(Math.random() * 8) + 3;
      
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
      
      setProgress(current);

      // Pacing status text
      if (current < 25) {
        setStatusText('ĐANG THIẾT LẬP THUẬT TOÁN KODAK PROSPER...');
      } else if (current < 55) {
        setStatusText('KẾT NỐI HỆ THỐNG MÁY IN SPEEDMASTER ĐỨC...');
      } else if (current < 85) {
        setStatusText('KIỂM TRA CHỨNG CHỈ BẢO MẬT ISO 27001...');
      } else {
        setStatusText('KHỞI CHẠY KHÔNG GIAN IN TÀI CHÍNH...');
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -100,
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 bg-slate-950 z-[1000] flex flex-col items-center justify-center text-white select-none overflow-hidden"
    >
      {/* Background radial soft high-tech lighting */}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,50,115,0.25),transparent_65%)] pointer-events-none" />

      {/* Grid Pattern Layout */}
      <span className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative text-center flex flex-col items-center max-w-sm px-6">
        
        {/* Animated outer tech circle */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          
          {/* Pulsing ring decor */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-dashed border-brand-gold/30 rounded-full"
          />
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2.5 border border-brand-blue/40 rounded-full"
          />

          {/* Secure lock or shield logo indicator */}
          <div className="relative w-20 h-20 bg-brand-blue-dark/80 rounded-full flex items-center justify-center border-2 border-brand-gold shadow-[0_0_20px_rgba(220,169,42,0.15)] overflow-hidden">
            {/* Running neon laser scanning sweep inside */}
            <motion.div 
              animate={{ y: [-40, 40, -40] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-0.5 bg-brand-gold shadow-[0_0_8px_rgb(220,169,42)]"
            />
            <ShieldCheck className="w-10 h-10 text-brand-gold relative z-10" />
          </div>
        </div>

        {/* Counter Percentages UI */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-5xl font-black text-white tracking-widest flex items-baseline justify-center mb-2"
        >
          {progress}
          <span className="text-sm font-bold text-brand-gold ml-1">%</span>
        </motion.div>

        {/* Custom Progress Bar with glossy filling */}
        <div className="w-64 h-1.5 bg-slate-800/80 border border-white/5 rounded-full overflow-hidden mb-6 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-blue via-blue-500 to-brand-gold"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
          />
        </div>

        {/* System Logs status updates block */}
        <div className="h-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusText}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="font-display font-medium text-[9px] tracking-widest text-[#94a3b8] uppercase text-center"
            >
              {statusText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom Small Brand Captions */}
        <div className="absolute bottom-[-160px] flex items-center gap-2 opacity-50">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span className="font-display font-black tracking-widest text-[8px] uppercase">
            XÍ NGHIỆP IN TÀI CHÍNH TP.HCM
          </span>
        </div>

      </div>
    </motion.div>
  );
}
