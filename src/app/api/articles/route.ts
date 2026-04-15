import { NextResponse } from "next/server";
import { getAllArticlesAsync } from "@/lib/content";

export async function GET() {
  const articles = await getAllArticlesAsync();
  return NextResponse.json(articles);
}
