import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, Trash2, FileText, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { submitIdea, downloadSubmission, deleteSubmission } from "@/lib/hacknestApi";
import type { HackathonInfo, TeamInfo } from "@/lib/hacknestApi";

interface Props {
  hackathon: HackathonInfo;
  team: TeamInfo;
  token: string;
  onRefresh: () => void;
}

const STRATEGY_ICON = "/Hacknest Resources/Strategy.webp";
const SHIELD_ICON = "/Hacknest Resources/Sheild.webp";

const IdeaSubmission = ({ hackathon, team, token, onRefresh }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const { is_submission_open, has_submission_template, template_path } = hackathon;
  const { has_submission, submission_filename } = team;
  const API_BASE = import.meta.env.VITE_HACKNEST_API || "https://server.uemcseaiml.org/hacknest";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) { setError("Only PDF scrolls are accepted, warrior."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Your strategy scroll exceeds the 10MB limit."); return; }

    setUploading(true); setError(""); setSuccess("");
    try {
      await submitIdea(token, file);
      setSuccess("Battle strategy deployed successfully! ⚔️");
      setTimeout(() => { setSuccess(""); onRefresh(); }, 2000);
    } catch (err: any) { setError(err.message || "Strategy deployment failed."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleDownload = async () => {
    setDownloading(true); setError("");
    try { await downloadSubmission(token); }
    catch (err: any) { setError(err.message || "Download failed."); }
    finally { setDownloading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true); setError("");
    try {
      await deleteSubmission(token);
      setSuccess("Strategy recalled from the war room.");
      setConfirmDelete(false);
      setTimeout(() => { setSuccess(""); onRefresh(); }, 1500);
    } catch (err: any) { setError(err.message || "Failed to recall strategy."); }
    finally { setDeleting(false); }
  };

  const handleDownloadTemplate = async () => {
    if (template_path) {
      setDownloadingTemplate(true);
      const url = template_path.startsWith("http") ? template_path : `${API_BASE}${template_path.startsWith("/") ? "" : "/"}${template_path}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = template_path.split('/').pop() || "Battle_Template.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        // Fallback to opening in new tab if CORS prevents fetch
        window.open(url, "_blank");
      } finally {
        setDownloadingTemplate(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-transparent rounded-2xl shadow-xl border-[16px] overflow-hidden"
      style={{ borderImage: 'url("/Frame.webp") 30 round' }}
    >
      {/* Title */}
      <div className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <img src={STRATEGY_ICON} alt="" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" loading="lazy" decoding="async" />
          <h3 className="text-lg sm:text-xl text-yellow-400" style={{ fontFamily: '"Clash Regular", sans-serif', textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Strategy Submission</h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-4">
        {/* Status */}
        <div className="flex items-start gap-2 text-sm font-body">

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {is_submission_open ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-bold text-green-600">Strategy Window OPEN</span>
                </>
              ) : (
                <>
                  <img src={SHIELD_ICON} alt="" className="w-4 h-4 object-contain" loading="lazy" decoding="async" />
                  <span className="font-bold text-black">Strategy Window <span className="text-red-500">CLOSED</span></span>
                </>
              )}
            </div>
            <p className="text-black text-xs mt-0.5">
              {is_submission_open
                ? "⚔️ The war room is open — deploy your battle plans!"
                : "⚠️ The war room gates have closed. No strategies are being accepted."}
            </p>
          </div>
        </div>

        {/* Template Download */}
        {has_submission_template && template_path && (
          <button type="button"
            onClick={handleDownloadTemplate}
            disabled={downloadingTemplate}
            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {downloadingTemplate ? (
              <Loader2 className="w-5 h-5 text-blue-500 shrink-0 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-blue-500 shrink-0" />
            )}
            <div className="min-w-0">
              <span className="font-body font-bold text-sm text-blue-700">
                {downloadingTemplate ? "Unrolling Scroll..." : "Download Battle Template"}
              </span>
              <p className="text-blue-400 text-xs font-body">Use this scroll as the foundation for your strategy</p>
            </div>
          </button>
        )}

        {/* Current Submission */}
        {has_submission && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-green-200 bg-green-50/50">
            <FileText className="w-5 h-5 text-green-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-body font-bold text-sm text-green-700 truncate block">
                {submission_filename || "battle_strategy.pdf"}
              </span>
              <p className="text-green-500 text-xs font-body">Strategy deployed to the war room</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={handleDownload} disabled={downloading}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-40" title="Download">
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
              {is_submission_open && (
                <button type="button" onClick={() => setConfirmDelete(true)} disabled={deleting}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-40" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-red-200 bg-red-50 p-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm font-body font-bold">Recall this strategy from the war room?</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleDelete} disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 py-2 rounded-lg text-sm font-body font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-40">
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {deleting ? "Recalling..." : "Yes, Recall"}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-body font-bold bg-gray-200 text-black hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Closed State Display */}
        {!is_submission_open && !has_submission && (
          <div className="text-center p-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
            <img src={SHIELD_ICON} alt="" className="w-10 h-10 mx-auto mb-2 object-contain opacity-70" loading="lazy" decoding="async" />
            <p className="font-display text-base text-black">Strategy Window Closed</p>
            <p className="text-black text-xs font-body mt-1">The war room is not accepting battle plans at this time</p>
          </div>
        )}

        {/* Upload Button */}
        {is_submission_open && (
          <div>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-3 rounded-xl font-display text-sm tracking-wider text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Deploying Strategy..." : has_submission ? "Replace Battle Strategy" : "Deploy Battle Strategy"}
            </motion.button>
          </div>
        )}

        {/* Note */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <span className="text-sm shrink-0">💡</span>
          <p className="text-xs text-amber-700 font-body leading-relaxed">
            <span className="font-bold">Note:</span> Multiple battle strategies are accepted — each new deployment replaces the previous one. Only PDF war scrolls under 10MB are permitted.
          </p>
        </div>

        {/* Feedback */}
        {error && <p className="text-red-500 text-sm font-body">❌ {error}</p>}
        {success && <p className="text-green-600 text-sm font-body">✅ {success}</p>}
      </div>
    </motion.div>
  );
};

export default IdeaSubmission;
