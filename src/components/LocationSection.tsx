import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

/*
 * The venue map used to live as a small card inside the Footer grid. Pulled
 * out into its own section (right after Mentors) so it gets real width and
 * reads as a destination rather than a footer afterthought.
 */
const LocationSection = () => {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden" style={{ background: "#0a0a0c" }}>
      {/* Solid base, matching neighbouring sections so there's no seam */}
      <div className="absolute inset-0" style={{ background: "#0a0a0c" }} />

      {/*
        Faint gold ambient glow behind the heading.

        The previous version was a fixed-height (`top-0 h-64`) box with the
        radial gradient's centre pinned to y=0 — full-strength gold sat right
        on the line where this section meets Mentors above it, which is
        exactly the rectangle that showed up as a visible edge. This version
        spans the whole section (no separate boxed div) and is zero at both
        the top and bottom, peaking only in the middle, so there's no height
        at which the glow starts or stops abruptly.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(234,179,8,0.05) 30%, rgba(234,179,8,0.06) 45%, transparent 75%)",
        }}
      />

      {/* Villager pointing the way, tucked in the left gutter */}
      <img
        src="/characters/villager.webp"
        alt=""
        aria-hidden="true"
        className="coc-float pointer-events-none absolute left-2 xl:left-10 bottom-4 h-40 md:h-48 object-contain opacity-60 hidden lg:block"
        style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(234,179,8,0.3))", ["--float-dist" as string]: "10px", ["--float-dur" as string]: "4s" }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-gold-coin" style={{ filter: "drop-shadow(0 0 10px rgba(234,179,8,0.6))" }} />
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-coin text-glow-gold">
              Find the Village
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            University of Engineering &amp; Management, New Town, Kolkata
          </p>
        </motion.div>

        <motion.a
          href="https://www.google.com/maps/place/University+of+Engineering+%26+Management,+Kolkata+(UEM)/@22.561845,88.4861732,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020b267a3cdc13:0xb3b21d652126f40!8m2!3d22.5618401!4d88.4887481!16s%2Fg%2F11c4pg5gwf?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="group relative block w-full max-w-4xl mx-auto h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden"
          style={{
            background: "#0a0a0c",
            boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
          }}
          aria-label="Open UEM location in Google Maps"
        >
          {/*
            The map art has a hard rectangular edge (bright green right up to
            the crop line), so a solid border just doubled down on that seam.
            Masking the image itself with a radial fade — rather than
            overlaying a shadow on top of a still-sharp edge — lets the map
            visually dissolve into the surrounding black instead of stopping
            at a ruled line.
          */}
          <img
            src="/village-map.webp"
            alt="Illustrated map of the UEM campus and New Town, Kolkata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 88% 84% at 50% 50%, #000 0%, #000 46%, rgba(0,0,0,0.75) 66%, rgba(0,0,0,0.25) 86%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 88% 84% at 50% 50%, #000 0%, #000 46%, rgba(0,0,0,0.75) 66%, rgba(0,0,0,0.25) 86%, transparent 100%)",
            }}
          />

          {/* Darken slightly on hover so the pill stays legible */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

          {/* Soft gold ambient ring — replaces the old hard border, sits
              behind the masked edge so it reads as a glow, not a seam */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: "inset 0 0 70px rgba(234,179,8,0.1), inset 0 0 2px rgba(234,179,8,0.3)" }}
          />

          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-blue-700 text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow">
            Open in Maps
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
        </motion.a>
      </div>
    </section>
  );
};

export default LocationSection;
