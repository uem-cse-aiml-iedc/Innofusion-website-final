// ========================================================================================
// 🐝 HACKNEST API SERVICE - Integration layer for custom team portal
// Docs: https://www.hacknest.co.in/team-portal-sdk-docs
// ========================================================================================

// In dev mode, use Vite proxy to bypass CORS; in production, hit the real API directly
const IS_DEV = import.meta.env.DEV;
const API_BASE_URL = IS_DEV
  ? "/hacknest-api"
  : (import.meta.env.VITE_HACKNEST_API || "https://server.uemcseaiml.org/hacknest");
const INTEGRATION_SECRET = import.meta.env.VITE_HACKNEST_INTEGRATION_SECRET || "";
const FRONTEND_URL = import.meta.env.VITE_HACKNEST_FRONTEND_URL || "https://www.hacknest.co.in";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HackathonInfo {
  id: string;
  name: string;
  accent_color: string;
  hackathon_logo: string | null;
  institute_logo: string | null;
  has_submission_template: boolean;
  template_path: string | null;
  is_submission_open: boolean;
  idea_submission_required: boolean;
  is_rsvp_open: boolean;
  min_team_size: number;
  max_team_size: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  rsvp: boolean;
  rsvp_code?: string;
}

export interface TeamInfo {
  id: string;
  team_name: string;
  status: "registered" | "shortlisted" | "rejected" | "waitlisted";
  leader: TeamMember;
  members: TeamMember[];
  has_submission: boolean;
  submission_path: string | null;
  submission_filename: string | null;
}

export interface PortalData {
  hackathon: HackathonInfo;
  team: TeamInfo;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (INTEGRATION_SECRET) {
    headers["x-hn-integration-secret"] = INTEGRATION_SECRET;
  }
  return headers;
}

/**
 * Build a full image URL from a potentially relative path returned by the API.
 */
export function buildImageUrl(relativePath: string | null): string | null {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  return `${API_BASE_URL}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
}

/**
 * Get the HackNest logo URL (static frontend asset).
 */
export function getHacknestLogoUrl(): string {
  return "/Hacknest Resources/hacknest-logo.webp";
}

/**
 * Get the original (native) portal URL with force_native flag.
 */
export function getNativePortalUrl(token: string): string {
  return `${FRONTEND_URL}/team-portal/${encodeURIComponent(token)}?force_native=1`;
}

/**
 * Check if the integration secret is configured.
 */
export function hasIntegrationSecret(): boolean {
  return !!INTEGRATION_SECRET;
}

// ─── API Endpoints ───────────────────────────────────────────────────────────

/**
 * GET /hackathon/team-portal-data/{token}
 * Fetch full portal state.
 */
export async function fetchPortalData(token: string): Promise<PortalData> {
  const res = await fetch(`${API_BASE_URL}/hackathon/team-portal-data/${token}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Portal data fetch failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * POST /hackathon/submit-idea/{token}
 * Upload/replace team idea submission (PDF only, max 10MB).
 */
export async function submitIdea(token: string, file: File): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/hackathon/submit-idea/${token}`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Submission failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * GET /hackathon/download-submission/{token}
 * Download current team submission file.
 */
export async function downloadSubmission(token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/hackathon/download-submission/${token}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Download failed (${res.status}): ${errorText}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Try to extract filename from Content-Disposition header
  const cd = res.headers.get("Content-Disposition");
  const filenameMatch = cd?.match(/filename="?([^";\n]+)"?/);
  a.download = filenameMatch?.[1] || "submission.pdf";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * DELETE /hackathon/delete-submission/{token}
 * Delete existing submission during open submission window.
 */
export async function deleteSubmission(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/hackathon/delete-submission/${token}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Deletion failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * PUT /hackathon/team-rsvp/{token}
 * Submit RSVP selections (shortlisted teams only).
 */
export async function submitRsvp(
  token: string,
  rsvpSelections: Record<string, boolean>
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/hackathon/team-rsvp/${token}`, {
    method: "PUT",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rsvp: rsvpSelections }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`RSVP submission failed (${res.status}): ${errorText}`);
  }

  return res.json();
}
