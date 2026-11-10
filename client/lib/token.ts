import type { User } from "@/api/types";

interface TokenPayload {
  user_id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  applicant_profile_id?: string;
  company_id?: string;
  status?: string;
  ban_reason?: string | null;
  ban_expires_at?: string | null;
}

/**
 * Decodes a JWT access token (without verification — trust is established
 * by the server-issued httpOnly refresh cookie flow) and maps the payload
 * to the client `User` shape.
 */
export function decodeTokenUser(token: string): User | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    // Base64url → Base64 → JSON
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const p: TokenPayload = JSON.parse(json);
    return {
      id: p.user_id,
      email: p.email,
      role: p.role,
      first_name: p.first_name ?? "",
      last_name: p.last_name ?? "",
      ...(p.applicant_profile_id && { applicant_profile_id: p.applicant_profile_id }),
      ...(p.company_id && { company_id: p.company_id }),
      ...(p.status && { status: p.status }),
      ...(p.ban_reason    && { ban_reason:     p.ban_reason }),
      ...(p.ban_expires_at && { ban_expires_at: p.ban_expires_at }),
    };
  } catch {
    return null;
  }
}
