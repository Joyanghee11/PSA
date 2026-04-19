import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getArticleBySlugAsync,
  writeArticleToBlob,
  deleteArticleFromBlob,
} from "@/lib/content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const article = await getArticleBySlugAsync(slug);
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
  const existing = await getArticleBySlugAsync(slug);
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
      pinned: body.pinned !== undefined ? (body.pinned || undefined) : existing.pinned,
      evaluation: body.evaluation !== undefined ? body.evaluation : existing.evaluation,
    };

    // Delete old blob, write new
    await deleteArticleFromBlob(slug);
    await writeArticleToBlob(updated);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("[Admin API] PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
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
  const deleted = await deleteArticleFromBlob(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
