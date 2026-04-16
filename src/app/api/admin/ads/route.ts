import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllBanners, saveBannersViaGitHub } from "@/lib/ads";
import type { AdBanner } from "@/lib/ads";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banners = getAllBanners();
  return NextResponse.json(banners);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const banners = getAllBanners();

    if (body._action === "update") {
      const idx = banners.findIndex((b: AdBanner) => b.id === body.id);
      if (idx === -1)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      const updated = { ...banners[idx], ...body };
      delete updated._action;
      banners[idx] = updated;
      await saveBannersViaGitHub(banners);
      return NextResponse.json({ success: true });
    }

    if (body._action === "delete") {
      const filtered = banners.filter((b: AdBanner) => b.id !== body.id);
      await saveBannersViaGitHub(filtered);
      return NextResponse.json({ success: true });
    }

    // Create
    const newBanner: AdBanner = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
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
    await saveBannersViaGitHub(banners);
    return NextResponse.json({ success: true, id: newBanner.id }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Failed: ${msg}` }, { status: 500 });
  }
}
