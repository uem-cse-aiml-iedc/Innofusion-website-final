import { motion } from "framer-motion";
import { buildImageUrl, getHacknestLogoUrl, getNativePortalUrl } from "@/lib/hacknestApi";
import type { HackathonInfo } from "@/lib/hacknestApi";

interface Props {
  hackathon: HackathonInfo | null;
  token: string;
  isTestMode: boolean;
  children?: React.ReactNode;
}

const PortalHeader = ({ hackathon, token, isTestMode, children }: Props) => {
  const hacknestLogo = getHacknestLogoUrl();
  const hackathonLogo = buildImageUrl(hackathon?.hackathon_logo ?? null);
  const instituteLogo = buildImageUrl(hackathon?.institute_logo ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative -mt-[3px]"
    >
      {/* Test Mode Badge */}
      {isTestMode && (
        <div className="flex justify-center mb-3">
          <div className="px-5 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-yellow-400 shadow-lg">
            <span className="font-display text-xs text-white tracking-wider">⚠️ TEST MODE — Data shown is for testing only</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-transparent px-[8%] sm:px-[10%] md:px-[12%] pt-[6%] sm:pt-[5%] md:pt-[2%] min-[970px]:pt-[0.9%] pb-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: HackNest Logo */}
          <div className="shrink-0">
            <img
              src={hacknestLogo}
              alt="HackNest"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
            decoding="async" />
          </div>

          {/* Center: Hackathon Name */}
          <div className="flex-1 min-w-0 text-center">
            <h1
              className="text-lg sm:text-2xl md:text-3xl text-yellow-400 tracking-wide"
              style={{ fontFamily: '"Clash Regular", sans-serif', textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
            >
              {hackathon?.name || "Team Portal"}
            </h1>
            <p className="text-white text-xs sm:text-sm font-body mt-0.5">Team Portal</p>
          </div>

          {/* Right: Hackathon + Institute logos */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/Innofusion3.0_Logo.webp"
              alt="InnoFusion"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain scale-[0.7]"
            decoding="async" width={1280} height={1280} />
            {hackathonLogo && (
              <img
                src={hackathonLogo}
                alt="Hackathon"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {instituteLogo && (
              <img
                src={instituteLogo}
                alt="Institute"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
        </div>

        {/* Render children (like StatusBanner) inside the header card */}
        {children && (
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PortalHeader;
