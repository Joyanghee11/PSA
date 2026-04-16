import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

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
const BLOB_URL = "https://whu7f1zl8tvyjqxy.public.blob.vercel-storage.com/ads/banners.json";

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// Read from Blob (direct URL, no list(), no cache)
export async function getAllBanners(): Promise<AdBanner[]> {
  if (hasBlobToken()) {
    try {
      const res = await fetch(BLOB_URL + "?t=" + Date.now(), {
        cache: "no-store",
      });
      if (res.ok) {
        return (await res.json()) as AdBanner[];
      }
    } catch {}
  }

  // Fallback: local file
  try {
    if (fs.existsSync(ADS_FILE)) {
      return JSON.parse(fs.readFileSync(ADS_FILE, "utf-8")) as AdBanner[];
    }
  } catch {}
  return [];
}

// Write to Blob
export async function saveBanners(banners: AdBanner[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(banners, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Async read filtered by position (for dynamic pages)
export async function getActiveBanners(
  position: AdPosition
): Promise<AdBanner[]> {
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
