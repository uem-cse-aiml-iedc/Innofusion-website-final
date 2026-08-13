import { motion } from "framer-motion";
import { Person, PersonCard, PERSON_CARD_HOVER_CSS } from "@/components/PersonCard";

/*
 * Mentors.
 *
 * Card rendering lives in the shared PersonCard component (also used by the
 * now-retired Judges/Hackpeers sections) so cards stay visually identical
 * without duplicating markup.
 *
 * Judges and Hackpeers were previously split out into their own sections
 * (src/components/Judges.tsx, src/components/Hackpeers.tsx) but have been
 * merged back in here. Parichay Das, Daipayan Guha, Subrata Acharjee and
 * Chandan Kumar Sarkar are pinned as the first four entries so they land in
 * the first row of the grid (4 columns at the md breakpoint and up).
 */

type Mentor = Person;

// Designations pulled from each mentor's own "Welcome" card image.
const MENTORS: Mentor[] = [
  // Pinned first row.
  { name: "Parichay Das", designation: "Principal Architect, AI Solutions @ LTM", image: "/mentors/parichay-das.webp", gender: "m" },
  { name: "Daipayan Guha", designation: "ML Engineer @ Tata Consultancy Services", image: "/mentors/daipayan-guha.webp", gender: "m" },
  { name: "Subrata Acharjee", designation: "Senior QA @ TCS", image: "/mentors/subrata-acharjee.webp", gender: "m" },
  { name: "Chandan Kumar Sarkar", designation: "Senior Data Engineer @ TCS", image: "/mentors/chandan-kumar-sarkar.webp", gender: "m" },
  // Remaining roster.
  { name: "Alik Agarwala", designation: "Software Engineer @ Amazon", image: "/mentors/alik-agarwala.webp", gender: "m" },
  { name: "Aniket Chakraborty", designation: "Founder @ Pujo Planner", image: "/mentors/aniket-chakraborty.webp", gender: "m" },
  { name: "Avik Agarwala", designation: "AI Engineer @ Tata Consultancy Services", image: "/mentors/avik-agarwala.webp", gender: "m", imagePosition: "32% 50%" },
  { name: "Devesh Tulshyan", designation: "Fullstack (AI + Cloud) Engineer @ TCS", image: "/mentors/devesh-tulshyan.webp", gender: "m" },
  { name: "Jyotirmoy Roy", designation: "Software Engineer @ Rezolve AI (Crownpeak)", image: "/mentors/jyotirmoy-roy.webp", gender: "m" },
  { name: "Jeevan Joshi", designation: "SDE Intern @ Amazon", image: "/mentors/jeevan-joshi.webp", gender: "m" },
  { name: "Narendra Nath Chatterjee", designation: "Senior Android Engineer-II @ Ajaib", image: "/mentors/narendra-nath-chatterjee.webp", gender: "m" },
  { name: "Prasun Das", designation: "SDE-II (Delivery Lead) @ Redoq", image: "/mentors/prasun-das.webp", gender: "m" },
  { name: "Raihan Khan", designation: "Founding AI Engineer @ Wyzr", image: "/mentors/raihan-khan.webp", gender: "m" },
  { name: "Raj Bhattacharyya", designation: "Systems Engineer @ TCS", image: "/mentors/raj-bhattacharyya.webp", gender: "m" },
  { name: "Rajdeep Banerjee", designation: "Software Developer @ Accenture", image: "/mentors/rajdeep-banerjee.webp", gender: "m" },
  { name: "Sanglap Mridha", designation: "SDE-II @ Cozeva", image: "/mentors/sanglap-mridha.webp", gender: "m" },
  { name: "Oheli Das", designation: "3x Hackathon Winner", image: "/mentors/oheli-das.webp", gender: "f", imagePosition: "68% 50%" },
  { name: "Mayank Kumar", designation: "5x Hackathon Winner", image: "/mentors/mayank-kumar.webp", gender: "m" },
];

