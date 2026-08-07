import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import type { TeamInfo } from "@/lib/hacknestApi";

interface Props {
  team: TeamInfo;
  className?: string;
}

const CLAN_ICON   = "/Hacknest Resources/Clan.webp";
const LEADER_ICON = "/Hacknest Resources/PEEKA.webp";
const MEMBER_ICON = "/Hacknest Resources/barbarian.webp";

const TeamDetails = ({ team, className = "" }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className={`bg-transparent rounded-2xl shadow-xl border-[16px] overflow-hidden ${className}`}
      style={{ borderImage: 'url("/Frame.webp") 30 round' }}
    >
      {/* Section Title */}
      <div className="shrink-0 px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <img src={CLAN_ICON} alt="" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" loading="lazy" decoding="async" />
          <h3 className="text-lg sm:text-xl text-yellow-400" style={{ fontFamily: '"Clash Regular", sans-serif', textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Clan Details</h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
        {/* Clan Name */}
        <div>
          <label className="text-xs font-body font-bold text-black uppercase tracking-wider mb-1.5 block">
            Clan Name:
          </label>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg px-4 py-2.5">
            <span className="font-display text-base sm:text-lg text-black">{team.team_name}</span>
          </div>
        </div>

        {/* Clan Leader */}
        <div className="mt-1">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">👑</span>
            <label className="text-xs font-body font-bold text-black uppercase tracking-wider">
              Clan Leader
            </label>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border border-amber-100 rounded-xl">
            <img src={LEADER_ICON} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0" loading="lazy" decoding="async" />
            <div className="min-w-0">
              <span className="font-body font-bold text-sm sm:text-base text-black block truncate">
                {team.leader.name}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-black shrink-0" />
                <span className="text-xs text-black font-body truncate">{team.leader.email}</span>
              </div>
            </div>
            {/* RSVP dot */}
            <div className="ml-auto shrink-0" title={team.leader.rsvp ? "RSVP Confirmed" : "Awaiting RSVP"}>
              <div className={`w-3 h-3 rounded-full ${team.leader.rsvp ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : "bg-gray-300"}`} />
            </div>
          </div>
        </div>

        {/* Clan Members */}
        {team.members.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">⚔️</span>
              <label className="text-xs font-body font-bold text-black uppercase tracking-wider">
                Clan Warriors ({team.members.length})
              </label>
            </div>
            <div className="space-y-2">
              {team.members.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.08 }}
                  className="flex items-center gap-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-colors"
                >
                  <img src={MEMBER_ICON} alt="" className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0" loading="lazy" decoding="async" />
                  <div className="min-w-0">
                    <span className="font-body font-bold text-sm text-black block truncate">
                      {member.name}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-black shrink-0" />
                      <span className="text-xs text-black font-body truncate">{member.email}</span>
                    </div>
                  </div>
                  <div className="ml-auto shrink-0" title={member.rsvp ? "RSVP Confirmed" : "Awaiting RSVP"}>
                    <div className={`w-3 h-3 rounded-full ${member.rsvp ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : "bg-gray-300"}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamDetails;
