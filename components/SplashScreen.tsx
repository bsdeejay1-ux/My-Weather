'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'nature' | 'transition' | 'cyberpunk'>('nature');

  useEffect(() => {
    // Stage 1: Nature background (0-2s)
    const timer1 = setTimeout(() => {
      setStage('transition');
    }, 2000);

    // Stage 2: Cyberpunk glitch & transition (2-3.5s)
    const timer2 = setTimeout(() => {
      setStage('cyberpunk');
    }, 3500);

    // End splash
    const timer3 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* 1. Anime Nature Background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: stage === 'nature' ? 1 : 0, 
          scale: stage === 'nature' ? 1 : 1.2,
          filter: stage === 'nature' ? 'brightness(1)' : 'brightness(0) contrast(150%) hue-rotate(90deg)'
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* 2. Cyberpunk Grid & Glitch (Transition) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'cyberpunk' || stage === 'transition' ? 1 : 0 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8, type: 'spring' }}
          className="relative text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] mb-4">
            MY WEATHER
          </h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 2.8, duration: 1 }}
            className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-cyan rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)] mx-auto mb-4"
          />
          <p className="font-sans text-cyber-cyan/80 tracking-[0.3em] text-sm uppercase">
            Presented by RVK EDITION
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-cyber-pink shadow-[0_0_8px_rgba(255,0,127,1)]"
              />
            ))}
          </div>
          <span className="font-mono text-xs text-cyber-cyan/50 animate-pulse">
            INITIALIZING_NEURAL_LINK...
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
