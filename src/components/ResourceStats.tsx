import { motion, useInView } from "framer-motion";
import { Users, Trophy, Gem } from "lucide-react";
import { useRef } from "react";

const stats = [
  {
    label: "Registrations",
    value: "3000+",
    numericValue: 3000,
    target: 5000,
    icon: Users,
    gradient: "from-fuchsia-500 via-pink-500 to-purple-500",
    glowColor: "rgba(236,72,153,0.4)",
    textColor: "text-pink-400",
    barBg: "bg-pink-500/10",
  },
  {
    label: "Prize Pool",
    value: "30 Lakh+",
    numericValue: 30,
    target: 50,
    icon: Trophy,
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    glowColor: "rgba(245,158,11,0.4)",
    textColor: "text-amber-400",
    barBg: "bg-amber-500/10",
  },
  {
    label: "Sponsors",
    value: "26",
    numericValue: 26,
    target: 40,
    icon: Gem,
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    glowColor: "rgba(20,184,166,0.4)",
    textColor: "text-emerald-400",
    barBg: "bg-emerald-500/10",
  },
];

const AnimatedBar = ({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const percent = Math.round((stat.numericValue / stat.target) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative rounded-2xl p-5 sm:p-6 transition-all duration-300 group"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 40px ${stat.glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <stat.icon className={stat.textColor} size={22} />
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-white/50">
              {stat.label}
            </p>
            <p className={`font-heading font-semibold text-xl ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        </div>
        <span className="font-heading text-sm text-white/30">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className={`relative h-3 rounded-full ${stat.barBg} overflow-hidden`}>
        {/* Animated fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${stat.gradient}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.4, delay: index * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Glow at the tip of the bar */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            background: stat.glowColor,
            filter: "blur(6px)",
          }}
          initial={{ left: "0%" }}
          animate={isInView ? { left: `${percent}%` } : { left: "0%" }}
          transition={{ duration: 1.4, delay: index * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
};

const ResourceStats = () => {
  return (
    <section className="relative py-16 overflow-hidden" style={{ background: '#0a0a0c' }}>
      {/* Solid dark background — no blend mask so no transparent gaps */}
      <div className="absolute inset-0" style={{ background: '#0a0a0c' }} />

      {/* Wizard keeping watch */}
      <img
        src="/characters/wizard.webp"
        alt=""
        aria-hidden="true"
        className="coc-float pointer-events-none absolute -left-4 bottom-0 h-40 object-contain opacity-25 hidden lg:block"
        style={{ filter: "drop-shadow(0 0 18px rgba(59,130,246,0.35))", ["--float-dist" as string]: "8px", ["--float-dur" as string]: "4s" }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          {stats.map((stat, index) => (
            <AnimatedBar key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceStats;
