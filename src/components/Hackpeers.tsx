import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Person, PersonCard, PERSON_CARD_HOVER_CSS } from "@/components/PersonCard";

/*
 * Hackpeers — split out of the Mentors roster.
 *
 * Same portrait-tile visual language as Mentors/Judges (shared PersonCard),
 * themed toward the energetic peer-support crowd rather than the senior
 * mentor/judge tiers.
 */

const HACKPEERS: (Person & { troop: string })[] = [
  {
    name: "Oheli Das",
    designation: "3x Hackathon Winner",
    image: "/mentors/oheli-das.webp",
    gender: "f",
    imagePosition: "68% 50%",
    troop: "/characters/track-archer.png",
  },
  {
    name: "Mayank Kumar",
    designation: "5x Hackathon Winner",
    image: "/mentors/mayank-kumar.webp",
    gender: "m",
    troop: "/characters/track-wizard.png",
  },
];

const Hackpeers = () => {
  const { isNight } = useTheme();
  const scrollGlow = isNight ? "rgba(139,92,246,0.5)" : "rgba(255,215,0,0.5)";
  const titleColor = isNight ? "text-purple-400" : "text-gold-coin";

  return (
    <section id="hackpeers" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 blend-y-bottom bg-gradient-to-b from-transparent via-dark-elixir/60 to-dark-elixir/70" />

      {/* Barbarian charging in, left gutter */}
      <img
        src="/characters/barbarian.webp"
        alt=""
        aria-hidden="true"
        className="coc-float pointer-events-none absolute -left-4 top-1/3 hidden h-40 object-contain opacity-40 lg:block"
        style={{ filter: `drop-shadow(0 0 30px ${scrollGlow})`, ["--float-dist" as string]: "12px", ["--float-dur" as string]: "4s" }}
      />

      {/* Archer on the right, mirrored via a static wrapper */}
      <div className="pointer-events-none absolute -right-4 top-1/2 hidden lg:block" style={{ transform: "scaleX(-1)" }}>
        <img
          src="/characters/archer.webp"
          alt=""
          aria-hidden="true"
          className="coc-float h-36 object-contain opacity-35"
          style={{ filter: `drop-shadow(0 0 24px ${scrollGlow})`, ["--float-dist" as string]: "10px", ["--float-dur" as string]: "4.6s" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center sm:mb-14"
        >
          {/* Builder Hut — matches the building-icon pattern used by Judges
              (Clan Castle) and Mentors (Laboratory). */}
          <img
            src="/Builder Hut.webp"
            alt=""
            aria-hidden="true"
            className="coc-float mx-auto mb-3 h-auto w-24 object-contain sm:w-32 md:w-40"
            style={{ ["--float-dist" as string]: "6px", ["--float-dur" as string]: "2.6s" }}
          />
          <h2 className={`font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 ${titleColor} ${isNight ? "text-glow-purple" : "text-glow-gold"}`}>
            HACKPEERS
          </h2>
          <p className="font-body text-sm text-muted-foreground sm:text-base md:text-lg">
            Fellow Warriors Fighting Alongside You
          </p>
        </motion.div>

        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
          {HACKPEERS.map((peer, index) => (
            <div key={peer.name} className="w-[calc(50%-0.5rem)] sm:w-56 md:w-64">
              <PersonCard person={peer} troop={peer.troop} index={index} />
            </div>
          ))}
        </div>
      </div>

      <style>{PERSON_CARD_HOVER_CSS}</style>
    </section>
  );
};

export default Hackpeers;
