import { motion, AnimatePresence } from "framer-motion";
import { X, Hammer } from "lucide-react";

interface BuilderBaseComingSoonPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuilderBaseComingSoonPopup = ({ isOpen, onClose }: BuilderBaseComingSoonPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - simplified */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75 z-[9998]"
            onClick={onClose}
          />

          {/* Main Popup Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-md md:max-w-lg"
            >
              <div
                className="relative rounded-2xl p-4 sm:p-6 md:p-8 overflow-visible"
                style={{
                  background: "linear-gradient(135deg, #5b4ab8 0%, #3d2f7a 50%, #1a1442 100%)",
                  border: "4px solid #FFD700",
                  boxShadow: "0 8px 0 #0a0515, 0 15px 40px rgba(0,0,0,0.8)",
                }}
              >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-3 -right-3 z-[10000] p-2 rounded-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-colors"
                style={{
                  boxShadow: "0 4px 0 #8b0000",
                  border: "2px solid #FFD700",
                }}
              >
                <X size={20} className="text-white" strokeWidth={3} />
              </button>

              {/* Troops - simplified with CSS animations */}
              {/* Left Troop */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="absolute -left-4 sm:-left-6 bottom-4 sm:bottom-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-[100]"
              >
                <img
                  src="/night-theme/RagedBarbarian.webp"
                  alt=""
                  className="w-full h-full object-contain animate-bounce-slow"
                loading="lazy" decoding="async" width={1024} height={1024} />
              </motion.div>

              {/* Right Troop */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="absolute -right-4 sm:-right-6 bottom-4 sm:bottom-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-[100]"
              >
                <img
                  src="/night-theme/NightWitch.webp"
                  alt=""
                  className="w-full h-full object-contain animate-bounce-slow delay-500"
                loading="lazy" decoding="async" width={1100} height={1100} />
              </motion.div>

              {/* Top Flying Troop */}
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.3 }}
                className="absolute -top-8 sm:-top-10 md:-top-12 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 z-[100]"
              >
                <img
                  src="/night-theme/DropShip.webp"
                  alt=""
                  className="w-full h-full object-contain animate-float"
                loading="lazy" decoding="async" width={1100} height={1100} />
              </motion.div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-4 py-6 pt-10">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3, type: "spring", damping: 15 }}
                  className="flex justify-center mb-3"
                >
                  <div
                    className="p-4 sm:p-5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
                      boxShadow: "0 5px 0 #B8860B, 0 8px 20px rgba(0,0,0,0.6)",
                      border: "3px solid #fff",
                    }}
                  >
                    <Hammer size={28} className="text-white sm:w-8 sm:h-8" strokeWidth={2.5} />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BUILDER BASE
                </motion.h2>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="space-y-3 px-2"
                >
                  <p
                    className="font-display text-lg sm:text-xl uppercase tracking-wide text-white font-bold"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Under Construction!
                  </p>
                  <div
                    className="max-w-sm mx-auto px-3 py-3 rounded-xl"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: "2px solid rgba(255,215,0,0.3)",
                    }}
                  >
                    <p
                      className="text-sm sm:text-base leading-relaxed font-medium text-white"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                    >
                      Our builders are working hard to prepare the hackathon listing on{" "}
                      <span className="text-yellow-300 font-bold">Devfolio</span>. Check back soon!
                    </p>
                  </div>
                </motion.div>

                {/* Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  onClick={onClose}
                  className="relative mt-4 active:scale-95 hover:scale-105 transition-transform"
                >
                  <div
                    className="px-6 sm:px-8 py-3 rounded-xl font-display text-base sm:text-lg uppercase tracking-widest font-bold text-white"
                    style={{
                      background: "linear-gradient(180deg, #4CAF50 0%, #388E3C 50%, #2E7D32 100%)",
                      border: "3px solid #FFD700",
                      boxShadow: "0 4px 0 #1B5E20, 0 6px 15px rgba(0,0,0,0.5)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    GOT IT!
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BuilderBaseComingSoonPopup;
