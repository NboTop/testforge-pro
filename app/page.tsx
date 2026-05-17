"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FunctionItem = {
  id?: string;
  name: string;
  file: string;
  tested: boolean;
  severity: "High" | "Medium" | "Low";
  reason: string;
};

type WorkflowEvidence = {
  repositoryScanned: string;
  functionSelected: string;
  testFileGenerated: string;
  provider: string;
  aiModel?: string;
  contextUsed?: boolean;
  branchCreated?: string;
  commitCreated?: string;
  prOpened?: string;
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
  workflowEvidence?: WorkflowEvidence;
};

type GenerateTestResponse = {
  functionName: string;
  provider: "gemini-live" | "mock-fallback" | "watsonx-ready";
  aiModel?: string;
  contextUsed?: boolean;
  testCode: string;
  explanation: string;
  filename: string;
  note?: string;
  fallbackReason?: string;
};

// ─── Provider Badge Config ────────────────────────────────────────────────────

function getProviderConfig(provider: "gemini-live" | "mock-fallback" | "watsonx-ready") {
  const configs = {
    "gemini-live": {
      label: "✨ Gemini Live",
      classes: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
    },
    "mock-fallback": {
      label: "📋 Template Fallback",
      classes: "bg-blue-500/20 text-blue-200 border border-blue-400/30",
    },
    "watsonx-ready": {
      label: "🤖 watsonx.ai Ready",
      classes: "bg-purple-500/20 text-purple-200 border border-purple-400/30",
    },
  };
  return configs[provider];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/void-logic/testforge-demo-target");
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<FunctionItem | null>(null);
  const [testCode, setTestCode] = useState("");
  const [testExplanation, setTestExplanation] = useState("");
  const [testFilename, setTestFilename] = useState("");
  const [testProvider, setTestProvider] = useState<"gemini-live" | "mock-fallback" | "watsonx-ready">("mock-fallback");
  const [testAiModel, setTestAiModel] = useState<string | undefined>();
  const [testContextUsed, setTestContextUsed] = useState<boolean | undefined>();
  const [testNote, setTestNote] = useState<string | undefined>();
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
  const [showDemoGuide, setShowDemoGuide] = useState(true);

  // ── Actions ──────────────────────────────────────────────────────────────

  async function analyzeRepo() {
    const cleanedRepoUrl = repoUrl.trim();
    if (!cleanedRepoUrl) { setError("Please enter a repository URL"); return; }

    setIsAnalyzing(true);
    setPrPreview(null);
    setTestCode("");
    setTestExplanation("");
    setTestFilename("");
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: cleanedRepoUrl }),
      });
      if (!response.ok) throw new Error("Failed to analyze repository");

      const data = await response.json();
      const functionsArray = Array.isArray(data.functions) ? data.functions : [];

      setFunctions(functionsArray);
      setTotalFunctions(data.totalFunctions || 0);
      setUntestedFunctions(data.untestedFunctions || 0);
      setScanMode(data.mode || "demo-fallback");
      setScanNote(data.note || "");
      setSelectedFunction(functionsArray.length > 0 ? functionsArray[0] : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          functionName: item.name,
          filePath: item.file,
          // functionCode omitted — not available in current scan output
        }),
      });
      if (!response.ok) throw new Error("Failed to generate test");

      const data: GenerateTestResponse = await response.json();
      setTestCode(data.testCode);
      setTestExplanation(data.explanation || "");
      setTestFilename(data.filename || `${item.name}.test.ts`);
      setTestProvider(data.provider || "mock-fallback");
      setTestAiModel(data.aiModel);
      setTestContextUsed(data.contextUsed);
      setTestNote(data.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testCode,
          functionName: selectedFunction.name,
          repoUrl,
          provider: testProvider,
          aiModel: testAiModel,
          contextUsed: testContextUsed,
        }),
      });
      if (!response.ok) throw new Error("Failed to create pull request");

      const data = await response.json();
      setPrPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsCreatingPR(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(testCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      console.error("Clipboard write failed");
    }
  }

  const generatedTests = testCode ? 1 : 0;
  const timeSaved = generatedTests ? "45 min" : "0 min";
  const providerConfig = getProviderConfig(testProvider);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      {/* ── Header ── */}
      <section className="border-b border-white/10 bg-[#0B1020]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                IBM Bob Hackathon Project
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">TestForge Pro</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                AI-assisted test engineering workflow: scan repositories, generate Jest tests with Gemini, and open real GitHub pull requests — all in one automated flow.
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
                {scanMode === "live-github-scan" ? "🟢 Live GitHub Scan" : "🔵 Demo Fallback"}
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                ✨ Gemini Optional
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
                <h3 className="text-sm font-medium text-slate-200">Scan Repository</h3>
              </div>
              <p className="text-xs text-slate-400">Live GitHub API or demo fallback</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-300">2</span>
                <h3 className="text-sm font-medium text-slate-200">Generate Tests</h3>
              </div>
              <p className="text-xs text-slate-400">Gemini AI or template fallback</p>
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

      {/* ── Error Banner ── */}
      {error && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            <strong>Error:</strong> {error}
          </div>
        </section>
      )}

      {/* ── Scan Note Banner ── */}
      {scanNote && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className={`rounded-xl border p-4 text-sm ${
            scanMode === "live-github-scan"
              ? "border-green-400/20 bg-green-500/10 text-green-100"
              : "border-blue-400/20 bg-blue-500/10 text-blue-100"
          }`}>
            <strong>ℹ️ {scanMode === "live-github-scan" ? "Live Scan:" : "Demo Fallback:"}</strong> {scanNote}
          </div>
        </section>
      )}

      {/* ── Main Grid ── */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ── Left Column ── */}
          <div className="space-y-6">

            {/* Analyze Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">1</span>
                <h2 className="text-lg font-medium">Analyze Repository</h2>
              </div>
              <p className="mt-1 text-sm text-slate-400">Enter a public GitHub URL to scan for untested functions.</p>

              {showDemoGuide && (
                <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-300 text-sm font-medium">📖 Demo Guide</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>Use <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200 font-mono">https://github.com/void-logic/testforge-demo-target</code> to create a real GitHub PR.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>Use any other public repo to see a simulated PR preview.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>Set <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200 font-mono">GEMINI_API_KEY</code> server-side to enable live AI test generation.</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setShowDemoGuide(false)}
                      className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                      aria-label="Dismiss demo guide"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-2"
                  />
                  <button
                    onClick={() => setRepoUrl("https://github.com/void-logic/testforge-demo-target")}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 whitespace-nowrap"
                  >
                    Use demo repo
                  </button>
                </div>
                <button
                  onClick={analyzeRepo}
                  disabled={isAnalyzing || !repoUrl.trim()}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzing ? "⏳ Scanning GitHub repository…" : "Analyze Repository"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
              <StatCard label="Total functions" value={totalFunctions} />
              <StatCard label="Untested" value={untestedFunctions} />
              <StatCard label="Generated tests" value={generatedTests} />
              <StatCard label="Time saved" value={timeSaved} />
            </div>

            {/* Coverage Gaps */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Coverage gaps</h2>
                  <p className="text-sm text-slate-400">Functions detected without meaningful tests.</p>
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
                    const itemKey = item.id || `${item.name}-${item.file}`;
                    const selectedKey = selectedFunction?.id || (selectedFunction ? `${selectedFunction.name}-${selectedFunction.file}` : null);
                    const isSelected = itemKey === selectedKey;

                    return (
                      <div
                        key={item.id || `${item.name}-${item.file}-${index}`}
                        className={`rounded-xl border p-4 transition ${
                          isSelected ? "border-blue-400/60 bg-blue-500/10" : "border-white/10 bg-black/20"
                        }`}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-medium">{item.name}</h3>
                              <SeverityBadge severity={item.severity} />
                              <span className={`rounded-full px-2 py-1 text-xs ${
                                item.tested ? "bg-green-500/10 text-green-200" : "bg-red-500/10 text-red-200"
                              }`}>
                                {item.tested ? "Tested" : "Untested"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{item.file}</p>
                            <p className="mt-2 text-sm text-slate-400">{item.reason}</p>
                          </div>
                          <button
                            onClick={() => generateTest(item)}
                            disabled={item.tested || isGenerating}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isGenerating && isSelected ? "⏳ Generating…" : item.tested ? "Already tested" : "Generate Test"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">

            {/* Generate Test Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-300">2</span>
                <h2 className="text-lg font-medium">Generate Test</h2>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Preview the generated Jest test suite before opening a pull request.
              </p>

              {/* Provider & Model Badge Row */}
              {testCode && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${providerConfig.classes}`}>
                    {providerConfig.label}
                  </span>
                  {testAiModel && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 font-mono">
                      {testAiModel}
                    </span>
                  )}
                  {testContextUsed !== undefined && (
                    <span className={`rounded-full px-2.5 py-1 text-xs ${testContextUsed ? "text-emerald-300" : "text-slate-400"}`}>
                      {testContextUsed ? "✅ Context used" : "ℹ️ Name-only context"}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-mono text-slate-400">{testFilename}</span>
                </div>
              )}

              {/* Code Preview */}
              <div className="mt-4 rounded-xl border border-white/10 bg-black/40">
                <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
                  {testFilename || (selectedFunction ? `${selectedFunction.name}.test.ts` : "No function selected")}
                </div>
                <pre className="min-h-[380px] overflow-auto p-4 text-xs leading-6 text-slate-200">
                  <code>
                    {isGenerating ? "⏳ Generating tests with AI…" : testCode || "// Generated test will appear here after you click Generate Test"}
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

              {/* Explanation */}
              {testExplanation && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-medium text-slate-400 mb-1">📝 What was generated:</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{testExplanation}</p>
                  {testNote && (
                    <p className="mt-2 text-xs text-slate-500 italic">{testNote}</p>
                  )}
                </div>
              )}

              {/* Create PR Button */}
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">3</span>
                <button
                  onClick={createPR}
                  disabled={!testCode || isCreatingPR}
                  className="flex-1 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isCreatingPR ? "⏳ Creating GitHub PR…" : "Create or Preview PR"}
                </button>
              </div>

              {/* PR Result Card */}
              {prPreview && (
                <div className={`mt-4 rounded-xl border p-5 ${
                  prPreview.mode === "real-github-pr"
                    ? "border-green-400/20 bg-green-500/10"
                    : "border-blue-400/20 bg-blue-500/10"
                }`}>
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-medium text-white">
                      {prPreview.mode === "real-github-pr" ? "✅ Real GitHub PR Created" : "📋 PR Preview Generated"}
                    </h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      prPreview.mode === "real-github-pr"
                        ? "bg-green-500/30 text-green-100 border border-green-400/40"
                        : "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                    }`}>
                      {prPreview.mode === "real-github-pr" ? "🟢 Live" : "🔵 Simulated"}
                    </span>
                  </div>

                  <p className="text-sm text-white/70 mb-4">{prPreview.message}</p>

                  {/* PR Details */}
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: "Branch", value: prPreview.branchName, mono: true },
                      { label: "File", value: prPreview.filePath, mono: true },
                      { label: "Commit", value: prPreview.commitMessage, mono: true },
                      { label: "PR Title", value: prPreview.prTitle, mono: false },
                    ].map(({ label, value, mono }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className="text-slate-300 font-medium min-w-[72px] text-xs pt-1">{label}:</span>
                        {mono ? (
                          <code className="flex-1 rounded bg-black/30 px-2 py-1 text-xs text-slate-200 font-mono break-all">{value}</code>
                        ) : (
                          <span className="flex-1 text-slate-200 text-sm">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Workflow Evidence */}
                  {prPreview.workflowEvidence && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-medium text-slate-300 mb-2">🔬 Workflow Evidence</p>
                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Repository scanned: <code className="text-slate-300">{prPreview.workflowEvidence.repositoryScanned}</code></span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Function selected: <code className="text-slate-300">{prPreview.workflowEvidence.functionSelected}</code></span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Test generated via: <code className={`${
                            prPreview.workflowEvidence.provider === "gemini-live"
                              ? "text-emerald-300"
                              : prPreview.workflowEvidence.provider === "watsonx-ready"
                              ? "text-purple-300"
                              : "text-blue-300"
                          }`}>{prPreview.workflowEvidence.provider}</code>
                            {prPreview.workflowEvidence.aiModel && (
                              <code className="ml-1 text-slate-400">({prPreview.workflowEvidence.aiModel})</code>
                            )}
                          </span>
                        </div>
                        {prPreview.workflowEvidence.branchCreated && (
                          <div className="flex gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Branch created via GitHub API</span>
                          </div>
                        )}
                        {prPreview.workflowEvidence.commitCreated && (
                          <div className="flex gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Test file committed to branch</span>
                          </div>
                        )}
                        {prPreview.workflowEvidence.prOpened && (
                          <div className="flex gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Pull request opened via GitHub API</span>
                          </div>
                        )}
                        {!prPreview.workflowEvidence.branchCreated && (
                          <div className="flex gap-2">
                            <span className="text-blue-400">○</span>
                            <span>No write — simulated preview only</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Note + Action Button */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-3"><strong>ℹ️</strong> {prPreview.note}</p>
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

            {/* IBM Bob Card */}
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
              <h2 className="text-lg font-medium text-blue-100">🤖 IBM Bob Development Partnership</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                Built in collaboration with <strong>IBM Bob</strong> as the primary development assistant throughout the entire lifecycle.
              </p>
              <div className="mt-4 space-y-2 text-sm text-blue-100/80">
                {[
                  ["Architecture Planning", "System design and technology decisions"],
                  ["API Implementation", "All three API routes developed with Bob"],
                  ["Gemini Integration", "AI-powered test generation with safe fallback"],
                  ["Code Review", "Quality improvements and best practices"],
                  ["Documentation", "Comprehensive guides and session logs"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-2">
                    <span className="text-blue-300">✓</span>
                    <span><strong>{title}:</strong> {desc}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-blue-100/60">
                📁 Session logs available in <span className="font-mono bg-blue-500/20 px-1.5 py-0.5 rounded">bob_sessions/</span>
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
  return <span className={`rounded-full px-2 py-1 text-xs ${styles[severity]}`}>{severity}</span>;
}