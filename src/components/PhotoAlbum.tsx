import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scroll, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/*
 * Photo Album — "Clan Memories"
 *
 * A cork-board / photobooth style wall of Polaroids from InnoFusion 2.0,
 * pinned at gentle alternating angles like they were tacked up by hand.
 * Deliberately laid out as a CSS-column masonry rather than the fixed-
 * aspect grids used elsewhere (Mentors, Sponsors) — the mixed portrait/
 * landscape source photos read better loose and overlapping than forced
 * into uniform tiles, and it keeps this section visually distinct.
 *
 * Click any photo to open it full-size in a keyboard-navigable lightbox.
 */

interface Photo {
  src: string;
  caption: string;
  /* height / width, used to balance column heights in the masonry below. */
  aspect: number;
}

const PHOTOS: Photo[] = [
  { src: "/gallery/innofusion2/gallery-01.webp", caption: "Clan Assembly", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-02.webp", caption: "Guardians of the Arena", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-03.webp", caption: "Council of Judges", aspect: 0.753 },
  { src: "/gallery/innofusion2/gallery-04.webp", caption: "Masked Sentinels", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-05.webp", caption: "The Silent Watch", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-06.webp", caption: "Fortress Gates", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-07.webp", caption: "Iron Sentinel", aspect: 1.328 },
  { src: "/gallery/innofusion2/gallery-08.webp", caption: "Welcome, Warriors", aspect: 1.328 },
  { src: "/gallery/innofusion2/gallery-09.webp", caption: "War Room Huddle", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-10.webp", caption: "United Clan", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-11.webp", caption: "Deep in Strategy", aspect: 0.64 },
  { src: "/gallery/innofusion2/gallery-12.webp", caption: "The Battle Arena", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-13.webp", caption: "Certificate of Valor", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-14.webp", caption: "Spoils of War", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-15.webp", caption: "Champions Rise", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-16.webp", caption: "Voice of the Realm", aspect: 1.499 },
  { src: "/gallery/innofusion2/gallery-17.webp", caption: "Honored Warriors", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-18.webp", caption: "Strategy Session", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-19.webp", caption: "Triumphant Clan", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-20.webp", caption: "Grand Finale", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-21.webp", caption: "Trophy Bearers", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-22.webp", caption: "Gifts of the Realm", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-23.webp", caption: "Allied Forces", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-24.webp", caption: "Sealing the Victory", aspect: 0.75 },
  { src: "/gallery/innofusion2/gallery-25.webp", caption: "The Hack Floor", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-26.webp", caption: "Fellowship of Four", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-27.webp", caption: "Brainstorm Circle", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-28.webp", caption: "Fortress Roll Call", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-29.webp", caption: "Medals of Honor", aspect: 0.667 },
  { src: "/gallery/innofusion2/gallery-30.webp", caption: "Clan Gathering", aspect: 0.75 },
];

/* Deterministic per-card tilt/pin so re-renders don't reshuffle the wall. */
const TILTS = [-3.5, 2.5, -2, 4, -4.5, 1.5, -1, 3, -2.5, 2, -3, 4.5];
const PIN_COLORS = ["#ef4444", "#eab308", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"];

const PolaroidCard = ({
  photo,
  index,
  isNight,
  onOpen,
}: {
  photo: Photo;
  index: number;
  isNight: boolean;
  onOpen: () => void;
}) => {
  const tilt = TILTS[index % TILTS.length];
  const pin = PIN_COLORS[index % PIN_COLORS.length];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 30, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 8) * 0.06, duration: 0.5 }}
      /*
       * No `scale` here on purpose — a translateY lift keeps the card's box
       * the same size on hover, which plays safer across browsers than a
       * scale-up. (The layout itself no longer uses CSS multi-column masonry;
       * see the note above the grid below for why that was replaced.)
       */
      whileHover={{ rotate: 0, y: -8, zIndex: 20 }}
      className="group relative block w-full text-left cursor-pointer focus:outline-none"
      style={{ transformOrigin: "center 20%" }}
      aria-label={`Open photo: ${photo.caption}`}
    >
      <div
        className="relative rounded-sm p-2 pb-7 transition-shadow duration-300"
        style={{
          background: isNight ? "#e8e2d4" : "#f7f2e6",
          boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.4) inset",
        }}
      >
        {/* Pushpin */}
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff8 0%, ${pin} 45%, ${pin}cc 100%)`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
          }}
        />
        <div className="overflow-hidden rounded-[2px] bg-black/20">
          <img
            src={photo.src}
            alt={photo.caption}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <p className="absolute bottom-1.5 left-0 right-0 px-2 text-center font-display text-[10px] sm:text-[11px] tracking-wide text-stone-700 truncate">
          {photo.caption}
        </p>
      </div>
      {/* Glow ring on hover, theme-tinted */}
      <div
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: isNight
            ? "0 0 0 2px rgba(168,85,247,0.55), 0 12px 30px rgba(168,85,247,0.25)"
            : "0 0 0 2px rgba(255,215,0,0.55), 0 12px 30px rgba(255,215,0,0.25)",
        }}
      />
    </motion.button>
  );
};

const Lightbox = ({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const photo = photos[index];

  /*
   * Rendered through a portal straight onto <body>.
   *
   * This section sits inside <ScrollAnimation>, whose GSAP reveal tween
   * leaves a `transform` on that wrapper even at rest (animating `y` to 0
   * doesn't remove the transform, it just resolves to translate3d(0,0,0)).
   * Per the CSS spec, any transformed ancestor becomes the containing block
   * for `position: fixed` descendants — so without the portal this modal
   * was "fixed" relative to the section wrapper instead of the viewport,
   * which is why it appeared pinned to the section's own position instead
   * of centered on screen.
   */
  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${photo.caption}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-16 sm:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 rounded-full p-2 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors"
      >
        <X size={22} />
      </button>

      {/* Prev / Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous photo"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 sm:p-3 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next photo"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 sm:p-3 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <motion.div
        key={photo.src}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full flex flex-col items-center"
      >
        <div
          className="p-2 sm:p-3 rounded-sm max-h-[75vh] flex items-center justify-center"
          style={{ background: "#f7f2e6", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
        >
          <img
            src={photo.src}
            alt={photo.caption}
            className="max-h-[68vh] w-auto object-contain rounded-[2px]"
          />
        </div>
        <div className="mt-4 flex items-center gap-3 font-display text-sm sm:text-base text-white/90">
          <span>{photo.caption}</span>
          <span className="text-white/40">•</span>
          <span className="text-gold-coin/90">{index + 1} / {photos.length}</span>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

/*
 * How many photo columns to render for the wall, mirroring the old Tailwind
 * `columns-2 sm:columns-3 lg:columns-4` breakpoints (640px / 1024px).
 */
const getColumnCount = () => {
  if (typeof window === "undefined") return 2;
  const w = window.innerWidth;
  if (w >= 1024) return 4;
  if (w >= 640) return 3;
  return 2;
};

/*
 * Buckets PHOTOS into `count` columns, each rendered as a plain flex column
 * (see the note above the grid markup for why this replaced the CSS
 * `columns-*` masonry approach).
 *
 * This walks the photos in order and always drops the next one into
 * whichever column is currently shortest, tracking each column's running
 * height via the photo's known aspect ratio (height/width). A naive
 * round-robin (index % count) ignores that photos have different heights,
 * so columns can end up noticeably uneven — e.g. one column filled with
 * portrait shots finishing well short of a neighboring column full of wide
 * landscape ones, leaving a visible gap at the bottom of the wall. Greedily
 * balancing by estimated height keeps all columns ending at roughly the
 * same point.
 */
const bucketPhotos = (photos: Photo[], count: number) => {
  const columns: { photo: Photo; index: number }[][] = Array.from({ length: count }, () => []);
  const heights = new Array(count).fill(0);
  photos.forEach((photo, index) => {
    let shortest = 0;
    for (let c = 1; c < count; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }
    columns[shortest].push({ photo, index });
    heights[shortest] += photo.aspect;
  });
  return columns;
};

const PhotoAlbum = () => {
  const { isNight } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [columnCount, setColumnCount] = useState<number>(getColumnCount);

  useEffect(() => {
    const onResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const columns = bucketPhotos(PHOTOS, columnCount);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)),
    []
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length)),
    []
  );

  const scrollGlow = isNight ? "rgba(139,92,246,0.5)" : "rgba(255,215,0,0.5)";
  const titleColor = isNight ? "text-purple-400" : "text-gold-coin";

  return (
    <section id="photo-album" className="relative py-16 sm:py-20 overflow-hidden">
      {/* Cork-board backdrop — a warm wood/board tone behind the photo wall,
          distinct from the neighbouring sections' gradients. */}
      <div
        className={`absolute inset-0 blend-y-bottom ${
          isNight ? "bg-slate-900/50" : "bg-gradient-to-b from-transparent via-dark-elixir/60 to-dark-elixir/70"
        }`}
      />

      {/* Floating troops guarding the album, left and right */}
      <motion.img
        src="/characters/wizard.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:left-4 top-1/4 h-28 sm:h-36 lg:h-44 object-contain opacity-30 lg:opacity-50 hidden sm:block"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 3.8, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 20px ${scrollGlow})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:right-4 bottom-10 hidden sm:block"
        style={{ transform: "scaleX(-1)" }}
      >
        <motion.img
          src="/characters/archer.webp"
          alt=""
          className="h-28 sm:h-36 lg:h-40 object-contain opacity-30 lg:opacity-50"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 20px ${scrollGlow})` }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
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
            <Camera className={`w-8 h-8 sm:w-10 sm:h-10 ${titleColor}`} />
            <Scroll className={`w-6 h-6 sm:w-8 sm:h-8 ${titleColor} opacity-70`} />
          </motion.div>

          <h2 className={`font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 ${titleColor} ${isNight ? "text-glow-purple" : "text-glow-gold"}`}>
            CLAN MEMORIES
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto">
            Snapshots pinned from the InnoFusion 2.0 battlefield
          </p>
        </motion.div>

        {/*
          Polaroid wall — mixed portrait/landscape shots settle naturally
          into unequal-height columns instead of being cropped to one ratio.

          This used to be CSS multi-column masonry (`columns-*`), but both
          Chromium and WebKit have a rendering bug where multicol fragment
          boundaries can leave items in a later column painting as empty
          (just the pin + shadow, no photo) — reported here on Mac Safari.
          Bucketing the photos into real flex columns in JS sidesteps that
          entirely: each card is now a normal flex child, not a multicol
          fragment.
        */}
        <div className="flex gap-4 max-w-6xl mx-auto px-1 sm:px-2">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-1 flex-col gap-4">
              {col.map(({ photo, index }) => (
                <PolaroidCard
                  key={photo.src}
                  photo={photo}
                  index={index}
                  isNight={isNight}
                  onOpen={() => setOpenIndex(index)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            photos={PHOTOS}
            index={openIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoAlbum;
