import { NextResponse } from "next/server";

type CreatePRResponse = {
  success: boolean;
  mode: "demo";
  prUrl: string;
  message: string;
};

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

    // Demo PR workflow response
    const response: CreatePRResponse = {
      success: true,
      mode: "demo",
      prUrl: "https://github.com/NboTop/testforge-pro/pull/demo",
      message:
        "This is a simulated PR URL for demo purposes. In production, this would create a branch, commit the generated test, and open a GitHub pull request.",
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
