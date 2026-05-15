import { NextResponse } from "next/server";

type FunctionItem = {
  name: string;
  file: string;
  tested: boolean;
  severity: "High" | "Medium" | "Low";
  reason: string;
};

type AnalyzeResponse = {
  repo: string;
  totalFunctions: number;
  untestedFunctions: number;
  generatedTests: number;
  estimatedTimeSaved: string;
  functions: FunctionItem[];
};

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

    // Mock repository analysis with realistic data
    const functions: FunctionItem[] = [
      {
        name: "calculateFinalPrice",
        file: "src/paymentService.ts",
        tested: false,
        severity: "High",
        reason: "Payment calculation has no matching test coverage",
      },
      {
        name: "applyDiscountCode",
        file: "src/discountCalculator.ts",
        tested: false,
        severity: "Medium",
        reason: "Discount logic has no edge-case tests",
      },
      {
        name: "validateUserEmail",
        file: "src/userValidator.ts",
        tested: true,
        severity: "Low",
        reason: "Matching test file found",
      },
    ];

    const untestedFunctions = functions.filter((fn) => !fn.tested).length;

    const response: AnalyzeResponse = {
      repo: repoUrl,
      totalFunctions: functions.length,
      untestedFunctions,
      generatedTests: 0,
      estimatedTimeSaved: "0 min",
      functions,
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
