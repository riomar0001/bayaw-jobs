import { API_URL } from "@/lib/site";

// Server-side reads of public API data for metadata and the sitemap.
// Failures return null/[] so a slow or down API never breaks page rendering.

const TIMEOUT_MS = 5000;
const MAX_PAGES = 20;
const REVALIDATE_SECONDS = 3600;

async function getJson(path: string): Promise<unknown> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    if (!body || typeof body !== "object" || !("data" in body)) return null;
    return (body as { data: unknown }).data;
  } catch {
    // Network error, timeout or bad JSON: treat as no data.
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface SitemapEntry {
  id: string;
  updatedAt?: string;
}

/** Pages through a list endpoint and collects item ids. */
async function collectIds(path: string, listKey: string, limit: number): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await getJson(`${path}?page=${page}&limit=${limit}`);
    if (!isRecord(data)) break;

    const items = data[listKey];
    if (!Array.isArray(items)) break;
    for (const item of items) {
      if (isRecord(item) && typeof item.id === "string") {
        entries.push({
          id: item.id,
          ...(typeof item.created_at === "string" && { updatedAt: item.created_at }),
        });
      }
    }

    const meta = data.meta;
    if (!isRecord(meta) || meta.hasNextPage !== true) break;
  }
  return entries;
}

export const listJobIds = () => collectIds("/jobs", "data", 100);
export const listCompanyIds = () => collectIds("/business", "companies", 50);

export interface JobSeo {
  title: string;
  description: string;
  companyName?: string;
  location?: string;
}

export async function getJobSeo(id: string): Promise<JobSeo | null> {
  const data = await getJson(`/jobs/${encodeURIComponent(id)}`);
  if (!isRecord(data) || typeof data.title !== "string") return null;
  const company = isRecord(data.company) ? data.company : isRecord(data.company_information) ? data.company_information : null;
  return {
    title: data.title,
    description: typeof data.description === "string" ? data.description : "",
    ...(company && typeof company.company_name === "string" && { companyName: company.company_name }),
    ...(typeof data.location === "string" && { location: data.location }),
  };
}

export interface CompanySeo {
  name: string;
  about: string;
  industry?: string;
}

export async function getCompanySeo(id: string): Promise<CompanySeo | null> {
  const data = await getJson(`/business/${encodeURIComponent(id)}/public`);
  if (!isRecord(data) || typeof data.company_name !== "string") return null;
  return {
    name: data.company_name,
    about: typeof data.about === "string" ? data.about : "",
    ...(typeof data.industry === "string" && { industry: data.industry }),
  };
}
