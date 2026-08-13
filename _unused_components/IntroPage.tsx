import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroPageProps {
  onEnter: () => void;
}

const IntroPage = ({ onEnter }: IntroPageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true); // Sound is ON by default
  const [showTapPrompt, setShowTapPrompt] = useState(false); // Show tap to enable sound prompt

  // Function to start audio - can be called from multiple places
  const startAudio = () => {
    if (audioRef.current && !audioStarted && isMusicEnabled) {
      audioRef.current.volume = 0.8;
      // For iOS, we need to load first
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioStarted(true);
            setShowTapPrompt(false);
          })
          .catch(() => {
            // Autoplay blocked - show tap prompt on mobile
            setShowTapPrompt(true);
          });
      }
    }
  };

  // Toggle music function
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicEnabled) {
        // Turn OFF
        audioRef.current.pause();
        setIsMusicEnabled(false);
        setShowTapPrompt(false);
      } else {
        // Turn ON
        audioRef.current.volume = 0.8;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => {
            setAudioStarted(true);
            setIsMusicEnabled(true);
            setShowTapPrompt(false);
          })
          .catch(() => {
            // Still set enabled, user tried to enable
            setIsMusicEnabled(true);
          });
      }
    } else {
      setIsMusicEnabled(!isMusicEnabled);
    }
  };

  // Handle tap anywhere to start audio (for mobile)
  const handleScreenTap = () => {
    if (!audioStarted && isMusicEnabled && audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setAudioStarted(true);
          setShowTapPrompt(false);
        })
        .catch(() => {});
    }
  };

  // Start music on first interaction
  useEffect(() => {
    // Try autoplay first (works on some browsers)
    if (isMusicEnabled) {
      startAudio();
    }

    // Fallback: play on first interaction
    const handleInteraction = () => {
      if (isMusicEnabled && audioRef.current && !audioStarted) {
        audioRef.current.volume = 0.8;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => {
            setAudioStarted(true);
            setShowTapPrompt(false);
          })
          .catch(() => {});
      }
      // Remove all listeners after first attempt
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('pointerdown', handleInteraction);
    };

    // Add listeners
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    document.addEventListener('touchend', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('pointerdown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('pointerdown', handleInteraction);
    };
  }, [audioStarted, isMusicEnabled]);

  const handleEnterBattle = () => {
    // Ensure audio is playing (important for mobile - user gesture is guaranteed here)
    if (audioRef.current && !audioStarted && isMusicEnabled) {
      audioRef.current.volume = 0.8;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setAudioStarted(true))
        .catch(() => {});
    }

    setIsExiting(true);
    setShowParticles(true);

    // Fade out intro music
    if (audioRef.current && isMusicEnabled) {
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }
      }, 50);
    }

    // Transition to main site after animation
    setTimeout(() => {
      onEnter();
    }, 1800);
  };

  // Force show cursor on intro page
  useEffect(() => {
    // Add class to body to enable cursor
    document.body.classList.add('show-cursor');
    document.body.style.cursor = 'default';
    document.documentElement.style.cursor = 'default';
    
    return () => {
      // Remove when leaving intro
      document.body.classList.remove('show-cursor');
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="intro-page fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
          style={{ cursor: 'default !important' } as React.CSSProperties}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleScreenTap}
          onTouchStart={handleScreenTap}
        >
          {/* Force cursor visibility with inline style tag */}
          <style>{`
            .intro-page, .intro-page *, body.show-cursor, body.show-cursor * {
              cursor: default !important;
            }
          `}</style>

          {/* Tap to Enable Sound Prompt - Shows on mobile when autoplay is blocked */}
          <AnimatePresence>
            {showTapPrompt && isMusicEnabled && !audioStarted && (
              <motion.div
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 sm:px-6 sm:py-3 rounded-xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(139, 105, 20, 0.95) 0%, rgba(93, 69, 16, 0.95) 100%)',
                  border: '2px solid #3D2A08',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-lg animate-pulse">🔊</span>
                  <span 
                    className="text-yellow-100 text-xs sm:text-sm font-bold"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    Tap anywhere for sound
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Intro Music - playsInline and muted initially for iOS autoplay support */}
          <audio
            ref={audioRef}
            src="/Intro/Intro.mp3"
            loop
            preload="auto"
            playsInline
            webkit-playsinline="true"
          />

          {/* Background Image - Responsive for all devices */}
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.02, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Desktop background */}
            <div 
              className="intro-bg-desktop w-full h-full hidden md:block"
              style={{
                backgroundImage: 'url("/Intro/COC_Intro.webp")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />
            {/* Mobile/Tablet background - Portrait image */}
            <div 
              className="intro-bg-mobile w-full h-full block md:hidden"
              style={{
                backgroundImage: 'url("/Intro/COC_Intro_Mobile.webp")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />
          </motion.div>

          {/* Dark background behind image for mobile letterbox */}
          <div className="absolute inset-0 bg-[#0d0d12] -z-10" />

          {/* Subtle gradient overlays for depth */}
          <div className="absolute top-0 left-0 right-0 h-[8%] bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

          {/* Premium animated fire/ember particles around edges */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  background: i % 4 === 0 ? '#ff6b35' : i % 4 === 1 ? '#ffd700' : i % 4 === 2 ? '#ff4500' : '#ffaa00',
                  left: `${Math.random() * 100}%`,
                  bottom: `${Math.random() * 40}%`,
                  filter: 'blur(1px)',
                  boxShadow: '0 0 10px currentColor',
                }}
                animate={{
                  y: [0, -150 - Math.random() * 300],
                  x: [0, (Math.random() - 0.5) * 100],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Ambient glow effects */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute left-0 bottom-0 w-1/3 h-1/2"
              style={{
                background: 'radial-gradient(ellipse at bottom left, rgba(255, 100, 0, 0.15) 0%, transparent 70%)',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute right-0 bottom-0 w-1/3 h-1/2"
              style={{
                background: 'radial-gradient(ellipse at bottom right, rgba(255, 100, 0, 0.15) 0%, transparent 70%)',
              }}
              animate={{
                opacity: [0.8, 0.5, 0.8],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* BUTTON - Using custom image with pop animation */}
          <div className="absolute bottom-[18%] sm:bottom-[14%] md:bottom-[12%] lg:bottom-[14%] xl:bottom-[15%] left-1/2 -translate-x-1/2 w-full px-2 sm:px-4 flex flex-col items-center z-50">
            {/* Click Here Indicator - COC Theme */}
            <motion.div
              className="flex flex-col items-center mb-2 sm:mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {/* Bouncing Arrow */}
              <motion.div
                className="text-amber-400 text-2xl sm:text-3xl md:text-4xl"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⚔️
              </motion.div>
              
              {/* Click Here Text - COC Style */}
              <motion.div
                className="relative"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span 
                  className="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 10px rgba(255, 200, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 140, 0, 0.5)',
                    fontFamily: '"Supercell-Magic", "Clash", sans-serif',
                  }}
                >
                  ⚡ Tap to Enter ⚡
                </span>
              </motion.div>
            </motion.div>

            <motion.button
              onClick={handleEnterBattle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group cursor-pointer select-none"
              initial={{ opacity: 0, y: 80, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: [1, 1.08, 1, 1.05, 1],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.8 },
                y: { duration: 0.8, delay: 0.8, type: "spring", stiffness: 80 },
                scale: { 
                  duration: 2.5, 
                  delay: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.5, 0.7, 1]
                },
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Outer glow pulse */}
              <motion.div
                className="absolute -inset-4 sm:-inset-6 md:-inset-8 rounded-2xl blur-2xl"
                style={{
                  background: 'radial-gradient(ellipse, rgba(255, 200, 0, 0.5) 0%, rgba(255, 140, 0, 0.3) 50%, transparent 70%)',
                }}
                animate={{
                  opacity: isHovered ? [0.8, 1, 0.8] : [0.5, 0.8, 0.5],
                  scale: isHovered ? [1, 1.2, 1] : [1, 1.15, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Ring pulse effect */}
              <motion.div
                className="absolute -inset-2 sm:-inset-3 md:-inset-4 rounded-xl border-2 border-amber-400/40"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Button Image with pop animation */}
              <motion.img
                src="/Intro/Intro_Button.webp"
                alt="Enter the Battle"
                className="w-[280px] xs:w-[320px] sm:w-[350px] md:w-[400px] lg:w-[480px] xl:w-[550px] 2xl:w-[620px] h-auto object-contain drop-shadow-2xl max-w-[95vw]"
                style={{
                  filter: isHovered 
                    ? 'drop-shadow(0 0 25px rgba(255, 200, 0, 0.7)) brightness(1.15)' 
                    : 'drop-shadow(0 0 12px rgba(255, 200, 0, 0.4))',
                }}
                animate={{
                  filter: isHovered 
                    ? ['drop-shadow(0 0 25px rgba(255, 200, 0, 0.7)) brightness(1.15)', 'drop-shadow(0 0 35px rgba(255, 200, 0, 0.9)) brightness(1.2)', 'drop-shadow(0 0 25px rgba(255, 200, 0, 0.7)) brightness(1.15)']
                    : ['drop-shadow(0 0 12px rgba(255, 200, 0, 0.4))', 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.6))', 'drop-shadow(0 0 12px rgba(255, 200, 0, 0.4))'],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          </div>

          {/* Subtle vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </motion.div>
      ) : (
        /* Epic Exit Transition Animation */
        <motion.div
          className="fixed inset-0 z-[300] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {/* Background stays visible during transition - Responsive */}
          {/* Desktop background */}
          <div 
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage: 'url("/Intro/COC_Intro.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {/* Mobile background */}
          <div 
            className="absolute inset-0 block md:hidden"
            style={{
              backgroundImage: 'url("/Intro/COC_Intro_Mobile.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Golden radial burst effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-[200vmax] h-[200vmax] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.95) 0%, rgba(255,140,0,0.8) 15%, rgba(255,69,0,0.6) 35%, transparent 60%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>

          {/* Explosion particles */}
          {showParticles && [...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: Math.random() * 25 + 8,
                height: Math.random() * 25 + 8,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                background: ['#ffd700', '#ff8c00', '#ff4500', '#fff', '#ffaa00'][Math.floor(Math.random() * 5)],
                boxShadow: '0 0 15px currentColor, 0 0 30px currentColor',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 1, 
                opacity: 1,
              }}
              animate={{ 
                x: (Math.random() - 0.5) * window.innerWidth * 2,
                y: (Math.random() - 0.5) * window.innerHeight * 2,
                scale: 0,
                opacity: 0,
                rotate: Math.random() * 1080,
              }}
              transition={{ 
                duration: 1.4 + Math.random() * 0.6,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Shockwave rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-400/50"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ 
                width: '200vmax', 
                height: '200vmax', 
                opacity: 0,
              }}
              transition={{ 
                duration: 1.2,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.15, 1] }}
          />

          {/* Final fade to reveal main content */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroPage;
