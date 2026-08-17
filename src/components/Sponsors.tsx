import React from "react";
import { motion } from "framer-motion";

// ========================================================================================
// ✨ ADD NEW SPONSORS HERE - Just add an object to the appropriate array below!
// ========================================================================================

interface Sponsor {
  name: string;
  logo: string;  // Path to logo image in /public folder
  logos?: string[]; // Multiple logos for a single card
  link: string;  // Website URL
  description?: string; // Text shown on the back of the flip card
}

// ──────────────────────────────────────────────────────────────────────────────
// Reusable FlipCard component
// ──────────────────────────────────────────────────────────────────────────────
interface SponsorCardProps {
  sponsor: Sponsor;
  /** CSS class applied to the outermost wrapper (controls size) */
  sizeClass?: string;
  /** Tailwind border / shadow colours for the card face */
  borderClass?: string;
  hoverShadow?: string;
  /** Inline background style for the front face */
  frontBg?: string;
  /** Inline background style for the back face */
  backBg?: string;
  /** Tailwind text-colour class for the sponsor name on the back */
  nameColorClass?: string;
  /** Height class for the logo area (e.g. "h-32" or "h-24") */
  logoHeightClass?: string;
  /** Drop-shadow filter for the logo */
  logoFilter?: string;
  /** Extra content rendered inside the front face (e.g. multiple logos) */
  renderFrontContent?: () => React.ReactNode;
  /** Whether the front has a white background (platform partners) */
  whiteFront?: boolean;
}

/**
 * Turns a solid gradient like
 *   linear-gradient(145deg, #2d1b4e 0%, #4a2c6b 40%, #2d1b4e 100%)
 * into a translucent one so the card reads as frosted glass over the page.
 */
/*
 * Logos whose artwork is almost entirely dark/desaturated ink — they were
 * drawn for light backgrounds and vanish against a translucent card. Measured
 * by scoring each file on the share of pixels that are either bright or
 * strongly saturated; anything under ~20% lands here and gets a light plate.
 */
/* Transparent-background logos drawn in near-black ink. Measured: >55% of
   their opaque pixels are darker than L=70 with almost no bright pixels, so
   they disappear against a translucent card. These get a light plate. */
const NEEDS_LIGHT_PLATE = new Set([
  "vercel-main",
  "wolfram",
  "CodeCrafters",
  "CODENEST",
  "LNC",
  "Diversion",
  "Wadhwani",
  "Miro", // navy wordmark reads as near-black on the translucent card
  "AgentMesh", // black zigzag mark on a transparent bg
  "Algorand", // navy mark on a transparent bg
]);

/* Logos that ship as a full-bleed dark tile (their own opaque background).
   A plate would just frame them oddly — they only need an edge so the tile
   separates from the card behind it. */
const DARK_TILE = new Set(["CodeRush", "InnovateX", "du", "Hackx", "Myrad"]);

function logoKey(path: string): string {
  return path.split("/").pop()?.replace(/\.(webp|png|jpe?g)$/i, "") ?? "";
}

