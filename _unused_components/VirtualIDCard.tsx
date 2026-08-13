import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Sparkles, ChevronLeft, ChevronRight, Shield, Zap } from "lucide-react";

// ========================================================================================
// 🎮 VIRTUAL ID CARD GENERATOR - Innofusion 3.0
// Fantasy-themed ID card generator with CoC-inspired design
// ========================================================================================

interface Character {
  id: string;
  name: string;
  title: string;
  image: string;
  color: string;
  glowColor: string;
}

const CHARACTERS: Character[] = [
  { id: "barbarian", name: "Barbarian", title: "Arena Warrior", image: "/ID/Barbarian.webp", color: "from-yellow-600 to-orange-700", glowColor: "rgba(234, 179, 8, 0.6)" },
  { id: "archer", name: "Archer", title: "Shadow Striker", image: "/ID/Archer.webp", color: "from-purple-600 to-pink-700", glowColor: "rgba(168, 85, 247, 0.6)" },
  { id: "wizard", name: "Wizard", title: "Code Sorcerer", image: "/ID/Wizard.webp", color: "from-blue-600 to-indigo-700", glowColor: "rgba(59, 130, 246, 0.6)" },
  { id: "pekka", name: "P.E.K.K.A", title: "Tech Knight", image: "/ID/Pekka.webp", color: "from-indigo-700 to-blue-900", glowColor: "rgba(99, 102, 241, 0.6)" },
  { id: "witch", name: "Witch", title: "Cyber Witch", image: "/ID/Witch.webp", color: "from-violet-700 to-purple-900", glowColor: "rgba(139, 92, 246, 0.6)" },
  { id: "wallbreaker", name: "Wall Breaker", title: "Bomb Squad", image: "/ID/WallBreaker.webp", color: "from-amber-700 to-yellow-800", glowColor: "rgba(217, 119, 6, 0.6)" },
  { id: "babydragon", name: "Baby Dragon", title: "Fire Coder", image: "/ID/BabyDragon.webp", color: "from-green-600 to-emerald-800", glowColor: "rgba(16, 185, 129, 0.6)" },
  { id: "lava", name: "Lava Hound", title: "Lava Beast", image: "/ID/Lava.webp", color: "from-red-600 to-orange-800", glowColor: "rgba(239, 68, 68, 0.6)" },
];

const generateID = () => {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `INF${digits}`;
};

// Particle component for spark effects
const SparkParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-yellow-400"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1.5, 1, 0],
      y: [0, -30 - Math.random() * 40],
      x: [(Math.random() - 0.5) * 60],
    }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  />
);

// Floating lightning bolt effect (static)
const FloatingLightning = ({ index }: { index: number }) => {
  const positions = [
    { left: "5%", top: "20%", rotate: 15 },
    { left: "90%", top: "30%", rotate: -20 },
    { left: "15%", top: "70%", rotate: 10 },
    { left: "85%", top: "60%", rotate: -15 },
    { left: "50%", top: "10%", rotate: 25 },
    { left: "70%", top: "80%", rotate: -10 },
  ];
  const pos = positions[index % positions.length];

  return (
    <div
      className="absolute pointer-events-none z-0"
      style={{ left: pos.left, top: pos.top, opacity: 0.4, transform: `rotate(${pos.rotate}deg)` }}
    >
      <Zap className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
    </div>
  );
};

// Ambient particle background (static)
const AmbientParticle = ({ index }: { index: number }) => {
  const size = Math.random() * 3 + 1;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        top: `${startY}%`,
        opacity: 0.5,
        background: index % 3 === 0
          ? "rgba(234, 179, 8, 0.6)"
          : index % 3 === 1
          ? "rgba(96, 165, 250, 0.5)"
          : "rgba(168, 85, 247, 0.5)",
      }}
    />
  );
};

