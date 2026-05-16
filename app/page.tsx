"use client";

import { useState } from "react";

type FunctionItem = {
  id?: string;
  name: string;
  file: string;
  tested: boolean;
  severity: "High" | "Medium" | "Low";
  reason: string;
};

type PRPreviewData = {
  success: boolean;
  mode: string;
  message: string;
  repositoryUrl?: string;
  prUrl?: string;
  branchName: string;
  filePath: string;
  commitMessage: string;
  prTitle: string;
  prBody?: string;
  note: string;
};

type GenerateTestResponse = {
  functionName: string;
  provider: "mock-fallback" | "watsonx-ready";
  testCode: string;
  explanation: string;
  filename: string;
};

export default function Home() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/void-logic/testforge-demo-target"
  );
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<FunctionItem | null>(
    null
  );
  const [testCode, setTestCode] = useState("");
  const [testExplanation, setTestExplanation] = useState("");
  const [testFilename, setTestFilename] = useState("");
  const [testProvider, setTestProvider] = useState<"mock-fallback" | "watsonx-ready">("mock-fallback");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [prPreview, setPrPreview] = useState<PRPreviewData | null>(null);
  const [totalFunctions, setTotalFunctions] = useState(0);
  const [untestedFunctions, setUntestedFunctions] = useState(0);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [scanMode, setScanMode] = useState<"live-github-scan" | "demo-fallback">("demo-fallback");
  const [scanNote, setScanNote] = useState("");

  async function analyzeRepo() {
    // Trim and validate repoUrl
    const cleanedRepoUrl = repoUrl.trim();
    
    // Display error if repoUrl is empty
    if (!cleanedRepoUrl) {
      setError("Please enter a repository URL");
      return;
    }

    // Temporary debug log
    console.log("Analyze clicked:", cleanedRepoUrl);

    // Set loading state before fetch
    setIsAnalyzing(true);
    
    // Clear old PR and test state
    setPrPreview(null);
    setTestCode("");
    setTestExplanation("");
    setTestFilename("");
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: cleanedRepoUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze repository");
      }

      // Parse response JSON with error handling
      const data = await response.json();
      
      // Safely handle missing data.functions using Array.isArray checks
      const functionsArray = Array.isArray(data.functions) ? data.functions : [];
      
      // Safely set state variables
      setFunctions(functionsArray);
      setTotalFunctions(data.totalFunctions || 0);
      setUntestedFunctions(data.untestedFunctions || 0);
      setScanMode(data.mode || "demo-fallback");
      setScanNote(data.note || "");
      
      // Set selectedFunction to the first detected function or null
      if (functionsArray.length > 0) {
        setSelectedFunction(functionsArray[0]);
      } else {
        setSelectedFunction(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error analyzing repository:", err);
    } finally {
      // Ensure isAnalyzing is reset in finally block
      setIsAnalyzing(false);
    }
  }

  async function generateTest(item: FunctionItem) {
    setSelectedFunction(item);
    setIsGenerating(true);
    setPrPreview(null);
    setError("");
    setCopySuccess(false);

    try {
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ functionName: item.name }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const data: GenerateTestResponse = await response.json();
      setTestCode(data.testCode);
      setTestExplanation(data.explanation || "");
      setTestFilename(data.filename || `${item.name}.test.ts`);
      setTestProvider(data.provider || "mock-fallback");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error generating test:", err);
    } finally {
      setIsGenerating(false);
    }
  }

  async function createPR() {
    if (!testCode || !selectedFunction) return;

    setIsCreatingPR(true);
    setError("");

    try {
      const response = await fetch("/api/create-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testCode,
          functionName: selectedFunction.name,
          repoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create pull request");
      }

      const data = await response.json();
      setPrPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating PR:", err);
    } finally {
      setIsCreatingPR(false);
    }
  }

  const generatedTests = testCode ? 1 : 0;
  const timeSaved = generatedTests ? "45 min" : "0 min";

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(testCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

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
                A Bob-assisted workflow demo: identify untested functions, generate Jest tests, and create or preview pull requests. Live GitHub scanning with controlled PR creation.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                Built with IBM Bob
              </div>
              <div className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                scanMode === "live-github-scan"
                  ? "border-green-400/30 bg-green-500/10 text-green-200"
                  : "border-blue-400/30 bg-blue-500/10 text-blue-200"
              }`}>
                {scanMode === "live-github-scan"
                  ? "🟢 Live GitHub Scan"
                  : "🔵 Demo Fallback"}
              </div>
              <div className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200">
                🤖 watsonx.ai Ready
              </div>
              <div className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-200">
                🔍 Regex Detection
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">1</span>
                <h3 className="text-sm font-medium text-slate-200">Analyze Repository</h3>
              </div>
              <p className="text-xs text-slate-400">Scan public GitHub repos or use demo fallback</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-300">2</span>
                <h3 className="text-sm font-medium text-slate-200">Generate Tests</h3>
              </div>
              <p className="text-xs text-slate-400">Create Jest tests with AI-ready templates</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">3</span>
                <h3 className="text-sm font-medium text-slate-200">Create or Preview PR</h3>
              </div>
              <p className="text-xs text-slate-400">Real PR for demo repo, simulated for others</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            <strong>Error:</strong> {error}
          </div>
        </section>
      )}

      {scanNote && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className={`rounded-xl border p-4 text-sm ${
            scanMode === "live-github-scan"
              ? "border-green-400/20 bg-green-500/10 text-green-100"
              : "border-blue-400/20 bg-blue-500/10 text-blue-100"
          }`}>
            <strong>ℹ️ {scanMode === "live-github-scan" ? "Live Scan Result:" : "Demo Fallback:"}</strong> {scanNote}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">1</span>
                <h2 className="text-lg font-medium">Analyze Repository</h2>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Enter a public GitHub repository URL to scan with live API, or use demo fallback data.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => setRepoUrl("https://github.com/void-logic/testforge-demo-target")}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 whitespace-nowrap"
                  >
                    Use demo repo
                  </button>
                </div>
                <button
                  type="button"
                  onClick={analyzeRepo}
                  disabled={isAnalyzing || !repoUrl.trim()}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                  {functions.map((item, index) => {
                    // Use item.id if available, otherwise fall back to name+file for unique identification
                    const itemKey = item.id || `${item.name}-${item.file}`;
                    const selectedKey = selectedFunction?.id || (selectedFunction ? `${selectedFunction.name}-${selectedFunction.file}` : null);
                    const isSelected = itemKey === selectedKey;
                    
                    return (
                    <div
                      key={item.id || `${item.name}-${item.file}-${index}`}
                      className={`rounded-xl border p-4 transition ${
                        isSelected
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
                          {isGenerating && isSelected
                            ? "Generating..."
                            : item.tested
                            ? "Already tested"
                            : "Generate Test"}
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-300">2</span>
                <h2 className="text-lg font-medium">Generate Test</h2>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Preview generated Jest tests before creating a pull request.
              </p>

              {testCode && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">Provider:</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    testProvider === "watsonx-ready"
                      ? "bg-purple-500/20 text-purple-200 border border-purple-400/30"
                      : "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                  }`}>
                    {testProvider === "watsonx-ready" ? "🤖 watsonx.ai Ready" : "📋 Mock Fallback"}
                  </span>
                  <span className="text-xs font-medium text-slate-400 ml-2">File:</span>
                  <code className="text-xs text-slate-300 font-mono">{testFilename}</code>
                </div>
              )}

              <div className="mt-5 rounded-xl border border-white/10 bg-black/40">
                <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
                  {testFilename || (selectedFunction
                    ? `${selectedFunction.name}.test.ts`
                    : "No function selected")}
                </div>
                <pre className="min-h-[420px] overflow-auto p-4 text-xs leading-6 text-slate-200">
                  <code>
                    {isGenerating
                      ? "Generating tests..."
                      : testCode || "// Generated test will appear here"}
                  </code>
                </pre>
              </div>

              {testCode && (
                <button
                  onClick={copyToClipboard}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {copySuccess ? "✓ Copied to clipboard!" : "📋 Copy test to clipboard"}
                </button>
              )}

              {testExplanation && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-medium text-slate-400 mb-2">📝 What was generated:</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{testExplanation}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">3</span>
                <button
                  onClick={createPR}
                  disabled={!testCode || isCreatingPR}
                  className="flex-1 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isCreatingPR ? "Creating PR..." : "Create or Preview PR"}
                </button>
              </div>
  
              {prPreview && (
                <div className="mt-4 rounded-xl border border-green-400/20 bg-green-500/10 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-medium text-green-100">
                      {prPreview.mode === "real-github-pr"
                        ? "✅ Real GitHub PR Created"
                        : "📋 PR Preview Generated"}
                    </h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      prPreview.mode === "real-github-pr"
                        ? "bg-green-500/30 text-green-100 border border-green-400/40"
                        : "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                    }`}>
                      {prPreview.mode === "real-github-pr" ? "🟢 Live" : "🔵 Simulated"}
                    </span>
                  </div>
                  
                  <p className="text-sm text-green-100/80 mb-4">
                    {prPreview.message}
                  </p>
  
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-300 font-medium min-w-[100px]">Branch:</span>
                      <code className="flex-1 rounded bg-black/30 px-2 py-1 text-xs text-green-100 font-mono">
                        {prPreview.branchName}
                      </code>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-green-300 font-medium min-w-[100px]">File Path:</span>
                      <code className="flex-1 rounded bg-black/30 px-2 py-1 text-xs text-green-100 font-mono">
                        {prPreview.filePath}
                      </code>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-green-300 font-medium min-w-[100px]">Commit:</span>
                      <code className="flex-1 rounded bg-black/30 px-2 py-1 text-xs text-green-100 font-mono">
                        {prPreview.commitMessage}
                      </code>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-green-300 font-medium min-w-[100px]">PR Title:</span>
                      <span className="flex-1 text-green-100">
                        {prPreview.prTitle}
                      </span>
                    </div>
                  </div>
  
                  <div className="mt-4 pt-4 border-t border-green-400/20">
                    <p className="text-xs text-green-100/70 mb-3">
                      <strong>ℹ️ Note:</strong> {prPreview.note}
                    </p>
                    {prPreview.mode === "real-github-pr" && prPreview.prUrl ? (
                      <a
                        href={prPreview.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500"
                      >
                        🔗 View pull request →
                      </a>
                    ) : prPreview.repositoryUrl ? (
                      <a
                        href={prPreview.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                      >
                        🔗 View repository →
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
              <h2 className="text-lg font-medium text-blue-100">
                🤖 IBM Bob Development Partnership
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                This project was built in collaboration with <strong>IBM Bob</strong> as the primary development assistant throughout the entire lifecycle.
              </p>
              <div className="mt-4 space-y-2 text-sm text-blue-100/80">
                <div className="flex items-start gap-2">
                  <span className="text-blue-300">✓</span>
                  <span><strong>Architecture Planning:</strong> System design and technology decisions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300">✓</span>
                  <span><strong>API Implementation:</strong> All three API routes developed with Bob</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300">✓</span>
                  <span><strong>Code Review:</strong> Quality improvements and best practices</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300">✓</span>
                  <span><strong>Documentation:</strong> Comprehensive guides and session logs</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-blue-100/60">
                📁 Complete session documentation available in <span className="font-mono bg-blue-500/20 px-1.5 py-0.5 rounded">bob_sessions/</span> directory
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