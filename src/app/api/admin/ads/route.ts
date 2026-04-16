import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllBanners, saveBanners } from "@/lib/ads";
import type { AdBanner } from "@/lib/ads";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banners = await getAllBanners();
  return NextResponse.json(banners);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const banners = await getAllBanners();

    if (body._action === "update") {
      const idx = banners.findIndex((b: AdBanner) => b.id === body.id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      banners[idx] = { ...banners[idx], ...body, id: banners[idx].id, createdAt: banners[idx].createdAt };
      await saveBanners(banners);
      return NextResponse.json({ success: true });
    }

    if (body._action === "delete") {
      const filtered = banners.filter((b: AdBanner) => b.id !== body.id);
      await saveBanners(filtered);
      return NextResponse.json({ success: true });
    }

    // Create
    const newBanner: AdBanner = {
      id: crypto.randomUUID(),
      position: body.position || "header-top",
      imageUrl: body.imageUrl || "",
      linkUrl: body.linkUrl || "",
      altText: body.altText || "",
      active: body.active ?? true,
      order: body.order ?? banners.length,
      startDate: body.startDate || undefined,
      endDate: body.endDate || undefined,
      createdAt: new Date().toISOString(),
    };

    banners.push(newBanner);
    await saveBanners(banners);
    return NextResponse.json({ success: true, id: newBanner.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
