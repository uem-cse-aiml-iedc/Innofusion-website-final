import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Trophy, Gift, Gem } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface GoblinTreasuryPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

// Day theme config (Giant)
const dayConfig = {
  character: '/Giant.webp',
  characterAlt: 'Giant',
  glowColor: 'from-yellow-500/50',
  dropShadowColor: 'rgba(255,215,0,0.6)',
  bubbleBg: 'from-amber-900/95 to-yellow-900/95',
  bubbleBorder: 'border-yellow-500',
  cornerBorder: 'border-amber-400',
  pointerColor: 'rgb(234 179 8)',
  pointerInnerColor: 'rgb(120 53 15)',
  titleColor: 'text-yellow-400',
  textColor: 'text-amber-200',
  iconBg: 'from-yellow-400 to-amber-600',
  iconTextColor: 'text-amber-900',
};

// Night theme config (Boxer Giant)
const nightConfig = {
  character: '/night-theme/BoxerGiant.webp',
  characterAlt: 'Boxer Giant',
  glowColor: 'from-orange-500/50',
  dropShadowColor: 'rgba(249,115,22,0.6)',
  bubbleBg: 'from-slate-900/95 to-orange-950/95',
  bubbleBorder: 'border-orange-500',
  cornerBorder: 'border-orange-400',
  pointerColor: 'rgb(249 115 22)',
  pointerInnerColor: 'rgb(30 27 40)',
  titleColor: 'text-orange-400',
  textColor: 'text-orange-200',
  iconBg: 'from-orange-400 to-amber-600',
  iconTextColor: 'text-orange-900',
};

const GoblinTreasuryPopup = ({ isVisible, onClose }: GoblinTreasuryPopupProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const { isNight } = useTheme();

  const config = isNight ? nightConfig : dayConfig;

  useEffect(() => {
    if (isVisible) {
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
      title: "Glorious Loot Awaits!",
      message: "The Treasury overflows with gold, gems, and glory! Top clans will claim prizes worth $50,000+ in total rewards!",
      icon: Coins,
    },
    {
      title: "Riches Beyond Measure!",
      message: "From cloud credits to mentorship - our Treasury holds more than just gold. Build your future, one victory at a time!",
      icon: Trophy,
    },
    {
      title: "Claim Your Rewards!",
      message: "Trophies, swag packs, and eternal glory await the victorious! Will your clan's name be etched in history?",
      icon: Gift,
    },
  ];

  const nightQuotes = [
    {
      title: "Builder's Bounty!",
      message: "The Boxer Giant guards incredible treasures! $50,000+ in Builder Base rewards await the strongest builders!",
      icon: Gem,
    },
    {
      title: "Night Prizes!",
      message: "From exclusive dark elixir credits to Master Builder mentorship - the night treasury is overflowing!",
      icon: Trophy,
    },
    {
      title: "Victory Loot!",
      message: "Builder trophies, night swag, and legendary status await! Can your team conquer the darkness?",
      icon: Gift,
    },
  ];

  const quotes = isNight ? nightQuotes : dayQuotes;

  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-[130px] right-2 sm:bottom-[140px] md:bottom-24 sm:right-4 md:right-20 z-[55] flex flex-row-reverse items-end gap-1.5 sm:gap-2 md:gap-3"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* Giant / Boxer Giant Character */}
          <motion.div
            className="relative"
            animate={{ 
              y: [0, -8, 0],
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
                className="w-14 sm:w-18 md:w-28 lg:w-36 h-auto relative z-10"
                style={{ 
                  filter: `drop-shadow(0 0 30px ${config.dropShadowColor})`,
                }}
                initial={{ scale: 0, rotate: 30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -30 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1 }}
              />
            </AnimatePresence>

            {/* Floating coins effect */}
            {[...Array(5)].map((_, i) => (
              <motion.img
                key={i}
                src="/Gold Coin Icon.webp"
                alt=""
                className="absolute w-5 h-5"
                style={{
                  left: `${10 + i * 18}%`,
                  top: `${5 + (i % 2) * 15}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>

          {/* Speech Bubble */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                className="relative"
                initial={{ scale: 0, opacity: 0, x: -20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {/* Speech bubble */}
                <div className={`relative bg-gradient-to-b ${config.bubbleBg} rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-2xl border-2 sm:border-2 md:border-3 lg:border-4 ${config.bubbleBorder} min-w-[120px] sm:min-w-[150px] md:min-w-[200px] lg:min-w-[240px] max-w-[150px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] backdrop-blur-sm`}>
                  {/* Glowing border effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${isNight ? 'from-orange-500/20 via-amber-500/20 to-orange-500/20' : 'from-yellow-500/20 via-amber-500/20 to-yellow-500/20'} animate-pulse`} />
                  
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
                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-sm hover:from-red-600 hover:to-red-800 transition-colors shadow-lg border-2 border-red-900 z-20"
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
                        <quote.icon className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${config.iconTextColor}`} />
                      </div>
                    </motion.div>
                    
                    <motion.h3 
                      className={`font-display text-[10px] sm:text-xs md:text-sm lg:text-lg ${config.titleColor} mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg`}
                      style={{ 
                        textShadow: isNight ? '0 0 20px rgba(249,115,22,0.5)' : '0 0 20px rgba(234,179,8,0.5)',
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
                    
                    {/* Gold decoration */}
                    <motion.div 
                      className="flex justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {['/Gold Coin Icon.webp', '/Gem Icon.webp', '/Gold Coin Icon.webp'].map((src, i) => (
                        <motion.img
                          key={i}
                          src={src}
                          alt=""
                          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                          animate={{ 
                            y: [0, -5, 0],
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{ 
                            duration: 1.5, 
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoblinTreasuryPopup;
