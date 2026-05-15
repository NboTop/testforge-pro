import { NextResponse } from "next/server";

type GenerateTestResponse = {
  functionName: string;
  provider: "mock-fallback" | "watsonx-ready";
  testCode: string;
  explanation: string;
};

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

    // Generate test code based on function name
    switch (functionName) {
      case "calculateFinalPrice":
        testCode = `import { calculateFinalPrice } from "../src/paymentService";

describe("calculateFinalPrice", () => {
  it("calculates final price with tax and discount", () => {
    const basePrice = 100;
    const taxRate = 0.1;
    const discount = 10;
    const result = calculateFinalPrice(basePrice, taxRate, discount);
    expect(result).toBe(100); // (100 + 10) - 10 = 100
  });

  it("throws an error for negative base price", () => {
    expect(() => calculateFinalPrice(-100, 0.1, 10)).toThrow(
      "Base price cannot be negative"
    );
  });

  it("handles zero discount correctly", () => {
    const basePrice = 100;
    const taxRate = 0.1;
    const discount = 0;
    const result = calculateFinalPrice(basePrice, taxRate, discount);
    expect(result).toBe(110); // 100 + (100 * 0.1) = 110
  });

  it("handles zero tax rate correctly", () => {
    const basePrice = 100;
    const taxRate = 0;
    const discount = 10;
    const result = calculateFinalPrice(basePrice, taxRate, discount);
    expect(result).toBe(90); // 100 - 10 = 90
  });

  it("calculates correctly with high tax rate", () => {
    const basePrice = 100;
    const taxRate = 0.25;
    const discount = 5;
    const result = calculateFinalPrice(basePrice, taxRate, discount);
    expect(result).toBe(120); // (100 + 25) - 5 = 120
  });
});`;
        explanation =
          "Generated comprehensive Jest tests covering normal calculation, error handling for negative prices, zero discount edge case, zero tax edge case, and high tax rate scenario. Tests verify correct arithmetic and error throwing behavior.";
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
        // Generic template for unknown functions
        testCode = `import { ${functionName} } from "../src/module";

describe("${functionName}", () => {
  it("should work correctly", () => {
    // TODO: Add test implementation
    expect(true).toBe(true);
  });

  it("should handle edge cases", () => {
    // TODO: Add edge case tests
    expect(true).toBe(true);
  });

  it("should handle errors appropriately", () => {
    // TODO: Add error handling tests
    expect(true).toBe(true);
  });
});`;
        explanation = `Generated starter Jest test template for ${functionName}. This template includes placeholder test cases that should be customized based on the actual function implementation. Add specific assertions and test scenarios as needed.`;
        break;
    }

    const response: GenerateTestResponse = {
      functionName,
      provider,
      testCode,
      explanation,
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
