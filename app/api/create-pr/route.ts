import { NextResponse } from "next/server";

type CreatePRResponse = {
  success: boolean;
  mode: "simulated-pr-preview";
  message: string;
  repositoryUrl: string;
  branchName: string;
  filePath: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
  note: string;
};

// Sanitize function name for use in branch names and file paths
function sanitizeFunctionName(functionName: string): string {
  // Convert to lowercase and replace special characters with hyphens
  return functionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testCode, functionName } = body;

    if (!testCode || !functionName) {
      return NextResponse.json(
        { error: "Test code and function name are required" },
        { status: 400 }
      );
    }

    // Sanitize function name for file paths and branch names
    const safeFunctionName = sanitizeFunctionName(functionName);

    // Simulated PR preview response
    const response: CreatePRResponse = {
      success: true,
      mode: "simulated-pr-preview",
      message: "No real PR was created in demo mode. This preview shows what would be prepared for GitHub.",
      repositoryUrl: "https://github.com/NboTop/testforge-pro",
      branchName: `testforge/add-tests-${safeFunctionName}`,
      filePath: `__tests__/${safeFunctionName}.test.ts`,
      commitMessage: `test: add Jest tests for ${functionName}`,
      prTitle: `Add tests for ${functionName}`,
      prBody: `This simulated pull request would add generated Jest tests for the \`${functionName}\` function.\n\nIn production, this would:\n- Create a new branch from main\n- Commit the test file using authenticated GitHub API access\n- Open a pull request with the changes\n\n**Note:** Real PR creation requires GitHub authentication and write permissions. This MVP prepares the request details without modifying any repository.`,
      note: "Real PR creation requires GitHub authentication and write permissions. This MVP prepares request details without modifying any repository.",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating PR:", error);
    return NextResponse.json(
      { error: "Failed to create pull request" },
      { status: 500 }
    );
  }
}

// Made with Bob
