import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Send, Lock, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { submitRsvp } from "@/lib/hacknestApi";
import type { HackathonInfo, TeamInfo } from "@/lib/hacknestApi";

interface Props {
  hackathon: HackathonInfo;
  team: TeamInfo;
  token: string;
  onRefresh: () => void;
}

const SHIELD_ICON = "/Hacknest Resources/Sheild.webp";

const RsvpSection = ({ hackathon, team, token, onRefresh }: Props) => {
  const allMembers = [
    { ...team.leader, isLeader: true },
    ...team.members.map((m) => ({ ...m, isLeader: false })),
  ];

  const hasAnyRsvpConfirmed = team.leader.rsvp || team.members.some((m) => m.rsvp);
  const [selections, setSelections] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    s[team.leader.id] = team.leader.rsvp;
    team.members.forEach((m) => { s[m.id] = m.rsvp; });
    return s;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openQrId, setOpenQrId] = useState<string | null>(null);

  const toggleQr = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenQrId((prev) => (prev === id ? null : id));
  };

  const selectedCount = Object.values(selections).filter(Boolean).length;
  const isReadOnly = hasAnyRsvpConfirmed;
  const isClosed = !hackathon.is_rsvp_open && !hasAnyRsvpConfirmed;

  const toggleMember = (id: string) => {
    if (isReadOnly) return;
    setSelections((prev) => ({ ...prev, [id]: !prev[id] }));
    setError("");
  };

  const handleSubmit = async () => {
    if (selectedCount < hackathon.min_team_size) {
      setError(`At least ${hackathon.min_team_size} warrior(s) must confirm for battle.`);
      return;
    }
    if (selectedCount > hackathon.max_team_size) {
      setError(`At most ${hackathon.max_team_size} warrior(s) can join the battlefield.`);
      return;
    }
    setSubmitting(true); setError("");
    try {
      const rsvpPayload: Record<string, boolean> = {};
      rsvpPayload["leader"] = selections[team.leader.id] || false;
      team.members.forEach((m) => { rsvpPayload[m.id] = selections[m.id] || false; });
      await submitRsvp(token, rsvpPayload);
      setSuccess("Warriors confirmed for the battlefield! ⚔️");
      setTimeout(() => onRefresh(), 1500);
    } catch (err: any) { setError(err.message || "Failed to confirm attendance."); }
    finally { setSubmitting(false); }
  };

  if (isClosed) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-transparent rounded-2xl shadow-xl border-[16px] overflow-hidden" style={{ borderImage: 'url("/Frame.webp") 30 round' }}>
        <div className="p-6 text-center">
          <Lock className="w-8 h-8 text-black mx-auto mb-2" />
          <h3 className="font-display text-lg text-black">RSVP Window Closed</h3>
          <p className="text-black text-xs font-body mt-1">The enlistment period has ended. Contact the War Council for changes.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="bg-transparent rounded-2xl shadow-xl border-[16px] overflow-hidden" style={{ borderImage: 'url("/Frame.webp") 30 round' }}>
      {/* Title */}
      <div className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <img src={SHIELD_ICON} alt="" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" loading="lazy" decoding="async" />
          <h3 className="text-lg sm:text-xl text-yellow-400" style={{ fontFamily: '"Clash Regular", sans-serif', textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
            {isReadOnly ? "Warriors Confirmed" : "Confirm Your Warriors"}
          </h3>
        </div>
        {!isReadOnly && (
          <p className="text-black text-xs font-body mt-1 ml-10">
            Select {hackathon.min_team_size}–{hackathon.max_team_size} warriors for the battlefield • {selectedCount} selected
          </p>
        )}
      </div>

      {/* Members */}
      <div className="p-4 sm:p-5 space-y-2">
        {allMembers.map((member) => {
          const checked = selections[member.id] || false;
          const isQrOpen = openQrId === member.id;
          return (
            <div
              key={member.id}
              className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-left ${checked
                ? "border-green-300 bg-green-50"
                : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                }`}
            >
              <div
                className={`flex items-center gap-3 w-full ${isReadOnly ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => toggleMember(member.id)}
              >
                {checked ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-black shrink-0" />
                )}

                <div className="min-w-0 flex-1 text-left flex flex-col justify-center">
                  <div>
                    <span className="font-body font-bold text-sm text-black">{member.name}</span>
                    {member.isLeader && (
                      <span className="ml-2 text-[10px] text-amber-600 font-bold">👑 Leader</span>
                    )}
                  </div>
                  {/* Show alphanumeric pass code underneath the name if RSVP'd */}
                  {member.rsvp && member.rsvp_code && (
                    <span className="text-[10px] font-mono text-emerald-600/80 font-bold tracking-widest mt-0.5 block">
                      {member.rsvp_code}
                    </span>
                  )}
                </div>

                {/* Inline QR Code beside the name */}
                {member.rsvp && member.rsvp_code && (
                  <div
                    className="ml-auto shrink-0 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AnimatePresence>
                      {isQrOpen && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, scale: 0.8 }}
                          animate={{ opacity: 1, width: "auto", scale: 1 }}
                          exit={{ opacity: 0, width: 0, scale: 0.8 }}
                          className="bg-white p-1 rounded-lg shadow-sm border border-green-200 overflow-hidden"
                          title="Scan this pass during physical verification"
                        >
                          <QRCode value={member.rsvp_code} size={42} level="M" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button type="button"
                      onClick={(e) => toggleQr(e, member.id)}
                      className="text-[10px] font-display bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-2 py-1.5 rounded-lg shadow-sm transition-colors uppercase tracking-wider whitespace-nowrap"
                    >
                      {isQrOpen ? "Hide" : "Show QR"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        {error && <p className="text-red-500 text-sm font-body mb-2">❌ {error}</p>}
        {success && <p className="text-green-600 text-sm font-body mb-2">✅ {success}</p>}
        {isReadOnly ? (
          <p className="text-black text-xs font-body text-center">The war roster is locked. Contact the War Council for edits.</p>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmit}
            disabled={submitting || selectedCount === 0}
            className="w-full py-3 rounded-xl font-display text-sm tracking-wider text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? "Confirming Warriors..." : "Confirm Battle Roster"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default RsvpSection;
