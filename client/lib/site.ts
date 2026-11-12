export const SITE_NAME = "Bayaw Jobs";

export const SITE_DESCRIPTION =
  "Find jobs from top companies in the Philippines and connect with employers that match your skills and career goals.";

// Canonical public origin; used for absolute URLs in metadata, the sitemap and robots.txt.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayawjobs.riomar.dev"
).replace(/\/+$/, "");

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"
).replace(/\/+$/, "");

// Built from app/opengraph-image.tsx. Pages that set their own openGraph replace the
// inherited one entirely, so each must list the image again.
export const OG_IMAGE = "/opengraph-image";

/** Title, description, canonical URL and social cards for one public page. */
export function pageMetadata(title: string, description: string, path: string) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: path, images: [OG_IMAGE] },
    twitter: { title: `${title} | ${SITE_NAME}`, description, images: [OG_IMAGE] },
  };
}
