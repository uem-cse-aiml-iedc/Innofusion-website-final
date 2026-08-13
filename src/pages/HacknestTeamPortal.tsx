import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { fetchPortalData, hasIntegrationSecret, getNativePortalUrl } from "@/lib/hacknestApi";
import type { PortalData } from "@/lib/hacknestApi";
import PortalHeader from "@/components/hacknest/PortalHeader";
import StatusBanner from "@/components/hacknest/StatusBanner";
import TeamDetails from "@/components/hacknest/TeamDetails";
import RsvpSection from "@/components/hacknest/RsvpSection";
import IdeaSubmission from "@/components/hacknest/IdeaSubmission";

// ========================================================================================
// 🏰 HACKNEST CUSTOM TEAM PORTAL — Clash of Clans Themed
// Implements the full HackNest Team Portal SDK spec with InnoFusion CoC styling.
// Docs: https://www.hacknest.co.in/team-portal-sdk-docs
// ========================================================================================

// Flat black canvas; the village photograph was retired with the redesign.
const INNER_BG = "/work_Area.webp";
const INNER_BG_MOBILE = "/work_area_phone.webp";

const HacknestTeamPortal = () => {
  const { urlToken } = useParams();
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadingTexts = ["Brewing Elixir...", "Training Troops...", "Upgrading Defenses...", "Rallying your clan..."];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const params = new URLSearchParams(window.location.search);
  const token = urlToken || params.get("hn_token") || "";
  const isTestMode = params.get("hn_test_mode") === "1";

  // If no integration secret, redirect to native portal
  useEffect(() => {
    if (!hasIntegrationSecret() && token) {
      window.location.replace(getNativePortalUrl(token));
    }
  }, [token]);

  const loadData = useCallback(async () => {
    if (!token) {
      setError("No clan portal token found. Please use the link provided by your War Council.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPortalData(token);
      setPortalData(data);
    } catch (err: any) {
      if (err.message?.includes("403")) {
        window.location.replace(getNativePortalUrl(token));
        return;
      }
      setError(err.message || "Failed to load clan portal data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const renderSections = () => {
    if (!portalData) return null;
    const { hackathon, team } = portalData;
    const { status } = team;

    // Determine what panels to show based on SDK spec
    const showRsvp = status === "shortlisted";
    const showSubmission =
      status !== "rejected" &&
      status !== "waitlisted" &&
      status !== "shortlisted" &&
      hackathon.idea_submission_required;

    return (
      <>
        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-md:px-[10px]">
          {/* Left: Clan Details */}
          <div className="md:relative">
            <div className="md:absolute md:inset-0 h-full">
              <TeamDetails team={team} className="h-full flex flex-col" />
            </div>
          </div>

          {/* Right: Strategy Submission or RSVP */}
          <div className="space-y-5">
            {showRsvp && (
              <RsvpSection hackathon={hackathon} team={team} token={token} onRefresh={loadData} />
            )}
            {showSubmission && (
              <IdeaSubmission hackathon={hackathon} team={team} token={token} onRefresh={loadData} />
            )}
            {/* If neither RSVP nor submission, show an info card */}
            {!showRsvp && !showSubmission && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 text-center"
              >
                <span className="text-3xl block mb-2">🏰</span>
                <p className="font-display text-base text-black">No further action required</p>
                <p className="text-black text-xs font-body mt-1">Your clan's status is shown above. Stay vigilant, warrior!</p>
              </motion.div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(70% 45% at 50% -5%, hsl(45 100% 55% / 0.08) 0%, transparent 65%)',
        }}
      />
      {/* Frame Wrapper to allow scrolling and stretching with content */}
      <div className="relative flex-1 w-[95%] sm:w-[90%] md:w-[85%] max-w-6xl mx-auto my-[20px] sm:my-[4vh] md:my-[6vh] flex flex-col">
        {/* Inner Inset Background Desktop */}
        <div
          className="max-[499px]:hidden absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url("${INNER_BG}")`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Inner Inset Background Mobile */}
        <div
          className="min-[500px]:hidden absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url("${INNER_BG_MOBILE}")`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Subtle overlay for readability (restored) */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-black/5" />

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-4 md:px-6 pt-2 sm:pt-3 min-[500px]:max-md:mt-[19px] pb-[60px] sm:pb-[80px] md:pb-[100px] flex-1 flex flex-col">
          {/* Header */}
          <PortalHeader hackathon={portalData?.hackathon ?? null} token={token} isTestMode={isTestMode}>
            {portalData && <StatusBanner hackathon={portalData.hackathon} team={portalData.team} />}
          </PortalHeader>

          <div className="mt-5 space-y-5">
            {/* Loading */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 sm:py-32">
                <motion.img
                  src="/Hacknest Resources/Clan.webp"
                  alt=""
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-8 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                  animate={{ y: [-8, 8, -8], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* CoC Style Progress Bar */}
                <div className="w-64 sm:w-80 h-6 sm:h-8 bg-gray-900/80 rounded-full border-2 border-yellow-600/50 p-1 relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 relative"
                    initial={{ width: "5%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                    style={{ boxShadow: "inset 0 4px 6px rgba(255,255,255,0.5), inset 0 -4px 6px rgba(0,0,0,0.3)" }}
                  >
                    {/* Sheen effect */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/40 rounded-t-full" />
                  </motion.div>
                </div>

                <motion.p
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-white text-base sm:text-lg tracking-widest mt-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase"
                >
                  {loadingTexts[loadingTextIndex]}
                </motion.p>
              </motion.div>
            )}

            {/* Error */}
            {error && !loading && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 p-8 text-center max-w-md mx-auto">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="font-display text-xl text-red-600 mb-2">Battle Plan Failed</h3>
                <p className="text-black font-body mb-6 text-base leading-relaxed">
                  The war council could not recognize your clan.
                </p>
                <button type="button" onClick={() => window.location.href = "/"}
                  className="px-8 py-3 rounded-xl font-display text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md transition-all tracking-wider uppercase">
                  Return Home
                </button>
              </motion.div>
            )}

            {/* Sections */}
            {!loading && !error && renderSections()}
          </div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="pt-8 md:pt-12">
            {/* Native Portal Fallback */}
            {!error && (
              <div className="text-center">
                <p className="text-black font-bold text-lg font-body mb-2">If this page is not working open hacknest dashboard.</p>
                <button type="button"
                  onClick={() => window.location.assign(getNativePortalUrl(token))}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-300/60 bg-white/90 hover:bg-white transition-colors text-blue-600 text-sm font-body font-bold shadow-sm"
                >
                  <img src="/Hacknest Resources/hacknest-logo.webp" alt="" className="w-5 h-5 object-contain" loading="lazy" decoding="async" width={900} height={900} />
                  Open Native HackNest Portal
                </button>
              </div>
            )}

            {/* Help text */}
            <div className="bg-transparent rounded-xl mt-[10px] text-center pb-[20px]">
              <p className="inline-block bg-white/50 px-[10px] py-1 rounded-md text-black text-xs font-body mb-1">
                For any questions or issues, please contact the hackathon organizers.
              </p>
              {/* Powered by */}
              <div className="text-center mt-1">
                <p className="bg-white/50 px-[10px] py-1 rounded-md text-black/80 text-xs font-body inline-flex items-center gap-1.5">
                  Powered by
                  <a href="https://www.hacknest.co.in" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 transition-colors font-bold">
                    <img src="/Hacknest Resources/hacknest-logo.webp" alt="" className="w-4 h-4 object-contain brightness-0" loading="lazy" decoding="async" width={900} height={900} />
                    HackNest
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HacknestTeamPortal;
