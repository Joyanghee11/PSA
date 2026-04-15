import fs from "fs";
import path from "path";
import { list, put, del } from "@vercel/blob";
import type { Article, Category, Lang } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const BLOB_PREFIX = "content/articles/";

// --- Local file helpers (for build-time / static generation) ---

function readJsonFile(filePath: string): Article | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getLocalArticles(): Article[] {
  const files = walkDir(CONTENT_DIR);
  const articles: Article[] = [];
  for (const file of files) {
    const article = readJsonFile(file);
    if (article) articles.push(article);
  }
  return articles;
}

// --- Blob helpers (for runtime on Vercel) ---

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function getBlobArticles(): Promise<Article[]> {
  if (!hasBlobToken()) return [];
  try {
    const articles: Article[] = [];
    let cursor: string | undefined;

    do {
      const result = await list({
        prefix: BLOB_PREFIX,
        cursor,
      });

      for (const blob of result.blobs) {
        if (!blob.pathname.endsWith(".json")) continue;
        try {
          const res = await fetch(blob.url);
          const article = (await res.json()) as Article;
          articles.push(article);
        } catch {
          // skip invalid blobs
        }
      }

      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    return articles;
  } catch {
    return [];
  }
}

// --- Combined accessors ---

async function getAllArticlesCombined(): Promise<Article[]> {
  const local = getLocalArticles();
  const blob = await getBlobArticles();

  // Merge, deduplicate by slug (blob takes priority)
  const slugMap = new Map<string, Article>();
  for (const a of local) slugMap.set(a.slug, a);
  for (const a of blob) slugMap.set(a.slug, a);

  return Array.from(slugMap.values()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// --- Public API (sync, for build-time static generation) ---

export function getAllArticles(): Article[] {
  const local = getLocalArticles();
  return local
    .filter((a) => a.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getLocalArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export function getArticlesByCategory(category: Category): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getRecentArticles(count: number): Article[] {
  return getAllArticles().slice(0, count);
}

export function searchArticles(query: string, lang: Lang): Article[] {
  const q = query.toLowerCase();
  return getAllArticles().filter((article) => {
    const content = article[lang];
    return (
      content.title.toLowerCase().includes(q) ||
      content.summary.toLowerCase().includes(q) ||
      article.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

// --- Public API (async, for runtime API routes) ---

export async function getAllArticlesAsync(): Promise<Article[]> {
  const all = await getAllArticlesCombined();
  return all.filter((a) => a.status === "published");
}

export async function getAllArticlesIncludingDrafts(): Promise<Article[]> {
  return getAllArticlesCombined();
}

export async function getArticleBySlugAsync(
  slug: string
): Promise<Article | null> {
  const all = await getAllArticlesCombined();
  return all.find((a) => a.slug === slug) || null;
}

export async function writeArticleToBlob(article: Article): Promise<void> {
  const date = new Date(article.publishedAt);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const blobPath = `${BLOB_PREFIX}${year}/${month}/${day}/${article.slug}.json`;
  const json = JSON.stringify(article, null, 2);

  await put(blobPath, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function deleteArticleFromBlob(slug: string): Promise<boolean> {
  if (!hasBlobToken()) return false;

  try {
    const result = await list({ prefix: BLOB_PREFIX });
    for (const blob of result.blobs) {
      if (blob.pathname.includes(`/${slug}.json`)) {
        await del(blob.url);
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

// --- Legacy local write (for pipeline / GitHub Actions) ---

export function writeArticle(article: Article): void {
  const date = new Date(article.publishedAt);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const dir = path.join(CONTENT_DIR, year, month, day);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${article.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");
}
