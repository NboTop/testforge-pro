import { NextResponse } from "next/server";

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const githubDemoOwner = process.env.GITHUB_DEMO_OWNER?.trim();
  const githubDemoRepo = process.env.GITHUB_DEMO_REPO?.trim();
  const watsonxApiKey = process.env.WATSONX_API_KEY?.trim();

  const realPrCreationConfigured = Boolean(
    githubToken && githubDemoOwner && githubDemoRepo
  );

  const watsonxConfigured = Boolean(watsonxApiKey);

  const demoRepo =
    githubDemoOwner && githubDemoRepo
      ? `${githubDemoOwner}/${githubDemoRepo}`
      : "not configured";

  return NextResponse.json({
    status: "ok",
    features: {
      githubScan: "live-public-api",
      functionDetection: "regex-based",
      testGeneration: "template-based",
      realPrCreationConfigured,
      watsonxConfigured,
    },
    demoRepo,
    safety: {
      arbitraryRepoWrites: false,
      tokenExposedToFrontend: false,
      simulatedFallbackForOtherRepos: true,
    },
    timestamp: new Date().toISOString(),
  });
}