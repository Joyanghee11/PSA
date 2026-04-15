import { NextResponse } from "next/server";
import { runDailyPipeline } from "@/pipeline/orchestrator";

export async function GET(request: Request) {
  // Verify cron secret for Vercel cron jobs
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDailyPipeline(5); // Limit to 5 for Vercel timeout
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Cron] Pipeline failed:", error);
    return NextResponse.json(
      { success: false, error: "Pipeline failed" },
      { status: 500 }
    );
  }
}
