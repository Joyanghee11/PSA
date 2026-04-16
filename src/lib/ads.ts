import { list, put } from "@vercel/blob";

export type AdPosition = "header-top" | "sidebar" | "between-articles";

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

const BLOB_PATH = "ads/banners.json";

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getAllBanners(): Promise<AdBanner[]> {
  if (!hasBlobToken()) return [];
  try {
    const result = await list({ prefix: "ads/" });
    const blob = result.blobs.find((b) => b.pathname === BLOB_PATH);
    if (!blob) return [];
    const res = await fetch(blob.url);
    return (await res.json()) as AdBanner[];
  } catch {
    return [];
  }
}

export async function saveBanners(banners: AdBanner[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(banners, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

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
