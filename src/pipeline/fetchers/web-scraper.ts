import * as cheerio from "cheerio";
import type { RawNewsItem } from "@/lib/types";
import { scrapeTargets } from "@/config/sources";

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "PSA-News-Bot/1.0 (+https://psa-news.vercel.app)",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function scrapeTarget(target: typeof scrapeTargets[number]): Promise<RawNewsItem[]> {
  try {
    const html = await fetchPage(target.url);
    const $ = cheerio.load(html);
    const items: RawNewsItem[] = [];

    $(target.selectors.articleList).each((_, el) => {
      const $el = $(el);
      const title = $el.find(target.selectors.title).first().text().trim();
      const linkEl = $el.find(target.selectors.link).first();
      let link = linkEl.attr("href") || "";

      if (link && !link.startsWith("http")) {
        const base = new URL(target.url);
        link = new URL(link, base.origin).toString();
      }

      const date =
        $el.find(target.selectors.date).first().attr("datetime") ||
        $el.find(target.selectors.date).first().text().trim() ||
        new Date().toISOString();

      const snippet = $el.find(target.selectors.snippet).first().text().trim().slice(0, 500);

      if (title && link) {
        items.push({
          title,
          link,
          pubDate: date,
          snippet,
          source: target.name,
        });
      }
    });

    console.log(`[Scraper] Found ${items.length} items from ${target.name}`);
    return items;
  } catch (error) {
    console.error(`[Scraper] Failed to scrape ${target.name}:`, error);
    return [];
  }
}

export async function scrapeAllTargets(): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    scrapeTargets.map((target) => scrapeTarget(target))
  );

  const items: RawNewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  console.log(`[Scraper] Total scraped: ${items.length} items`);
  return items;
}
