import { motion } from "framer-motion";
import type { HackathonInfo, TeamInfo } from "@/lib/hacknestApi";

interface Props {
  hackathon: HackathonInfo;
  team: TeamInfo;
}

type BannerType = "success" | "warning" | "error" | "info";

interface BannerConfig {
  type: BannerType;
  title: string;
  subtitle: string;
}

function getBannerConfig(hackathon: HackathonInfo, team: TeamInfo): BannerConfig {
  const { status } = team;
  const { idea_submission_required, is_submission_open } = hackathon;
  const { has_submission } = team;

  if (status === "rejected") {
    return { type: "error", title: "Application Not Selected", subtitle: "Your clan was not chosen for this battle. Train harder and return!" };
  }
  if (status === "shortlisted") {
    return { type: "success", title: "Clan Shortlisted! ⚔️", subtitle: "Your clan has been selected for the warfront. Confirm your warriors below." };
  }
  if (status === "waitlisted") {
    return { type: "warning", title: "Waitlisted — Stand By", subtitle: "Your clan is on the reserves. We'll summon you if a slot opens." };
  }
  if (!idea_submission_required) {
    return { type: "info", title: "Onboarding Successful", subtitle: "Your clan registration is complete and under review by the War Council." };
  }
  if (has_submission) {
    return { type: "success", title: "Strategy Received ✅", subtitle: "Your battle strategy has been received. You may update it while the gates remain open." };
  }
  if (is_submission_open) {
    return { type: "warning", title: "Strategy Window Open", subtitle: "The war room is open — deploy your battle strategy now!" };
  }
  return { type: "error", title: "Strategy Window Closed", subtitle: "The war room gates have closed. Contact the organizers if you need assistance." };
}

const bannerStyles: Record<BannerType, { bg: string; icon: string }> = {
  success: { bg: "from-green-500 to-green-600", icon: "🛡️" },
  warning: { bg: "from-amber-500 to-orange-500", icon: "⚔️" },
  error: { bg: "from-red-500 to-red-600", icon: "🔒" },
  info: { bg: "from-blue-500 to-indigo-500", icon: "🏰" },
};

const StatusBanner = ({ hackathon, team }: Props) => {
  const config = getBannerConfig(hackathon, team);
  const style = bannerStyles[config.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`rounded-xl bg-gradient-to-r ${style.bg} p-4 sm:p-5 shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{style.icon}</span>
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg text-white">
            {config.title}
          </h3>
          <p className="text-white/80 text-xs sm:text-sm font-body mt-0.5 leading-relaxed">
            {config.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBanner;
