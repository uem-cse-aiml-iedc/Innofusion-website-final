import { motion } from "framer-motion";
import { ExternalLink, Scroll, Trophy } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const PastEditions = () => {
  const { isNight } = useTheme();

  const editions = [
    {
      name: "InnoFusion 1.0",
      tagline: "Where It All Began",
      url: "https://v1.innofusion.tech/",
      year: "2024",
      description: "The first chapter of our legendary hackathon journey",
    },
    {
      name: "InnoFusion 2.0",
      tagline: "The Battle Continues",
      url: "https://v2.innofusion.tech/",
      year: "2025",
      description: "Warriors returned stronger, innovations grew bolder",
    },
  ];

  // Theme-based styling
  const characterImage = "/characters/goblin.webp";
  const trophyImage = "/TrophyStand.webp";
  const scrollGlow = isNight ? "rgba(139,92,246,0.5)" : "rgba(255,215,0,0.5)";
  const titleColor = isNight ? "text-purple-400" : "text-gold-coin";
  const cardBorder = isNight ? "border-purple-500/40" : "border-gold-coin/40";
  const cardGlow = isNight ? "hover:shadow-purple-500/30" : "hover:shadow-gold-coin/30";

  return (
    <section id="past-editions" className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background */}
      {!isNight && <div className="absolute inset-0 blend-y bg-grass-pattern opacity-10" />}
      <div className={`absolute inset-0 blend-y-bottom ${isNight
        ? 'bg-slate-900/50'
        : 'bg-gradient-to-b from-transparent via-dark-elixir/60 to-dark-elixir/70'}`}
      />

      {/* Floating Character - Left */}
      <motion.img
        src={characterImage}
        alt=""
        className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 h-28 sm:h-36 lg:h-44 object-contain opacity-30 lg:opacity-50"
        animate={{ 
          y: [-8, 8, -8],
          x: [-3, 3, -3],
        }}
        transition={{ duration: 3.5, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 20px ${scrollGlow})` }}
      />

      {/* Trophy on Right */}
      <motion.img
        src={trophyImage}
        alt=""
        className="absolute right-4 sm:right-8 bottom-8 sm:bottom-12 h-32 sm:h-40 lg:h-48 object-contain opacity-30 lg:opacity-50 hidden sm:block"
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 25px ${scrollGlow})` }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Scroll className={`w-8 h-8 sm:w-10 sm:h-10 ${titleColor}`} />
            <Trophy className={`w-6 h-6 sm:w-8 sm:h-8 ${titleColor} opacity-70`} />
          </motion.div>
          
          <h2 className={`font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 ${titleColor} ${isNight ? 'text-glow-purple' : 'text-glow-gold'}`}>
            BATTLE ARCHIVES
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto">
            {isNight ? 'Ancient scrolls from past conquests' : 'Relive the glory of past battles'}
          </p>
        </motion.div>

        {/* Edition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto px-2 sm:px-4">
          {editions.map((edition, index) => (
            <motion.a
              key={edition.name}
              href={edition.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="group block"
            >
              <div 
                className={`${isNight ? 'panel-wood-night' : 'panel-wood'} p-5 sm:p-6 md:p-8 text-center relative overflow-hidden border-2 ${cardBorder} transition-all duration-300 ${cardGlow} hover:shadow-2xl`}
              >
                {/* Year Badge */}
                <motion.div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-display ${
                    isNight 
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' 
                      : 'bg-gold-coin/30 text-gold-coin border border-gold-coin/40'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {edition.year}
                </motion.div>

                {/* Sparkle Effect */}
                <motion.div
                  className="absolute top-4 left-4 text-lg"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ✨
                </motion.div>

                {/* Edition Title */}
                <motion.h3 
                  className={`font-display text-xl sm:text-2xl md:text-3xl mb-2 ${titleColor} group-hover:scale-105 transition-transform`}
                >
                  {edition.name}
                </motion.h3>

                {/* Tagline */}
                <p className={`font-display text-sm sm:text-base mb-3 ${
                  isNight ? 'text-purple-300/80' : 'text-amber-300/90'
                }`}>
                  {edition.tagline}
                </p>

                {/* Description */}
                <p className="font-body text-xs sm:text-sm text-muted-foreground mb-4">
                  {edition.description}
                </p>

                {/* Visit Button */}
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm transition-all ${
                    isNight 
                      ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 group-hover:bg-purple-500/40' 
                      : 'bg-gold-coin/20 border border-gold-coin/50 text-gold-coin group-hover:bg-gold-coin/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span>Explore</span>
                  <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${
                  isNight ? 'bg-purple-500' : 'bg-gold-coin'
                } blur-xl pointer-events-none`} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 text-center"
        >
          <p className={`font-body text-xs sm:text-sm ${isNight ? 'text-purple-400/60' : 'text-gold-coin/60'}`}>
            🏰 From humble beginnings to legendary battles 🏰
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PastEditions;
