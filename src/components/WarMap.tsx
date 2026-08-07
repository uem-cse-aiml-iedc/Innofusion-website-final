import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";

type Status = "completed" | "active" | "locked";

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  buildingImage: string;
  /** Small companion troop rendered beside the building — skipped for the chest node. */
  characterImage?: string;
  /** Percentages (0-100) placing the building on the map. */
  position: { left: number; top: number };
  /** ISO date the event is considered wrapped up. Past this, status resolves to "completed". */
  endsAt?: string;
  /** ISO date the event unlocks. Before this, status resolves to "locked". */
  startsAt?: string;
  /** Escape hatch for genuinely open-ended events (e.g. "Ongoing") that dates can't drive. */
  statusOverride?: Status;
  /** Renders as a sealed/open chest instead of a building. */
  chest?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Registration Opens",
    date: "Jan 16, 2026 • 8 PM",
    description: "Assemble your clan",
    buildingImage: "/TownHall.webp",
    characterImage: "/Barbarian.webp",
    position: { left: 10, top: 78 },
    endsAt: "2026-01-16T23:59:59",
  },
  {
    id: 2,
    title: "Idea Submission",
    date: "May 15 – June 15, 2026",
    description: "Submit your battle plans",
    buildingImage: "/ArmyCamp.webp",
    characterImage: "/P.E.K.K.A.webp",
    position: { left: 24, top: 64 },
    endsAt: "2026-06-15T23:59:59",
  },
  {
    id: 3,
    title: "Registration Closes",
    date: "June 12, 2026 • 11:59 PM",
    description: "Last call for warriors",
    buildingImage: "/Barracks.webp",
    characterImage: "/Giant.webp",
    position: { left: 37, top: 52 },
    endsAt: "2026-06-12T23:59:59",
  },
  {
    id: 4,
    title: "Evaluation",
    date: "Completed",
    description: "Plans reviewed by judges",
    buildingImage: "/Laboratory.webp",
    characterImage: "/Wizard.webp",
    position: { left: 55, top: 48 },
    statusOverride: "completed",
  },
  {
    id: 5,
    title: "Finalists Declaration",
    date: "June 25, 2026",
    description: "Top warriors revealed",
    buildingImage: "/ClanCastle.webp",
    characterImage: "/ArcherQueen.webp",
    position: { left: 70, top: 26 },
    endsAt: "2026-06-25T23:59:59",
  },
  {
    id: 6,
    title: "Grand Finale",
    date: "22–23 August, 2026",
    description: "Claim your glory!",
    buildingImage: "/TrophyStand.webp",
    position: { left: 90, top: 18 },
    startsAt: "2026-08-22T00:00:00",
    chest: true,
  },
];

/**
 * Status used to be a hand-set string per event, so past dates (Jan 16,
 * June 12...) kept showing as "ACTIVE" long after they'd happened. This
 * derives status from the date fields instead, so it's always correct
 * without anyone having to remember to update it. `statusOverride` is the
 * only escape hatch, reserved for events with no fixed date to derive
 * status from.
 */
function resolveStatus(event: TimelineEvent, now: Date): Status {
  if (event.statusOverride) return event.statusOverride;
  if (event.startsAt && now < new Date(event.startsAt)) return "locked";
  if (event.endsAt && now > new Date(event.endsAt)) return "completed";
  return "active";
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Title colour only changes for the active event — completed and upcoming
// events both read as gold, matched by the badge (checkmark vs. none) rather
// than a separate "locked" hue.
const TITLE_COLOR: Record<Status, string> = {
  completed: "#FFD24C",
  active: "#FF4FA3",
  locked: "#FFD24C",
};

const LEGEND_COLOR: Record<Status, string> = {
  completed: "#22c55e",
  active: "#FF4FA3",
  locked: "#9ca3af",
};

const STATUS_LABEL: Record<Status, string> = {
  completed: "Completed",
  active: "Active",
  locked: "Upcoming",
};

const Legend = () => (
  <motion.div
    className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6 md:mt-8"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 }}
  >
    {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
      <div key={s} className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: LEGEND_COLOR[s], boxShadow: `0 0 8px ${hexToRgba(LEGEND_COLOR[s], 0.6)}` }}
        />
        <span className="text-xs md:text-sm text-amber-200/80">{STATUS_LABEL[s]}</span>
      </div>
    ))}
  </motion.div>
);

