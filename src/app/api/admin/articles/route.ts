import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getAllArticlesIncludingDrafts,
  writeArticleToBlob,
  getArticleBySlugAsync,
} from "@/lib/content";
import { createSlug } from "@/lib/utils";
import type { Article } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await getAllArticlesIncludingDrafts();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const slug = createSlug(body.en?.title || body.ko?.title || "untitled");

    // Check for duplicate slug
    const existing = await getArticleBySlugAsync(slug);
    if (existing) {
      return NextResponse.json(
        { error: "Article with this title already exists" },
        { status: 409 }
      );
    }

    const article: Article = {
      slug,
      publishedAt: now,
      updatedAt: now,
      status: body.status || "draft",
      category: body.category,
      tags: body.tags || [],
      sourceUrls: body.sourceUrls || [],
      en: {
        title: body.en?.title || "",
        summary: body.en?.summary || "",
        body: body.en?.body || "",
        metaDescription: body.en?.metaDescription || "",
      },
      ko: {
        title: body.ko?.title || "",
        summary: body.ko?.summary || "",
        body: body.ko?.body || "",
        metaDescription: body.ko?.metaDescription || "",
      },
      imageUrl: body.imageUrl || undefined,
      imageAlt: body.imageAlt || undefined,
    };

    await writeArticleToBlob(article);
    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Admin API] POST error:", message);
    return NextResponse.json(
      { error: `Failed to create article: ${message}` },
      { status: 500 }
    );
  }
}