/*
 * Two separate pools so the badge always matches the mentor's gender —
 * male troops for the male photos, female troops for the female ones.
 * Each pool cycles independently (tracked in MentorsSection below) so
 * neighbours within the same gender still get visual variety.
 */
const MALE_TROOPS = [
  "/characters/track-warden.png",
  "/characters/track-pekka.png",
  "/characters/track-barbarian.png",
  "/characters/track-wizard.png",
  "/characters/track-minion.png",
  "/characters/track-king.png",
  "/characters/track-balloon.png",
];

const FEMALE_TROOPS = [
  "/characters/track-archer.png",
  "/characters/track-nightwitch.png",
];

// Walks the roster once, handing each mentor the next badge from their own
// gender's pool — so a male mentor never ends up with the Archer/Night
// Witch and vice versa, while same-gender neighbours still vary.
let maleCursor = 0;
let femaleCursor = 0;
const MENTORS_WITH_TROOPS = MENTORS.map((mentor) => ({
  mentor,
  troop:
    mentor.gender === "f"
      ? FEMALE_TROOPS[femaleCursor++ % FEMALE_TROOPS.length]
      : MALE_TROOPS[maleCursor++ % MALE_TROOPS.length],
}));

const MentorsSection = () => {
  return (
    <section id="mentors" className="relative overflow-hidden py-20">
      <div className="absolute inset-0 blend-y-bottom bg-gradient-to-b from-transparent via-dark-elixir/60 to-dark-elixir/70" />

      {/* Dart Goblin guarding the left gutter */}
      <img
        src="/characters/dart-goblin.webp"
        alt=""
        aria-hidden="true"
        className="coc-float pointer-events-none absolute -left-4 top-1/3 hidden h-40 object-contain opacity-40 lg:block"
        style={{ filter: "drop-shadow(0 0 30px rgba(168,85,247,0.5))", ["--float-dist" as string]: "12px", ["--float-dur" as string]: "4s" }}
      />

      {/* Wall Breaker on the right, mirrored via a static wrapper so the
          flip never animates through zero width */}
      <div className="pointer-events-none absolute -right-4 top-1/2 hidden lg:block" style={{ transform: "scaleX(-1)" }}>
        <img
          src="/characters/wall-breaker.webp"
          alt=""
          aria-hidden="true"
          className="coc-float h-32 object-contain opacity-35"
          style={{ filter: "drop-shadow(0 0 24px rgba(249,115,22,0.45))", ["--float-dist" as string]: "10px", ["--float-dur" as string]: "4.6s" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center sm:mb-14"
        >
          {/* Builder Hut — back on Mentors now that Judges/Hackpeers have
              merged into this section; matches "Master Builders" below. */}
          <img
            src="/Builder Hut.webp"
            alt=""
            aria-hidden="true"
            className="coc-float mx-auto mb-3 h-auto w-24 object-contain sm:w-32 md:w-40"
            style={{ ["--float-dist" as string]: "6px", ["--float-dur" as string]: "2.6s" }}
          />
          <h2 className="font-heading text-2xl font-semibold text-gold-coin text-glow-gold sm:text-3xl md:text-4xl lg:text-5xl">
            MENTORS
          </h2>
          <p className="mt-3 font-body text-sm text-muted-foreground sm:text-base md:text-lg">
            Master Builders Ready to Guide
          </p>
        </motion.div>

        {/* flex-wrap + justify-center (not CSS grid) so an incomplete last
            row — e.g. the trailing 2 cards once the roster isn't a clean
            multiple of the column count — centers instead of hugging left. */}
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
          {MENTORS_WITH_TROOPS.map(({ mentor, troop }, index) => (
            <div
              key={mentor.name}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.834rem)] md:w-[calc(25%-1.125rem)]"
            >
              <PersonCard person={mentor} troop={troop} index={index} />
            </div>
          ))}
        </div>
      </div>

      <style>{PERSON_CARD_HOVER_CSS}</style>
    </section>
  );
};

export default MentorsSection;
