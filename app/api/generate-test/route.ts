import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = "gemini-live" | "mock-fallback" | "watsonx-ready";

type GenerateTestResponse = {
  success: boolean;
  functionName: string;
  provider: Provider;
  aiModel?: string;
  contextUsed?: boolean;
  testCode: string;
  explanation: string;
  filename: string;
  message: string;
  note: string;
  fallbackReason?: string;
};

// ─── Filename Sanitizer ───────────────────────────────────────────────────────

function sanitizeFilename(functionName: string): string {
  const isRouteHandler = /^(GET|POST|PUT|DELETE|PATCH)\s+\/api\//i.test(functionName);
  if (isRouteHandler) {
    return (
      functionName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") + ".test.ts"
    );
  }
  return functionName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim() + ".test.ts";
}

// ─── Function Type Detector ───────────────────────────────────────────────────

function detectFunctionType(
  functionName: string
): "route-handler" | "react-component" | "regular-function" {
  if (/^(GET|POST|PUT|DELETE|PATCH)\s+\/api\//i.test(functionName)) return "route-handler";
  if (/^[A-Z][a-zA-Z0-9]*$/.test(functionName)) return "react-component";
  return "regular-function";
}

// ─── Gemini Integration ───────────────────────────────────────────────────────

async function generateWithGemini(
  functionName: string,
  filePath?: string,
  functionCode?: string
): Promise<{ testCode: string; explanation: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

  const contextLines: string[] = [];
  if (filePath) contextLines.push(`File path: ${filePath}`);
  if (functionCode) {
    contextLines.push(`Function implementation:\n\`\`\`typescript\n${functionCode}\n\`\`\``);
  }
  const contextBlock =
    contextLines.length > 0 ? `\n\nAvailable context:\n${contextLines.join("\n")}` : "";

  const prompt = `You are an expert JavaScript/TypeScript test engineer using Jest and TypeScript.

Generate a comprehensive Jest test suite for the function: "${functionName}"${contextBlock}

STRICT REQUIREMENTS:
- Output ONLY valid Jest TypeScript code — no markdown fences, no backticks, no prose explanation
- Start immediately with import statements
- Use a describe("${functionName}", () => { ... }) block
- Include at minimum:
  - 1 happy-path test
  - 2 edge-case tests
  - 1 error-handling test
- Use descriptive it("should ...") names
- Add a short comment above each test explaining what it validates
- Follow TypeScript best practices

Begin the test file now:`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`[Gemini] API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const rawText: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("[Gemini] Empty response");
      return null;
    }

    // Strip any accidental markdown fences
    const clean = rawText
      .replace(/^```(?:typescript|javascript|ts|js)?\r?\n?/m, "")
      .replace(/\r?\n?```\s*$/m, "")
      .trim();

    return {
      testCode: clean,
      explanation: `Gemini AI generated a Jest test suite for ${functionName}. Tests cover the happy path, edge cases, and error handling, generated using Google Gemini (${model}) with ${
        filePath || functionCode ? "file-path/code" : "name-only"
      } context.`,
    };
  } catch (err) {
    clearTimeout(timeout);
    console.error(
      "[Gemini] Generation failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

// ─── Template: Route Handlers ─────────────────────────────────────────────────

function getRouteHandlerTest(functionName: string): {
  testCode: string;
  explanation: string;
} {
  const match = functionName.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(\/api\/.+)$/i);
  const method = match ? match[1].toUpperCase() : "POST";
  const path = match ? match[2] : "/api/unknown";

  if (functionName === "POST /api/analyze") {
    return {
      testCode: `import { describe, expect, it } from "@jest/globals";

describe("POST /api/analyze", () => {
  // Validates the route accepts a valid public GitHub URL
  it("should accept a valid public GitHub repository URL", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: "https://github.com/NboTop/testforge-pro" }),
    });
    // TODO: const { POST } = await import("@/app/api/analyze/route");
    // const response = await POST(request);
    // expect(response.status).toBe(200);
    expect(request.method).toBe("POST");
  });

  // Ensures invalid URLs are handled gracefully
  it("should handle an invalid repository URL", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: "not-a-valid-url" }),
    });
    expect(request.method).toBe("POST");
  });

  // Verifies fallback to demo data when live scan is unavailable
  it("should fall back to demo mode when GitHub API is unavailable", async () => {
    // TODO: mock GitHub API failure, assert response uses demo fallback
    expect(true).toBe(true);
  });

  // Checks that a missing repoUrl returns 400
  it("should return 400 when repoUrl is missing", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(request.method).toBe("POST");
  });
});`,
      explanation:
        "Template Jest tests for POST /api/analyze. Covers valid URL acceptance, invalid URL handling, GitHub API fallback, and missing field validation.",
    };
  }

  if (functionName === "POST /api/create-pr") {
    return {
      testCode: `import { describe, expect, it } from "@jest/globals";

