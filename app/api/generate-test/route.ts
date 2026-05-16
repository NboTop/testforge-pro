import { NextResponse } from "next/server";

type GenerateTestResponse = {
  success: boolean;
  functionName: string;
  provider: "mock-fallback" | "watsonx-ready";
  testCode: string;
  explanation: string;
  filename: string;
  message: string;
  note: string;
};

/**
 * Sanitize function name to create a valid test filename
 * Examples:
 * - "POST /api/analyze" → "post-api-analyze.test.ts"
 * - "POST /api/create-pr" → "post-api-create-pr.test.ts"
 * - "RootLayout" → "RootLayout.test.ts"
 * - "calculateFinalPrice" → "calculateFinalPrice.test.ts"
 */
function sanitizeFilename(functionName: string): string {
  // Check if it's a route handler (contains HTTP method and path)
  const isRouteHandler = /^(GET|POST|PUT|DELETE|PATCH)\s+\/api\//i.test(functionName);
  
  if (isRouteHandler) {
    // For route handlers: convert to lowercase, replace slashes and spaces with hyphens
    const sanitized = functionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${sanitized}.test.ts`;
  } else {
    // For regular functions and components: preserve case, only remove invalid filename characters
    const sanitized = functionName
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .trim();
    return `${sanitized}.test.ts`;
  }
}

/**
 * Detect the type of function based on naming patterns
 */
function detectFunctionType(functionName: string): "route-handler" | "react-component" | "regular-function" {
  // Check for HTTP method patterns (POST /api/analyze, GET /api/users, etc.)
  if (/^(GET|POST|PUT|DELETE|PATCH)\s+\/api\//i.test(functionName)) {
    return "route-handler";
  }
  
  // Check for PascalCase (React components like Home, RootLayout, StatCard)
  if (/^[A-Z][a-zA-Z0-9]*$/.test(functionName)) {
    return "react-component";
  }
  
  // Default to regular function (camelCase like analyzeRepo, generateTest)
  return "regular-function";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { functionName } = body;

    if (!functionName) {
      return NextResponse.json(
        { error: "Function name is required" },
        { status: 400 }
      );
    }

    // Check if watsonx API key is configured
    const provider = process.env.WATSONX_API_KEY
      ? "watsonx-ready"
      : "mock-fallback";

    let testCode = "";
    let explanation = "";
    const filename = sanitizeFilename(functionName);
    const functionType = detectFunctionType(functionName);

    // Generate test code based on function type and name
    if (functionType === "route-handler") {
      // Extract method and path from function name
      const match = functionName.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(\/api\/.+)$/i);
      const method = match ? match[1].toUpperCase() : "POST";
      const path = match ? match[2] : "/api/unknown";
      
      // Generate route handler specific tests
      if (functionName === "POST /api/analyze") {
        testCode = `import { describe, expect, it } from "@jest/globals";

describe("POST /api/analyze", () => {
  it("accepts a valid public GitHub repository URL", async () => {
    // TODO: Import the route handler when wiring this into the real test suite:
    // const { POST } = await import("@/app/api/analyze/route");

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        repoUrl: "https://github.com/NboTop/testforge-pro",
      }),
    });

    // const response = await POST(request);
    // expect(response.status).toBe(200);

    expect(request.method).toBe("POST");
  });

  it("handles invalid repository URLs gracefully", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        repoUrl: "not-a-valid-url",
      }),
    });

    expect(request.method).toBe("POST");
  });

  it("falls back to demo mode when live scanning is unavailable", async () => {
    // TODO: Mock GitHub API failure and assert that the response uses demo fallback mode.
    expect(true).toBe(true);
  });
});`;
        explanation = `Generated a valid starter Jest test for the POST /api/analyze route handler. The test includes request construction examples and TODO comments for wiring the route handler into a real test suite.`;
      } else if (functionName === "POST /api/create-pr") {
        testCode = `import { describe, expect, it } from "@jest/globals";

describe("POST /api/create-pr", () => {
  it("accepts valid test code and function name", async () => {
    // TODO: Import the route handler when wiring this into the real test suite:
    // const { POST } = await import("@/app/api/create-pr/route");

    const request = new Request("http://localhost:3000/api/create-pr", {
      method: "POST",
      body: JSON.stringify({
        functionName: "calculateFinalPrice",
        testCode: "describe('calculateFinalPrice', () => { it('works', () => { expect(true).toBe(true); }); });",
      }),
    });

    // const response = await POST(request);
    // expect(response.status).toBe(200);

    expect(request.method).toBe("POST");
  });

  it("returns error when test code is missing", async () => {
    const request = new Request("http://localhost:3000/api/create-pr", {
      method: "POST",
      body: JSON.stringify({
        functionName: "calculateFinalPrice",
      }),
    });

    expect(request.method).toBe("POST");
  });

  it("returns demo PR URL in demo mode", async () => {
    // TODO: Assert that the response includes a simulated PR URL.
    expect(true).toBe(true);
  });
});`;
        explanation = `Generated a valid starter Jest test for the POST /api/create-pr route handler. The test includes request construction examples and TODO comments for wiring the route handler into a real test suite.`;
      } else if (functionName === "POST /api/generate-test") {
        testCode = `import { describe, expect, it } from "@jest/globals";

