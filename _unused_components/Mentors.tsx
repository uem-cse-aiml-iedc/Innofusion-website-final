import { memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface Mentor {
  name: string;
  image: string;
}

const mentors: Mentor[] = [
  { name: "Alik Agarwala", image: "/mentors/alik-agarwala.webp" },
  { name: "Aniket Chakraborty", image: "/mentors/aniket-chakraborty.webp" },
  { name: "Avik Agarwala", image: "/mentors/avik-agarwala.webp" },
  { name: "Daipayan Guha", image: "/mentors/daipayan-guha.webp" },
  { name: "Devesh Tulshyan", image: "/mentors/devesh-tulshyan.webp" },
  { name: "Jeevan Joshi", image: "/mentors/jeevan-joshi.webp" },
  { name: "Jyotirmoy Roy", image: "/mentors/jyotirmoy-roy.webp" },
  { name: "Mayank Kumar", image: "/mentors/mayank-kumar.webp" },
  { name: "Narendra Nath Chatterjee", image: "/mentors/narendra-nath-chatterjee.webp" },
  { name: "Oheli Das", image: "/mentors/oheli-das.webp" },
  { name: "Parichay Das", image: "/mentors/parichay-das.webp" },
  { name: "Prasun Das", image: "/mentors/prasun-das.webp" },
  { name: "Rajdeep Banerjee", image: "/mentors/rajdeep-banerjee.webp" },
  { name: "Raihan Khan", image: "/mentors/raihan-khan.webp" },
  { name: "Raj Bhattacharyya", image: "/mentors/raj-bhattacharyya.webp" },
  { name: "Sanglap Mridha", image: "/mentors/sanglap-mridha.webp" },
];

// A small rotating cast of troop badges, cycled by index so neighbouring
// cards don't repeat the same one.
const MENTOR_TROOPS = [
  "/characters/track-warden.png",
  "/characters/track-pekka.png",
  "/characters/track-barbarian.png",
  "/characters/track-wizard.png",
  "/characters/track-balloon.png",
  "/characters/track-nightwitch.png",
  "/characters/track-archer.png",
  "/characters/track-minion.png",
];

const MENTOR_ACCENTS = [
  "#eab308", // gold
  "#3b82f6", // blue
  "#a855f7", // violet
  "#f97316", // orange
  "#ec4899", // pink
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f43f5e", // rose
];

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/*
 * Hoisted to module scope (rather than declared inside Mentors) and wrapped
 * in memo, same fix applied to ClanLeaders' TeamCard: a component declared
 * inside its parent gets treated as a brand-new type on every parent
 * re-render, remounting all 16 cards and restarting their entrance
 * animation for no reason.
 */
const MentorCard = memo(({ mentor, index }: { mentor: Mentor; index: number }) => {
  const accent = MENTOR_ACCENTS[index % MENTOR_ACCENTS.length];
  const troop = MENTOR_TROOPS[index % MENTOR_TROOPS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.05, duration: 0.45 }}
      className="mentor-card relative"
      style={{ "--accent": accent, "--accent-glow": hexToRgba(accent, 0.32) } as React.CSSProperties}
    >
      <div
        className="relative rounded-2xl p-4 sm:p-5 text-center overflow-visible transition-transform duration-300"
        style={{
          background: `linear-gradient(165deg, ${hexToRgba(accent, 0.16)} 0%, rgba(255,255,255,0.03) 42%, rgba(10,10,12,0.65) 100%)`,
          border: `1px solid ${hexToRgba(accent, 0.3)}`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      >
        {/* Sheen sweep, matches Treasury/SpecialPrizes hover language */}
        <div className="mentor-sheen pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute -inset-y-full -left-1/2 w-1/3 rotate-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
          />
        </div>

        <div
          className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden"
          style={{ border: `2px solid ${hexToRgba(accent, 0.65)}`, boxShadow: `0 0 18px ${hexToRgba(accent, 0.28)}` }}
        >
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width={640}
            height={640}
          />
        </div>

        {/* Troop badge, floats gently — no rotation, per the site-wide convention */}
        <motion.img
          src={troop}
          alt=""
          aria-hidden="true"
          className="absolute -top-2.5 -right-2.5 w-8 h-8 sm:w-9 sm:h-9 object-contain"
          style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.55))" }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: (index % 5) * 0.3 }}
        />

        <h3 className="font-display text-xs sm:text-sm md:text-base text-foreground leading-tight">
          {mentor.name}
        </h3>
      </div>
    </motion.div>
  );
});
MentorCard.displayName = "MentorCard";

const Mentors = () => {
  const { isNight } = useTheme();

  // Night/Day themed characters and colors
  const floatingCharacter = "/characters/dart-goblin.webp";
  const buildingImage = "/Builder Hut.webp";
  const floatingGlow = isNight ? "rgba(139,92,246,0.6)" : "rgba(168,85,247,0.6)";
  const buildingGlow = isNight ? "rgba(139,92,246,0.6)" : "rgba(249,115,22,0.6)";
  const titleColor = isNight ? "text-purple-400" : "text-gold-coin";

  return (
    <section id="mentors" className="relative py-20 overflow-hidden">
      {/* Transparent background - uses global fixed background */}
      {!isNight && <div className="absolute inset-0 blend-y bg-grass-pattern opacity-10" />}
      <div className={`absolute inset-0 blend-y-bottom ${isNight
        ? 'bg-slate-900/50'
        : 'bg-gradient-to-b from-transparent via-dark-elixir/60 to-dark-elixir/70'}`}
      />

      {/* Night Witch / Wizard floating on left */}
      <motion.img
        src={floatingCharacter}
        alt=""
        className="absolute -left-4 top-1/2 -translate-y-1/2 h-40 object-contain opacity-40 hidden lg:block"
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 30px ${floatingGlow})` }}
      />

      {/* Wall Breaker floating on right, mirrored to face inward toward the grid */}
      <div className="absolute -right-6 top-1/3 hidden lg:block" style={{ transform: "scaleX(-1)" }}>
        <motion.img
          src="/characters/wall-breaker.webp"
          alt=""
          className="h-32 object-contain opacity-35"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 24px ${floatingGlow})` }}
        />
      </div>

      {/* O.T.T.O Hut / Builder Hut on right */}
      <motion.img
        src={buildingImage}
        alt=""
        className="absolute right-8 bottom-10 h-48 object-contain opacity-40 hidden lg:block"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 25px ${buildingGlow})` }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.img
            src={buildingImage}
            alt=""
            className="w-24 sm:w-32 md:w-40 h-auto mx-auto mb-3 sm:mb-4 object-contain"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h2 className={`font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 ${titleColor} ${isNight ? 'text-glow-purple' : 'text-glow-gold'}`}>
            MENTORS
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground">
            {isNight ? 'Night Builders Ready to Guide' : 'Master Builders Ready to Guide'}
          </p>
        </motion.div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
          {mentors.map((mentor, index) => (
            <MentorCard key={mentor.name} mentor={mentor} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        .mentor-card > div:hover {
          transform: translateY(-6px);
          border-color: var(--accent) !important;
          box-shadow: 0 14px 30px var(--accent-glow), 0 6px 18px rgba(0,0,0,0.35) !important;
        }
        .mentor-card:hover .mentor-sheen > div {
          animation: mentorSheen 0.9s ease forwards;
        }
        @keyframes mentorSheen {
          from { transform: translateX(0) rotate(12deg); }
          to { transform: translateX(420%) rotate(12deg); }
        }
      `}</style>
    </section>
  );
};

export default Mentors;