/** The wood-plank event card shared by the mobile and desktop layouts. */
const EventCard = ({ event, status }: { event: TimelineEvent; status: Status }) => (
  <div
    className="relative rounded-xl p-3"
    style={{
      background: 'linear-gradient(180deg, rgba(44,31,18,0.95) 0%, rgba(23,15,8,0.96) 100%)',
      border: '1px solid rgba(190,150,90,0.3)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
    }}
  >
    <h4
      className="font-display text-sm md:text-base font-bold leading-tight"
      style={{ color: TITLE_COLOR[status], textShadow: '0 2px 0 rgba(0,0,0,0.55)' }}
    >
      {event.title}
    </h4>
    <p className="font-body text-[11px] md:text-xs mt-0.5" style={{ color: '#FFAB40' }}>
      {event.date}
    </p>
    <p className="font-body text-[11px] md:text-xs mt-0.5 text-stone-200/70">
      {event.description}
    </p>

    {status === "active" && (
      <div className="mt-1.5 inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: '#FF4FA3', boxShadow: '0 0 6px rgba(255,79,163,0.8)' }} />
        <span className="text-[10px] md:text-xs font-bold" style={{ color: '#FF4FA3' }}>LIVE</span>
      </div>
    )}

    {status === "completed" && (
      <div
        className="absolute -bottom-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: '#22c55e', boxShadow: '0 3px 8px rgba(0,0,0,0.45), 0 0 0 3px rgba(20,14,8,0.9)' }}
      >
        <CheckCircle size={15} className="text-white" strokeWidth={2.5} />
      </div>
    )}
  </div>
);

