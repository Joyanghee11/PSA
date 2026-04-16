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

// Read: works on both local and Vercel (read-only at build time)
export function getAllBanners(): AdBanner[] {
  try {
    if (!fs.existsSync(ADS_FILE)) return [];
    const raw = fs.readFileSync(ADS_FILE, "utf-8");
    return JSON.parse(raw) as AdBanner[];
  } catch {
    return [];
  }
}

// Write via GitHub API (works on Vercel serverless)
export async function saveBannersViaGitHub(banners: AdBanner[]): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not configured");

  const owner = "Joyanghee11";
  const repo = "PSA";
  const filePath = "content/ads.json";
  const content = Buffer.from(JSON.stringify(banners, null, 2)).toString("base64");

  // Get current file SHA
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    { headers: { Authorization: `Bearer ${token}`, "User-Agent": "DiveJournal" } }
  );

  let sha: string | undefined;
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }

  // Create or update file
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "DiveJournal",
      },
      body: JSON.stringify({
        message: "chore: update ads.json",
        content,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub API failed: ${putRes.status} ${err}`);
  }
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
