import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CloudTransitionProps {
  isOpen: boolean;
  onComplete?: () => void;
}

const CloudTransition = ({ isOpen, onComplete }: CloudTransitionProps) => {
  const [showClouds, setShowClouds] = useState(!isOpen);

  useEffect(() => {
    if (isOpen) {
      // Delay before starting cloud animation
      const timer = setTimeout(() => {
        setShowClouds(false);
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {showClouds && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {/* Dark overlay that fades */}
          <motion.div
            className="absolute inset-0 bg-[#1a1a2e]"
            initial={{ opacity: 1 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Top clouds group */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[55%]"
            initial={{ y: 0 }}
            animate={{ y: isOpen ? "-100%" : 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Main cloud layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2d3a4a] via-[#4a5568] to-[#6b7c93]" />
            
            {/* Cloud texture overlay */}
            <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6b7c93" />
                  <stop offset="100%" stopColor="#8899aa" stopOpacity="0.8" />
                </linearGradient>
                <filter id="cloudBlur">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
              </defs>
              
              {/* Multiple cloud layers for depth */}
              <path
                d="M0,100 Q120,50 240,100 T480,100 T720,100 T960,100 T1200,100 T1440,100 L1440,200 L0,200 Z"
                fill="url(#cloudGrad1)"
                filter="url(#cloudBlur)"
              />
              <path
                d="M0,120 Q180,70 360,120 T720,120 T1080,120 T1440,120 L1440,200 L0,200 Z"
                fill="#7a8a9a"
                opacity="0.7"
              />
              <path
                d="M0,140 Q90,100 180,140 T360,140 T540,140 T720,140 T900,140 T1080,140 T1260,140 T1440,140 L1440,200 L0,200 Z"
                fill="#8899aa"
                opacity="0.5"
              />
            </svg>

            {/* Animated floating cloud puffs - Reduced count */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`top-puff-${i}`}
                className="absolute rounded-full bg-gradient-to-b from-[#8899aa] to-[#6b7c93]"
                style={{
                  width: `${100 + Math.random() * 150}px`,
                  height: `${60 + Math.random() * 80}px`,
                  bottom: `${Math.random() * 30}%`,
                  left: `${i * 18 + Math.random() * 5}%`,
                  filter: 'blur(8px)',
                  willChange: 'transform, opacity',
                }}
                animate={{
                  x: [0, 20, 0],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>

          {/* Bottom clouds group */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[55%]"
            initial={{ y: 0 }}
            animate={{ y: isOpen ? "100%" : 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Main cloud layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2d3a4a] via-[#4a5568] to-[#6b7c93]" />
            
            {/* Cloud texture overlay */}
            <svg className="absolute top-0 w-full h-48" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path
                d="M0,100 Q120,150 240,100 T480,100 T720,100 T960,100 T1200,100 T1440,100 L1440,0 L0,0 Z"
                fill="url(#cloudGrad1)"
                filter="url(#cloudBlur)"
              />
              <path
                d="M0,80 Q180,130 360,80 T720,80 T1080,80 T1440,80 L1440,0 L0,0 Z"
                fill="#7a8a9a"
                opacity="0.7"
              />
              <path
                d="M0,60 Q90,100 180,60 T360,60 T540,60 T720,60 T900,60 T1080,60 T1260,60 T1440,60 L1440,0 L0,0 Z"
                fill="#8899aa"
                opacity="0.5"
              />
            </svg>

            {/* Animated floating cloud puffs - Reduced count */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`bottom-puff-${i}`}
                className="absolute rounded-full bg-gradient-to-t from-[#8899aa] to-[#6b7c93]"
                style={{
                  width: `${100 + Math.random() * 150}px`,
                  height: `${60 + Math.random() * 80}px`,
                  top: `${Math.random() * 30}%`,
                  left: `${i * 18 + Math.random() * 5}%`,
                  filter: 'blur(8px)',
                  willChange: 'transform, opacity',
                }}
                animate={{
                  x: [0, -20, 0],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>

          {/* Center light burst when opening */}
          {isOpen && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, times: [0, 0.3, 1] }}
            >
              <div
                className="w-full h-32 bg-gradient-to-r from-transparent via-gold-coin/30 to-transparent"
                style={{ filter: 'blur(20px)' }}
              />
            </motion.div>
          )}

          {/* Dust particles during transition - Reduced count */}
          {isOpen && [...Array(10)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-gold-coin/50"
              style={{ willChange: 'transform, opacity' }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight / 2,
                opacity: 0,
              }}
              animate={{
                y: i % 2 === 0 ? -100 : window.innerHeight + 100,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1.2,
                delay: Math.random() * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default CloudTransition;
