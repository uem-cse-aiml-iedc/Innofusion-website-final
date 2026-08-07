import { motion, AnimatePresence } from "framer-motion";
import { X, Hammer, Zap } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface StartBuildingComingSoonPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartBuildingComingSoonPopup = ({ isOpen, onClose }: StartBuildingComingSoonPopupProps) => {
  const { isNight } = useTheme();

  // Choose the troop character based on theme
  const troopImage = isNight 
    ? "/night-theme/NightWitch.webp" 
    : "/Wizard.webp";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Popup Container */}
            <motion.div
              initial={{ scale: 0.5, y: 100, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, y: 100, opacity: 0, rotate: 10 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.5
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[85vw] sm:max-w-sm md:max-w-md lg:max-w-lg"
            >
              {/* Main Card */}
              <div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                  background: isNight
                    ? "linear-gradient(180deg, #3d2f6b 0%, #2a1f4d 50%, #1a1030 100%)"
                    : "linear-gradient(180deg, #8B4513 0%, #654321 50%, #3d2817 100%)",
                  border: `4px solid ${isNight ? "#5a4a8a" : "#DAA520"}`,
                  boxShadow: `
                    0 0 0 3px ${isNight ? "#2a1a4a" : "#8B6914"},
                    0 10px 40px rgba(0,0,0,0.6),
                    inset 0 2px 0 rgba(255,255,255,0.2)
                  `,
                }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: isNight
                      ? [
                          "radial-gradient(circle at 30% 50%, rgba(138,43,226,0.3) 0%, transparent 50%)",
                          "radial-gradient(circle at 70% 50%, rgba(138,43,226,0.3) 0%, transparent 50%)",
                          "radial-gradient(circle at 30% 50%, rgba(138,43,226,0.3) 0%, transparent 50%)",
                        ]
                      : [
                          "radial-gradient(circle at 30% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)",
                          "radial-gradient(circle at 70% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)",
                          "radial-gradient(circle at 30% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)",
                        ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Close Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 sm:p-2.5 rounded-full text-white pointer-events-auto cursor-pointer"
                  style={{
                    background: isNight
                      ? "linear-gradient(135deg, #6a5acd 0%, #483d8b 100%)"
                      : "linear-gradient(135deg, #CD853F 0%, #8B4513 100%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </motion.button>

                {/* Content Container */}
                <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-7">
                  {/* Troop Character with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                    className="flex justify-center mb-3 sm:mb-4"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative"
                    >
                      {/* Glow effect behind character */}
                      <motion.div
                        className="absolute inset-0 blur-xl"
                        style={{
                          background: isNight
                            ? "radial-gradient(circle, rgba(138,43,226,0.6) 0%, transparent 70%)"
                            : "radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)",
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 0.8, 0.6],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <img
                        src={troopImage}
                        alt=""
                        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-2xl"
                      loading="lazy" decoding="async" />
                      
                      {/* Sparkles around character */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                          style={{
                            background: isNight ? "#FFD700" : "#FFD700",
                            boxShadow: `0 0 10px ${isNight ? "#FFD700" : "#FFD700"}`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
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

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center space-y-1.5 sm:space-y-2 mb-4 sm:mb-5"
                  >
                    <motion.h2
                      className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider"
                      style={{
                        color: isNight ? "#FFD700" : "#FFD700",
                        textShadow: `
                          3px 3px 0 ${isNight ? "#8B008B" : "#8B4513"},
                          -1px -1px 0 rgba(0,0,0,0.5),
                          0 0 20px ${isNight ? "rgba(138,43,226,0.5)" : "rgba(255,215,0,0.5)"}
                        `,
                        WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                      }}
                      animate={{
                        textShadow: [
                          `3px 3px 0 ${isNight ? "#8B008B" : "#8B4513"}, -1px -1px 0 rgba(0,0,0,0.5), 0 0 20px ${isNight ? "rgba(138,43,226,0.5)" : "rgba(255,215,0,0.5)"}`,
                          `3px 3px 0 ${isNight ? "#8B008B" : "#8B4513"}, -1px -1px 0 rgba(0,0,0,0.5), 0 0 40px ${isNight ? "rgba(138,43,226,0.8)" : "rgba(255,215,0,0.8)"}`,
                          `3px 3px 0 ${isNight ? "#8B008B" : "#8B4513"}, -1px -1px 0 rgba(0,0,0,0.5), 0 0 20px ${isNight ? "rgba(138,43,226,0.5)" : "rgba(255,215,0,0.5)"}`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Coming Soon!
                    </motion.h2>

                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Hammer 
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                          style={{ color: isNight ? "#9370DB" : "#DAA520" }}
                        />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Zap 
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                          style={{ color: "#FFD700" }}
                        />
                      </motion.div>
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Hammer 
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                          style={{ color: isNight ? "#9370DB" : "#DAA520" }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <p 
                      className="text-center text-xs sm:text-sm md:text-base font-semibold leading-relaxed px-1 sm:px-2"
                      style={{
                        color: "#FFFFFF",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      {isNight 
                        ? "The Builder Base is upgrading! Our workshop is preparing something legendary for you."
                        : "Our troops are training for the ultimate battle! The Clan Wars arena is being prepared."
                      }
                    </p>

                    <motion.div
                      className="text-center p-2 sm:p-3 rounded-lg mx-auto max-w-xs sm:max-w-sm"
                      style={{
                        background: isNight
                          ? "rgba(138,43,226,0.2)"
                          : "rgba(255,215,0,0.2)",
                        border: `2px solid ${isNight ? "rgba(138,43,226,0.4)" : "rgba(255,215,0,0.4)"}`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 20px ${isNight ? "rgba(138,43,226,0.3)" : "rgba(255,215,0,0.3)"}`,
                          `0 0 30px ${isNight ? "rgba(138,43,226,0.5)" : "rgba(255,215,0,0.5)"}`,
                          `0 0 20px ${isNight ? "rgba(138,43,226,0.3)" : "rgba(255,215,0,0.3)"}`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <p 
                        className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wide"
                        style={{
                          color: "#FFD700",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        🛠️ Devfolio Integration in Progress 🛠️
                      </p>
                      <p 
                        className="text-xs sm:text-sm mt-2"
                        style={{
                          color: "#FFFFFF",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        Registration will open soon. Stay tuned!
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 sm:mt-5 flex justify-center"
                  >
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-display text-xs sm:text-sm md:text-base uppercase tracking-wider font-bold"
                      style={{
                        background: isNight
                          ? "linear-gradient(180deg, #6a5acd 0%, #483d8b 50%, #2e2b5f 100%)"
                          : "linear-gradient(180deg, #4CAF50 0%, #388E3C 50%, #2E7D32 100%)",
                        border: `3px solid ${isNight ? "#2a1a4a" : "#1B5E20"}`,
                        boxShadow: `
                          0 4px 0 ${isNight ? "#1a0a2a" : "#1B5E20"},
                          0 8px 20px rgba(0,0,0,0.4),
                          inset 0 2px 0 rgba(255,255,255,0.3)
                        `,
                        color: "#fff",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      Got It!
                    </motion.button>
                  </motion.div>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-30">
                  <div
                    className="w-full h-full"
                    style={{
                      background: isNight
                        ? "linear-gradient(135deg, #FFD700 0%, transparent 50%)"
                        : "linear-gradient(135deg, #FFD700 0%, transparent 50%)",
                    }}
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-30">
                  <div
                    className="w-full h-full"
                    style={{
                      background: isNight
                        ? "linear-gradient(-45deg, #FFD700 0%, transparent 50%)"
                        : "linear-gradient(-45deg, #FFD700 0%, transparent 50%)",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StartBuildingComingSoonPopup;
