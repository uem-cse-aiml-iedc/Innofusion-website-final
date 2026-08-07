import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface SpecialPrize {
  name: string;
  logo: string;
  link: string;
  description: string;
  themeColor: string;
}

/*
 * Redesign notes
 * ─────────────────────────────────────────────────────────────────────────
 * The previous version was a 3D flip card: a flat solid-gold front panel
 * that clashed with the frosted-glass language the rest of the site now
 * uses (Sponsors, Treasury, Clan Leaders), and a flip-on-hover interaction
 * that has no real affordance on touch devices — nothing on the front face
 * hinted that tapping would do anything.
 *
 * This version drops the flip entirely. Every card shows its logo, name,
 * full description and CTAs at all times, styled as translucent glass
 * tinted with the sponsor's own theme colour — the same diagonal-gradient
 * card language established in Treasury's TrackPrizeCard. Hover is a CSS
 * transform + border glow (compositor-only), not a JS-animated box-shadow.
 */

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* Transparent-background logos drawn in near-black ink — invisible on a
   tinted glass card without a light plate behind them. */
const NEEDS_LIGHT_PLATE = new Set(["Wolfram", "CodeCrafters"]);

/* Logos that ship as their own full-bleed opaque tile. A plate would frame
   them oddly; they just need an edge to separate from the glass behind. */
const DARK_TILE = new Set<string>([]);

