import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingTips = [
  "Sharpening Swords...",
  "Feeding the Dragons...",
  "Training Elite Barbs...",
  "Collecting Dark Elixir...",
  "Upgrading Town Hall...",
  "Recruiting Champions...",
  "Preparing for War...",
  "Loading Resources...",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsReady(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background with CoC style gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, rgba(75, 119, 190, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(46, 125, 50, 0.4) 0%, transparent 40%),
            linear-gradient(180deg, #0d1b2a 0%, #1b263b 40%, #2d4a3e 100%)
          `,
        }}
      />

      {/* Animated background particles - Reduced count for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff69b4' : '#00ff88',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with shield */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8 relative"
        >
          {/* Shield badge behind logo */}
          <motion.img
            src="/ShieldClan Badge Icon.webp"
            alt=""
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 object-contain opacity-30"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Main logo text */}
          <motion.img
            src="/Clash_of_Clans_Logo_Style_Text.webp"
            alt="InnoFusion 2026"
            className="w-80 md:w-[450px] h-auto object-contain drop-shadow-2xl relative z-10"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
            }}
            animate={{
              filter: [
                'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
                'drop-shadow(0 0 50px rgba(255, 215, 0, 0.8))',
                'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Character showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-end justify-center gap-4 mb-8 h-32"
        >
          <motion.img
            src="/Barbarian.webp"
            alt=""
            className="h-24 md:h-28 object-contain"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.img
            src="/Valkyrie_Warrior_Girl_Character.webp"
            alt=""
            className="h-28 md:h-32 object-contain"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.img
            src="/ArcherQueen.webp"
            alt=""
            className="h-26 md:h-30 object-contain"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </motion.div>

        {/* Premium loading bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-80 md:w-96 mb-6 relative"
        >
          {/* Outer frame - wood style */}
          <div 
            className="relative p-1 rounded-xl"
            style={{
              background: 'linear-gradient(180deg, #5d4e37 0%, #3d2e1f 50%, #2a1f14 100%)',
              boxShadow: '0 4px 0 #1a120a, 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Inner track */}
            <div 
              className="relative h-10 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.8)',
              }}
            >
              {/* Progress fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  background: 'linear-gradient(180deg, #ffd700 0%, #ffaa00 30%, #ff8c00 70%, #cc6600 100%)',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 2px 0 rgba(255,255,255,0.4)',
                }}
              />
              
              {/* Shine effect on progress bar */}
              <motion.div
                className="absolute inset-y-0 left-0 w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Progress text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="font-display text-base text-white tracking-wider"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Decorative bolts */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-b from-[#8b7355] to-[#5d4e37] border-2 border-[#3d2e1f]" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-b from-[#8b7355] to-[#5d4e37] border-2 border-[#3d2e1f]" />
        </motion.div>

        {/* Loading tip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            {/* Resource icons */}
            <motion.img
              src="/Gold Coin Icon.webp"
              alt=""
              className="w-6 h-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <p 
              className="font-body text-lg text-[#e8d5b5] tracking-wide"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {loadingTips[tipIndex]}
            </p>
            <motion.img
              src="/Elixir Drop Icon.webp"
              alt=""
              className="w-6 h-6"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Ready indicator */}
        <AnimatePresence>
          {isReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center gap-2"
            >
              <motion.img
                src="/Gem Icon.webp"
                alt=""
                className="w-8 h-8"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span className="font-display text-gem-green text-lg tracking-wider">
                READY FOR BATTLE!
              </span>
              <motion.img
                src="/Gem Icon.webp"
                alt=""
                className="w-8 h-8"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d5a3d" stopOpacity="0" />
              <stop offset="100%" stopColor="#1a3a25" />
            </linearGradient>
          </defs>
          <path d="M0,50 Q360,20 720,50 T1440,50 L1440,100 L0,100 Z" fill="url(#groundGrad)" />
        </svg>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
