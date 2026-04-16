import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_AI_API_KEY not set" }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // Call Gemini 3.1 Flash Image (Nano Banana) API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a high-quality photorealistic image: ${prompt}` }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    const data = await res.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);

    if (!imagePart) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    // Upload to Vercel Blob
    const buf = Buffer.from(imagePart.inlineData.data, "base64");
    const filename = `generated/${Date.now()}.jpg`;
    const blob = await put(filename, buf, {
      access: "public",
      contentType: imagePart.inlineData.mimeType || "image/jpeg",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[Generate Image] Failed:", error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