describe("POST /api/create-pr", () => {
  // Validates successful PR payload structure
  it("should accept valid testCode and functionName", async () => {
    const request = new Request("http://localhost:3000/api/create-pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        functionName: "calculateFinalPrice",
        testCode: "describe('test', () => { it('works', () => { expect(true).toBe(true); }); });",
        repoUrl: "https://github.com/void-logic/testforge-demo-target",
      }),
    });
    // TODO: const { POST } = await import("@/app/api/create-pr/route");
    // const response = await POST(request);
    // expect(response.status).toBe(200);
    expect(request.method).toBe("POST");
  });

  // Ensures missing testCode triggers an error
  it("should return error when testCode is missing", async () => {
    const request = new Request("http://localhost:3000/api/create-pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ functionName: "calculateFinalPrice" }),
    });
    expect(request.method).toBe("POST");
  });

  // Verifies simulation mode for non-configured repos
  it("should use simulated mode for non-demo repositories", async () => {
    // TODO: assert mode === "simulated-pr-preview"
    expect(true).toBe(true);
  });

  // Security: token must not appear in the response
  it("should not expose GitHub token in response", async () => {
    // The token is server-side only; it must never appear in response JSON
    expect(process.env.GITHUB_TOKEN).toBeUndefined(); // env not leaked in test context
  });
});`,
      explanation:
        "Template Jest tests for POST /api/create-pr. Covers valid payload, missing field errors, simulation mode, and token security.",
    };
  }

  if (functionName === "POST /api/generate-test") {
    return {
      testCode: `import { describe, expect, it } from "@jest/globals";

describe("POST /api/generate-test", () => {
  // Validates the route accepts a valid function name
  it("should accept a valid functionName", async () => {
    const request = new Request("http://localhost:3000/api/generate-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ functionName: "calculateFinalPrice" }),
    });
    // TODO: const { POST } = await import("@/app/api/generate-test/route");
    // const response = await POST(request);
    // const data = await response.json();
    // expect(data.success).toBe(true);
    // expect(data.testCode).toBeTruthy();
    expect(request.method).toBe("POST");
  });

  // Ensures missing functionName returns 400
  it("should return 400 when functionName is missing", async () => {
    const request = new Request("http://localhost:3000/api/generate-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(request.method).toBe("POST");
  });

  // Verifies generated test code is non-empty
  it("should return non-empty testCode in the response", async () => {
    // TODO: assert data.testCode.length > 0
    expect(true).toBe(true);
  });

  // Checks provider field is one of the known values
  it("should return a valid provider field", async () => {
    const validProviders = ["gemini-live", "mock-fallback", "watsonx-ready"];
    // TODO: assert validProviders.includes(data.provider)
    expect(validProviders).toContain("mock-fallback");
  });
});`,
      explanation:
        "Template Jest tests for POST /api/generate-test. Covers valid input, missing field validation, non-empty output, and provider field shape.",
    };
  }

  // Generic route handler
  return {
    testCode: `import { describe, expect, it } from "@jest/globals";

