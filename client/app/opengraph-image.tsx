import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} – Find your dream job`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered once at build time and served as a static file.
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 55%, #e0f2fe 100%)",
          color: "#0f172a",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, color: "#0d9488" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>
          Find Your Dream Job Today
        </div>
        <div style={{ fontSize: 34, color: "#475569", marginTop: 28 }}>
          Connect with top companies hiring in the Philippines
        </div>
      </div>
    ),
    size,
  );
}
