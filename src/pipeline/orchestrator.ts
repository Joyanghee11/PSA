import { fetchAllRssFeeds } from "./fetchers/rss";
import { scrapeAllTargets } from "./fetchers/web-scraper";
import { processItems } from "./processor";
import { generateArticle } from "./ai-writer";
import { getAllArticles, writeArticle } from "@/lib/content";
import type { ProcessedNewsItem } from "@/lib/types";

interface PipelineResult {
  fetchedCount: number;
  processedCount: number;
  generatedCount: number;
  skippedCount: number;
  articles: string[];
  errors: string[];
}

export async function runDailyPipeline(
  maxArticles = 10
): Promise<PipelineResult> {
  const result: PipelineResult = {
    fetchedCount: 0,
    processedCount: 0,
    generatedCount: 0,
    skippedCount: 0,
    articles: [],
    errors: [],
  };

  console.log("[Pipeline] Starting daily pipeline...");

  // 1. Fetch from all sources in parallel
  const [rssItems, scrapedItems] = await Promise.all([
    fetchAllRssFeeds(),
    scrapeAllTargets(),
  ]);

  const allRawItems = [...rssItems, ...scrapedItems];
  result.fetchedCount = allRawItems.length;
  console.log(`[Pipeline] Total fetched: ${allRawItems.length} items`);

  if (allRawItems.length === 0) {
    console.log("[Pipeline] No items fetched. Exiting.");
    return result;
  }

  // 2. Process: normalize, deduplicate, rank
  const processed = processItems(allRawItems);
  result.processedCount = processed.length;

  // 3. Filter out items whose URLs already exist in published articles
  const existingArticles = getAllArticles();
  const existingUrls = new Set(
    existingArticles.flatMap((a) => a.sourceUrls)
  );

  const newItems = processed.filter(
    (item) => !existingUrls.has(item.link)
  );

  console.log(
    `[Pipeline] ${processed.length} processed, ${newItems.length} new (${processed.length - newItems.length} already published)`
  );

  // 4. Take top N items and generate articles
  const toGenerate = newItems.slice(0, maxArticles);

  // Group related items (same topic) or process individually
  for (const item of toGenerate) {
    try {
      // Find related items (similar titles)
      const related = newItems.filter(
        (other) =>
          other !== item &&
          titleSimilarity(item.normalizedTitle, other.normalizedTitle) > 0.4
      );

      const group: ProcessedNewsItem[] = [item, ...related.slice(0, 2)];

      const article = await generateArticle(group);

      if (article) {
        writeArticle(article);
        result.generatedCount++;
        result.articles.push(article.slug);
        console.log(
          `[Pipeline] ✓ Published: ${article.slug} (${article.category})`
        );
      } else {
        result.skippedCount++;
      }

      // Small delay between API calls
      await sleep(2000);
    } catch (error) {
      const msg = `Failed to generate article for: ${item.title}`;
      console.error(`[Pipeline] ${msg}`, error);
      result.errors.push(msg);
    }
  }

  console.log(
    `[Pipeline] Complete. Generated: ${result.generatedCount}, Skipped: ${result.skippedCount}, Errors: ${result.errors.length}`
  );

  return result;
}

function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.split(" "));
  const wordsB = new Set(b.split(" "));
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