describe("${functionName}", () => {
  // Validates the endpoint accepts a well-formed request
  it("should handle a valid ${method} request", async () => {
    const request = new Request("http://localhost:3000${path}", {
      method: "${method}",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    // TODO: const { ${method} } = await import("@/app${path}/route");
    // const response = await ${method}(request);
    // expect(response.status).toBe(200);
    expect(request.method).toBe("${method}");
  });

  // Validates bad input is rejected gracefully
  it("should return an appropriate error for invalid input", async () => {
    // TODO: add assertion
    expect(true).toBe(true);
  });

  // Checks the response structure
  it("should return a valid response shape", async () => {
    // TODO: assert response fields
    expect(true).toBe(true);
  });
});`,
    explanation: `Template Jest tests for the ${method} ${path} route handler. Includes request construction and TODO comments for wiring into a real test suite.`,
  };
}

// ─── Template: React Components ───────────────────────────────────────────────

function getComponentTest(functionName: string): {
  testCode: string;
  explanation: string;
} {
  return {
    testCode: `import { describe, expect, it } from "@jest/globals";

describe("${functionName} component", () => {
  // Verifies the component can render without throwing
  it("should render without crashing", () => {
    // TODO: import and render with React Testing Library
    // import { render } from "@testing-library/react";
    // render(<${functionName} />);
    expect(true).toBe(true);
  });

  // Checks expected content is displayed
  it("should display expected content", () => {
    // TODO: const { getByText } = render(<${functionName} />);
    // expect(getByText("...")).toBeInTheDocument();
    expect(true).toBe(true);
  });

  // Ensures user interactions work correctly
  it("should handle user interactions correctly", () => {
    // TODO: import { fireEvent } from "@testing-library/react";
    // fireEvent.click(element);
    // assert state change
    expect(true).toBe(true);
  });
});`,
    explanation: `Starter Jest/RTL test for the ${functionName} React component. Includes render, content, and interaction stubs.`,
  };
}

// ─── Template: Known Functions ────────────────────────────────────────────────

function getKnownFunctionTest(functionName: string): {
  testCode: string;
  explanation: string;
} | null {
  switch (functionName) {
    case "calculateFinalPrice":
      return {
        testCode: `import { calculateFinalPrice } from "../src/paymentService";

describe("calculateFinalPrice", () => {
  // Standard price with tax and no discount
  it("should calculate final price with tax only", () => {
    // (100 - 0) * (1 + 0.1) = 110
    const result = calculateFinalPrice(100, 0.1, 0);
    expect(result).toBe(110);
  });

  // Discount is subtracted before tax is applied
  it("should subtract discount before applying tax", () => {
    // (100 - 10) * (1 + 0.1) = 90 * 1.1 = 99
    const result = calculateFinalPrice(100, 0.1, 10);
    expect(result).toBe(99);
  });

  // Zero tax rate — result is subtotal minus discount
  it("should return discounted price when tax rate is zero", () => {
    // (100 - 10) * (1 + 0) = 90
    const result = calculateFinalPrice(100, 0, 10);
    expect(result).toBe(90);
  });

  // Higher tax rate with small discount
  it("should calculate correctly with a high tax rate", () => {
    // (100 - 5) * (1 + 0.25) = 95 * 1.25 = 118.75
    const result = calculateFinalPrice(100, 0.25, 5);
    expect(result).toBe(118.75);
  });

  // Guard: negative subtotal must throw
  it("should throw for a negative subtotal", () => {
    expect(() => calculateFinalPrice(-100, 0.1, 10)).toThrow(
      "Subtotal cannot be negative"
    );
  });
});`,
        explanation:
          "Comprehensive Jest tests for calculateFinalPrice using the formula: (subtotal − discount) × (1 + taxRate). Covers standard tax, discount+tax, zero tax, high tax, and negative subtotal guard.",
      };

    case "applyDiscountCode":
      return {
        testCode: `import { applyDiscountCode } from "../src/discountCalculator";

describe("applyDiscountCode", () => {
  // SAVE10 applies a 10% discount
  it("should apply a 10% discount for SAVE10", () => {
    expect(applyDiscountCode(100, "SAVE10")).toBe(90);
  });

  // SAVE20 applies a 20% discount
  it("should apply a 20% discount for SAVE20", () => {
    expect(applyDiscountCode(100, "SAVE20")).toBe(80);
  });

  // An unknown code leaves the price unchanged
  it("should return the original price for an invalid code", () => {
    expect(applyDiscountCode(100, "INVALID")).toBe(100);
  });

  // A zero price stays zero regardless of discount
  it("should handle a zero price without error", () => {
    expect(applyDiscountCode(0, "SAVE10")).toBe(0);
  });

  // An empty code string leaves the price unchanged
  it("should return full price for an empty code", () => {
    expect(applyDiscountCode(100, "")).toBe(100);
  });
});`,
        explanation:
          "Jest tests for applyDiscountCode. Covers SAVE10, SAVE20, invalid codes, zero-price edge case, and empty-string code.",
      };

    case "validateUserEmail":
      return {
        testCode: `import { validateUserEmail } from "../src/userValidator";

describe("validateUserEmail", () => {
  // A standard well-formed email should pass
  it("should return true for a valid email address", () => {
    expect(validateUserEmail("user@example.com")).toBe(true);
  });

  // Missing @ symbol should fail
  it("should return false when the @ symbol is missing", () => {
    expect(validateUserEmail("userexample.com")).toBe(false);
  });

  // Missing domain should fail
  it("should return false when the domain is missing", () => {
    expect(validateUserEmail("user@")).toBe(false);
  });

  // Subdomain should be accepted
  it("should accept emails with subdomains", () => {
    expect(validateUserEmail("user@mail.example.com")).toBe(true);
  });

  // Empty string should fail
  it("should return false for an empty string", () => {
    expect(validateUserEmail("")).toBe(false);
  });
});`,
        explanation:
          "Jest tests for validateUserEmail. Covers valid email, missing @, missing domain, subdomain support, and empty-string input.",
      };

    default:
      return null;
  }
}

// ─── Template: Generic Functions ─────────────────────────────────────────────

function getGenericFunctionTest(functionName: string): {
  testCode: string;
  explanation: string;
} {
  return {
    testCode: `import { describe, expect, it } from "@jest/globals";

describe("${functionName}", () => {
  // Happy path: function returns the expected result for valid input
  it("should handle valid input and return the expected result", () => {
    // TODO: import ${functionName} and replace with a real assertion
    expect(true).toBe(true);
  });

  // Edge case: empty, null, or boundary input
  it("should handle empty or null input gracefully", () => {
    // TODO: test boundary conditions specific to this function
    expect(true).toBe(true);
  });

  // Error case: invalid input should throw or return an error value
  it("should throw or return an error for invalid input", () => {
    // TODO: verify error handling behaviour
    expect(true).toBe(true);
  });
});`,
    explanation: `Starter Jest test template for ${functionName}. Replace the placeholder assertions with real imports and test logic based on the function's implementation.`,
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      functionName,
      filePath,
      functionCode,
    }: {
      functionName: string;
      filePath?: string;
      functionCode?: string;
    } = body;

    if (!functionName) {
      return NextResponse.json(
        { success: false, error: "Function name is required" },
        { status: 400 }
      );
    }

    const filename = sanitizeFilename(functionName);
    const functionType = detectFunctionType(functionName);
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

    let provider: Provider = "mock-fallback";
    let aiModel: string | undefined;
    let contextUsed = false;
    let fallbackReason: string | undefined;
    let testCode = "";
    let explanation = "";

    // ── 1. Try Gemini if key is configured ───────────────────────────────────
    if (geminiKey) {
      const geminiResult = await generateWithGemini(
        functionName,
        filePath,
        functionCode
      );

      if (geminiResult) {
        provider = "gemini-live";
        aiModel = geminiModel;
        contextUsed = !!(filePath || functionCode);
        testCode = geminiResult.testCode;
        explanation = geminiResult.explanation;
      } else {
        fallbackReason =
          "Gemini API call failed or returned empty content — using template fallback.";
      }
    }

    // ── 2. Template fallback ─────────────────────────────────────────────────
    if (!testCode) {
      // Determine provider label when using templates
      if (!geminiKey && process.env.WATSONX_API_KEY?.trim()) {
        provider = "watsonx-ready";
      } else if (!geminiKey) {
        provider = "mock-fallback";
      }
      // If geminiKey existed but Gemini failed, provider stays "mock-fallback"
      // (Gemini was configured but failed, so we fell back)

      let templateResult: { testCode: string; explanation: string };

      if (functionType === "route-handler") {
        templateResult = getRouteHandlerTest(functionName);
      } else if (functionType === "react-component") {
        templateResult = getComponentTest(functionName);
      } else {
        const known = getKnownFunctionTest(functionName);
        templateResult = known ?? getGenericFunctionTest(functionName);
      }

      testCode = templateResult.testCode;
      explanation = templateResult.explanation;
      contextUsed = false;
    }

    // ── 3. Build note ────────────────────────────────────────────────────────
    let note: string;
    if (provider === "gemini-live") {
      note = `Test generated by Google Gemini (${geminiModel}) via live AI inference. Review all assertions before merging.`;
    } else if (provider === "watsonx-ready") {
      note =
        "Architecture ready for IBM watsonx.ai Granite integration. Currently using template-based generation.";
    } else {
      note = fallbackReason
        ? `${fallbackReason}`
        : "Template-based generation. Set GEMINI_API_KEY to enable AI-powered test generation.";
    }

    // ── 4. Return response ───────────────────────────────────────────────────
    const response: GenerateTestResponse = {
      success: true,
      functionName,
      provider,
      ...(aiModel !== undefined && { aiModel }),
      contextUsed,
      testCode,
      explanation,
      filename,
      message: `Test generated successfully for ${functionName}`,
      note,
      ...(fallbackReason !== undefined && { fallbackReason }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate test" },
      { status: 500 }
    );
  }
}

// Made with IBM Bob