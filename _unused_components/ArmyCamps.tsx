import { motion } from "framer-motion";
import { Brain, Link, Smartphone, Shield, Cpu, Wand2, Glasses, Cloud, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Track {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  glowColor: string;
  popular?: boolean;
}

// Day tracks
const dayTracks: Track[] = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Unleash the power of intelligent systems and neural networks to solve real-world problems.",
    icon: Brain,
    glowColor: "rgba(168, 85, 247, 0.5)",

  },
  {
    id: 2,
    title: "AR & VR",
    description: "Build immersive experiences that blur the line between the digital and physical world.",
    icon: Glasses,
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    id: 3,
    title: "Cloud & Infrastructure",
    description: "Architect scalable, resilient systems that power the next generation of applications.",
    icon: Cloud,
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: 4,
    title: "Blockchain & Web3",
    description: "Decentralize the future with trustless protocols, smart contracts, and on-chain innovation.",
    icon: Link,
    glowColor: "rgba(255, 215, 0, 0.5)",
  },
  {
    id: 5,
    title: "Robotics & IoT",
    description: "Connect the physical world through intelligent devices, sensors, and autonomous systems.",
    icon: Cpu,
    glowColor: "rgba(6, 182, 212, 0.5)",
  },
  {
    id: 6,
    title: "Cybersecurity",
    description: "Fortify digital fortresses and build cutting-edge defenses against modern cyber threats.",
    icon: Shield,
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    id: 7,
    title: "Web Development",
    description: "Craft stunning, performant web experiences that engage users and push the limits of the browser.",
    icon: Globe,
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
  {
    id: 8,
    title: "App Development",
    description: "Build mobile applications that millions carry in their pocket and rely on every single day.",
    icon: Smartphone,
    glowColor: "rgba(251, 191, 36, 0.5)",
  },
  {
    id: 9,
    title: "Open Innovation",
    description: "Break the mold — any technology, any problem, any solution. Your imagination is the only limit.",
    icon: Wand2,
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
];

// Night tracks (Builder Base theme — same icons/descriptions, different glow palette)
const nightTracks: Track[] = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Unleash the power of intelligent systems and neural networks to solve real-world problems.",
    icon: Brain,
    glowColor: "rgba(139, 92, 246, 0.6)",
    popular: true,
  },
  {
    id: 2,
    title: "AR & VR",
    description: "Build immersive experiences that blur the line between the digital and physical world.",
    icon: Glasses,
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
  {
    id: 3,
    title: "Cloud & Infrastructure",
    description: "Architect scalable, resilient systems that power the next generation of applications.",
    icon: Cloud,
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: 4,
    title: "Blockchain & Web3",
    description: "Decentralize the future with trustless protocols, smart contracts, and on-chain innovation.",
    icon: Link,
    glowColor: "rgba(139, 92, 246, 0.5)",
  },
  {
    id: 5,
    title: "Robotics & IoT",
    description: "Connect the physical world through intelligent devices, sensors, and autonomous systems.",
    icon: Cpu,
    glowColor: "rgba(99, 102, 241, 0.5)",
  },
  {
    id: 6,
    title: "Cybersecurity",
    description: "Fortify digital fortresses and build cutting-edge defenses against modern cyber threats.",
    icon: Shield,
    glowColor: "rgba(6, 182, 212, 0.5)",
  },
  {
    id: 7,
    title: "Web Development",
    description: "Craft stunning, performant web experiences that engage users and push the limits of the browser.",
    icon: Globe,
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
  {
    id: 8,
    title: "App Development",
    description: "Build mobile applications that millions carry in their pocket and rely on every single day.",
    icon: Smartphone,
    glowColor: "rgba(251, 191, 36, 0.5)",
  },
  {
    id: 9,
    title: "Open Innovation",
    description: "Break the mold — any technology, any problem, any solution. Your imagination is the only limit.",
    icon: Wand2,
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
];

// ─── Corner Rivet ────────────────────────────────────────────────────────────
const Rivet = ({ position }: { position: string }) => (
  <div
    className={`absolute ${position} w-4 h-4 rounded-full`}
    style={{
      background: "radial-gradient(circle at 35% 30%, #c0c0c0, #5a5a5a)",
      border: "1.5px solid #888",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.7), 0 1px 2px rgba(255,255,255,0.1)",
    }}
  />
);

// ─── Track Card ───────────────────────────────────────────────────────────────
const TrackCard = ({ track, index, isNight }: { track: Track; index: number; isNight: boolean }) => {
  const Icon = track.icon;

  return (
    <motion.div
      key={track.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full flex flex-col"
      style={{ paddingTop: track.popular ? "20px" : "0" }}
    >


      {/* ── Card Frame ── */}
      <div
        className="relative rounded-2xl overflow-hidden flex-1 flex flex-col"
        style={{
          background: isNight
            ? "linear-gradient(180deg, #1e1630 0%, #130d20 100%)"
            : "linear-gradient(180deg, #3a2a1a 0%, #241609 100%)",
          border: "3px solid #C4920A",
          boxShadow:
            "0 6px 0 #7A5808, 0 10px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Corner Rivets */}
        <Rivet position="top-2.5 left-2.5" />
        <Rivet position="top-2.5 right-2.5" />
        <Rivet position="bottom-2.5 left-2.5" />
        <Rivet position="bottom-2.5 right-2.5" />

        {/* ── Card Content ── */}
        <div className="px-5 pt-8 pb-7 flex flex-col items-center text-center flex-1">
          {/* Large Icon Circle */}
          <div className="relative mb-5" style={{ width: "110px", height: "110px" }}>
            {/* Ambient glow behind circle */}
            <div
              className="absolute inset-0 rounded-full blur-xl scale-110 pointer-events-none"
              style={{ background: track.glowColor, opacity: 0.6 }}
            />
            {/* Gold ring + dark inner circle */}
            <motion.div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.08 }}
              style={{
                background: isNight
                  ? "radial-gradient(circle at 40% 30%, #2a1a4a 0%, #180d30 60%, #0e0820 100%)"
                  : "radial-gradient(circle at 40% 30%, #4a2060 0%, #2a1040 60%, #1a0820 100%)",
                border: "4px solid #C4920A",
                boxShadow:
                  "0 0 0 2px #8B6014, 0 0 30px rgba(196,146,10,0.35), inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              {/* Inner highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 45% 30%, rgba(255,255,255,0.18) 0%, transparent 55%)",
                }}
              />
              <Icon
                size={46}
                className="relative z-10"
                style={{
                  color: "#ffffff",
                  filter: `drop-shadow(0 0 12px ${track.glowColor})`,
                }}
              />
            </motion.div>
          </div>

          {/* Track Title — min-h keeps the gold divider at the same vertical position
               across all cards in a row, regardless of 1-line vs 2-line titles */}
          <h3
            className="font-display text-base sm:text-lg md:text-xl mb-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center"
            style={{
              color: "#f5e8d0",
              textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 20px rgba(196,146,10,0.2)",
            }}
          >
            {track.title}
          </h3>

          {/* Divider line */}
          <div
            className="w-12 h-0.5 mb-3 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #C4920A, transparent)",
            }}
          />

          {/* Description — flex-1 absorbs remaining card height so bottom
               padding stays consistent across tall and short descriptions */}
          <p
            className="font-body text-xs sm:text-sm leading-relaxed flex-1"
            style={{ color: "#a09080" }}
          >
            {track.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const ArmyCamps = () => {
  const { isNight } = useTheme();
  const tracks = isNight ? nightTracks : dayTracks;

  const leftChar = isNight ? "/night-theme/SuperPekka.webp" : "/P.E.K.K.A.webp";
  const rightChar = isNight ? "/night-theme/BoxerGiant.webp" : "/Giant.webp";

  return (
    <section id="tracks" className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${isNight ? "bg-slate-900/50" : "bg-dark-elixir/50"}`} />
      {!isNight && <div className="absolute inset-0 bg-grass-pattern opacity-10" />}

      {/* Floating characters */}
      <motion.img
        src={leftChar}
        alt=""
        className="absolute left-0 top-20 w-32 h-32 object-contain opacity-20 hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.img
        src={rightChar}
        alt=""
        className="absolute right-0 bottom-20 w-36 h-36 object-contain opacity-20 hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.img
            src="/ShieldClan Badge Icon.webp"
            alt=""
            className="w-20 sm:w-24 md:w-32 h-auto mx-auto mb-3 sm:mb-4 object-contain"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 ${isNight ? "text-purple-400 text-glow-purple" : "text-gold-coin text-glow-gold"
              }`}
          >
            {isNight ? "Builder Barracks" : "Army Camps"}
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {isNight
              ? "Choose your Builder Base troops. Each represents a path to glory."
              : "Choose your battlefield. Each track represents a different path to glory."}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 px-2 sm:px-4 [&>*:last-child]:col-span-2 [&>*:last-child]:max-w-xs [&>*:last-child]:w-full [&>*:last-child]:mx-auto [&>*:last-child]:lg:col-span-1 [&>*:last-child]:lg:max-w-none">
          {tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              index={index}
              isNight={isNight}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArmyCamps;
