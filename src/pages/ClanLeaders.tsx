import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Linkedin, Sword } from "lucide-react";
import Navbar from "@/components/Navbar";

// ========================================================================================
// ✨ ADD NEW CLAN LEADERS HERE - Just add them to the arrays below!
// ========================================================================================

interface TeamMember {
  name: string;
  role: string;
  image: string;      // Path to image in /public folder
  linkedin?: string;  // LinkedIn profile URL (optional)
}

// Archer Queen Popup Component
const ArcherQueenPopup = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowMessage(true), 500);

      // Auto-hide after 2 seconds
      const autoHideTimer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoHideTimer);
      };
    } else {
      setShowMessage(false);
    }
  }, [isVisible, onClose]);

  const leaderQuotes = [
    { text: "Welcome to the War Council! Meet the leaders who forge our clan's destiny!", icon: "👑" },
    { text: "These warriors command our forces with wisdom and courage!", icon: "⚔️" },
    { text: "The mightiest clan is built by the mightiest leaders!", icon: "🏰" },
  ];

  const [quote] = useState(() => leaderQuotes[Math.floor(Math.random() * leaderQuotes.length)]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-[100] flex items-end gap-3 flex-row-reverse"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* Archer Queen Character */}
          <motion.div
            className="relative"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Static glow. Animating `scale` on a blur-2xl element forces the
                browser to re-run a large gaussian blur every frame. */}
            <div className="absolute inset-0 bg-gradient-radial from-purple-500/50 via-transparent to-transparent blur-2xl scale-150" />
            <img
              src="/ArcherQueen.webp"
              alt=""
              className="w-40 h-auto relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>

          {/* Speech Bubble */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                className="relative"
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div
                  className="relative rounded-2xl p-4 min-w-[240px] max-w-[320px]"
                  style={{
                    /* Same ~70% transparency as the cards */
                    background:
                      "linear-gradient(to bottom, rgba(88,28,135,0.32), rgba(76,29,149,0.28))",
                    border: "2px solid rgba(168,85,247,0.55)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow:
                      "0 16px 40px rgba(0,0,0,0.55), 0 0 30px rgba(168,85,247,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Static sheen — animate-pulse here repainted a full-size
                      gradient every frame for the life of the popup. */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10" />

                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-purple-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-purple-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-purple-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-purple-400 rounded-br-lg" />

                  {/* Pointer pointing right (towards character) */}
                  <div
                    className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: '16px solid rgba(168,85,247,0.55)',
                    }}
                  />

                  <button type="button"
                    onClick={onClose}
                    className="absolute -top-3 -left-3 w-7 h-7 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm hover:from-red-600 hover:to-red-800 transition-colors shadow-lg border-2 border-red-900 z-20"
                  >
                    ✕
                  </button>

                  <div className="text-center relative z-10">
                    <motion.div
                      className="flex justify-center mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                    >
                      <span className="text-3xl">{quote.icon}</span>
                    </motion.div>

                    <motion.p
                      className="text-white font-body text-sm leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {quote.text}
                    </motion.p>

                    <motion.p
                      className="text-purple-300 text-xs mt-2 font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      — Archer Queen
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/*
 * TeamCard
 *
 * Hoisted to module scope and memoised. It used to be declared inside
 * ClanLeaders, which meant React saw a brand-new component type on every
 * render — so each of the ~49 cards was unmounted and remounted (and every
 * entrance animation restarted) whenever any state changed. The popup alone
 * toggles state twice in the first two seconds, so the whole grid was torn
 * down and rebuilt twice on load. That was the lag.
 */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/*
 * Each section gets its own colour + COC troop badge, so a very long page
 * (9 sections, 49 people) reads as distinct rosters at a glance instead of
 * one repeating maroon block. Leadership stays gold-ringed regardless of
 * team — gold reads as "leader" everywhere else on the site (Treasury,
 * Sponsors), so keeping it universal here is what makes the ribbon legible.
 */
export interface TeamTheme {
  accent: string;
  troopIcon: string;
  troopAlt: string;
}

const TeamCard = React.memo(
  ({
    member,
    index,
    isLead = false,
    theme,
  }: {
    member: TeamMember;
    index: number;
    isLead?: boolean;
    theme: TeamTheme;
  }) => {
    const { accent, troopIcon, troopAlt } = theme;

    return (
      <motion.div
        /* whileInView + once means off-screen cards never animate, and nothing
           re-runs on scroll-back. Only transform/opacity are animated, so this
           stays on the compositor. */
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: Math.min(index, 6) * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="clan-card group relative w-72 flex"
        style={
          {
            "--accent": accent,
            "--accent-glow": hexToRgba(accent, 0.32),
          } as React.CSSProperties
        }
      >
        {/* Glass card face — dark base tinted with the team's accent colour,
            same diagonal-gradient language as Treasury / Special Bounties. */}
        <div
          className="relative flex flex-col w-full rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(165deg, ${hexToRgba(accent, 0.22)} 0%, rgba(255,255,255,0.03) 42%, rgba(10,10,12,0.6) 100%)`,
            border: `2px solid ${hexToRgba(accent, isLead ? 0.75 : 0.5)}`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: isLead
              ? `0 10px 30px rgba(0,0,0,0.5), 0 0 24px ${hexToRgba(accent, 0.25)}, inset 0 1px 0 rgba(255,255,255,0.14)`
              : "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top colour wash */}
          <div
            className="absolute inset-x-0 top-0 h-2/3 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${hexToRgba(accent, 0.24)} 0%, transparent 70%)` }}
          />

          {/* Hover sheen sweep — CSS-driven, no per-frame JS */}
          <div
            className="clan-sheen absolute inset-0 pointer-events-none"
            style={{
              transform: "translateX(-130%)",
              transition: "transform .7s ease",
              background: `linear-gradient(115deg, transparent 35%, ${hexToRgba(accent, 0.2)} 48%, rgba(255,255,255,0.12) 52%, transparent 65%)`,
            }}
          />

          {/* Lead ribbon — small cloth banner pinned to the top-left corner */}
          {isLead && (
            <div
              className="absolute -left-1 top-4 z-20 flex items-center gap-1 pl-3 pr-2.5 py-1 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, #a16207, #eab308)",
                clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
              }}
            >
              <Crown size={11} className="text-yellow-950" fill="currentColor" />
              <span className="font-display text-[9px] tracking-widest text-yellow-950">LEAD</span>
            </div>
          )}

          {/* Troop badge — replaces the old universal crown with a COC troop
              matched to the team, so the icon itself signals which roster
              this card belongs to. */}
          <div className="relative z-10 flex justify-center pt-4">
            <div className="clan-troop-badge relative w-14 h-14 flex items-center justify-center">
              <div
                className="absolute inset-[-6px] rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${hexToRgba(accent, 0.4)} 0%, transparent 70%)`, filter: "blur(6px)" }}
              />
              <img
                src={troopIcon}
                alt={troopAlt}
                loading="lazy"
                decoding="async"
                className="relative w-full h-full object-contain"
                style={{ filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 8px ${hexToRgba(accent, 0.5)})` }}
              />
            </div>
          </div>

          {/* Name — fixed two-line block so one- and two-line names align */}
          <div className="relative z-10 pt-2 pb-3 px-3 flex items-center justify-center min-h-[3.9rem]">
            <h3 className="font-display text-lg leading-tight text-center text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {member.name}
            </h3>
          </div>

          {/* Avatar */}
          <div className="relative z-10 flex justify-center pb-5">
            <div className={`relative ${isLead ? "w-32 h-32" : "w-28 h-28"}`}>
              {/* Static ring (was an infinite 360° rotation on every card).
                  Leads always get gold — that's the leadership signal;
                  everyone else's ring reflects their team's colour. */}
              <div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: isLead
                    ? "conic-gradient(from 0deg, #facc15, #f59e0b, #fde68a, #f59e0b, #facc15)"
                    : `conic-gradient(from 0deg, ${hexToRgba(accent, 0.9)}, ${hexToRgba(accent, 0.55)}, ${hexToRgba(accent, 0.9)})`,
                }}
              />
              <div className="relative w-full h-full rounded-full border-4 border-black/80 overflow-hidden bg-gray-900">
                <img
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member.name
                    )}&background=7c2d12&color=fbbf24&size=128&bold=true`;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Role — fixed height so the button below always lines up */}
          <div className="relative z-10 px-4 pb-4">
            <div
              className="flex items-center justify-center text-center py-2.5 px-3 rounded-lg min-h-[3rem]"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(accent, 0.2)}, ${hexToRgba(accent, 0.3)}, ${hexToRgba(accent, 0.2)})`,
                border: `1px solid ${hexToRgba(accent, 0.35)}`,
              }}
            >
              <span className="font-body font-bold text-white text-sm tracking-wide leading-snug">
                {member.role}
              </span>
            </div>
          </div>

          {/* Connect — mt-auto pins it to the bottom, and the slot is always
              rendered so members without a LinkedIn don't shrink their card */}
          <div className="relative z-10 mt-auto px-4 pb-4">
            {member.linkedin ? (
              <button
                type="button"
                onClick={() => window.open(member.linkedin, "_blank", "noopener,noreferrer")}
                className="clan-connect flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg w-full cursor-pointer transition-colors"
                style={{
                  background: "linear-gradient(90deg, rgba(37,99,235,0.75), rgba(29,78,216,0.75))",
                  border: "1px solid rgba(96,165,250,0.45)",
                }}
              >
                <Linkedin className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">Connect</span>
              </button>
            ) : (
              <div className="h-[42px]" aria-hidden="true" />
            )}
          </div>

          {/* Corner brackets, tinted to match the team */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl pointer-events-none" style={{ borderColor: hexToRgba(accent, 0.55) }} />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr pointer-events-none" style={{ borderColor: hexToRgba(accent, 0.55) }} />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl pointer-events-none" style={{ borderColor: hexToRgba(accent, 0.55) }} />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br pointer-events-none" style={{ borderColor: hexToRgba(accent, 0.55) }} />
        </div>
      </motion.div>
    );
  }
);
TeamCard.displayName = "TeamCard";

/*
 * One theme per section. Troop choices lean on the character art already
 * imported for the page's background gutters (CLAN_TROOPS below), so no new
 * assets are needed — just a different pairing of colour + troop per team.
 */
const TEAM_THEMES: Record<string, TeamTheme> = {
  organizers:  { accent: "#eab308", troopIcon: "/characters/track-warden.png",     troopAlt: "Grand Warden" },
  webdev:      { accent: "#3b82f6", troopIcon: "/characters/track-pekka.png",      troopAlt: "P.E.K.K.A" },
  core:        { accent: "#f59e0b", troopIcon: "/characters/track-barbarian.png",  troopAlt: "Barbarian" },
  graphics:    { accent: "#a855f7", troopIcon: "/characters/track-nightwitch.png", troopAlt: "Night Witch" },
  branding:    { accent: "#f97316", troopIcon: "/characters/track-wizard.png",     troopAlt: "Wizard" },
  pr:          { accent: "#ec4899", troopIcon: "/characters/track-archer.png",     troopAlt: "Archer" },
  decoration:  { accent: "#10b981", troopIcon: "/characters/coc-builder.png",      troopAlt: "Builder" },
  coordinator: { accent: "#06b6d4", troopIcon: "/characters/coc-wallbreaker.png",  troopAlt: "Wall Breaker" },
  executive:   { accent: "#f43f5e", troopIcon: "/characters/track-king.png",       troopAlt: "Barbarian King" },
};

/* Decorative troops drifting in the page gutters. Float only, no rotation. */
const CLAN_TROOPS = [
  { src: "/characters/coc-builder.png",      side: "left",  top: "14%", size: 250, glow: "rgba(255,150,80,0.35)" },
  { src: "/characters/track-barbarian.png",  side: "left",  top: "40%", size: 260, glow: "rgba(255,180,60,0.35)" },
  { src: "/characters/track-pekka.png",      side: "left",  top: "66%", size: 275, glow: "rgba(120,150,255,0.35)" },
  { src: "/characters/coc-wallbreaker.png",  side: "left",  top: "88%", size: 240, glow: "rgba(200,200,210,0.3)" },
  { src: "/characters/track-archer.png",     side: "right", top: "18%", size: 250, glow: "rgba(230,80,180,0.35)" },
  { src: "/characters/track-wizard.png",     side: "right", top: "44%", size: 255, glow: "rgba(80,170,255,0.35)" },
  { src: "/characters/track-warden.png",     side: "right", top: "70%", size: 260, glow: "rgba(168,85,247,0.35)" },
  { src: "/characters/track-nightwitch.png", side: "right", top: "92%", size: 250, glow: "rgba(230,80,180,0.35)" },
] as const;

const ClanTroops = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {CLAN_TROOPS.map((t, i) => (
      <div
        key={t.src + t.top}
        className={`absolute hidden xl:block ${t.side === "left" ? "left-2 2xl:left-10" : "right-2 2xl:right-10"}`}
        /* Mirror is a static transform, never animated — animating scaleX
           tweens through zero width and looks like the troop spinning. */
        style={{ top: t.top, transform: t.side === "right" ? "scaleX(-1)" : undefined }}
      >
        <motion.img
          src={t.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="object-contain"
          style={{
            height: t.size,
            opacity: 0.5,
            filter: `drop-shadow(0 8px 18px rgba(0,0,0,0.6)) drop-shadow(0 0 24px ${t.glow})`,
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4 + (i % 3) * 0.7, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
        />
      </div>
    ))}
  </div>
);

const ClanLeaders = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  // Show popup after page loads
  useEffect(() => {
    if (!popupDismissed) {
      const timer = setTimeout(() => setShowPopup(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [popupDismissed]);

  /* Stable identity — the popup effect depends on onClose, so an inline
     arrow here would re-fire the timers on every render. */
  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
    setPopupDismissed(true);
  }, []);

  // 👑 LEAD ORGANIZER - Edit details here
  const leadOrganizer: TeamMember = {
    name: "Diptimayee Patra",
    role: "Lead Organizer",
    image: "/team/diptimayee.webp",
    linkedin: "https://www.linkedin.com/in/diptimayee-patra-90a74a28a/",
  };

  // 🔥 CO-ORGANIZERS - Add new co-organizers to this array
  const coOrganizers: TeamMember[] = [
    {
      name: "MD Asif",
      role: "Co-Lead Organizer",
      image: "/team/asif2.webp",
      linkedin: "https://www.linkedin.com/in/mdasif2003/",
    },
    {
      name: "Pratyay Chatterjee",
      role: "Co-Lead Organizer",
      image: "/team/pratyay.webp",
      linkedin: "https://www.linkedin.com/in/pratyaychatterjee/",
    },
    {
      name: "Prakash Metla",
      role: "Co-Lead Organizer",
      image: "/team/Prakash.webp",
      linkedin: "https://www.linkedin.com/in/prakash-metla-921050253/"
    },
    {
      name: "Manjima Dutta",
      role: "Organizer",
      image: "/team/ManjhimaDutta.webp",
      linkedin: "https://www.linkedin.com/in/manjima-dutta-79260428a?utm_source=share_via&utm_content=profile&utm_medium=member_android"

    },
    {
      name: "Dipanjan sheth",
      role: "Organizer",
      image: "/team/DipanjanSeth.webp",
      linkedin: "https://www.linkedin.com/in/dipanjan-sheth-4391b7286"
    },
  ];

  const webDevelopmentTeam: TeamMember[] = [
    // { name: "Member Name", role: "Core Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },

    {
      name: "Nilanjan Saha",
      role: "Developer Lead",
      image: "/team/NilanjanSaha.webp",
      linkedin: "https://www.linkedin.com/in/nilanjan-saha-2449961a7/"
    },
    {
      name: "Justina Gomes",
      role: "Developer Team",
      image: "/team/JustinaGomes.webp",
      linkedin: "https://www.linkedin.com/in/justina-gomes-899b78234?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Puspendu Sekhar Das",
      role: "Developer Team",
      image: "/team/Puspendu.webp",
      linkedin: "https://www.linkedin.com/in/puspendu-sekhar-das/",
    },
  ]

  // 🔷 CORE TEAM - Add core team members here
  const coreTeam: TeamMember[] = [
    // { name: "Member Name", role: "Core Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },
    {
      name: "Srijeeta Bose",
      role: "Core Team",
      image: "/team/Srijeeta.webp",
      linkedin: "https://www.linkedin.com/in/srijeeta-bose-651ab6287?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Debarun Saha",
      role: "Core Team",
      image: "/team/DebarunSaha.webp",
      linkedin: "https://www.linkedin.com/in/debarun-saha-5aaa5028a/"
    },
    {
      name: "Annesha Gayen",
      role: "Core Team",
      image: "/team/Annesha.webp",
      linkedin: "https://www.linkedin.com/in/annesha-gayen?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"

    },
    {
      name: "Srija Majumdar",
      role: "Core Team",
      image: "/team/Srija.webp",
      linkedin: "https://www.linkedin.com/in/srija-majumdar-3b3044319?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Sufal Podder",
      role: "Core Team",
      image: "/team/SufalPodder.webp",
      linkedin: "https://www.linkedin.com/in/sufal-podder-bb7b76318"
    }

  ];

  // 🎨 GRAPHICS TEAM - Add graphics team members here
  const graphicsTeam: TeamMember[] = [
    // { name: "Member Name", role: "Graphics Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },
    {
      name: "Preeti Dey",
      role: "Graphics Lead",
      image: "/team/Preeti.webp",
      linkedin: "https://www.linkedin.com/in/preeti-dey227?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Aritra Chatterjee",
      role: "Graphics Team",
      image: "/team/Aritra.webp",
      linkedin: "https://www.linkedin.com/in/aritra-chatterjee-b76726303?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Anindita Mondal",
      role: "Graphics Team",
      image: "/team/Anindita.webp",
      linkedin: "https://www.linkedin.com/in/anindita-mondal-663527272?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Ayushman Paul",
      role: "Graphics Team",
      image: "/team/AyushmanPaul.webp",
      linkedin: "https://www.linkedin.com/in/ayushman-paul-388907320/"
    },
    {
      name: "Sayuri Ghosh",
      role: "Graphics Team",
      image: "/team/SayuriGhosh.webp",
      linkedin: "https://www.linkedin.com/in/sayurighosh/"
    },
    {
      name: "Soumi Deb Singha",
      role: "Graphics Team",
      image: "/team/SoumiDebSingha.webp",
      linkedin: "https://www.linkedin.com/in/soumi-deb-singha-76a094319?"
    },
    {
      name: "Ankan Paul",
      role: "Graphics Team",
      image: "/team/AnkanPaul.webp",
      linkedin: "https://www.linkedin.com/in/ankan-paul-955982318?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },

    {
      name: "Purnendu Pal",
      image: "/team/Purnendu.webp",
      role: "Graphics Team",
      linkedin: "https://www.linkedin.com/in/purnendu-pal-1210e2024?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }

  ];

  // 📣 MARKETING TEAM - Add marketing team members here
  const marketingTeam: TeamMember[] = [
    // { name: "Member Name", role: "Marketing Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },
    {
      name: "Soumajit Goswami",
      role: "Branding Team Lead",
      image: "/team/Soumajit.webp",
      linkedin: "https://www.linkedin.com/in/soumajit-goswami2005/"
    },
    {
      name: "Soubhagya Sadhukhan",
      role: "Branding Team",
      image: "/team/Soubhagya.webp",
      linkedin: "https://www.linkedin.com/in/soubhagya-sadhukhan-910330270?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }
  ];

  // 📱 SOCIAL MEDIA TEAM - Add social media team members here
  const socialMediaTeam: TeamMember[] = [
    // { name: "Member Name", role: "Social Media Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },
    {
      name: "Sourasanta Dutta",
      role: "PR Lead",
      image: "/team/Sourasanta.webp",
      linkedin: "https://www.linkedin.com/in/sourasanta-dutta-852345282?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
    },
    {
      name: "Sayan Adhikari",
      role: "PR Team",
      image: "/team/SayanAdhikari.webp",
      linkedin: "https://www.linkedin.com/in/sayan-adhikari-86a988291/"
    },


    {
      name: "Rangan Mukherjee",
      role: "PR Team",
      image: "/team/RanganMukherjee.webp",
      linkedin: "https://www.linkedin.com/in/rangan-mukherjee-8a5758316?utm_source=share_via&utm_content=profile&utm_medium=member_iosutm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },

    {
      name: "Shreya Chakraborty",
      role: "PR Team",
      image: "/team/Shreya.webp",
      linkedin: "https://www.linkedin.com/in/shreya-chakraborty-456037325?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }
  ];

  // 🎀 DECORATION TEAM - Add decoration team members here
  const decorationTeam: TeamMember[] = [
    // { name: "Member Name", role: "Decoration Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },
    {
      name: "Sourav Das",
      role: "Decoration Lead",
      image: "/team/Sourav.webp",
      linkedin: "https://www.linkedin.com/in/sourvdas/"
    },
    {
      name: "Srija pahari",
      role: "Decoration Team",
      image: "/team/SrijaPahari.webp",
      linkedin: "https://www.linkedin.com/in/srija-pahari-b4974728a/"
    },
    {
      name: "Sushmita Saha",
      role: "Decoration Team",
      image: "/team/Sushmita.webp",
      linkedin: "http://linkedin.com/in/sushmita-saha-664629323"
    }

  ];

  // 🗂️ COORDINATOR TEAM - Add coordinator team members here
  const coordinatorTeam: TeamMember[] = [
    // { name: "Member Name", role: "Coordinator", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },

    {
      name: "Prajukta Saha",
      role: "Coordinator",
      image: "/team/Prajukta.webp",
      linkedin: "https://www.linkedin.com/in/prajukta-saha-4a5618340?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Subarno Priyo Pandit",
      role: "Coordinator",
      image: "/team/SubarnoPriyoPandit.webp",
      linkedin: "www.linkedin.com/in/subarno-priyo-pandit-a87229322"
    },
    {
      name: "Pritam Paul",
      role: "Coordinator",
      image: "/team/PritamPaul.webp",
      linkedin: "https://www.linkedin.com/in/pritam-paul-530660306"
    },
    {
      name: "Shannidhya Guha",
      role: "Coordinator",
      image: "/team/ShannidhyaGuha.webp",
      linkedin: "https://www.linkedin.com/in/shannidhya-guha-484091319?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Sucharita Ghosh",
      role: "Coordinator",
      image: "/team/SuchitraGhosh.webp",
      linkedin: "https://www.linkedin.com/in/sucharita-ghosh-641a82318?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }
  ];

  // ⭐ EXECUTIVE TEAM - Add executive team members here
  const executiveTeam: TeamMember[] = [
    // { name: "Member Name", role: "Executive Team", image: "/team/photo.jpg", linkedin: "https://linkedin.com/in/..." },
    {
      name: "Ditipriya laha",
      role: "Executive Lead",
      image: "/team/Ditipriya.webp",
      linkedin: "https://www.linkedin.com/in/ditipriya-laha-b832b52b7?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      name: "Pritim Mondal",
      role: "Executive Team",
      image: "/team/Pritim.webp",
      linkedin: "https://www.linkedin.com/in/pritim-mondal-326ba6322/"
    },
    {
      name: "Priyanshu Chandra Sarker",
      role: "Executive Team",
      image: "/team/PriyanshuChandraSarkar.webp",
      linkedin: "https://www.linkedin.com/in/priyanshu-chandra-sarker-59719131a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Anish Dey",
      role: "Executive Team",
      image: "/team/AnishDey.webp",
      linkedin: "https://www.linkedin.com/in/anish-dey-28b426322?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }
  ];





  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/*
        Flat black canvas with one warm light pool, matching the landing page.
        This previously painted the village photograph with
        background-attachment: fixed, which repainted the whole viewport on
        every scroll frame - the same jank the home page had.
      */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(70% 45% at 50% -5%, hsl(45 100% 55% / 0.08) 0%, transparent 65%)',
        }}
      />

      {/* Clan troops drifting in the gutters, behind the grid */}
      <ClanTroops />

      {/*
        Hover is handled in CSS rather than Framer's whileHover. Animating
        boxShadow through JS forces a paint on every frame for every hovered
        card; a class swap with a GPU transform costs nothing.
      */}
      <style>{`
        /*
          --accent is set per-card (inline style on .clan-card), so this one
          hover rule automatically picks up each team's colour instead of
          needing a separate rule per section.
        */
        .clan-card { will-change: transform; }
        .clan-card > div {
          transition: transform .28s cubic-bezier(.22,1,.36,1),
                      box-shadow .28s ease,
                      border-color .28s ease;
        }
        .clan-card:hover > div {
          transform: translateY(-8px) scale(1.03);
          border-color: var(--accent, rgba(250,204,21,0.9));
          box-shadow: 0 22px 44px rgba(0,0,0,0.6),
                      0 0 34px var(--accent-glow, rgba(234,179,8,0.28)),
                      inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .clan-card:hover .clan-sheen { transform: translateX(130%); }
        .clan-troop-badge {
          animation: clanFloat 3.2s ease-in-out infinite;
        }
        @keyframes clanFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .clan-connect:hover { filter: brightness(1.18); }
        .clan-connect:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) {
          .clan-card > div { transition: none; }
          .clan-troop-badge { animation: none; }
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Archer Queen Popup */}
      <ArcherQueenPopup isVisible={showPopup && !popupDismissed} onClose={handleClosePopup} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Decorative crossed swords flanking the clan badge. Rendered as
              icons rather than bitmaps so they stay crisp at any density. */}
          <div className="flex items-center justify-center gap-4 mb-6" aria-hidden="true">
            <motion.div
              className="text-gold-coin drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              animate={{ rotate: [-14, -4, -14] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sword className="w-12 h-12 md:w-14 md:h-14 -scale-x-100" strokeWidth={1.75} />
            </motion.div>

            <motion.div
              className="relative"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/ShieldClan Badge Icon.webp"
                alt=""
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                loading="eager"
                decoding="async"
              />
            </motion.div>

            <motion.div
              className="text-gold-coin drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              animate={{ rotate: [14, 4, 14] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sword className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.75} />
            </motion.div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-4">
            The Clan Leaders
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 font-body max-w-2xl mx-auto"
          >
            Meet the mighty warriors who lead our <span className="text-red-400 font-bold">InnoFusion</span> clan to victory
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 mx-auto w-96 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
          />
        </motion.div>

        {/* Organizers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-10">
            <h2
              className="font-display text-3xl mb-2"
              style={{ color: TEAM_THEMES.organizers.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.organizers.accent, 0.4)}` }}
            >
              Organizers
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <TeamCard member={leadOrganizer} index={0} isLead={true} theme={TEAM_THEMES.organizers} />
            {coOrganizers.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index + 1} theme={TEAM_THEMES.organizers} />
            ))}
          </div>
        </motion.div>
        {/* WebDev Team Section */}
        {webDevelopmentTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.webdev.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.webdev.accent, 0.4)}` }}
              >
                Developer Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.webdev.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {webDevelopmentTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.webdev}
                />
              ))}
            </div>
          </motion.div>
        )}


        {/* Core Team Section */}
        {coreTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.core.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.core.accent, 0.4)}` }}
              >
                Core Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.core.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {coreTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.core}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Graphics Team Section */}
        {graphicsTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.graphics.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.graphics.accent, 0.4)}` }}
              >
                Graphics Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.graphics.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {graphicsTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.graphics}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Marketing Team Section */}
        {marketingTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.branding.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.branding.accent, 0.4)}` }}
              >
                Branding Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.branding.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {marketingTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.branding}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Social Media Team Section */}
        {socialMediaTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.pr.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.pr.accent, 0.4)}` }}
              >
                Public Relations Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.pr.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {socialMediaTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.pr}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Decoration Team Section */}
        {decorationTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.decoration.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.decoration.accent, 0.4)}` }}
              >
                Decoration Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.decoration.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {decorationTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.decoration}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Coordinator Team Section */}
        {coordinatorTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.coordinator.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.coordinator.accent, 0.4)}` }}
              >
                Coordinator Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.coordinator.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {coordinatorTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.coordinator}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Executive Team Section */}
        {executiveTeam.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16">
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: TEAM_THEMES.executive.accent, textShadow: `0 0 18px ${hexToRgba(TEAM_THEMES.executive.accent, 0.4)}` }}
              >
                Executive Team
              </h2>
              <div className="mx-auto w-64 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAM_THEMES.executive.accent}, transparent)` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {executiveTeam.map((member, index) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  isLead={member.role.toLowerCase().includes("lead")}
                  theme={TEAM_THEMES.executive}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Decoration - COC Themed Quote Box */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-20"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Outer golden border with glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-2xl blur-sm opacity-75" />

            {/* Main container */}
            <div className="relative bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 rounded-xl p-1 shadow-2xl">
              {/* Inner golden border */}
              <div className="bg-gradient-to-b from-yellow-600 via-amber-700 to-yellow-800 rounded-lg p-1">
                {/* Dark inner area */}
                <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-black rounded-lg px-8 py-6 relative overflow-hidden">
                  {/* Texture overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        rgba(255,215,0,0.1) 2px,
                        rgba(255,215,0,0.1) 4px
                      )`
                    }}
                  />

                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-yellow-500/70 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-yellow-500/70 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-yellow-500/70 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-yellow-500/70 rounded-br-lg" />

                  {/* Shield/Emblem icon */}
                  <div className="flex justify-center mb-3">
                    {/* Only `scale` is animated — it composites. The filter is
                        now static; animating drop-shadow re-rasterised the
                        element on every frame. */}
                    <motion.div
                      style={{ filter: 'drop-shadow(0 0 12px rgba(234,179,8,0.65))' }}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <img
                        src="/ShieldClan Badge Icon.webp"
                        alt=""
                        className="w-12 h-12"
                        onError={(e) => {
                          (e.target as HTMLImageElement).outerHTML = '<span class="text-4xl">🛡️</span>';
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Quote text */}
                  {/* Static text-shadow. Animating it repainted the whole
                      gradient-clipped headline every frame, forever. */}
                  <p
                    className="font-display text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-center relative z-10"
                    style={{ textShadow: '0 0 30px rgba(234,179,8,0.35)' }}
                  >
                    "Clash with Codes, Conquer with Vision! ~"
                  </p>

                  {/* Decorative line */}
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-yellow-600" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <img
                        src="/Gold Coin Icon.webp"
                        alt=""
                        className="w-5 h-5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).outerHTML = '<span class="text-yellow-500">✦</span>';
                        }}
                      />
                    </motion.div>
                    <div className="h-0.5 w-16 bg-gradient-to-l from-transparent via-yellow-500 to-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating sparkle effects */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: `${20 + i * 20}%`,
                  left: i % 2 === 0 ? '-10px' : 'auto',
                  right: i % 2 === 1 ? '-10px' : 'auto',
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClanLeaders;
