import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Flame, Shield, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PekkaWarPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

// Day theme config
const dayConfig = {
  character: '/P.E.K.K.A.webp',
  characterAlt: 'P.E.K.K.A',
  glowColor: 'from-purple-500/50',
  dropShadowColor: 'rgba(168,85,247,0.6)',
  sparkColor: 'from-pink-400',
  bubbleBg: 'from-purple-900/95 to-slate-900/95',
  bubbleBorder: 'border-purple-500',
  cornerBorder: 'border-pink-500',
  pointerColor: 'rgb(168 85 247)',
  pointerInnerColor: 'rgb(88 28 135)',
  titleColor: 'text-pink-400',
  textColor: 'text-purple-200',
  iconBg: 'from-pink-500 to-purple-600',
  dotColor: 'bg-pink-500',
};

// Night theme config (Builder Base - Super PEKKA)
const nightConfig = {
  character: '/night-theme/SuperPekka.webp',
  characterAlt: 'Super P.E.K.K.A',
  glowColor: 'from-cyan-500/50',
  dropShadowColor: 'rgba(34,211,238,0.6)',
  sparkColor: 'from-cyan-400',
  bubbleBg: 'from-slate-900/95 to-cyan-950/95',
  bubbleBorder: 'border-cyan-500',
  cornerBorder: 'border-cyan-400',
  pointerColor: 'rgb(34 211 238)',
  pointerInnerColor: 'rgb(8 51 68)',
  titleColor: 'text-cyan-400',
  textColor: 'text-cyan-200',
  iconBg: 'from-cyan-500 to-blue-600',
  dotColor: 'bg-cyan-500',
};

const PekkaWarPopup = ({ isVisible, onClose }: PekkaWarPopupProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const { isNight } = useTheme();

  const config = isNight ? nightConfig : dayConfig;

  useEffect(() => {
    if (isVisible) {
      // Show message after PEKKA appears
      const messageTimer = setTimeout(() => {
        setShowMessage(true);
      }, 500);
      
      // Auto-close popup after 3 seconds
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 3000);
      
      return () => {
        clearTimeout(messageTimer);
        clearTimeout(autoCloseTimer);
      };
    } else {
      setShowMessage(false);
    }
  }, [isVisible]);

  const handleClose = () => {
    setShowMessage(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const dayQuotes = [
    {
      title: "War is Coming!",
      message: "The battlefield awaits, Chief! 30 hour of intense coding battles lie ahead. Will your clan emerge victorious?",
      icon: Swords,
    },
    {
      title: "Prepare Your Troops!",
      message: "Gather your best coders, sharpen your algorithms, and prepare for the ultimate hackathon showdown!",
      icon: Shield,
    },
    {
      title: "Battle Stations!",
      message: "From Registration to Victory - your journey through the War Map begins here. May the best clan win!",
      icon: Flame,
    },
  ];

  const nightQuotes = [
    {
      title: "Builder Battle!",
      message: "The Super P.E.K.K.A leads the charge! 30 hour of electric innovation awaits. Power up your builds!",
      icon: Zap,
    },
    {
      title: "Upgrade Complete!",
      message: "Your Builder Base army is ready! Deploy your most advanced code and crush the competition!",
      icon: Shield,
    },
    {
      title: "Night Mode Active!",
      message: "Under the stars, the strongest builders emerge. Construct your victory path!",
      icon: Flame,
    },
  ];

  const quotes = isNight ? nightQuotes : dayQuotes;

  // Pick a random quote
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-[130px] right-2 sm:bottom-[140px] md:bottom-24 sm:right-4 md:right-20 z-[55] flex items-end gap-1.5 sm:gap-2 md:gap-3"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* Speech Bubble */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                className="relative"
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {/* Speech bubble */}
                <div className={`relative bg-gradient-to-b ${config.bubbleBg} rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-2xl border-2 sm:border-2 md:border-3 lg:border-4 ${config.bubbleBorder} min-w-[120px] sm:min-w-[150px] md:min-w-[200px] lg:min-w-[240px] max-w-[150px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] backdrop-blur-sm`}>
                  {/* Glowing border effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${isNight ? 'from-cyan-500/20 via-blue-500/20 to-cyan-500/20' : 'from-purple-500/20 via-pink-500/20 to-purple-500/20'} animate-pulse`} />
                  
                  {/* Decorative corners */}
                  <div className={`absolute -top-1 -left-1 w-3 h-3 sm:w-5 sm:h-5 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 ${config.cornerBorder} rounded-tl-lg`} />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 sm:w-5 sm:h-5 border-t-2 border-r-2 sm:border-t-4 sm:border-r-4 ${config.cornerBorder} rounded-tr-lg`} />
                  <div className={`absolute -bottom-1 -left-1 w-3 h-3 sm:w-5 sm:h-5 border-b-2 border-l-2 sm:border-b-4 sm:border-l-4 ${config.cornerBorder} rounded-bl-lg`} />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-5 sm:h-5 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 ${config.cornerBorder} rounded-br-lg`} />
                  
                  {/* Bubble pointer pointing right */}
                  <div 
                    className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: `16px solid ${config.pointerColor}`,
                    }}
                  />
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderLeft: `14px solid ${config.pointerInnerColor}`,
                      marginRight: '-14px',
                    }}
                  />

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-sm hover:from-red-600 hover:to-red-800 transition-colors shadow-lg border-2 border-red-900 z-20"
                  >
                    ✕
                  </button>

                  {/* Message content */}
                  <div className="text-center relative z-10">
                    <motion.div
                      className="flex justify-center mb-1 sm:mb-2"
                      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                    >
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br ${config.iconBg} flex items-center justify-center shadow-lg`}>
                        <quote.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                    </motion.div>
                    
                    <motion.h3 
                      className={`font-display text-[10px] sm:text-xs md:text-sm lg:text-lg ${config.titleColor} mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg`}
                      style={{ 
                        textShadow: isNight ? '0 0 20px rgba(34,211,238,0.5)' : '0 0 20px rgba(236,72,153,0.5)',
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {quote.title}
                    </motion.h3>
                    <motion.p 
                      className={`text-[8px] sm:text-[10px] md:text-xs lg:text-sm ${config.textColor} leading-relaxed`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {quote.message}
                    </motion.p>
                    
                    {/* Battle decorations */}
                    <motion.div 
                      className="flex justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${config.dotColor}`}
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PEKKA / Super PEKKA Character */}
          <motion.div
            className="relative"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-radial ${config.glowColor} via-transparent to-transparent blur-2xl scale-150`}
              animate={{
                scale: [1.5, 1.8, 1.5],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Character Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={isNight ? 'night' : 'day'}
                src={config.character}
                alt={config.characterAlt}
                className="w-16 sm:w-20 md:w-32 lg:w-40 h-auto relative z-10"
                style={{ 
                  filter: `drop-shadow(0 0 30px ${config.dropShadowColor})`,
                }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 30 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1 }}
              />
            </AnimatePresence>

            {/* Electric sparks effect */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-4 bg-gradient-to-b ${config.sparkColor} to-transparent rounded-full`}
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + (i % 2) * 20}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleY: [0.5, 1, 0.5],
                  y: [-5, 5, -5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PekkaWarPopup;
