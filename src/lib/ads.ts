import fs from "fs";
import path from "path";
import { list, put } from "@vercel/blob";

export type AdPosition =
  | "header-top"
  | "sidebar"
  | "between-articles"
  | "article-top"
  | "article-bottom"
  | "footer-above";

export interface AdBanner {
  id: string;
  position: AdPosition;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  active: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

const ADS_FILE = path.join(process.cwd(), "content", "ads.json");
const BLOB_PATH = "ads/banners.json";

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// Read: Blob first (with cache bust), then local file
export async function getAllBanners(): Promise<AdBanner[]> {
  if (hasBlobToken()) {
    try {
      const result = await list({ prefix: "ads/" });
      const blob = result.blobs.find((b) => b.pathname === BLOB_PATH);
      if (blob) {
        // Cache bust to always get latest
        const res = await fetch(blob.url, { cache: "no-store" });
        return (await res.json()) as AdBanner[];
      }
    } catch {
      // fall through to local
    }
  }

  try {
    if (fs.existsSync(ADS_FILE)) {
      return JSON.parse(fs.readFileSync(ADS_FILE, "utf-8")) as AdBanner[];
    }
  } catch {}
  return [];
}

// Write: Blob (Vercel runtime)
export async function saveBanners(banners: AdBanner[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(banners, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Sync read for build-time (server components)
export function getActiveBannersSync(position: AdPosition): AdBanner[] {
  let banners: AdBanner[] = [];
  try {
    if (fs.existsSync(ADS_FILE)) {
      banners = JSON.parse(fs.readFileSync(ADS_FILE, "utf-8")) as AdBanner[];
    }
  } catch {}

  const now = new Date().toISOString();
  return banners
    .filter((b) => {
      if (!b.active) return false;
      if (b.position !== position) return false;
      if (b.startDate && now < b.startDate) return false;
      if (b.endDate && now > b.endDate) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

// Async read for runtime (dynamic pages)
export async function getActiveBanners(position: AdPosition): Promise<AdBanner[]> {
  const all = await getAllBanners();
  const now = new Date().toISOString();
  return all
    .filter((b) => {
      if (!b.active) return false;
      if (b.position !== position) return false;
      if (b.startDate && now < b.startDate) return false;
      if (b.endDate && now > b.endDate) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);
}