const VirtualIDCard = () => {
  const [name, setName] = useState("");
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [uniqueID, setUniqueID] = useState(generateID());
  const [isGenerated, setIsGenerated] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [charScrollIndex, setCharScrollIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const coinSoundRef = useRef<HTMLAudioElement>(null);

  const visibleChars = typeof window !== 'undefined' && window.innerWidth < 400 ? 4 : 6;
  const maxScroll = Math.max(0, CHARACTERS.length - visibleChars);

  const playSound = useCallback(() => {
    if (soundEnabled && coinSoundRef.current) {
      coinSoundRef.current.currentTime = 0;
      coinSoundRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  const handleGenerate = () => {
    if (!name.trim()) return;
    setUniqueID(generateID());
    setIsGenerated(true);
    setShowSparks(true);
    playSound();
    setTimeout(() => setShowSparks(false), 1200);
  };

  const handleDownload = async () => {
    if (!cardRef.current || !isGenerated) return;
    setIsDownloading(true);

    try {
      // Wait for all fonts (including Supercell-Magic) to be fully loaded
      await document.fonts.ready;

      // Remove any 3D transforms that interfere with rendering
      const el = cardRef.current;
      const origTransform = el.style.transform;
      const origTransformStyle = el.style.transformStyle;
      const origPerspective = el.style.perspective;
      el.style.transform = "none";
      el.style.transformStyle = "flat";
      el.style.perspective = "none";

      // Small delay to let browser settle after style changes
      await new Promise((r) => setTimeout(r, 150));

      const { toPng } = await import("html-to-image");

      // Generate image with multiple attempts for font reliability
      // First call warms up the font embedding, second call renders correctly
      await toPng(el, { quality: 1, pixelRatio: 3, cacheBust: true }).catch(() => {});
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        skipAutoScale: true,
        style: {
          transform: "none",
          transformStyle: "flat",
        },
      });

      // Restore transforms
      el.style.transform = origTransform;
      el.style.transformStyle = origTransformStyle;
      el.style.perspective = origPerspective;

      const link = document.createElement("a");
      link.download = `INNOFUSION3_${name.replace(/\s+/g, "_")}_${uniqueID}.png`;
      link.href = dataUrl;
      link.click();
      playSound();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const scrollChars = (dir: "left" | "right") => {
    setCharScrollIndex((prev) =>
      dir === "left" ? Math.max(0, prev - 1) : Math.min(maxScroll, prev + 1)
    );
  };

  // Spark positions for generation effect
  const sparks = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    delay: Math.random() * 0.4,
  }));

  return (
    <section
      className="relative min-h-screen overflow-hidden py-10 sm:py-12 md:py-20 px-3 sm:px-4 md:px-6"
      style={{ background: "#0a0a0c" }}
    >
      {/* Audio */}
      <audio ref={coinSoundRef} src="/Coins.mp3" preload="auto" />

      {/*
        Base wash — deliberately NOT masked. It starts and ends on the exact
        page background (#0a0a0c) so the section has no boundary at all; the
        purple only exists as a slow swell through the middle.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0a0a0c 0%, #0a0a0c 8%, #0a090f 16%, #0b0912 24%, #0c0916 34%, #0d0a19 46%, #0c0916 58%, #0b0912 70%, #0a090f 80%, #0a0a0c 90%, #0a0a0c 100%)",
          }}
        />

        {/* Violet swell behind the card — wide and very soft, no visible rim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 40%, rgba(96,44,150,0.13) 0%, rgba(70,32,110,0.07) 38%, rgba(40,18,64,0.03) 62%, transparent 82%)",
          }}
        />

        {/* Soft side vignette only — never touches the top or bottom edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 120% at 50% 50%, transparent 45%, rgba(10,10,12,0.6) 100%)",
          }}
        />

        {/* Guarantee the first and last 90px are exactly page black */}
        <div
          className="absolute inset-x-0 top-0 h-24"
          style={{ background: "linear-gradient(to bottom, #0a0a0c 0%, rgba(10,10,12,0) 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to top, #0a0a0c 0%, rgba(10,10,12,0) 100%)" }}
        />
      </div>

      {/* Decorative layer — masked so stars / lava / gears fade before the edges */}
      <div className="absolute inset-0 z-0 blend-y">
        {/* Stars overlay */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                opacity: 0.3 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        {/* Lava cracks at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-red-900/20 to-transparent" />
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`lava-${i}`}
              className="absolute bottom-0 bg-gradient-to-t from-orange-500/30 to-transparent"
              style={{
                left: `${i * 12 + Math.random() * 5}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${40 + Math.random() * 60}px`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>

        {/* Gear decorations */}
        <div
          className="absolute -left-16 top-1/4 w-48 h-48 border-4 border-yellow-900/20 rounded-full"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-4 h-10 bg-yellow-900/20 rounded-sm"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-90px)`,
              }}
            />
          ))}
        </div>

        <div
          className="absolute -right-20 bottom-1/4 w-56 h-56 border-4 border-purple-900/15 rounded-full"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-4 h-12 bg-purple-900/15 rounded-sm"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-105px)`,
              }}
            />
          ))}
        </div>

        {/* Floating lightning effects */}
        {Array.from({ length: 6 }, (_, i) => (
          <FloatingLightning key={`lightning-${i}`} index={i} />
        ))}

        {/* Ambient particles */}
        {Array.from({ length: 25 }, (_, i) => (
          <AmbientParticle key={`particle-${i}`} index={i} />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-0 sm:px-2">
        {/* Section Title */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="font-coc text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)] mb-2 sm:mb-3 px-2"
            style={{ WebkitTextStroke: "0.5px rgba(234, 179, 8, 0.3)" }}
          >
            Generate Your Virtual ID Card!
          </motion.h2>
          <p className="text-purple-300/80 text-xs sm:text-sm md:text-base font-body max-w-lg mx-auto px-2">
            Create & Download your fantasy hacker ID for Innofusion 3.0!
          </p>
        </motion.div>

        {/* Main Content - Card Preview + Input */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
          {/* ============================================================ */}
          {/* ID CARD PREVIEW */}
          {/* ============================================================ */}
          <motion.div
            className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-sm md:max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Animated glowing border */}
            <div
              className="absolute -inset-1 rounded-2xl z-0"
              style={{
                background: "linear-gradient(145deg, #d4a017, #b8860b, #8B6914, #d4a017, #f0d060, #d4a017)",
              }}
            />

            {/* Outer glow */}
            <div
              className="absolute -inset-4 rounded-3xl z-0 opacity-30 blur-xl"
              style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.6), rgba(234,179,8,0.3), rgba(212,160,23,0.6))" }}
            />

            {/* Card itself */}
            <motion.div
              ref={cardRef}
              data-id-card
              className="relative z-10 rounded-2xl overflow-hidden"
              whileHover={{ rotateY: 3, rotateX: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              {/* Card background */}
              <div className="relative p-[3px] rounded-2xl" style={{ background: "linear-gradient(145deg, #d4a017, #b8860b, #8B6914, #d4a017, #f0d060, #d4a017, #8B6914)" }}>
                <div className="relative rounded-[13px] overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/ID/card-background.webp')" }}
                  />
                  
                  {/* Subtle vignette for depth */}
                  <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)" }} />

                  {/* Content wrapper with padding */}
                  <div className="relative p-4 sm:p-5 md:p-6">
                  
                  {/* Corner rivets */}
                  {[
                    "top-2 left-2",
                    "top-2 right-2",
                    "bottom-2 left-2",
                    "bottom-2 right-2",
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className={`absolute ${pos} w-3.5 h-3.5 rounded-full z-10`}
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #f0d060, #d4a017, #8B6914)",
                        boxShadow: "0 0 6px rgba(212,160,23,0.6), inset 0 1px 1px rgba(255,255,255,0.3)",
                        border: "1px solid rgba(184,134,11,0.7)",
                      }}
                    />
                  ))}

                  {/* Card Content Layout - VERTICAL */}
                  <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                    {/* Header: Logo + Event Name centered */}
                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 border border-yellow-600/20">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg border-2 border-yellow-400/60" style={{ background: "linear-gradient(135deg, #d4a017, #f0d060, #d4a017)" }}>
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-coc text-lg sm:text-xl md:text-2xl leading-tight tracking-wide" style={{ fontFamily: '"Supercell-Magic", "Lilita One", cursive', color: "#f0d060", textShadow: "0 0 10px rgba(240,208,96,0.5), 0 2px 4px rgba(0,0,0,0.8)" }}>
                          INNOFUSION
                        </h3>
                        <p className="font-coc text-xs sm:text-sm tracking-[0.3em]" style={{ fontFamily: '"Supercell-Magic", "Lilita One", cursive', color: "#60a5fa", textShadow: "0 0 8px rgba(96,165,250,0.5)" }}>
                          3.0
                        </p>
                      </div>
                    </div>

                    {/* Decorative separator */}
                    <div className="flex items-center gap-2 w-full max-w-[80%]">
                      <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(to right, transparent, #d4a017)" }} />
                      <div className="w-2 h-2 rotate-45 bg-yellow-500/80" />
                      <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(to left, transparent, #d4a017)" }} />
                    </div>

                    {/* Name - centered */}
                    <h2
                      className="font-coc text-2xl sm:text-3xl md:text-4xl tracking-wide uppercase text-center truncate max-w-full px-1 sm:px-2"
                      style={{ fontFamily: '"Supercell-Magic", "Lilita One", cursive', color: "#ffffff", textShadow: "0 0 15px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(234,179,8,0.2)" }}
                    >
                      {name || "YOUR NAME"}
                    </h2>

                    {/* Character Avatar - Large & centered */}
                    <div className="relative">
                      {/* Golden frame around avatar */}
                      <div className="relative p-[3px] rounded-2xl" style={{ background: "linear-gradient(135deg, #d4a017, #f0d060, #8B6914, #d4a017)" }}>
                        <motion.div
                          className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-[13px] overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, rgba(10, 15, 40, 0.95), rgba(20, 8, 40, 0.95))`,
                          }}
                        >
                          {/* Starfield inside avatar box */}
                          <div className="absolute inset-0">
                            {Array.from({ length: 20 }, (_, i) => (
                              <div
                                key={i}
                                className="absolute rounded-full bg-white/40"
                                style={{
                                  width: Math.random() * 2 + 0.5,
                                  height: Math.random() * 2 + 0.5,
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                }}
                              />
                            ))}
                          </div>

                          <img
                            src={selectedChar.image}
                            alt={selectedChar.name}
                            className="w-full h-full object-contain relative z-10 p-2"
                            crossOrigin="anonymous"
                            style={{ filter: "drop-shadow(0 0 20px rgba(234,179,8,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}
                          loading="lazy" decoding="async" />

                          {/* ID overlay on avatar */}
                          <div className="absolute bottom-2 right-2 z-20 rounded-lg px-2.5 py-1" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(15,23,42,0.8))", border: "1px solid rgba(96,165,250,0.4)", boxShadow: "0 0 10px rgba(96,165,250,0.2)" }}>
                            <p className="font-coc text-[10px] md:text-xs tracking-wider" style={{ fontFamily: '"Supercell-Magic", "Lilita One", cursive', color: "#60a5fa", textShadow: "0 0 6px rgba(96,165,250,0.6)" }}>
                              #{uniqueID}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Avatar glow */}
                      <div
                        className="absolute -inset-4 rounded-2xl blur-xl -z-10 opacity-40"
                        style={{ background: selectedChar.glowColor }}
                      />
                    </div>

                    {/* Decorative separator */}
                    <div className="flex items-center gap-2 w-full max-w-[80%]">
                      <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(to right, transparent, #d4a017)" }} />
                      <div className="w-1.5 h-1.5 rotate-45 bg-yellow-500/80" />
                      <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(to left, transparent, #d4a017)" }} />
                    </div>

                    {/* Badges row */}
                    <div className="flex items-center justify-center gap-3 sm:gap-5 w-full">
                      {/* Trophy badge */}
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-600/20">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #d4a017, #f0d060)" }}>
                          <span className="text-sm sm:text-base">🏆</span>
                        </div>
                        <div>
                          <p className="font-coc text-[9px] sm:text-[10px] md:text-[11px] tracking-wider uppercase" style={{ fontFamily: '"Supercell-Magic", "Lilita One", cursive', color: "#f0d060", textShadow: "0 0 6px rgba(240,208,96,0.4), 0 1px 3px rgba(0,0,0,0.8)" }}>
                            {selectedChar.name}
                          </p>
                          <p className="text-yellow-200/60 text-[9px] sm:text-[10px] font-body">
                            3000
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-[2px] h-8 sm:h-10 rounded-full" style={{ background: "linear-gradient(to bottom, transparent, #d4a017, transparent)" }} />

                      {/* Hacker badge */}
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-orange-600/20">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}>
                          <span className="text-sm sm:text-base">🎖️</span>
                        </div>
                        <div>
                          <p className="font-coc text-[9px] sm:text-[10px] md:text-[11px] tracking-wider uppercase" style={{ fontFamily: '"Supercell-Magic", "Lilita One", cursive', color: "#fdba74", textShadow: "0 0 6px rgba(253,186,116,0.4), 0 1px 3px rgba(0,0,0,0.8)" }}>
                            HACKER
                          </p>
                          <p className="text-orange-200/60 text-[9px] sm:text-[10px] font-body">
                            #{uniqueID}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spark effects on generation */}
                  <AnimatePresence>
                    {showSparks && (
                      <>
                        {sparks.map((spark) => (
                          <SparkParticle
                            key={spark.id}
                            delay={spark.delay}
                            x={spark.x}
                            y={spark.y}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ============================================================ */}
          {/* INPUT SECTION */}
          {/* ============================================================ */}
          <motion.div
            className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-sm md:max-w-lg space-y-4 sm:space-y-6 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Name Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="font-coc text-xs sm:text-sm md:text-base text-yellow-400/90 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Input Name:
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="Enter your warrior name..."
                  maxLength={20}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 bg-[#0d0520]/80 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl text-white font-body text-sm sm:text-base placeholder:text-purple-300/30 focus:outline-none focus:border-yellow-500/60 focus:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none group-focus-within:from-yellow-500/10 group-focus-within:to-blue-500/10 transition-all duration-300" />
              </div>
            </div>

            {/* Character Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label className="font-coc text-xs sm:text-sm md:text-base text-yellow-400/90 tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-500" />
                Choose Your Character:
              </label>

              <div className="relative">
                {/* Scroll buttons */}
                {charScrollIndex > 0 && (
                  <motion.button
                    onClick={() => scrollChars("left")}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-purple-900/80 border border-purple-400/30 hidden sm:flex items-center justify-center text-purple-300 hover:bg-purple-800 hover:border-yellow-400/50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                )}
                {charScrollIndex < maxScroll && (
                  <motion.button
                    onClick={() => scrollChars("right")}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-purple-900/80 border border-purple-400/30 hidden sm:flex items-center justify-center text-purple-300 hover:bg-purple-800 hover:border-yellow-400/50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}

                {/* Character grid - wrapping on mobile, scrollable on larger */}
                <div className="overflow-hidden px-0.5 sm:px-1">
                  <motion.div
                    className="grid grid-cols-4 gap-1.5 sm:hidden"
                  >
                    {CHARACTERS.map((char) => {
                      const isSelected = selectedChar.id === char.id;
                      return (
                        <motion.button
                          key={`mobile-${char.id}`}
                          onClick={() => {
                            setSelectedChar(char);
                            playSound();
                          }}
                          className={`relative flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-300 
                            ${isSelected
                              ? "bg-yellow-500/15 border-2 border-yellow-500/70 shadow-[0_0_10px_rgba(234,179,8,0.25)]"
                              : "bg-white/5 border-2 border-transparent"
                            }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div
                            className={`w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br ${char.color} p-0.5`}
                          >
                            <div className="w-full h-full rounded-md bg-[#0d0520]/60 flex items-center justify-center overflow-hidden">
                              <img
                                src={char.image}
                                alt={char.name}
                                className="w-full h-full object-contain drop-shadow-lg"
                                loading="lazy"
                              decoding="async" />
                            </div>
                          </div>
                          <span
                            className={`text-[8px] font-coc tracking-wide truncate w-full text-center leading-tight ${
                              isSelected ? "text-yellow-400" : "text-purple-200/70"
                            }`}
                          >
                            {char.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>

                  {/* Desktop scrollable row */}
                  <motion.div
                    className="hidden sm:flex gap-2 md:gap-3"
                    animate={{ x: -charScrollIndex * (90 + 12) }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {CHARACTERS.map((char) => {
                      const isSelected = selectedChar.id === char.id;
                      return (
                        <motion.button
                          key={char.id}
                          onClick={() => {
                            setSelectedChar(char);
                            playSound();
                          }}
                          className={`relative flex-shrink-0 w-[76px] md:w-[90px] flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 
                            ${isSelected
                              ? "bg-yellow-500/15 border-2 border-yellow-500/70 shadow-[0_0_15px_rgba(234,179,8,0.25)]"
                              : "bg-white/5 border-2 border-transparent hover:border-purple-400/30 hover:bg-white/10"
                            }`}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div
                              className="absolute -inset-0.5 rounded-xl border-2 border-yellow-400/40 -z-10"
                              style={{ boxShadow: "0 0 15px rgba(234, 179, 8, 0.3)" }}
                            />
                          )}

                          {/* Character image */}
                          <div
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gradient-to-br ${char.color} p-0.5`}
                          >
                            <div className="w-full h-full rounded-md bg-[#0d0520]/60 flex items-center justify-center overflow-hidden">
                              <img
                                src={char.image}
                                alt={char.name}
                                className="w-full h-full object-contain drop-shadow-lg"
                                loading="lazy"
                              decoding="async" />
                            </div>
                          </div>

                          {/* Name */}
                          <span
                            className={`text-[10px] md:text-[11px] font-coc tracking-wide truncate w-full text-center ${
                              isSelected ? "text-yellow-400" : "text-purple-200/70"
                            }`}
                          >
                            {char.name}
                          </span>

                          {/* Glow effect on hover */}
                          <motion.div
                            className="absolute -inset-1 rounded-xl -z-20 opacity-0 blur-md transition-opacity"
                            style={{ background: char.glowColor }}
                            whileHover={{ opacity: 0.2 }}
                          />
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!name.trim()}
                className={`flex-1 relative group font-coc text-xs sm:text-sm md:text-base tracking-wider py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl overflow-hidden transition-all duration-300
                  ${name.trim()
                    ? "text-white cursor-pointer"
                    : "text-white/30 cursor-not-allowed"
                  }`}
                whileHover={name.trim() ? { scale: 1.02 } : {}}
                whileTap={name.trim() ? { scale: 0.98 } : {}}
              >
                {/* Button background */}
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    name.trim()
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "bg-white/5 border border-white/10"
                  }`}
                />

                {/* Shimmer effect */}
                {name.trim() && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate ID Card
                </span>
              </motion.button>

              {/* Download Button */}
              <AnimatePresence>
                {isGenerated && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="relative group font-coc text-xs sm:text-sm md:text-base tracking-wider py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl text-white overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]" />

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)",
                      }}
                    />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                      {isDownloading ? "Saving..." : "Download PNG"}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Footer tagline */}
            <motion.p
              className="text-center text-purple-400/50 text-xs font-body pt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              ⚔️ Pick Your In-Game Avatar & Be the Ace Builder! ⚔️
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VirtualIDCard;
