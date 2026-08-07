import { useMemo } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onFindMatch: () => void;
}

const HeroSection = ({ onFindMatch }: HeroSectionProps) => {
  /*
   * Sparse ember field — deterministic positions so re-renders
   * don't cause the whole field to teleport.
   */
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 23 + 7) % 80}%`,
        size: 1.5 + ((i * 3) % 3),
        duration: 2.4 + ((i * 7) % 20) / 10,
        delay: ((i * 13) % 24) / 10,
      })),
    []
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Looping cinematic video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Vignette overlay: radial gradient + subtle blur ──
           Deep black at edges (navbar/footer), slightly transparent
           center window so the cinematic video breathes through
           without competing with the text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(10,10,12,0.35) 0%, rgba(10,10,12,0.75) 55%, rgba(10,10,12,0.92) 100%)",
        }}
      />
      {/* Extra top/bottom black bands for navbar readability and
          seamless transition into next section */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,12,0.85) 0%, transparent 18%, transparent 75%, rgba(10,10,12,1) 100%)",
        }}
      />
      {/* Subtle backdrop blur to soften explosions behind text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backdropFilter: "blur(2.5px)",
          WebkitBackdropFilter: "blur(2.5px)",
          maskImage:
            "radial-gradient(ellipse 55% 45% at 50% 48%, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 45% at 50% 48%, black 0%, transparent 100%)",
        }}
      />

      {/* ── Embers floating over the overlay ── */}
      <div aria-hidden="true" className="absolute inset-0 z-[3] pointer-events-none">
        {embers.map((ember) => (
          <motion.span
            key={ember.id}
            className="absolute rounded-full bg-amber-400/60"
            style={{
              left: ember.left,
              top: ember.top,
              width: ember.size,
              height: ember.size,
            }}
            animate={{ opacity: [0.1, 0.65, 0.1], y: [0, -18, 0] }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 px-2 sm:px-4 pb-20 md:pb-8"
        >
          {/* ── Glass pill badge ── */}
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: -28 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-3 mb-2 md:mb-3"
          >
            <div
              className="hero-glass-pill flex items-center gap-2 px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full"
            >
              <img
                src="/Gem Icon.webp"
                alt=""
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                decoding="async"
                width={320}
                height={480}
              />
              <span
                className="font-heading font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-widest whitespace-nowrap"
                style={{
                  color: "#fff4d6",
                  textShadow:
                    "0 0 14px rgba(255,210,120,0.65), 0 0 28px rgba(255,180,60,0.35), 0 1px 3px rgba(0,0,0,0.8)",
                }}
              >
                30-Hour India's Premier Software + Hardware Hackathon
              </span>
              <img
                src="/Gem Icon.webp"
                alt=""
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                decoding="async"
                width={320}
                height={480}
              />
            </div>
          </motion.div>

          {/* ── Shield Badge ── */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            className="mb-0"
          >
            <motion.img
              src="/ShieldClan Badge Icon.webp"
              alt=""
              className="w-12 h-12 md:w-14 md:h-14 mx-auto object-contain"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                filter: "drop-shadow(0 0 26px rgba(255,200,30,0.35))",
              }}
            />
          </motion.div>

          {/* ── Main Logo ── */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-2 -mt-4 md:-mt-6"
          >
            <motion.img
              src="/Clash_of_Clans_Logo_Style_Text.webp"
              alt="InnoFusion 2026"
              className="w-full max-w-[280px] md:max-w-sm lg:max-w-md mx-auto h-auto object-contain"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.6))",
              }}
            />
          </motion.div>

          {/* ── Subtitle — wide letter-spaced, metallic gold, Space Grotesk ── */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-heading font-semibold text-lg sm:text-xl md:text-2xl mb-2 uppercase"
            style={{
              color: "#e8c547",
              letterSpacing: "0.25em",
              textShadow:
                "0 0 24px rgba(232,197,71,0.35), 0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            The Clan Wars Begin
          </motion.h2>

          {/* ── Tagline — ash gray, lower hierarchy ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-body font-semibold text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-4"
            style={{
              color: "rgba(238,238,230,0.92)",
              textShadow:
                "0 0 16px rgba(232,197,71,0.3), 0 2px 6px rgba(0,0,0,0.75)",
            }}
          >
            Clash with Codes, Conquer with Vision!~
          </motion.p>

          {/* ── CTA Buttons — dark frosted glass ── */}
          <div className="relative z-100 flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <a
              href="https://innofusion-3.devfolio.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-glass-btn group relative flex items-center justify-center gap-2.5 font-heading tracking-widest uppercase overflow-hidden transition-all duration-300"
              style={{ height: "48px", width: "312px", borderRadius: "14px" }}
            >
              {/* Devfolio mark */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                fill="#3770FF"
              >
                <path d="M3.5 3h7.2c5.1 0 8.8 3.7 8.8 9s-3.7 9-8.8 9H3.5V3zm4.2 3.6v10.8h2.9c2.8 0 4.7-2.2 4.7-5.4s-1.9-5.4-4.7-5.4H7.7z" />
              </svg>
              <span className="text-white/90 text-sm">Apply with Devfolio</span>
            </a>

            <a
              href="https://discord.gg/UhjCnh9R5U"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-glass-btn group relative flex items-center justify-center gap-2.5 font-heading tracking-widest uppercase overflow-hidden transition-all duration-300"
              style={{ height: "48px", width: "312px", borderRadius: "14px" }}
            >
              {/* Discord mark */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                fill="#5865F2"
              >
                <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z" />
              </svg>
              <span className="text-white/90 text-sm">Join Discord</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom fade mask — dissolves video into dark cavern below ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[25%] z-[4] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,10,12,0.6) 40%, #0a0a0c 100%)",
        }}
      />
    </section>
  );
};

export default HeroSection;
