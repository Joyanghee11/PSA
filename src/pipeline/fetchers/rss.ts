import Parser from "rss-parser";
import type { RawNewsItem } from "@/lib/types";
import { rssFeeds } from "@/config/sources";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "PSA-News-Bot/1.0 (+https://psa-news.vercel.app)",
  },
});

async function fetchFeed(url: string, name: string): Promise<RawNewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      title: item.title?.trim() || "",
      link: item.link || "",
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      snippet:
        item.contentSnippet?.slice(0, 500) ||
        item.content?.replace(/<[^>]*>/g, "").slice(0, 500) ||
        "",
      source: name,
    }));
  } catch (error) {
    console.error(`[RSS] Failed to fetch ${name} (${url}):`, error);
    return [];
  }
}

export async function fetchAllRssFeeds(): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    rssFeeds.map((feed) => fetchFeed(feed.url, feed.name))
  );

  const items: RawNewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  console.log(`[RSS] Fetched ${items.length} items from ${rssFeeds.length} feeds`);
  return items;
}
