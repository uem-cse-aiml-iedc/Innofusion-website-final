import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Zap, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface WizardArmyPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

// Day theme config (Wizard)
const dayConfig = {
  character: '/Wizard.webp',
  characterAlt: 'Wizard',
  glowColor: 'from-purple-500/50 via-indigo-500/30',
  dropShadowColor: 'rgba(129,140,248,0.6)',
  bubbleBg: 'from-indigo-900/95 to-purple-900/95',
  bubbleBorder: 'border-indigo-400',
  cornerBorder: 'border-purple-400',
  pointerColor: 'rgb(129 140 248)',
  pointerInnerColor: 'rgb(49 46 129)',
  titleColor: 'text-indigo-300',
  textColor: 'text-purple-200',
  iconBg: 'from-indigo-400 to-purple-600',
  sparkleColors: ['rgb(199,210,254)', 'rgb(196,181,253)'],
  orbGlow: 'from-purple-400 to-indigo-600',
};

// Night theme config (Night Witch)
const nightConfig = {
  character: '/night-theme/NightWitch.webp',
  characterAlt: 'Night Witch',
  glowColor: 'from-violet-500/50 via-purple-500/30',
  dropShadowColor: 'rgba(139,92,246,0.6)',
  bubbleBg: 'from-slate-900/95 to-violet-950/95',
  bubbleBorder: 'border-violet-500',
  cornerBorder: 'border-violet-400',
  pointerColor: 'rgb(139 92 246)',
  pointerInnerColor: 'rgb(30 27 75)',
  titleColor: 'text-violet-300',
  textColor: 'text-violet-200',
  iconBg: 'from-violet-400 to-purple-600',
  sparkleColors: ['rgb(196,181,253)', 'rgb(167,139,250)'],
  orbGlow: 'from-violet-400 to-purple-600',
};

const WizardArmyPopup = ({ isVisible, onClose }: WizardArmyPopupProps) => {
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
      title: "Choose Your Magic!",
      message: "AI wizardry, Blockchain sorcery, or App enchantments? Each track holds unique powers. Choose wisely, young warrior!",
      icon: Wand2,
    },
    {
      title: "Assemble Your Squad!",
      message: "From Machine Learning mages to IoT engineers - every track needs diverse talents. Build your ultimate team of 4!",
      icon: Sparkles,
    },
    {
      title: "Train Your Troops!",
      message: "Six powerful tracks await! Master one domain or combine forces. The battlefield rewards both specialists and versatile warriors!",
      icon: Zap,
    },
  ];

  const nightQuotes = [
    {
      title: "Dark Magic Awaits!",
      message: "The Night Witch summons her bats! Choose your Builder Base track and unleash devastating combinations!",
      icon: Moon,
    },
    {
      title: "Summon Your Army!",
      message: "From AI shadows to IoT specters - night troops bring unique powers. Build your nocturnal squad of 4!",
      icon: Sparkles,
    },
    {
      title: "Night Falls!",
      message: "Six dark tracks await in the Builder Base! Master the shadows and dominate the night battlefield!",
      icon: Wand2,
    },
  ];

  const quotes = isNight ? nightQuotes : dayQuotes;

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
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${isNight ? 'from-violet-500/20 via-purple-500/20 to-violet-500/20' : 'from-indigo-500/20 via-purple-500/20 to-indigo-500/20'} animate-pulse`} />
                  
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
                        textShadow: isNight ? '0 0 20px rgba(139,92,246,0.5)' : '0 0 20px rgba(129,140,248,0.5)',
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
                    
                    {/* Magic sparkles decoration */}
                    <motion.div 
                      className="flex justify-center gap-2 sm:gap-3 mt-2 sm:mt-3"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${isNight ? 'from-violet-400 to-purple-400' : 'from-indigo-400 to-purple-400'}`}
                          animate={{ 
                            scale: [1, 1.8, 1],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{ 
                            duration: 1.2, 
                            repeat: Infinity,
                            delay: i * 0.15
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wizard / Night Witch Character */}
          <motion.div
            className="relative"
            animate={{ 
              y: [0, -12, 0],
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Magic glow effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-radial ${config.glowColor} to-transparent blur-2xl scale-150`}
              animate={{
                scale: [1.5, 2, 1.5],
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
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 30 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1 }}
              />
            </AnimatePresence>

            {/* Magic sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 3) * 20}%`,
                  background: `radial-gradient(circle, ${config.sparkleColors[i % 2]} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.25,
                }}
              />
            ))}

            {/* Magic orb effect */}
            <motion.div
              className={`absolute bottom-8 left-4 w-6 h-6 rounded-full bg-gradient-to-br ${config.orbGlow}`}
              style={{
                boxShadow: isNight 
                  ? '0 0 20px rgba(139,92,246,0.8), 0 0 40px rgba(139,92,246,0.5)'
                  : '0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(129,140,248,0.5)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />

            {/* Night Witch bats (night only) */}
            {isNight && [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-3 bg-violet-900 rounded-full"
                style={{
                  left: `${60 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                animate={{
                  x: [0, 20, 0],
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WizardArmyPopup;
