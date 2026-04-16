import fs from "fs";
import path from "path";

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

const ADS_FILE = path.join(process.cwd(), "content", "ads.json");

export function getAllBanners(): AdBanner[] {
  try {
    if (!fs.existsSync(ADS_FILE)) return [];
    const raw = fs.readFileSync(ADS_FILE, "utf-8");
    return JSON.parse(raw) as AdBanner[];
  } catch {
    return [];
  }
}

export function saveBanners(banners: AdBanner[]): void {
  const dir = path.dirname(ADS_FILE);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ADS_FILE, JSON.stringify(banners, null, 2), "utf-8");
}

export function getActiveBanners(position: AdPosition): AdBanner[] {
  const all = getAllBanners();
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