describe("POST /api/generate-test", () => {
  it("accepts a valid function name", async () => {
    // TODO: Import the route handler when wiring this into the real test suite:
    // const { POST } = await import("@/app/api/generate-test/route");

    const request = new Request("http://localhost:3000/api/generate-test", {
      method: "POST",
      body: JSON.stringify({
        functionName: "calculateFinalPrice",
      }),
    });

    // const response = await POST(request);
    // expect(response.status).toBe(200);

    expect(request.method).toBe("POST");
  });

  it("returns error when function name is missing", async () => {
    const request = new Request("http://localhost:3000/api/generate-test", {
      method: "POST",
      body: JSON.stringify({}),
    });

    expect(request.method).toBe("POST");
  });

  it("generates appropriate test code for the function", async () => {
    // TODO: Assert that the response includes valid test code.
    expect(true).toBe(true);
  });
});`;
        explanation = `Generated a valid starter Jest test for the POST /api/generate-test route handler. The test includes request construction examples and TODO comments for wiring the route handler into a real test suite.`;
      } else {
        // Generic route handler template
        testCode = `import { describe, expect, it } from "@jest/globals";

describe("${functionName}", () => {
  it("handles valid requests", async () => {
    // TODO: Import the route handler when wiring this into the real test suite:
    // const { ${method} } = await import("@/app${path}/route");

    const request = new Request("http://localhost:3000${path}", {
      method: "${method}",
      body: JSON.stringify({}),
    });

    // const response = await ${method}(request);
    // expect(response.status).toBe(200);

    expect(request.method).toBe("${method}");
  });

  it("handles invalid requests gracefully", async () => {
    const request = new Request("http://localhost:3000${path}", {
      method: "${method}",
      body: JSON.stringify({}),
    });

    expect(request.method).toBe("${method}");
  });

  it("returns appropriate error responses", async () => {
    // TODO: Add error handling assertions.
    expect(true).toBe(true);
  });
});`;
        explanation = `Generated a valid starter Jest test for the ${method} ${path} route handler. The test includes request construction examples and TODO comments for wiring the route handler into a real test suite.`;
      }
    } else if (functionType === "react-component") {
      // Generate React component tests
      testCode = `import { describe, expect, it } from "@jest/globals";

describe("${functionName}", () => {
  it("renders without crashing", () => {
    // TODO: Import and render the component with React Testing Library:
    // render(<${functionName} />);
    expect(true).toBe(true);
  });

  it("displays expected content", () => {
    // TODO: Add assertions for component content.
    expect(true).toBe(true);
  });

  it("handles user interactions correctly", () => {
    // TODO: Add interaction tests.
    expect(true).toBe(true);
  });
});`;
      explanation = `Generated a starter Jest test for the ${functionName} React component. The test includes TODO comments for importing and rendering the component with React Testing Library.`;
    } else {
      // Regular function tests - check for specific known functions first
      switch (functionName) {
      case "calculateFinalPrice":
        testCode = `import { calculateFinalPrice } from "../src/paymentService";

describe("calculateFinalPrice", () => {
  it("calculates final price with tax and discount", () => {
    const subtotal = 100;
    const taxRate = 0.1;
    const discount = 10;
    const result = calculateFinalPrice(subtotal, taxRate, discount);
    expect(result).toBe(99); // (100 - 10) * 1.1 = 99.00
  });

  it("throws an error for negative subtotal", () => {
    expect(() => calculateFinalPrice(-100, 0.1, 10)).toThrow(
      "Subtotal cannot be negative"
    );
  });

  it("handles zero discount correctly", () => {
    const subtotal = 100;
    const taxRate = 0.1;
    const discount = 0;
    const result = calculateFinalPrice(subtotal, taxRate, discount);
    expect(result).toBe(110); // (100 - 0) * 1.1 = 110.00
  });

  it("handles zero tax rate correctly", () => {
    const subtotal = 100;
    const taxRate = 0;
    const discount = 10;
    const result = calculateFinalPrice(subtotal, taxRate, discount);
    expect(result).toBe(90); // (100 - 10) * 1.0 = 90.00
  });

  it("calculates correctly with high tax rate", () => {
    const subtotal = 100;
    const taxRate = 0.25;
    const discount = 5;
    const result = calculateFinalPrice(subtotal, taxRate, discount);
    expect(result).toBe(118.75); // (100 - 5) * 1.25 = 118.75
  });
});`;
        explanation =
          "Generated comprehensive Jest tests covering normal calculation, error handling for negative subtotal, zero discount edge case, zero tax edge case, and high tax rate scenario. Tests verify correct arithmetic using the formula: discountedSubtotal = subtotal - discount, then final = discountedSubtotal * (1 + taxRate), rounded to 2 decimal places.";
        break;

      case "applyDiscountCode":
        testCode = `import { applyDiscountCode } from "../src/discountCalculator";

