import { runDailyPipeline } from "../src/pipeline/orchestrator";

async function main() {
  console.log("=== PSA Daily News Pipeline ===");
  console.log(`Start time: ${new Date().toISOString()}`);

  const maxArticles = parseInt(process.env.MAX_ARTICLES || "10", 10);

  try {
    const result = await runDailyPipeline(maxArticles);

    console.log("\n=== Pipeline Summary ===");
    console.log(`Fetched:    ${result.fetchedCount} items`);
    console.log(`Processed:  ${result.processedCount} items`);
    console.log(`Generated:  ${result.generatedCount} articles`);
    console.log(`Skipped:    ${result.skippedCount}`);
    console.log(`Errors:     ${result.errors.length}`);

    if (result.articles.length > 0) {
      console.log("\nNew articles:");
      result.articles.forEach((slug) => console.log(`  - ${slug}`));
    }

    if (result.errors.length > 0) {
      console.log("\nErrors:");
      result.errors.forEach((err) => console.log(`  ✗ ${err}`));
    }

    console.log(`\nEnd time: ${new Date().toISOString()}`);
    process.exit(result.errors.length > 0 ? 1 : 0);
  } catch (error) {
    console.error("Pipeline failed:", error);
    process.exit(1);
  }
}

main();
