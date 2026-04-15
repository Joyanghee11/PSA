import type { RawNewsItem, ProcessedNewsItem } from "@/lib/types";

function normalize(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\uac00-\ud7af\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function scoreRelevance(item: RawNewsItem): number {
  let score = 50;
  const text = (item.title + " " + item.snippet).toLowerCase();

  const highPriority = [
    "record",
    "world record",
    "competition",
    "championship",
    "blackout",
    "safety",
    "death",
    "rescue",
    "new record",
  ];
  const mediumPriority = [
    "freediving",
    "freediver",
    "apnea",
    "breath hold",
    "AIDA",
    "depth",
  ];

  for (const keyword of highPriority) {
    if (text.includes(keyword)) score += 15;
  }
  for (const keyword of mediumPriority) {
    if (text.includes(keyword)) score += 5;
  }

  const pubDate = new Date(item.pubDate);
  const hoursAgo =
    (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 12) score += 20;
  else if (hoursAgo < 24) score += 10;
  else if (hoursAgo < 48) score += 5;

  return Math.min(score, 100);
}

export function processItems(
  rawItems: RawNewsItem[],
  maxAgeHours = 72
): ProcessedNewsItem[] {
  const cutoff = Date.now() - maxAgeHours * 60 * 60 * 1000;

  // Filter by age and valid data
  const filtered = rawItems.filter((item) => {
    if (!item.title || !item.link) return false;
    const pubDate = new Date(item.pubDate);
    return !isNaN(pubDate.getTime()) && pubDate.getTime() > cutoff;
  });

  // Normalize and score
  const processed: ProcessedNewsItem[] = filtered.map((item) => ({
    ...item,
    normalizedTitle: normalize(item.title),
    relevanceScore: scoreRelevance(item),
  }));

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const deduped: ProcessedNewsItem[] = [];

  for (const item of processed) {
    if (seenUrls.has(item.link)) continue;

    // Check title similarity against existing items
    const isDuplicate = deduped.some(
      (existing) => similarity(existing.normalizedTitle, item.normalizedTitle) > 0.6
    );
    if (isDuplicate) continue;

    seenUrls.add(item.link);
    deduped.push(item);
  }

  // Sort by relevance
  deduped.sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(
    `[Processor] ${rawItems.length} raw -> ${filtered.length} filtered -> ${deduped.length} deduped`
  );

  return deduped;
}