describe("applyDiscountCode", () => {
  it("applies SAVE10 discount correctly", () => {
    const price = 100;
    const code = "SAVE10";
    const result = applyDiscountCode(price, code);
    expect(result).toBe(90); // 10% discount
  });

  it("applies SAVE20 discount correctly", () => {
    const price = 100;
    const code = "SAVE20";
    const result = applyDiscountCode(price, code);
    expect(result).toBe(80); // 20% discount
  });

  it("returns original price for invalid code", () => {
    const price = 100;
    const code = "INVALID";
    const result = applyDiscountCode(price, code);
    expect(result).toBe(100); // No discount applied
  });

  it("handles zero price edge case", () => {
    const price = 0;
    const code = "SAVE10";
    const result = applyDiscountCode(price, code);
    expect(result).toBe(0); // 0 with any discount is still 0
  });

  it("handles empty discount code", () => {
    const price = 100;
    const code = "";
    const result = applyDiscountCode(price, code);
    expect(result).toBe(100); // No discount for empty code
  });

  it("is case-insensitive for discount codes", () => {
    const price = 100;
    const code = "save10";
    const result = applyDiscountCode(price, code);
    expect(result).toBe(90); // Should work with lowercase
  });
});`;
        explanation =
          "Generated Jest tests covering multiple discount codes (SAVE10, SAVE20), invalid code handling, zero price edge case, empty code handling, and case-insensitive code matching. Tests ensure discount logic works correctly across various scenarios.";
        break;

      case "validateUserEmail":
        testCode = `import { validateUserEmail } from "../src/userValidator";

describe("validateUserEmail", () => {
  it("validates correct email format", () => {
    const email = "user@example.com";
    const result = validateUserEmail(email);
    expect(result).toBe(true);
  });

  it("rejects email without @ symbol", () => {
    const email = "userexample.com";
    const result = validateUserEmail(email);
    expect(result).toBe(false);
  });

  it("rejects email without domain", () => {
    const email = "user@";
    const result = validateUserEmail(email);
    expect(result).toBe(false);
  });

  it("rejects email without local part", () => {
    const email = "@example.com";
    const result = validateUserEmail(email);
    expect(result).toBe(false);
  });

  it("validates email with subdomain", () => {
    const email = "user@mail.example.com";
    const result = validateUserEmail(email);
    expect(result).toBe(true);
  });

  it("rejects empty string", () => {
    const email = "";
    const result = validateUserEmail(email);
    expect(result).toBe(false);
  });
});`;
        explanation =
          "Generated Jest tests covering valid email format, missing @ symbol, missing domain, missing local part, subdomain handling, and empty string validation. Tests ensure email validation logic handles both valid and invalid inputs correctly.";
        break;

      default:
        // Generic template for unknown regular functions
        testCode = `import { describe, expect, it } from "@jest/globals";

describe("${functionName}", () => {
  it("handles the expected happy path", () => {
    // TODO: Import ${functionName} from the correct module and add real assertions.
    expect(true).toBe(true);
  });

  it("handles edge cases", () => {
    // TODO: Add edge case assertions.
    expect(true).toBe(true);
  });
});`;
        explanation = `Generated starter Jest test template for ${functionName}. This template includes placeholder test cases that should be customized based on the actual function implementation. Add specific assertions and test scenarios as needed.`;
        break;
      }
    }

    const response: GenerateTestResponse = {
      success: true,
      functionName,
      provider,
      testCode,
      explanation,
      filename,
      message: `Test generated successfully for ${functionName}`,
      note: provider === "watsonx-ready"
        ? "Architecture is ready for watsonx.ai integration. Currently using template-based generation."
        : "Using mock fallback templates. Real AI generation planned for watsonx.ai integration.",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}

// Made with Bob