function translucent(gradient: string, alpha: number): string {
  return gradient.replace(/#([0-9a-fA-F]{6})/g, (_m, hex: string) => {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  });
}

const SponsorCard: React.FC<SponsorCardProps> = ({
  sponsor,
  sizeClass = "w-64",
  borderClass = "border-purple-500/50",
  hoverShadow = "0 0 40px rgba(168,85,247,0.4)",
  frontBg = "linear-gradient(145deg, #2d1b4e 0%, #4a2c6b 40%, #2d1b4e 100%)",
  logoHeightClass = "h-28",
  logoFilter = "drop-shadow(0 0 12px rgba(168,85,247,0.5))",
  renderFrontContent,
  whiteFront = false,
}) => {
  const isNavigable = sponsor.link && sponsor.link !== "#";
  const key = logoKey(sponsor.logo);
  const needsPlate = !whiteFront && !renderFrontContent && NEEDS_LIGHT_PLATE.has(key);
  const isDarkTile = !whiteFront && !renderFrontContent && DARK_TILE.has(key);

  return (
    <div
      role={isNavigable ? "link" : undefined}
      tabIndex={isNavigable ? 0 : undefined}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (isNavigable) window.open(sponsor.link, "_blank", "noopener,noreferrer"); } }}
      onClick={() => { if (isNavigable) window.open(sponsor.link, "_blank", "noopener,noreferrer"); }}
      className={`sponsor-card-container ${sizeClass} block relative ${isNavigable ? "cursor-pointer" : "cursor-default"} transition-all duration-300 hover:scale-105`}
    >
      <div
        className={`absolute inset-0 rounded-2xl border ${borderClass} overflow-hidden`}
        style={{
          background: whiteFront
            ? "rgba(255,255,255,0.88)"
            : translucent(frontBg, 0.22),
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10" />
        <div className={`relative z-10 flex items-center justify-center ${logoHeightClass} w-full h-full px-6`}>
          {renderFrontContent ? renderFrontContent() : needsPlate ? (
            /* Dark-ink logo: sit it on a frosted light plate so it stays legible
               against the now-translucent card without lightening the card. */
            <div
              className="flex items-center justify-center rounded-xl px-5 py-4 max-w-full max-h-[86%]"
              style={{
                background: "rgba(244,244,248,0.94)",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="max-h-[86px] max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className={`max-h-[80%] max-w-full object-contain ${
                isDarkTile ? "rounded-xl" : ""
              }`}
              style={{
                filter: whiteFront ? "none" : logoFilter,
                ...(isDarkTile
                  ? {
                      /* Self-contained dark tile: give it a bright edge and a
                         drop shadow so it reads as an object, not a hole. */
                      border: "1px solid rgba(255,255,255,0.35)",
                      boxShadow:
                        "0 6px 18px rgba(0,0,0,0.55), 0 0 0 3px rgba(255,255,255,0.06)",
                    }
                  : {}),
              }}
            loading="lazy" decoding="async" />
          )}
        </div>
      </div>
      <style>{`
        .sponsor-card-container {
          height: 210px;
        }
        .sponsor-card-container:hover {
          box-shadow: ${hoverShadow};
        }
      `}</style>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Clan sentinels — decorative COC troops that occupy the empty gutters beside
// the sponsor grid. Only shown from `lg` up, where those margins actually exist.
// ──────────────────────────────────────────────────────────────────────────────
interface SentinelProps {
  src: string;
  side: "left" | "right";
  /** Vertical position within the section, as a CSS percentage string */
  top: string;
  /** Rendered height in px */
  size: number;
  glow: string;
  /** Fliers drift further and tilt; ground units bob and sway */
  flying?: boolean;
  /** Mirror horizontally so the troop faces the content */
  mirror?: boolean;
  delay?: number;
}

const Sentinel: React.FC<SentinelProps> = ({
  src,
  side,
  top,
  size,
  glow,
  flying = false,
  mirror = false,
  delay = 0,
}) => {
  /*
    The mirror lives on a plain wrapper, NOT on the animated element.
    Putting `scaleX: -1` inside Framer's `animate` makes it tween from 1 to
    -1, so the sprite squashes through zero width on mount — which reads as
    the character spinning. A static transform on the parent avoids that
    entirely, and the img underneath only ever animates `y`.
  */
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden lg:block ${
        side === "left" ? "left-1 xl:left-8 2xl:left-16" : "right-1 xl:right-8 2xl:right-16"
      }`}
      style={{ top, transform: mirror ? "scaleX(-1)" : undefined }}
    >
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="object-contain"
        style={{
          height: size,
          opacity: 0.6,
          filter: `drop-shadow(0 8px 18px rgba(0,0,0,0.6)) drop-shadow(0 0 24px ${glow})`,
        }}
        /* Vertical float only. No rotate, no scale, no flip. */
        animate={flying ? { y: [0, -20, 0, -10, 0] } : { y: [0, -10, 0] }}
        transition={{
          duration: flying ? 6.5 : 4.2,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

/*
 * Laid out to avoid the Spell Factory that still sits at right / top-1/2,
 * and spaced so no two troops on the same side crowd each other.
 */
const SENTINELS: SentinelProps[] = [
  // ── Left gutter ──
  { src: "/characters/track-warden.png",    side: "left",  top: "11%", size: 310, glow: "rgba(168,85,247,0.4)",  delay: 0.0 },
  { src: "/characters/track-pekka.png",     side: "left",  top: "29%", size: 335, glow: "rgba(120,150,255,0.4)", delay: 0.6 },
  { src: "/characters/track-barbarian.png", side: "left",  top: "48%", size: 305, glow: "rgba(255,180,60,0.4)",  delay: 1.2 },
  { src: "/characters/coc-builder.png",     side: "left",  top: "66%", size: 292, glow: "rgba(255,140,80,0.4)",  delay: 0.3 },
  { src: "/characters/coc-wallbreaker.png", side: "left",  top: "84%", size: 288, glow: "rgba(200,200,210,0.35)", delay: 0.9 },

  // ── Right gutter ──
  { src: "/characters/track-wizard.png",    side: "right", top: "17%", size: 306, glow: "rgba(80,170,255,0.45)", mirror: true, delay: 0.4 },
  { src: "/characters/track-balloon.png",   side: "right", top: "33%", size: 335, glow: "rgba(255,90,60,0.4)",   flying: true, delay: 0.0 },
  { src: "/characters/coc-baby-dragon.png", side: "right", top: "66%", size: 295, glow: "rgba(120,220,110,0.45)", flying: true, mirror: true, delay: 1.1 },
  { src: "/characters/track-nightwitch.png",side: "right", top: "80%", size: 310, glow: "rgba(230,80,180,0.4)",  mirror: true, delay: 0.7 },
  { src: "/characters/coc-gem-chest.png",   side: "right", top: "92%", size: 262, glow: "rgba(120,230,90,0.45)", delay: 1.5 },
];

/** Utility: pull the rgba(...) part from a box-shadow string for text-shadow reuse */
function extractRgba(shadow: string): string {
  const match = shadow.match(/rgba\([^)]+\)/);
  return match ? match[0] : "rgba(255,255,255,0.4)";
}

// ──────────────────────────────────────────────────────────────────────────────

const Sponsors = () => {

  // 🏆 LEGEND SPONSORS - Add new legend sponsors here
  const legendSponsors: Sponsor[] = [
    // { name: "Company Name", logo: "/Sponsers/logo.png", link: "https://company.com" },

    {
      name: "N8N",
      logo: "/Sponsers/N8N.webp",
      link: "https://www.n8n.io/",
      description: "Every finalist gets n8n Cloud Pro access (valued at €60/license) to build complete automation workflows during the hackathon."
    },
    {
      name: "Wolfram",
      logo: "/Sponsers/wolfram.webp",
      link: "#",
      description: "Every registered participant gets 1 month of Wolfram|One: full Wolfram Language access, 5,000 API calls, 5,000 Cloud Credits, 2 installations & 2 GB Cloud Storage."
    },
    {
      name: "Vercel",
      logo: "/Sponsers/vercel-main.webp",
      link: "https://vercel.com/"
    }
  ];

  // ⚔️ TITAN SPONSORS - Add new titan sponsors here
  const titanSponsors: Sponsor[] = [
    {
      name: "CodeCrafters",
      logo: "/Sponsers/CodeCrafters.webp",
      link: "https://codecrafters.io/",
      description: "Top 3 teams win VIP memberships ($360/yr): 🥇 2-year, 🥈 1-year, 🥉 6-month — build Git, Docker & SQLite from scratch."
    }

  ];

  // 🛡️ CHAMPION SPONSORS - Add new champion sponsors here
  const championSponsors: Sponsor[] = [
    // { name: "Company Name", logo: "/Sponsers/logo.png", link: "https://company.com" },
    {
      name: "Edubuk",
      logo: "/Sponsers/Edubuk.webp",
      link: "https://edubuk.com/",
      description: "All participants get lifetime blockchain-verified digital badges via eSeal, plus 3 months free access to TruCV and TruJobs platforms."
    },
    {
      name: "Mastra AI",
      logo: "/Sponsers/mastra.webp",
      link: "https://www.mastra.ai/",
      description: "Every finalist receives a copy of a technical book to level up their AI and software development skill sets."
    },
    {
      name: "navan ai",
      logo: "/Sponsers/navan.webp",
      link: "https://www.navan.ai/",
      description: "Finalists access the multi-agent framework at sam.navan.ai + free Skool community access ($19/month) for spec coding courses & networking."
    },

    // {
    //   name: "Ascent Circle",
    //   logo: "Sponsers/AscentCircle.png",
    //   link: "https://ascentcircle.web.app/"
    // },
    {
      name: "Miro",
      logo: "/Sponsers/Miro.webp",
      link: "https://miro.com/templates/miro-meetups-social-promo-toolkit/"
    },
    {
      name: "Corsair",
      logo: "/Sponsers/Corsair.webp",
      link: "https://corsair.dev/"
    },
    {
      name: "AgentMesh",
      logo: "/Sponsers/AgentMesh.webp",
      link: "https://www.myradhq.xyz/dashboard"
    },
    {
      name: "Algorand",
      logo: "/Sponsers/Algorand.webp",
      link: "https://algorand.co/"
    },
    {
      name: "Myrad",
      logo: "/Sponsers/Myrad.webp",
      link: "https://www.agent-mesh.app/"
    },


  ];

  // 🔧 TECHNICAL SPONSORS - Add new technical sponsors here
  const technicalSponsors: Sponsor[] = [
    // { name: "Company Name", logo: "/Sponsers/logo.png", link: "https://company.com" },
    {
      name: "Keploy",
      logo: "/Sponsers/keploy.webp",
      link: "https://www.keploy.io/",
      description: "Exclusive API testing credits during the hacking period + official Keploy Gift Hamper (T-shirt & swag) for Web/App and Cloud track winners."
    },
    {
      name: ".XYZ",
      logo: "/Sponsers/xyz-logo-white.webp",
      link: "https://gen.xyz/",
      description: "Free .xyz domains for all Finalists, Evangelists & Top 30 outstanding teams to host their hackathon builds and create a live digital presence."
    }

  ];

  // 📢 KNOWLEDGE PARTNERS - Add new knowledge partners here
  const KnowledgePartners: Sponsor[] = [
    {
      name: "Wadhwani Foundation",
      logo: "/Sponsers/Wadhwani.webp",
      link: "https://wadhwanifoundation.org/"
    }
  ];

  // 🤝 PLATFORM PARTNERS - Add new platform partners here
  const platformPartners: Sponsor[] = [
    {
      name: "Devfolio",
      logo: "/Sponsers/Devfolio.webp",
      //make it not clickable for now since the website is not live yet
      link: "https://innofusion-3.devfolio.co/"
    },
    {
      name: "HackOS",
      logo: "/Sponsers/hackos-logo.jpg",
      link: "https://hackosqr.innofusion.tech/"
    },
    {
      name: "HackNest",
      logo: "/Sponsers/LogoTransparentBG.webp",
      //make it not clickable for now since the website is not live yet
      link: "#"
    }
  ];

  // 📢 MEDIA PARTNERS - Add new media partners here
  const mediaPartners: Sponsor[] = [
    {
      name: "Eventopia",
      logo: "/Sponsers/Eventopia.webp",
      link: "https://www.eventopia.in/"
    },
  ];

  // 🔬 TECHNICAL PARTNERS - Add new technical partners here
  const technicalPartners: Sponsor[] = [
    {
      name: "SPIE & Optica",
      logo: "/Sponsers/SPIE-Optica.webp",
      link: "#"
    },
  ];

  // 🌐 COMMUNITY PARTNERS - Add new community partners here
  const communityPartners: Sponsor[] = [
    // { name: "Community Name", logo: "/Sponsers/community-logo.png", link: "https://community.com" },

    {
      name: "OSEN",
      logo: "/Sponsers/osen-logo.png",
      link: "#"
    },

    {
      name: "Hacktropica"
      , logo: "/Sponsers/Hacktropica.webp"
      , link: "https://www.hacktropica.xyz/"
    },

    {
      name: "HexaFalls"
      , logo:"/Sponsers/HexaFalls2.webp"
      , link:"https://www.hexafalls.org/"
    },


    {
      name: "MetaMorph"
      , logo: "/Sponsers/MetaMorph.webp"
      , link: "https://www.meta-morph.tech/"
    },
    {
      name: "Diversion"
      , logo: "/Sponsers/Diversion.webp"
      , link: "https://www.diversion.tech/"
    },
    {
      name: "HackSpire",
      logo: "/Sponsers/Hackspire.webp",
      logos: ["/Sponsers/Hackspire.webp", "/Sponsers/fiemacm.webp"],
      link: "#"
    },
    {
      name: "Hackolution"
      , logo: "/Sponsers/Hackolution.webp"
      , link: "https://www.hackolution.tech/"
    },

    {
      name: "Technologia",
      logo: "/Sponsers/Technologia.webp",
      link: "https://www.technologia-iem.tech"
    },
    {
      name: "Hacksnippet"
      , logo: "/Sponsers/Hacksnippet.webp"
      , link: "https://hacksnippet.iem.edu.in/"
    },
    {
      name: "CodeNest"
      , logo: "/Sponsers/CODENEST.webp"
      , link: "https://cfc-hackathon2k26.vercel.app/"
    },
    {
      name: "Hackx Tech", 
      logo: "/Sponsers/Hackx.webp",
      link: "#"
    },
    {
      name: "InnovateX", 
      logo: "/Sponsers/InnovateX.webp",
      link: "#"
    },
    {
      name: "HackBaroda",
      logo: "/Sponsers/Hack_Baroda_Logo.webp",
      link: "https://hackbaroda.in/"
    },
    {
      name: "Watch the Code",
      logo: "/Sponsers/wtc.webp",
      link: "https://hack.gehu.in/"
    },
    {
      name: "Techgeeks",
      logo: "/Sponsers/Techgeeks.webp",
      link: "#"
    },
    {
      name: "Coderush X",
      logo: "/Sponsers/CodeRush.webp",
      link: "#"
    },
    {
      name  : "Debuggers United",
      logo  : "/Sponsers/du.webp",
      link  : "https://hacktoberfest.com/",
    },
    {
      name: "Synchronicity",
      logo: "/Sponsers/Sync.webp",
      link: "https://synchronicity.ju-acm.com/home"
    },
    // {
    //   name: "Miro Meetups",
    //   logo: "Sponsers/miroMeetups.png",
    //   link: "https://www.instagram.com/mmkolkata_?igsh=ZHMwOTExcTRlbnc3",
    //   description: "Participants enjoy an exclusive 40-minute visual collaboration workshop, official swag, and a $100 monetary sponsorship to enhance the overall experience."
    // },
    {
      name: "LNC",
      logo: "/Sponsers/LNC.webp",
      link: "https://linktr.ee/LNC_COMMUNITY"
    }
  ];
  const beveragePartners: Sponsor[] = [
    {
      name: "Red Bull",
      logo: "/Sponsers/RedBull.webp",
      link: "https://www.redbull.com/in-en"
    },
  ];

  return (
    <section id="sponsors" className="relative py-20 overflow-hidden">
      {/* Transparent background - no solid color */}
      <div className="absolute inset-0 bg-transparent" />

      {/*
        Clan sentinels — COC troops posted down the empty left and right
        gutters so the wide margins beside the sponsor grid aren't dead space.
        Ground units bob and sway; fliers get a wider drift and a tilt.
      */}
      {SENTINELS.map((s) => (
        <Sentinel key={`${s.side}-${s.top}`} {...s} />
      ))}

      {/* Spell Factory floating on right */}
      <motion.img
        src="/Spell Factory Building.webp"
        alt=""
        className="absolute right-4 top-1/2 -translate-y-1/2 h-56 object-contain opacity-40 hidden lg:block"
        animate={{
          y: [-8, 8, -8],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.6))' }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-8 sm:mb-12"
        >
          {/* Barbarian King standing guard, left of the header. Roars on hover.
              Positioning lives on the wrapper and the idle bob on an inner
              element, so the hover scale below has a transform of its own to
              animate without fighting the float. */}
          <div className="absolute left-0 xl:-left-24 top-1/2 -translate-y-1/2 hidden lg:block cursor-default">
            <div
              className="coc-float"
              style={{
                ["--float-dist" as string]: "10px",
                ["--float-dur" as string]: "3.6s",
              }}
            >
              <img
                src="/characters/track-king.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-72 md:h-[22rem] object-contain opacity-70 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-110"
                style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6)) drop-shadow(0 0 22px rgba(255,190,60,0.45))" }}
              />
            </div>
          </div>
          {/*
            Dragon watching the header, right side. The mirror sits on a static
            wrapper — animating scaleX to -1 would tween through zero width and
            look like the dragon spinning on load.
          */}
          <div
            aria-hidden="true"
            className="absolute right-0 xl:-right-24 top-1/2 -translate-y-1/2 hidden lg:block"
            style={{ transform: "translateY(-50%) scaleX(-1)" }}
          >
            <motion.img
              src="/characters/track-dragon.png"
              alt=""
              className="h-72 md:h-[22rem] object-contain opacity-70 cursor-default"
              animate={{ y: [0, -16, 0] }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 4.2, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6)) drop-shadow(0 0 22px rgba(200,80,220,0.45))" }}
            />
          </div>
          <motion.img
            src="/ShieldClan Badge Icon.webp"
            alt=""
            className="w-20 sm:w-24 md:w-32 h-auto mx-auto mb-3 sm:mb-4 object-contain"
            animate={{
              rotate: [-5, 5, -5],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))' }}
          />
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gold-coin text-glow-gold mb-3 sm:mb-4">
            SPONSORS
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground">
            Allied Kingdoms Supporting Our Clan
          </p>
        </motion.div>

        {/* Legend Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
            <span className="text-purple-400 text-glow">Legend</span>
            <span className="text-foreground"> Sponsors</span>
          </h3>
          {legendSponsors.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto px-4">
              {legendSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <SponsorCard
                    sponsor={sponsor}
                    sizeClass="w-72"
                    borderClass="border-purple-500/50"
                    hoverShadow="0 0 50px rgba(168,85,247,0.4)"
                    frontBg="linear-gradient(145deg, #2d1b4e 0%, #4a2c6b 40%, #2d1b4e 100%)"
                    backBg="linear-gradient(145deg, #3d1b6e 0%, #5a2c8b 40%, #3d1b6e 100%)"
                    nameColorClass="text-purple-300"
                    logoHeightClass="h-32"
                    logoFilter="drop-shadow(0 0 15px rgba(168,85,247,0.5))"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center px-4">
              <div className="group w-80">
                <div className="relative overflow-hidden text-center rounded-2xl p-8 border border-purple-500/35 transition-all duration-500 hover:border-purple-400/70 hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]" style={{ background: translucent('linear-gradient(145deg, #2d1b4e 0%, #4a2c6b 40%, #2d1b4e 100%)', 0.22), backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/12 via-transparent to-purple-600/8 opacity-70" />
                  <div className="border border-purple-400/30 rounded-xl p-4 relative z-10" style={{ background: 'rgba(168,85,247,0.08)' }}>
                    <p className="font-display text-sm uppercase tracking-widest text-purple-400/80">Coming Soon</p>
                    <p className="font-body text-xs text-muted-foreground mt-2">Join the Legendary League</p>
                  </div>
                  <motion.div className="absolute top-3 right-3 text-2xl" animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}>🏆</motion.div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Titan Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
            <span className="text-gold-coin text-glow-gold">Titan</span>
            <span className="text-foreground"> Sponsors</span>
          </h3>
          {titanSponsors.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto px-4">
              {titanSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <SponsorCard
                    sponsor={sponsor}
                    sizeClass="w-72"
                    borderClass="border-yellow-500/50"
                    hoverShadow="0 0 50px rgba(255,215,0,0.3)"
                    frontBg="linear-gradient(145deg, #5c3d10 0%, #7a5220 40%, #5c3d10 100%)"
                    backBg="linear-gradient(145deg, #6c4d10 0%, #8a6220 40%, #6c4d10 100%)"
                    nameColorClass="text-yellow-300"
                    logoHeightClass="h-32"
                    logoFilter="drop-shadow(0 0 15px rgba(255,215,0,0.4))"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center px-4">
              <div className="group w-80">
                <div className="relative overflow-hidden text-center rounded-2xl p-8 border border-yellow-500/35 transition-all duration-500 hover:border-yellow-400/70 hover:shadow-[0_0_50px_rgba(255,215,0,0.25)]" style={{ background: translucent('linear-gradient(145deg, #5c3d10 0%, #7a5220 40%, #5c3d10 100%)', 0.22), backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/12 via-transparent to-yellow-600/8 opacity-70" />
                  <div className="border border-gold-coin/30 rounded-xl p-4 relative z-10" style={{ background: 'rgba(255,215,0,0.08)' }}>
                    <p className="font-display text-sm uppercase tracking-widest text-gold-coin/80">Coming Soon</p>
                    <p className="font-body text-xs text-muted-foreground mt-2">Join the Titan League</p>
                  </div>
                  <motion.img src="/Gem Icon.webp" alt="" className="absolute top-2 right-2 w-6 h-6 object-contain opacity-40" animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Champion Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
            <span className="text-red-400 text-glow">Champion</span>
            <span className="text-foreground"> Sponsors</span>
          </h3>
          {championSponsors.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {championSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={sponsor}
                    sizeClass="w-64"
                    borderClass="border-red-500/50"
                    hoverShadow="0 0 40px rgba(239,68,68,0.3)"
                    frontBg="linear-gradient(145deg, #4a1a1a 0%, #6b2828 40%, #4a1a1a 100%)"
                    backBg="linear-gradient(145deg, #5a1a1a 0%, #7b3838 40%, #5a1a1a 100%)"
                    nameColorClass="text-red-300"
                    logoHeightClass="h-24"
                    logoFilter="drop-shadow(0 0 10px rgba(239,68,68,0.4))"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center px-4">
              <div className="group w-80">
                <div className="relative overflow-hidden text-center rounded-2xl p-8 border border-red-500/35 transition-all duration-500 hover:border-red-400/70 hover:shadow-[0_0_50px_rgba(239,68,68,0.3)]" style={{ background: translucent('linear-gradient(145deg, #4a1a1a 0%, #6b2828 40%, #4a1a1a 100%)', 0.22), backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/12 via-transparent to-red-500/8 opacity-70" />
                  <div className="border border-red-400/30 rounded-xl p-4 relative z-10" style={{ background: 'rgba(239,68,68,0.08)' }}>
                    <p className="font-display text-sm uppercase tracking-widest text-red-400/80">Coming Soon</p>
                    <p className="font-body text-xs text-muted-foreground mt-2">Join the Champions</p>
                  </div>
                  <motion.img src="/Gem Icon.webp" alt="" className="absolute top-2 right-2 w-6 h-6 object-contain opacity-40" animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Technical Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
            <span className="text-green-400 text-glow">Technical</span>
            <span className="text-foreground"> Sponsors</span>
          </h3>
          {technicalSponsors.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {technicalSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={sponsor}
                    sizeClass="w-64"
                    borderClass="border-green-500/50"
                    hoverShadow="0 0 40px rgba(34,197,94,0.3)"
                    frontBg="linear-gradient(145deg, #1a3a1a 0%, #2d5a2d 40%, #1a3a1a 100%)"
                    backBg="linear-gradient(145deg, #1a4a1a 0%, #3d6a3d 40%, #1a4a1a 100%)"
                    nameColorClass="text-green-300"
                    logoHeightClass="h-24"
                    logoFilter="drop-shadow(0 0 10px rgba(34,197,94,0.4))"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center px-4">
              <div className="group w-80">
                <div className="relative overflow-hidden text-center rounded-2xl p-8 border border-green-500/35 transition-all duration-500 hover:border-green-400/70 hover:shadow-[0_0_50px_rgba(34,197,94,0.3)]" style={{ background: translucent('linear-gradient(145deg, #1a3a1a 0%, #2d5a2d 40%, #1a3a1a 100%)', 0.22), backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/12 via-transparent to-green-500/8 opacity-70" />
                  <div className="border border-green-400/30 rounded-xl p-4 relative z-10" style={{ background: 'rgba(34,197,94,0.08)' }}>
                    <p className="font-display text-sm uppercase tracking-widest text-green-400/80">Coming Soon</p>
                    <p className="font-body text-xs text-muted-foreground mt-2">Technical Support Partners</p>
                  </div>
                  <motion.img src="/Gem Icon.webp" alt="" className="absolute top-2 right-2 w-6 h-6 object-contain opacity-40" animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Knowledge Partners */}
        {KnowledgePartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
              <span className="text-pink-400 text-glow">Knowledge</span>
              <span className="text-foreground"> Partners</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {KnowledgePartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={partner}
                    sizeClass="w-64"
                    borderClass="border-pink-500/50"
                    hoverShadow="0 0 40px rgba(236,72,153,0.3)"
                    frontBg="linear-gradient(145deg, #4a1a3a 0%, #6b2851 40%, #4a1a3a 100%)"
                    backBg="linear-gradient(145deg, #5a1a4a 0%, #7b3861 40%, #5a1a4a 100%)"
                    nameColorClass="text-pink-300"
                    logoHeightClass="h-24"
                    logoFilter="drop-shadow(0 0 10px rgba(236,72,153,0.4)) brightness(0) invert(1)"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Platform Partners */}
        {platformPartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
              <span className="text-purple-400 text-glow">Platform</span>
              <span className="text-foreground"> Partners</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto px-4">
              {platformPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <SponsorCard
                    sponsor={partner}
                    sizeClass="w-72"
                    borderClass="border-purple-400/60"
                    hoverShadow="0 0 50px rgba(168,85,247,0.3)"
                    frontBg="white"
                    backBg="linear-gradient(145deg, #2d1b4e 0%, #4a2c6b 40%, #2d1b4e 100%)"
                    nameColorClass="text-purple-300"
                    logoHeightClass="h-32"
                    logoFilter="drop-shadow(0 0 8px rgba(168,85,247,0.3))"
                    whiteFront={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Media Partners */}
        {mediaPartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
              <span className="text-pink-400 text-glow">Media</span>
              <span className="text-foreground"> Partners</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {mediaPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={partner}
                    sizeClass="w-64"
                    borderClass="border-pink-500/50"
                    hoverShadow="0 0 40px rgba(236,72,153,0.3)"
                    frontBg="linear-gradient(145deg, #4a1a3a 0%, #6b2851 40%, #4a1a3a 100%)"
                    backBg="linear-gradient(145deg, #5a1a4a 0%, #7b3861 40%, #5a1a4a 100%)"
                    nameColorClass="text-pink-300"
                    logoHeightClass="h-24"
                    logoFilter="drop-shadow(0 0 10px rgba(236,72,153,0.4)) brightness(0) invert(1)"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Technical Partners */}
        {technicalPartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
              <span className="text-green-400 text-glow">Technical</span>
              <span className="text-foreground"> Partner</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {technicalPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={partner}
                    sizeClass="w-80"
                    borderClass="border-green-400/60"
                    hoverShadow="0 0 50px rgba(34,197,94,0.3)"
                    frontBg="white"
                    backBg="linear-gradient(145deg, #1a3a1a 0%, #2d5a2d 40%, #1a3a1a 100%)"
                    nameColorClass="text-green-300"
                    logoHeightClass="h-28"
                    logoFilter="drop-shadow(0 0 8px rgba(34,197,94,0.25))"
                    whiteFront={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Community Partners */}
        {communityPartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
              <span className="text-blue-400 text-glow">Community</span>
              <span className="text-foreground"> Partners</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {communityPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={partner}
                    sizeClass="w-64"
                    borderClass="border-blue-400/40"
                    hoverShadow="0 0 40px rgba(96,165,250,0.25)"
                    frontBg="linear-gradient(145deg, #1e3a5f 0%, #2d5382 40%, #1e3a5f 100%)"
                    backBg="linear-gradient(145deg, #1e4a6f 0%, #3d6392 40%, #1e4a6f 100%)"
                    nameColorClass="text-blue-300"
                    logoHeightClass="h-28"
                    logoFilter="drop-shadow(0 0 10px rgba(96,165,250,0.4))"
                    renderFrontContent={
                      partner.logos && partner.logos.length > 1
                        ? () => (
                          <div className="flex items-center justify-center gap-3 w-full h-full px-4">
                            {partner.logos!.map((logoSrc, i) => (
                              <img
                                key={i}
                                src={logoSrc}
                                alt={`${partner.name} ${i + 1}`}
                                className="max-h-full object-contain"
                                style={{
                                  filter: "drop-shadow(0 0 10px rgba(96,165,250,0.4))",
                                  maxWidth: `${90 / partner.logos!.length}%`,
                                }}
                              loading="lazy" decoding="async" />
                            ))}
                          </div>
                        )
                        : undefined
                    }
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Beverage Partners */}
        {beveragePartners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">
              <span className="text-pink-400 text-glow">Beverage</span>
              <span className="text-foreground"> Partners</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {beveragePartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsorCard
                    sponsor={partner}
                    sizeClass="w-64"
                    borderClass="border-pink-500/50"
                    hoverShadow="0 0 40px rgba(236,72,153,0.3)"
                    frontBg="linear-gradient(145deg, #4a1a3a 0%, #6b2851 40%, #4a1a3a 100%)"
                    backBg="linear-gradient(145deg, #5a1a4a 0%, #7b3861 40%, #5a1a4a 100%)"
                    nameColorClass="text-pink-300"
                    logoHeightClass="h-24"
                    logoFilter="drop-shadow(0 0 10px rgba(236,72,153,0.4))"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Sponsors;
