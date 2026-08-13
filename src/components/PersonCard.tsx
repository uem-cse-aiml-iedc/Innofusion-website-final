import { memo } from "react";
import { motion } from "framer-motion";

/*
 * Shared portrait tile used by Mentors, Judges and Hackpeers.
 *
 * Pulled out of MentorsSection so all three "people" sections stay visually
 * identical (same card shape, scrim, troop badge, accent-color hover) without
 * copy-pasting ~90 lines of JSX per section.
 */

export interface Person {
  name: string;
  designation: string;
  image: string;
  gender: "m" | "f";
  /** CSS object-position override for photos that need reframing within the card. Defaults to centered. */
  imagePosition?: string;
}

export const ACCENTS = [
  "234,179,8",   // gold
  "59,130,246",  // blue
  "168,85,247",  // violet
  "249,115,22",  // orange
  "236,72,153",  // pink
  "16,185,129",  // emerald
  "6,182,212",   // cyan
  "244,63,94",   // rose
];

export const PersonCard = memo(({ person, troop, index }: { person: Person; troop: string; index: number }) => {
  const rgb = ACCENTS[index % ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="person-card group relative overflow-hidden rounded-2xl"
      style={{
        border: `1px solid rgba(${rgb},0.3)`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        // Read by the shared hover rule each section defines once.
        ["--mc" as string]: rgb,
      }}
    >
      {/* Tall portrait photo — the card's own shape, not a small circle inset */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img
          src={person.image}
          alt={person.name}
          width={640}
          height={853}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: person.imagePosition ?? "50% 50%" }}
        />
        {/* Scrim so the name + role stay legible over any photo. Taller and
            darker than before so a two-line designation never washes out. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(10,10,12,0) 38%, rgba(10,10,12,0.75) 68%, rgba(6,6,8,0.97) 100%)" }}
        />
        {/*
          Floating troop badge — vertical drift only, never rotation.

          Uses the CSS `.coc-float` animation rather than a framer-motion
          loop: this card renders ~18 times across Mentors/Judges/Hackpeers,
          and a JS-driven keyframe loop per instance adds up to real
          main-thread cost while scrolling. See index.css for the details.
        */}
        <img
          src={troop}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="coc-float pointer-events-none absolute top-3 right-2 w-12 h-12 sm:w-14 sm:h-14 object-contain"
          style={{
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.7))",
            ["--float-delay" as string]: `${(index % 5) * 0.35}s`,
            ["--float-dist" as string]: "5px",
          }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-2 text-center">
        <h3 className="font-display text-xs leading-tight text-foreground sm:text-sm">
          {person.name}
        </h3>
        <div
          className="mx-auto my-1.5 h-px w-8 opacity-70"
          style={{ background: `rgb(${rgb})` }}
        />
        <p
          className="font-body text-[10px] leading-snug text-muted-foreground sm:text-[11px]"
          style={{ color: `rgba(${rgb},0.9)` }}
        >
          {person.designation}
        </p>
      </div>
    </motion.div>
  );
});
PersonCard.displayName = "PersonCard";

/* Shared hover rule — each section injects this once via <style>. Exported
   as a string so every section's <style> tag stays identical. */
export const PERSON_CARD_HOVER_CSS = `
  .person-card { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .person-card:hover {
    transform: translateY(-6px);
    border-color: rgb(var(--mc)) !important;
    box-shadow: 0 14px 32px rgba(var(--mc), .3), 0 6px 18px rgba(0,0,0,.35) !important;
  }
`;
