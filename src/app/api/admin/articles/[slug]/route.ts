import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getArticleBySlug, writeArticle, deleteArticle } from "@/lib/content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const existing = getArticleBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    const updated = {
      ...existing,
      updatedAt: new Date().toISOString(),
      status: body.status ?? existing.status,
      category: body.category ?? existing.category,
      tags: body.tags ?? existing.tags,
      sourceUrls: body.sourceUrls ?? existing.sourceUrls,
      en: { ...existing.en, ...body.en },
      ko: { ...existing.ko, ...body.ko },
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
      imageAlt: body.imageAlt !== undefined ? body.imageAlt : existing.imageAlt,
    };

    // Delete old file first (in case date changed), then write new
    deleteArticle(slug);
    writeArticle(updated);

    return NextResponse.json({ success: true, slug });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = deleteArticle(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
