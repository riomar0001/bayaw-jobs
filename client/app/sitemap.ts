import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { listCompanyIds, listJobIds } from "@/lib/public-api";

// Rebuilt hourly from the API so it follows the nightly data reset.
export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: "daily" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/jobs", priority: 0.9, changeFrequency: "daily" },
  { path: "/companies", priority: 0.8, changeFrequency: "daily" },
  { path: "/hire", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/signup", priority: 0.4, changeFrequency: "monthly" },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, companies] = await Promise.all([listJobIds(), listCompanyIds()]);

  return [
    ...STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.id}`,
      ...(job.updatedAt && { lastModified: job.updatedAt }),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...companies.map((company) => ({
      url: `${SITE_URL}/companies/${company.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
