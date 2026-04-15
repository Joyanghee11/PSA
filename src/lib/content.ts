import fs from "fs";
import path from "path";
import type { Article, Category, Lang } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

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

export function getAllArticles(): Article[] {
  const files = walkDir(CONTENT_DIR);
  const articles: Article[] = [];
  for (const file of files) {
    const article = readJsonFile(file);
    if (article && article.status === "published") {
      articles.push(article);
    }
  }
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | null {
  const files = walkDir(CONTENT_DIR);
  for (const file of files) {
    const article = readJsonFile(file);
    if (article && article.slug === slug) {
      return article;
    }
  }
  return null;
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

export function getAllArticlesIncludingDrafts(): Article[] {
  const files = walkDir(CONTENT_DIR);
  const articles: Article[] = [];
  for (const file of files) {
    const article = readJsonFile(file);
    if (article) {
      articles.push(article);
    }
  }
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function deleteArticle(slug: string): boolean {
  const files = walkDir(CONTENT_DIR);
  for (const file of files) {
    const article = readJsonFile(file);
    if (article && article.slug === slug) {
      fs.unlinkSync(file);
      return true;
    }
  }
  return false;
}

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
