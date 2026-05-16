import { NextResponse } from "next/server";

export const runtime = "nodejs";

type FunctionItem = {
  id: string;
  name: string;
  file: string;
  tested: boolean;
  severity: "High" | "Medium" | "Low";
  reason: string;
};

type AnalyzeResponse = {
  success: boolean;
  repo: string;
  totalFunctions: number;
  untestedFunctions: number;
  generatedTests: number;
  estimatedTimeSaved: string;
  functions: FunctionItem[];
  mode: "live-github-scan" | "demo-fallback";
  message: string;
  note: string;
};

// Demo fallback data
const DEMO_FUNCTIONS: FunctionItem[] = [
  {
    id: "demo-1",
    name: "calculateFinalPrice",
    file: "src/paymentService.ts",
    tested: false,
    severity: "High",
    reason: "Payment calculation has no matching test coverage",
  },
  {
    id: "demo-2",
    name: "applyDiscountCode",
    file: "src/discountCalculator.ts",
    tested: false,
    severity: "Medium",
    reason: "Discount logic has no edge-case tests",
  },
  {
    id: "demo-3",
    name: "validateUserEmail",
    file: "src/userValidator.ts",
    tested: true,
    severity: "Low",
    reason: "Matching test file found",
  },
];

// Regex patterns for detecting exported functions
const FUNCTION_PATTERNS = [
  /export\s+function\s+(\w+)\s*\(/g,
  /export\s+async\s+function\s+(\w+)\s*\(/g,
  /export\s+const\s+(\w+)\s*=\s*\(/g,
  /export\s+const\s+(\w+)\s*=\s*async\s*\(/g,
  /function\s+(\w+)\s*\(/g,
];

// Parse GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

// Determine severity based on file path
function determineSeverity(filePath: string): "High" | "Medium" | "Low" {
  const lowerPath = filePath.toLowerCase();
  
  if (
    lowerPath.includes("payment") ||
    lowerPath.includes("auth") ||
    lowerPath.includes("security")
  ) {
    return "High";
  }
  
  if (
    lowerPath.includes("validation") ||
    lowerPath.includes("parser") ||
    lowerPath.includes("api")
  ) {
    return "Medium";
  }
  
  return "Low";
}

// Extract route path from Next.js API route file path
function extractRoutePath(filePath: string): string | null {
  // Check if file is in app/api/ directory and ends with route.ts
  if (!filePath.startsWith("app/api/") || !filePath.endsWith("/route.ts")) {
    return null;
  }
  
  // Remove "app" prefix and "/route.ts" suffix
  // app/api/analyze/route.ts -> /api/analyze
  const routePath = filePath
    .replace(/^app/, "")
    .replace(/\/route\.ts$/, "");
  
  return routePath;
}

// Check if function is a Next.js API route handler
function isApiRouteHandler(functionName: string, filePath: string): boolean {
  const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  return (
    httpMethods.includes(functionName) &&
    filePath.startsWith("app/api/") &&
    filePath.endsWith("/route.ts")
  );
}

// Detect functions in file content using regex
function detectFunctions(content: string, filePath: string): FunctionItem[] {
  const functions: FunctionItem[] = [];
  const foundNames = new Set<string>();
  
  for (const pattern of FUNCTION_PATTERNS) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const functionName = match[1];
      if (functionName && !foundNames.has(functionName)) {
        foundNames.add(functionName);
        const severity = determineSeverity(filePath);
        
        // Transform display name for API route handlers
        let displayName = functionName;
        let reason = `Function detected in ${filePath} - real coverage verification planned for future AST implementation`;
        
        if (isApiRouteHandler(functionName, filePath)) {
          const routePath = extractRoutePath(filePath);
          if (routePath) {
            displayName = `${functionName} ${routePath}`;
            reason = "Route handler detected in app/api/[route]/route.ts - real coverage verification planned for future AST implementation";
          }
        }
        
        functions.push({
          id: `${filePath}-${functionName}`,
          name: displayName,
          file: filePath,
          tested: false,
          severity,
          reason,
        });
      }
    }
  }
  
  return functions;
}

// Priority directories for source files
const PRIORITY_DIRECTORIES = [
  "src/",
  "lib/",
  "packages/",
  "core/",
  "app/",
  "components/",
  "utils/",
];

// Deprioritized directories (test/demo/example paths)
const DEPRIORITIZED_DIRECTORIES = [
  "e2e/",
  "examples/",
  "example/",
  "demo/",
  "demos/",
  "fixtures/",
  "test/",
  "tests/",
];

// Check if file is in priority directory
function isInPriorityDirectory(path: string): boolean {
  const lowerPath = path.toLowerCase();
  return PRIORITY_DIRECTORIES.some((dir) => lowerPath.startsWith(dir));
}

// Check if file is in deprioritized directory
function isInDeprioritizedDirectory(path: string): boolean {
  const lowerPath = path.toLowerCase();
  return DEPRIORITIZED_DIRECTORIES.some((dir) => lowerPath.includes(dir));
}

// Filter and categorize source files
function filterSourceFiles(
  tree: { path: string; type: string }[]
): { priority: { path: string }[]; secondary: { path: string }[] } {
  const priority: { path: string }[] = [];
  const secondary: { path: string }[] = [];

  for (const item of tree) {
    if (item.type !== "blob") continue;

    const path = item.path.toLowerCase();

    // Check file extension
    if (
      !path.endsWith(".ts") &&
      !path.endsWith(".tsx") &&
      !path.endsWith(".js") &&
      !path.endsWith(".jsx")
    ) {
      continue;
    }

    // Exclude paths
    if (
      path.includes("node_modules") ||
      path.includes("dist") ||
      path.includes("build") ||
      path.includes(".next") ||
      path.includes("coverage") ||
      path.includes(".test.") ||
      path.includes(".spec.") ||
      path.includes("__tests__")
    ) {
      continue;
    }

    // Categorize by priority
    if (isInPriorityDirectory(item.path)) {
      priority.push({ path: item.path });
    } else if (!isInDeprioritizedDirectory(item.path)) {
      secondary.push({ path: item.path });
    }
  }

  return { priority, secondary };
}

// Scan GitHub repository
async function scanGitHubRepo(
  owner: string,
  repo: string
): Promise<FunctionItem[] | null> {
  try {
    // Fetch repository metadata to get default branch
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "TestForge-Pro",
        },
      }
    );

    if (!repoResponse.ok) {
      console.error("Failed to fetch repository metadata:", repoResponse.status);
      return null;
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch || "main";

    // Fetch repository tree
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "TestForge-Pro",
        },
      }
    );

    if (!treeResponse.ok) {
      console.error("Failed to fetch repository tree:", treeResponse.status);
      return null;
    }

    const treeData = await treeResponse.json();

    // Filter and categorize source files
    const { priority, secondary } = filterSourceFiles(treeData.tree);

    // Two-tier selection: prioritize high-quality source files
    let selectedFiles: { path: string }[] = [];

    // First, add priority files (up to 8)
    selectedFiles = priority.slice(0, 8);

    // If we need more files, supplement with secondary files
    if (selectedFiles.length < 8) {
      const remaining = 8 - selectedFiles.length;
      selectedFiles = [...selectedFiles, ...secondary.slice(0, remaining)];
    }

    // Fetch file contents and detect functions
    const allFunctions: FunctionItem[] = [];

    for (const file of selectedFiles) {
      try {
        const contentResponse = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`,
          {
            headers: {
              "User-Agent": "TestForge-Pro",
            },
          }
        );

        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const functions = detectFunctions(content, file.path);
          allFunctions.push(...functions);

          // Limit to 10 functions total
          if (allFunctions.length >= 10) {
            break;
          }
        }
      } catch (error) {
        console.error(`Error fetching file ${file.path}:`, error);
      }
    }

    return allFunctions.slice(0, 10);
  } catch (error) {
    console.error("Error scanning GitHub repository:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Try to parse GitHub URL and scan repository
    const parsed = parseGitHubUrl(repoUrl);
    let functions: FunctionItem[] = [];
    let mode: "live-github-scan" | "demo-fallback" = "demo-fallback";
    let note = "";

    if (parsed) {
      // Attempt live GitHub scan
      const scannedFunctions = await scanGitHubRepo(parsed.owner, parsed.repo);
      
      if (scannedFunctions && scannedFunctions.length > 0) {
        functions = scannedFunctions;
        mode = "live-github-scan";
        note = "Live public GitHub scan completed. Source files were fetched from GitHub and functions were detected with regex-based analysis. Real coverage verification is planned for the AST-based implementation.";
      } else {
        // Fallback to demo data
        functions = DEMO_FUNCTIONS;
        note = "Demo fallback data is being shown because live scanning was unavailable, private, rate-limited, or no functions were detected.";
      }
    } else {
      // Invalid URL, use demo data
      functions = DEMO_FUNCTIONS;
      note = "Demo fallback data is being shown because live scanning was unavailable, private, rate-limited, or no functions were detected.";
    }

    const untestedFunctions = functions.filter((fn) => !fn.tested).length;

    const response: AnalyzeResponse = {
      success: true,
      repo: repoUrl,
      totalFunctions: functions.length,
      untestedFunctions,
      generatedTests: 0,
      estimatedTimeSaved: "0 min",
      functions,
      mode,
      message: mode === "live-github-scan"
        ? "Repository analyzed successfully using live GitHub scan"
        : "Repository analyzed using demo fallback data",
      note,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error analyzing repository:", error);
    return NextResponse.json(
      { error: "Failed to analyze repository" },
      { status: 500 }
    );
  }
}

// Made with Bob
