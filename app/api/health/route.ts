import { NextResponse } from "next/server";

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const githubDemoOwner = process.env.GITHUB_DEMO_OWNER?.trim();
  const githubDemoRepo = process.env.GITHUB_DEMO_REPO?.trim();
  const watsonxApiKey = process.env.WATSONX_API_KEY?.trim();
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

  const realPrCreationConfigured = Boolean(githubToken && githubDemoOwner && githubDemoRepo);
  const watsonxConfigured = Boolean(watsonxApiKey);
  const geminiConfigured = Boolean(geminiApiKey);

  const demoRepo =
    githubDemoOwner && githubDemoRepo
      ? `${githubDemoOwner}/${githubDemoRepo}`
      : "not configured";

  // Determine active test generation mode
  let testGenerationMode: string;
  if (geminiConfigured) {
    testGenerationMode = `gemini-live-with-template-fallback (${geminiModel})`;
  } else if (watsonxConfigured) {
    testGenerationMode = "watsonx-ready-with-template-fallback";
  } else {
    testGenerationMode = "template-based-mock-fallback";
  }

  return NextResponse.json({
    status: "ok",
    features: {
      githubScan: "live-public-api",
      functionDetection: "regex-based",
      testGeneration: testGenerationMode,
      realPrCreationConfigured,
      watsonxConfigured,
      geminiConfigured,
      ...(geminiConfigured && { geminiModel }),
    },
    demoRepo,
    safety: {
      arbitraryRepoWrites: false,
      tokenExposedToFrontend: false,
      geminiKeyExposedToFrontend: false,
      simulatedFallbackForOtherRepos: true,
    },
    timestamp: new Date().toISOString(),
  });
}