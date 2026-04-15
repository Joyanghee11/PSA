import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { Article, ProcessedNewsItem } from "@/lib/types";
import { createSlug } from "@/lib/utils";

const articleSchema = z.object({
  en: z.object({
    title: z.string().min(10),
    summary: z.string().min(20).max(200),
    body: z.string().min(100),
    metaDescription: z.string().min(20).max(160),
  }),
  ko: z.object({
    title: z.string().min(5),
    summary: z.string().min(10).max(200),
    body: z.string().min(100),
    metaDescription: z.string().min(10).max(160),
  }),
  category: z.enum([
    "competition",
    "records",
    "training",
    "safety",
    "equipment",
    "science",
    "environment",
    "people",
  ]),
  tags: z.array(z.string()).min(2).max(8),
});

const SYSTEM_PROMPT = `You are a professional bilingual (English/Korean) journalist specializing in freediving and underwater sports. Your role is to write original, engaging news articles based on source material.

RULES:
1. Write ORIGINAL articles. Do NOT copy source text verbatim.
2. Produce both English and Korean versions. The Korean version should be a natural Korean article, NOT a direct translation.
3. Articles should be 300-500 words in each language.
4. Use HTML tags for formatting: <p>, <strong>, <em>, <h3>, <ul>, <li>.
5. Be factual and accurate. Do not invent facts not present in the sources.
6. Choose the most appropriate category from: competition, records, training, safety, equipment, science, environment, people.
7. Generate 3-6 relevant tags in English (lowercase).
8. The summary should be 1-2 sentences, under 160 characters.
9. The metaDescription should be SEO-friendly, under 155 characters.

OUTPUT FORMAT: Return ONLY a valid JSON object with this structure:
{
  "en": { "title": "...", "summary": "...", "body": "...", "metaDescription": "..." },
  "ko": { "title": "...", "summary": "...", "body": "...", "metaDescription": "..." },
  "category": "...",
  "tags": ["...", "..."]
}`;

export async function generateArticle(
  items: ProcessedNewsItem[]
): Promise<Article | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[AI Writer] ANTHROPIC_API_KEY not set");
    return null;
  }

  const client = new Anthropic({ apiKey });

  const sourceText = items
    .map(
      (item, i) =>
        `Source ${i + 1} [${item.source}]:\nTitle: ${item.title}\nURL: ${item.link}\nSnippet: ${item.snippet}`
    )
    .join("\n\n");

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Write a news article based on the following source(s):\n\n${sourceText}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI Writer] No JSON found in response");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = articleSchema.parse(parsed);

    const now = new Date().toISOString();
    const slug = createSlug(validated.en.title);

    const article: Article = {
      slug,
      publishedAt: now,
      updatedAt: now,
      status: "published",
      category: validated.category,
      tags: validated.tags,
      sourceUrls: items.map((item) => item.link),
      en: validated.en,
      ko: validated.ko,
    };

    console.log(`[AI Writer] Generated article: ${slug}`);
    return article;
  } catch (error) {
    console.error("[AI Writer] Failed to generate article:", error);
    return null;
  }
}