const BountyCard: React.FC<{ prize: SpecialPrize; index: number }> = ({ prize, index }) => {
  const c = prize.themeColor;
  const isNavigable = prize.link && prize.link !== "#";
  const needsPlate = NEEDS_LIGHT_PLATE.has(prize.name);
  const isDarkTile = DARK_TILE.has(prize.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index, 8) * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bounty-card group relative w-full h-full"
    >
      <div
        className="relative flex flex-col h-full rounded-2xl overflow-hidden p-5"
        style={{
          background: `linear-gradient(165deg, ${hexToRgba(c, 0.18)} 0%, rgba(255,255,255,0.03) 42%, rgba(10,10,12,0.55) 100%)`,
          border: `1px solid ${hexToRgba(c, 0.4)}`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Ambient colour wash from the top, matches Treasury's card language */}
        <div
          className="absolute inset-x-0 top-0 h-2/3 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${hexToRgba(c, 0.22)} 0%, transparent 70%)` }}
        />

        {/* Sheen sweep on hover — CSS only, no per-frame JS animation */}
        <div
          className="bounty-sheen absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(115deg, transparent 35%, ${hexToRgba(c, 0.22)} 48%, rgba(255,255,255,0.14) 52%, transparent 65%)`,
          }}
        />

        {/* Corner rivets */}
        <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-black/50 border border-white/10 pointer-events-none" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-black/50 border border-white/10 pointer-events-none" />
        <span className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-black/50 border border-white/10 pointer-events-none" />
        <span className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-black/50 border border-white/10 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center h-20 mb-3">
          {needsPlate ? (
            <div
              className="flex items-center justify-center rounded-xl px-4 py-3 max-w-full max-h-full"
              style={{ background: "rgba(244,244,248,0.94)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
            >
              <img
                src={prize.logo}
                alt={prize.name}
                className="max-h-[52px] max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <img
              src={prize.logo}
              alt={prize.name}
              className={`max-h-[72px] max-w-[75%] object-contain ${isDarkTile ? "rounded-lg" : ""}`}
              loading="lazy"
              decoding="async"
              style={
                isDarkTile
                  ? {
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                    }
                  : { filter: `drop-shadow(0 0 10px ${hexToRgba(c, 0.35)})` }
              }
            />
          )}
        </div>

        {/* Name */}
        <h4
          className="relative z-10 font-display text-lg tracking-wide text-center mb-1"
          style={{ color: c, textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}
        >
          {prize.name}
        </h4>

        <div
          className="relative z-10 w-10 h-px mx-auto mb-3"
          style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.7)}, transparent)` }}
        />

        {/* Description — always visible, no hover/flip gating */}
        <p className="relative z-10 font-body text-[13px] leading-relaxed text-center text-gray-300 flex-1">
          {prize.description}
        </p>

        {/* CTAs */}
        <div className="relative z-10 w-full flex gap-2 mt-4">
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://innofusion.notion.site/InnoFusion-3-0-Participant-Benefits-341e586c7bb480419a63ebfb42e81cd5",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="bounty-btn flex-1 flex items-center justify-center py-2.5 rounded-lg text-[11px] font-bold font-display tracking-widest uppercase text-white"
            style={{
              background: "linear-gradient(180deg, #5aacf5 0%, #1a6fd4 100%)",
              border: "1.5px solid #1050a0",
              boxShadow: "0 3px 0 #1050a0, inset 0 1px 0 rgba(255,255,255,0.35)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Details
          </button>

          {isNavigable && (
            <button
              type="button"
              onClick={() => window.open(prize.link, "_blank", "noopener,noreferrer")}
              className="bounty-btn flex-1 flex items-center justify-center py-2.5 rounded-lg text-[11px] font-bold font-display tracking-widest uppercase text-white"
              style={{
                background: "linear-gradient(180deg, #8ede43 0%, #519b16 100%)",
                border: "1.5px solid #2d5a0c",
                boxShadow: "0 3px 0 #2d5a0c, inset 0 1px 0 rgba(255,255,255,0.35)",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Visit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const SpecialPrizes = () => {
  const { isNight } = useTheme();

  const specialPrizes: SpecialPrize[] = [
    {
      name: "N8N",
      logo: "/Sponsers/N8N.webp",
      link: "https://www.n8n.io/",
      description:
        "Every finalist gets n8n Cloud Pro access (valued at €60/license) to build complete automation workflows.",
      themeColor: "#ec4899",
    },
    {
      name: "Wolfram",
      logo: "/Sponsers/wolfram.webp",
      link: "#",
      description:
        "1 month of Wolfram|One: full Wolfram Language access, 5k API calls, 5k Cloud Credits, 2 installs & 2GB Storage.",
      themeColor: "#dc2626",
    },
    {
      name: "CodeCrafters",
      logo: "/Sponsers/CodeCrafters.webp",
      link: "https://codecrafters.io/",
      description:
        "Top 3 teams win VIP memberships ($360/yr): 🥇 2-year, 🥈 1-year, 🥉 6-month — build Git, Docker & SQLite.",
      themeColor: "#38bdf8",
    },
    {
      name: "Edubuk",
      logo: "/Sponsers/Edubuk.webp",
      link: "https://edubuk.com/",
      description:
        "Lifetime blockchain-verified digital badges via eSeal, plus 3 months free access to TruCV and TruJobs.",
      themeColor: "#14b8a6",
    },
    {
      name: "Mastra AI",
      logo: "/Sponsers/mastra.webp",
      link: "https://www.mastra.ai/",
      description:
        "Every finalist receives a copy of a technical book to level up their AI and software development skill sets.",
      themeColor: "#a855f7",
    },
    {
      name: "navan ai",
      logo: "/Sponsers/navan.webp",
      link: "https://www.navan.ai/",
      description:
        "Access to multi-agent framework + free Skool community access ($19/month) for coding courses & networking.",
      themeColor: "#f97316",
    },
    {
      name: "Keploy",
      logo: "/Sponsers/keploy.webp",
      link: "https://www.keploy.io/",
      description:
        "Exclusive API testing credits + official Keploy Gift Hamper (T-shirt & swag) for Web/App and Cloud track winners.",
      themeColor: "#22c55e",
    },
    {
      name: ".XYZ",
      logo: "/Sponsers/xyz-logo-white.webp",
      link: "https://gen.xyz/",
      description:
        "Free .xyz domains for all Finalists, Evangelists & Top 30 teams to host their hackathon builds.",
      themeColor: "#eab308",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 sm:mt-24 max-w-6xl mx-auto px-4"
    >
      <style>{`
        .bounty-sheen {
          transform: translateX(-130%);
          transition: transform .7s ease;
        }
        .bounty-card > div {
          transition: transform .28s cubic-bezier(.22,1,.36,1),
                      box-shadow .28s ease, border-color .28s ease;
        }
        .bounty-card:hover > div {
          transform: translateY(-6px);
          box-shadow: 0 16px 34px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .bounty-card:hover .bounty-sheen { transform: translateX(130%); }
        .bounty-btn { transition: filter .15s ease, transform .1s ease; }
        .bounty-btn:hover { filter: brightness(1.12); }
        .bounty-btn:active { transform: translateY(2px); }
        @media (prefers-reduced-motion: reduce) {
          .bounty-card > div, .bounty-sheen { transition: none; }
        }
      `}</style>

      <div className="text-center mb-10 sm:mb-16">
        <h3
          className={`font-display text-2xl sm:text-3xl md:text-4xl mb-3 ${
            isNight
              ? "text-purple-400 text-glow-purple"
              : "text-gold-coin text-glow-gold"
          }`}
        >
          💎 Special Bounties
        </h3>
        <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground">
          Unlock exclusive tools, licenses, and rewards from our ecosystem allies
        </p>
      </div>

      {/*
        Flex-wrap + justify-center rather than CSS grid: with 8 cards at 3
        columns the last row only has 2, and a grid always left-aligns a
        short final row. Each card gets an explicit basis matching the old
        grid's column widths, so wrapping looks identical — the only
        difference is an incomplete last row centers instead of hugging
        the left edge.
      */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 items-stretch">
        {specialPrizes.map((prize, index) => (
          <div key={prize.name} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
            <BountyCard prize={prize} index={index} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SpecialPrizes;
