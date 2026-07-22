import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Printer, Layers } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
  key?: string;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('ĐANG KHỞI TẠO QUY TRÌNH HỆ THỐNG CHẤT LƯỢNG...');
  const [isFlash, setIsFlash] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Add random small increments
      current += Math.floor(Math.random() * 8) + 3;
      
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setIsFlash(true);
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 750); // Elegant delay to let the flash effect transition smoothly
      } else {
        setProgress(current);
      }
      
      // Pacing status text to reflect professional digital/offset printing
      if (current < 25) {
        setStatusText('ĐANG THIẾT LẬP THUẬT TOÁN KODAK PROSPER...');
      } else if (current < 55) {
        setStatusText('KẾT NỐI HỆ THỐNG MÁY IN SPEEDMASTER ĐỨC...');
      } else if (current < 85) {
        setStatusText('CÔNG NGHỆ IN KỸ THUẬT SỐ BIẾN ĐỔI DỮ LIỆU...');
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
      className="fixed inset-0 bg-[#123A78] z-[1000] flex flex-col items-center justify-center text-white select-none overflow-hidden"
    >
      {/* Background radial soft high-tech corporate blue lighting */}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,50,115,0.3),transparent_70%)] pointer-events-none" />

      {/* Grid Pattern Layout */}
      <span className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Yellow flash on completion */}
      <AnimatePresence>
        {isFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-[#FFD400] z-[1001] pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      <div className="relative text-center flex flex-col items-center max-w-sm px-6">
        
        {/* Animated outer printing concept rings */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          
          {/* Pulsing ring decor in CMYK spectrum */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-dashed border-[#00BCD4]/30 rounded-full"
          />
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2.5 border border-[#EC008C]/30 rounded-full"
          />

          {/* Central printing & layers icon with pulsing CMYK ink jets */}
          <div className="relative w-20 h-20 bg-brand-blue-dark/90 rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_0_20px_rgba(10,50,115,0.4)] overflow-hidden">
            
            {/* Ink Drop Glowing Dots (CMYK representative pulsing) */}
            <span className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full bg-[#00BCD4] shadow-[0_0_6px_#00BCD4] animate-pulse" />
            <span className="absolute top-2 right-6 w-1.5 h-1.5 rounded-full bg-[#EC008C] shadow-[0_0_6px_#EC008C] animate-pulse delay-200" />
            <span className="absolute bottom-2 left-1/2 -ml-0.75 w-1.5 h-1.5 rounded-full bg-[#FFD400] shadow-[0_0_6px_#FFD400] animate-pulse delay-500" />

            {/* Laser scanning sweep inside represent printing head sweep */}
            <motion.div 
              animate={{ y: [-40, 40, -40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-[#00BCD4] via-[#EC008C] to-[#FFD400] shadow-[0_0_8px_rgba(236,0,140,0.8)] z-20"
            />
            
            <Printer className="w-10 h-10 text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
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

        {/* Custom Progress Bar with CMYK Linear Gradient and glowing shadow */}
        <div className="w-64 h-2 bg-[#0F3268] border border-white/10 rounded-full overflow-hidden mb-6 relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
          <motion.div 
            className="h-full rounded-full transition-all duration-75"
            style={{
              background: 'linear-gradient(90deg, #00BCD4 0%, #EC008C 35%, #FFD400 70%, #111111 100%)',
              backgroundSize: '256px 100%', // Match parent container size so gradient tracks beautifully
              boxShadow: '0 0 10px rgba(0, 188, 212, 0.4), 0 0 15px rgba(236, 0, 140, 0.3)'
            }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
          />
        </div>

        {/* System Logs status updates block */}
        <div className="h-4 flex items-center justify-center mb-1">
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

        {/* Tech Label in Cyan and Gold */}
        <div className="text-[8px] tracking-[0.2em] font-black font-mono text-[#00BCD4] uppercase">
          CMYK DIGITAL PRINTING TECHNOLOGY
        </div>

        {/* Bottom Small Brand Captions */}
        <div className="absolute bottom-[-160px] flex items-center gap-2 opacity-60">
          <Layers className="w-3.5 h-3.5 text-brand-gold" />
          <span className="font-display font-black tracking-widest text-[8px] uppercase">
            XÍ NGHIỆP IN TÀI CHÍNH TP.HCM
          </span>
        </div>

      </div>
    </motion.div>
  );
}
