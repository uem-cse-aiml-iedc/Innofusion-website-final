import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomePopupProps {
  onClose?: () => void;
}

/*
 * Single dark config. The cream-on-amber speech bubble the day theme used
 * (amber-100 background, amber-900 text) fought the black canvas, so the
 * surface is now the same near-black glass panel used elsewhere with a gold
 * hairline. The separate Builder Base config is gone along with the toggle.
 */
const dayConfig = {
  character: '/characters/villager.webp',
  characterAlt: '',
  glowColor: 'from-primary/25',
  dropShadow: 'drop-shadow-[0_0_18px_rgba(255,200,30,0.28)]',
  bubbleBg: 'glass',
  bubbleBorder: 'border-white/10',
  cornerBorder: 'border-primary/50',
  pointerColor: 'hsl(45 100% 55% / 0.35)',
  pointerInnerColor: 'hsl(0 0% 8%)',
  titleColor: 'text-primary',
  textColor: 'text-foreground/90',
  accentColor: 'text-primary',
  subTextColor: 'text-muted-foreground',
  shieldIcon: '/ShieldClan Badge Icon.webp',
  resources: [
    { src: '/Gold Coin Icon.webp', delay: 0 },
    { src: '/Elixir Drop Icon.webp', delay: 0.1 },
    { src: '/Gem Icon.webp', delay: 0.2 },
  ],
  greeting: 'Welcome, Chief!',
  message: 'Get ready for battle!',
};

const nightConfig = dayConfig;

const WelcomePopup = ({ onClose }: WelcomePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { isNight } = useTheme();

  const config = isNight ? nightConfig : dayConfig;

  useEffect(() => {
    // Show popup after a small delay when page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    // Auto expand after appearing
    const expandTimer = setTimeout(() => {
      setShowMessage(true);
    }, 1500);

    // Auto hide after 3 seconds (3000ms after message appears)
    const autoHideTimer = setTimeout(() => {
      setShowMessage(false);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, 4500); // 1500ms (message appears) + 3000ms (display time)

    return () => {
      clearTimeout(timer);
      clearTimeout(expandTimer);
      clearTimeout(autoHideTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setShowMessage(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-[130px] left-2 sm:bottom-[140px] md:bottom-24 sm:left-4 z-[55] flex items-end gap-1.5 sm:gap-2 md:gap-3"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* Character Container */}
          <motion.div
            className="relative"
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Character Image */}
            <motion.div
              className="relative cursor-pointer"
              onClick={() => setShowMessage(!showMessage)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect behind character */}
              <div className={`absolute inset-0 bg-gradient-radial ${config.glowColor} via-transparent to-transparent blur-xl scale-150`} />
              
              {/* Character Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={isNight ? 'night-char' : 'day-char'}
                  src={config.character}
                  alt={config.characterAlt}
                  className={`w-12 sm:w-16 md:w-24 lg:w-28 h-auto relative z-10 ${config.dropShadow}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                />
              </AnimatePresence>

              {/* Sparkle effects around character */}
              <motion.div
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-5 sm:h-5 z-20"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src="/Gem Icon.webp" alt="" className="w-full h-full" loading="lazy" decoding="async" width={320} height={480} />
              </motion.div>

              <motion.div
                className="absolute -bottom-1 -left-1 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 z-20"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 0.4, 0.8],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <img src="/Gold Coin Icon.webp" alt="" className="w-full h-full" loading="lazy" decoding="async" width={320} height={480} />
              </motion.div>
            </motion.div>
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
                <div className={`relative ${config.bubbleBg} rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-2xl border ${config.bubbleBorder} min-w-[120px] sm:min-w-[140px] md:min-w-[180px] lg:min-w-[220px] max-w-[140px] sm:max-w-[160px] md:max-w-[220px] lg:max-w-[280px]`}>
                  
                  {/* Decorative corners */}
                  <div className={`absolute -top-1 -left-1 w-3 h-3 sm:w-5 sm:h-5 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 ${config.cornerBorder} rounded-tl-lg`} />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 sm:w-5 sm:h-5 border-t-2 border-r-2 sm:border-t-4 sm:border-r-4 ${config.cornerBorder} rounded-tr-lg`} />
                  <div className={`absolute -bottom-1 -left-1 w-3 h-3 sm:w-5 sm:h-5 border-b-2 border-l-2 sm:border-b-4 sm:border-l-4 ${config.cornerBorder} rounded-bl-lg`} />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-5 sm:h-5 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 ${config.cornerBorder} rounded-br-lg`} />
                  
                  {/* Bubble pointer */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderRight: `16px solid ${config.pointerColor}`,
                    }}
                  />
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderRight: `14px solid ${config.pointerInnerColor}`,
                      marginLeft: '-14px',
                    }}
                  />

                  {/* Close button */}
                  <button type="button"
                    onClick={handleClose}
                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-sm hover:from-red-600 hover:to-red-800 transition-colors shadow-lg border-2 border-red-900 z-20"
                  >
                    ✕
                  </button>

                  {/* Message content */}
                  <div className="text-center relative z-10">
                    <motion.div
                      className="flex justify-center mb-1 sm:mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <img 
                        src={config.shieldIcon}
                        alt="" 
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 drop-shadow-lg"
                      loading="lazy" decoding="async" />
                    </motion.div>
                    
                    <motion.h3 
                      className={`font-display text-[10px] sm:text-xs md:text-sm lg:text-lg ${config.titleColor} mb-0.5 sm:mb-1 drop-shadow-sm`}
                      style={{ 
                        textShadow: isNight ? '0 0 10px rgba(147,51,234,0.5)' : '1px 1px 0 rgba(255,215,0,0.5)',
                        fontFamily: '"Supercell-Magic", "Luckiest Guy", cursive'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {config.greeting}
                    </motion.h3>
                    <motion.p 
                      className={`text-[8px] sm:text-[10px] md:text-xs lg:text-sm ${config.textColor} leading-relaxed font-medium`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Welcome to{' '}
                      <span 
                        className={`${config.accentColor} font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-base`}
                        style={{ textShadow: isNight ? '0 0 8px rgba(147,51,234,0.4)' : '1px 1px 0 rgba(0,0,0,0.2)' }}
                      >
                        InnoFusion 3.0
                      </span>
                      !<br />
                      <span className={config.subTextColor}>{config.message}</span>
                    </motion.p>
                    
                    {/* Resource icons decoration */}
                    <motion.div 
                      className="flex justify-center gap-2 sm:gap-3 mt-2 sm:mt-3"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {config.resources.map((item, i) => (
                        <motion.img
                          key={i}
                          src={item.src}
                          alt=""
                          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 drop-shadow-md"
                          animate={{ 
                            y: [0, -4, 0],
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            delay: item.delay
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

export default WelcomePopup;
