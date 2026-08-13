import { motion } from "framer-motion";
import { Home, Map, Trophy, Users, Hammer, Crown, Eye, Clock, UserCheck, Building2, Medal } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useViewCounter } from "../hooks/useViewCounter";

const staticStats = [
  { icon: Clock, value: "30", label: "HOUR HACKATHON" },
  { icon: UserCheck, value: "3000+", label: "REGISTRATIONS" },
  { icon: Building2, value: "26", label: "SPONSORS" },
  { icon: Medal, value: "Announced", label: "FINALISTS" },
];

const navButtons = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Map, label: "Timeline", href: "#timeline" },
  { icon: Trophy, label: "Prizepool", href: "#prizes" },
  { icon: Building2, label: "Sponsors", href: "#sponsors" },
  { icon: Hammer, label: "Mentors", href: "#mentors" },
  { icon: Users, label: "Crew", href: "#crew" },
];

const StorySection = () => {
  const { isNight } = useTheme();
  const { views, loading } = useViewCounter();

  // Combine live views with static stats
  const stats = [
    { icon: Eye, value: loading ? "..." : (views?.toLocaleString() || "0"), label: "VIEWS" },
    ...staticStats,
  ];

  // Theme-based character
  const characterImage = "/characters/archer.webp";
  const characterAlt = "Archer Queen";
  const glowColor = isNight ? "from-purple-500/30 via-cyan-500/20" : "from-elixir-pink/30 via-purple-500/20";
  const particleColor = isNight ? "bg-purple-500" : "bg-elixir-pink";
  const dropShadow = isNight ? "drop-shadow(0 0 30px rgba(147,51,234,0.5))" : "drop-shadow(0 0 30px rgba(168,85,247,0.5))";

  return (
    <section className="relative py-16 overflow-hidden" style={{ background: '#0a0a0c' }}>
      {/* Background — smooth 24-bit gradient from page black into WarMap's warm brown cavern */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0a0a0c 0%, #0a0a0c 30%, #0e0c09 50%, #131008 70%, #1a1207 100%)',
        }}
      />

      {/* Decorative elements */}
      <motion.div
        className={`absolute top-20 left-10 w-32 h-32 rounded-full ${isNight ? 'bg-purple-500/10' : 'bg-elixir-pink/10'} blur-3xl`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className={`absolute bottom-20 right-20 w-40 h-40 rounded-full ${isNight ? 'bg-cyan-500/10' : 'bg-gold-coin/10'} blur-3xl`}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Stats Marquee — infinite right-to-left scroll */}
        <div className="mb-8 sm:mb-12 overflow-hidden relative">
          {/* Left/right fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10" style={{ background: 'linear-gradient(to right, hsl(30 8% 5%), transparent)' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10" style={{ background: 'linear-gradient(to left, hsl(30 8% 5%), transparent)' }} />

          <motion.div
            className="flex w-max gap-6 sm:gap-10 md:gap-14 py-3 sm:py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { duration: 22, repeat: Infinity, ease: "linear" } }}
          >
            {/* Duplicate the stats twice for seamless loop */}
            {[...stats, ...stats].map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="flex items-center gap-2 sm:gap-3 shrink-0"
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg ${isNight ? 'bg-purple-900/50 border-purple-500/30' : 'bg-dark-elixir/50 border-gold-coin/30'} flex items-center justify-center border`}>
                  <stat.icon size={16} className={isNight ? 'text-purple-400' : 'text-gold-coin'} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-display text-lg sm:text-xl md:text-2xl ${isNight ? 'text-purple-400' : 'text-gold-coin'}`}>{stat.value}</span>
                  <span className="font-body text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                </div>

                {/* Diamond separator */}
                <span className={`ml-4 sm:ml-6 text-xs ${isNight ? 'text-purple-500/50' : 'text-gold-coin/40'}`}>&#9670;</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 px-2 sm:px-0"
          >
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6">
              <span className="text-foreground">The Story of the </span>
              <span className={`${isNight ? 'text-purple-400' : 'text-gold-coin'} text-glow-gold`}>Arena</span>
            </h2>

            <div className="space-y-3 sm:space-y-4 font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                <span className={`${isNight ? 'text-purple-400' : 'text-gold-coin'} font-semibold`}>InnoFusion</span> is a 30-hour hackathon hosted by the{" "}
                <span className="text-elixir-pink">University of Engineering and Management (UEM), Kolkata</span>,
                bringing students from across the country together to devise innovative solutions for real-world problems.
                This event provides a collaborative space for students to showcase their skills, gain hands-on experience
                with new technologies, and create projects with societal impact.
              </p>

              <p>
                Established in 2014 and located in New Town, Kolkata, UEM offers students significant industry exposure
                due to its proximity to top corporates and the Netaji Subhash International Airport. Ranked among{" "}
                <span className="text-gem-green font-semibold">India's top 10 institutes</span> by the NPTEL program,
                the IEM UEM group is recognized for its industry-focused education, fostering a culture of innovation,
                discipline, and excellence. With robust placement support, the group ensures promising career starts,
                consistently securing 1 to 2 job offers per student.
              </p>
            </div>

            {/* Decorative divider */}
            <motion.div
              className="mt-6 h-1 bg-gradient-to-r from-gold-coin via-elixir-pink to-gem-green rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Character Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Glow effect behind character */}
              <motion.div
                className={`absolute inset-0 bg-gradient-radial ${glowColor} to-transparent blur-3xl`}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Character - Archer Queen. Reacts on hover instead of sitting perfectly still. */}
              <motion.img
                src={characterImage}
                alt={characterAlt}
                className="relative z-10 h-48 sm:h-60 md:h-72 lg:h-96 object-contain cursor-default"
                animate={{
                  y: [-5, 5, -5],
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: dropShadow }}
              />

              {/* Pinned caption, taped on at a slight angle rather than aligned */}
              <span className="pin-tag hidden sm:inline-block absolute top-2 -right-6 rotate-6 z-20 whitespace-nowrap">
                Meet the Archer Queen
              </span>

              {/* Floating particles around character */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${particleColor}`}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