const WarMap = () => {
  /*
   * Was `useMemo(() => new Date(), [])` — computed once at mount and never
   * refreshed, so a tab left open across an event boundary (registration
   * closing, finale starting) kept showing a stale locked/active/completed
   * status until the page was reloaded. A minute is plenty of resolution
   * for day-granularity event dates without re-rendering constantly.
   */
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const events = useMemo(
    () => timelineEvents.map((e) => ({ ...e, status: resolveStatus(e, now) })),
    [now]
  );

  return (
    <section id="timeline" className="relative py-8 md:py-20 overflow-hidden" style={{ background: '#0a0a0c' }}>
      {/* Cavern background — StorySection above already fades to #1a1207 at its own
          bottom edge, so this starts on that same value and fades back to page black
          at the bottom to match Treasury below. Wide, evenly-spaced stops (rather than
          many tightly-packed ones) keep the gradient smooth instead of stepping. */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #1a1207 0%, #2d1f0f 32%, #1a1207 66%, #0a0a0c 100%)',
        }}
      />
      {/*
        The warm "ember glow" radial highlight that used to sit here was a
        fixed-height div — even with its own gradient fading to transparent,
        a finite box like that guarantees a hard rectangular boundary at its
        edge, and stacked with the dither layer that edge was still reading
        as a faint line across the seam with StorySection above. Dropped
        rather than chased further; the base gradient alone carries the
        warmth now.
      */}
      {/*
        Grain/dither layer — sits on top of *both* gradients above (not
        sandwiched between them) so it breaks up banding in the combined
        result. Dark, low-saturation gradients like this cavern background
        are exactly where 8-bit colour steps become visible as faint
        concentric "rings" (the artifact the reference 24-bit-gradient image
        was pointing at); a bit of noise dithers that away the same way it
        would on a photo.
      */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Title Section */}
      <div className="relative z-20 container mx-auto px-4 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 md:mb-4">
            <img
              src="/ShieldClan Badge Icon.webp"
              alt=""
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 object-contain"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))' }}
            />
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-gold-coin"
              style={{
                textShadow: '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3), 0 4px 0 #8B6914',
              }}>
              The War Map
            </h2>
            <img
              src="/ShieldClan Badge Icon.webp"
              alt=""
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 object-contain"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))' }}
            />
          </div>
          {/* Ribbon banner, echoing the folded-cloth banners used elsewhere on the site */}
          <div
            className="inline-block px-6 py-1.5 md:px-8 md:py-2"
            style={{
              background: 'linear-gradient(180deg, #dc2626 0%, #7f1d1d 100%)',
              clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.45)',
            }}
          >
            <p className="font-body text-xs sm:text-sm md:text-base font-semibold text-white tracking-wide">
              Your journey through the Clan Wars
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===== MOBILE TIMELINE VIEW ===== */}
      <div className="md:hidden relative z-10 container mx-auto px-4">
        <div className="relative">
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #FFD24C, #FF4FA3, #9ca3af)' }}
          />

          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative pl-16"
              >
                <div
                  className="absolute left-4 top-4 w-4 h-4 rounded-full z-10"
                  style={{ background: LEGEND_COLOR[event.status], boxShadow: `0 0 10px ${hexToRgba(LEGEND_COLOR[event.status], 0.7)}` }}
                >
                  {event.status === "active" && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: LEGEND_COLOR[event.status] }}
                      animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    <img
                      src={event.chest ? (event.status === "locked" ? "/chest-closed.png" : "/chest-open.png") : event.buildingImage}
                      alt={event.title}
                      className="w-14 h-14 object-contain"
                      style={{
                        filter: !event.chest && event.status === "locked"
                          ? 'grayscale(60%) brightness(0.7)'
                          : 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
                      }}
                      loading="lazy" decoding="async"
                    />
                    {event.chest && event.status === "locked" && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-black/70 border border-gray-400/50 flex items-center justify-center">
                        <Lock size={10} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <EventCard event={event} status={event.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Legend />
      </div>

      {/* ===== DESKTOP MAP VIEW ===== */}
      <div className="hidden md:block relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-5xl"
        >
          <div
            className="relative rounded-2xl"
            style={{
              aspectRatio: '16/10',
              border: '1px solid rgba(218,165,32,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Background art shown bright and true-colour, like an actual sunlit village map — clipped to its own layer so cards/markers below stay free to overflow slightly without being cut off */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img
                src="/War Map Background.webp"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy" decoding="async" width={1536} height={1024}
              />
              {/* Faint bottom vignette only, to keep card text legible without dulling the art */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)' }} />
            </div>

            {/* Event markers + cards */}
            {events.map((event, index) => {
              // Finalists Declaration (index 4) used to sit "above" its marker,
              // which put its card directly under the Grand Finale card and
              // the two overlapped. Dropping it "below" instead clears that
              // — the node's own top% was also nudged up slightly so the
              // downward card has room before it reaches Evaluation's card.
              const placement: "above" | "below" | "left" =
                index === events.length - 1 ? "left" : index === 4 ? "below" : index % 2 === 1 ? "below" : "above";
              return (
                <motion.div
                  key={event.id}
                  className="absolute z-20"
                  style={{ left: `${event.position.left}%`, top: `${event.position.top}%`, transform: 'translate(-50%, -50%)' }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {/* Building sits directly on the terrain — no medallion frame */}
                  <div className="relative flex items-center justify-center">
                    {event.chest ? (
                      <>
                        <img
                          src={event.status === "locked" ? "/chest-closed.png" : "/chest-open.png"}
                          alt={event.title}
                          className="w-20 h-20 md:w-28 md:h-28 object-contain"
                          style={{ filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.5))' }}
                          loading="lazy" decoding="async"
                        />
                        {event.status === "locked" && (
                          <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-black/70 border border-gray-400/50 flex items-center justify-center">
                            <Lock size={14} className="text-gray-300" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <img
                          src={event.buildingImage}
                          alt={event.title}
                          className="w-16 h-16 md:w-24 md:h-24 object-contain"
                          style={{
                            filter: event.status === "locked"
                              ? 'grayscale(60%) brightness(0.7)'
                              : 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
                          }}
                          loading="lazy" decoding="async"
                        />
                        {event.characterImage && (
                          <img
                            src={event.characterImage}
                            alt=""
                            className="absolute -bottom-1 -right-3 w-8 h-8 md:w-11 md:h-11 object-contain"
                            style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}
                            loading="lazy" decoding="async"
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* Card — placement alternates above/below by node order so it never collides with a neighbour; the final node sits at the panel's right edge so its card anchors to the left instead */}
                  <div
                    className="absolute w-44 md:w-52"
                    style={
                      placement === "below"
                        ? { left: '50%', top: 'calc(100% + 14px)', transform: 'translateX(-50%)' }
                        : placement === "above"
                          ? { left: '50%', top: '-14px', transform: 'translate(-50%, -100%)' }
                          : { right: 'calc(100% + 18px)', top: '50%', transform: 'translateY(-50%)' }
                    }
                  >
                    <EventCard event={event} status={event.status} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Legend />
        </motion.div>
      </div>
    </section>
  );
};

export default WarMap;
