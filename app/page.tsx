"use client";

import { useState } from "react";

type FunctionItem = {
  name: string;
  file: string;
  tested: boolean;
  severity: "High" | "Medium" | "Low";
  reason: string;
};

const mockFunctions: FunctionItem[] = [
  {
    name: "calculateFinalPrice",
    file: "src/paymentService.ts",
    tested: false,
    severity: "High",
    reason: "Payment calculation has no matching test coverage.",
  },
  {
    name: "applyDiscountCode",
    file: "src/discountCalculator.ts",
    tested: false,
    severity: "Medium",
    reason: "Discount logic has no edge-case tests.",
  },
  {
    name: "validateUserEmail",
    file: "src/userValidator.ts",
    tested: true,
    severity: "Low",
    reason: "Matching test file found.",
  },
];

const generatedTest = `import { calculateFinalPrice } from "../src/paymentService";

describe("calculateFinalPrice", () => {
  it("calculates final price with tax and discount", () => {
    expect(calculateFinalPrice(100, 0.1, 10)).toBe(100);
  });

  it("throws an error for negative base price", () => {
    expect(() => calculateFinalPrice(-100, 0.1, 10)).toThrow("Base price cannot be negative");
  });

  it("handles zero discount", () => {
    expect(calculateFinalPrice(100, 0.1, 0)).toBe(110);
  });
});`;

export default function Home() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/your-username/testforge-demo-repo"
  );
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<FunctionItem | null>(
    null
  );
  const [testCode, setTestCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prUrl, setPrUrl] = useState("");

  async function analyzeRepo() {
    setIsAnalyzing(true);
    setPrUrl("");
    setTestCode("");

    setTimeout(() => {
      setFunctions(mockFunctions);
      setSelectedFunction(mockFunctions[0]);
      setIsAnalyzing(false);
    }, 900);
  }

  async function generateTest(item: FunctionItem) {
    setSelectedFunction(item);
    setIsGenerating(true);
    setPrUrl("");

    setTimeout(() => {
      setTestCode(generatedTest);
      setIsGenerating(false);
    }, 1000);
  }

  async function createPR() {
    setPrUrl("https://github.com/your-username/testforge-demo-repo/pull/1");
  }

  const totalFunctions = functions.length;
  const untestedFunctions = functions.filter((fn) => !fn.tested).length;
  const generatedTests = testCode ? 1 : 0;
  const timeSaved = generatedTests ? "45 min" : "0 min";

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <section className="border-b border-white/10 bg-[#0B1020]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                IBM Bob Hackathon Project
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">
                TestForge Pro
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Bob-assisted AI test generation for real repositories. Scan a
                codebase, find untested functions, generate Jest tests, and
                create pull requests faster.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Built with IBM Bob + watsonx.ai
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
              <h2 className="text-lg font-medium">Analyze repository</h2>
              <p className="mt-1 text-sm text-slate-400">
                Enter a GitHub repo URL. Demo mode uses a prepared repo with
                missing tests.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-2"
                />
                <button
                  onClick={analyzeRepo}
                  disabled={isAnalyzing}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Repository"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <StatCard label="Total functions" value={totalFunctions} />
              <StatCard label="Untested" value={untestedFunctions} />
              <StatCard label="Generated tests" value={generatedTests} />
              <StatCard label="Time saved" value={timeSaved} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Coverage gaps</h2>
                  <p className="text-sm text-slate-400">
                    Functions detected without meaningful tests.
                  </p>
                </div>
                {functions.length > 0 && (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-200">
                    {untestedFunctions} gaps found
                  </span>
                )}
              </div>

              {functions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
                  Run repository analysis to see detected functions.
                </div>
              ) : (
                <div className="space-y-3">
                  {functions.map((item) => (
                    <div
                      key={item.name}
                      className={`rounded-xl border p-4 transition ${
                        selectedFunction?.name === item.name
                          ? "border-blue-400/60 bg-blue-500/10"
                          : "border-white/10 bg-black/20"
                      }`}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <SeverityBadge severity={item.severity} />
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                item.tested
                                  ? "bg-green-500/10 text-green-200"
                                  : "bg-red-500/10 text-red-200"
                              }`}
                            >
                              {item.tested ? "Tested" : "Untested"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.file}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            {item.reason}
                          </p>
                        </div>

                        <button
                          onClick={() => generateTest(item)}
                          disabled={item.tested || isGenerating}
                          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isGenerating &&
                          selectedFunction?.name === item.name
                            ? "Generating..."
                            : item.tested
                            ? "Already tested"
                            : "Generate Test"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-medium">Generated test preview</h2>
              <p className="mt-1 text-sm text-slate-400">
                Preview AI-generated Jest tests before creating a pull request.
              </p>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/40">
                <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
                  {selectedFunction
                    ? `${selectedFunction.name}.test.ts`
                    : "No function selected"}
                </div>
                <pre className="min-h-[420px] overflow-auto p-4 text-xs leading-6 text-slate-200">
                  <code>
                    {isGenerating
                      ? "Generating tests with AI..."
                      : testCode || "// Generated test will appear here"}
                  </code>
                </pre>
              </div>

              <button
                onClick={createPR}
                disabled={!testCode}
                className="mt-4 w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Pull Request
              </button>

              {prUrl && (
                <div className="mt-4 rounded-xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-100">
                  Pull request workflow ready:{" "}
                  <a
                    href={prUrl}
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    View PR
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
              <h2 className="text-lg font-medium text-blue-100">
                IBM Bob usage proof
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                IBM Bob is used as the development partner for planning,
                implementation, debugging, UI generation, and code review. The
                exported task reports are included in the{" "}
                <span className="font-mono">bob_sessions/</span> folder.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "High" | "Medium" | "Low" }) {
  const styles = {
    High: "bg-red-500/10 text-red-200",
    Medium: "bg-yellow-500/10 text-yellow-200",
    Low: "bg-green-500/10 text-green-200",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${styles[severity]}`}>
      {severity}
    </span>
  );
}