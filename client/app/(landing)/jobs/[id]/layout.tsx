import type { Metadata } from "next";
import { getJobSeo } from "@/lib/public-api";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";

const MAX_DESCRIPTION = 160;

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const path = `/jobs/${encodeURIComponent(id)}`;
  const job = await getJobSeo(id);

  // Unknown or unreachable: keep the page out of the index rather than index an empty shell.
  if (!job) {
    return { title: "Job Not Found", robots: { index: false, follow: true } };
  }

  const title = job.companyName ? `${job.title} at ${job.companyName}` : job.title;
  const where = job.location ? ` in ${job.location}` : "";
  const description = truncate(
    job.description || `${title}${where}. Apply on ${SITE_NAME}.`,
    MAX_DESCRIPTION,
  );

  return {
    // absolute: the parent /jobs or /companies layout has a plain title, which stops the root template.
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", title: `${title} | ${SITE_NAME}`, description, url: path, images: [OG_IMAGE] },
    twitter: { title: `${title} | ${SITE_NAME}`, description, images: [OG_IMAGE] },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
