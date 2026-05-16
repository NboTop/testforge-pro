# TestForge Pro — 2-Minute Live Demonstration Script

**IBM Bob Hackathon 2026**

---

## 🎯 Opening Hook (15 seconds)

> "Every developer knows the pain of coverage debt. You ship features fast, but tests lag behind. What if you could go from 'I need tests for this function' to a real pull request in under 2 minutes?"

**[Open TestForge Pro dashboard at https://testforge-void.vercel.app/]**

> "I'm going to show you TestForge Pro—a platform that accelerates the journey from conceptual ideas to measurable impact in production codebases. Watch as we analyze a real repository, generate comprehensive tests, and create an actual GitHub pull request—all live, right now."

---

## 📊 Step 1: Live Repository Analysis (30 seconds)

**[Navigate to repository input field]**

> "Let's start with a real repository. I'm using our pre-configured demo repository at https://github.com/void-logic/testforge-demo-target."

**[Enter repository URL or click "Use demo repo" button]**

**[Click "Analyze Repository"]**

> "TestForge Pro is now scanning this public GitHub repository using the GitHub API. It's fetching the file tree, filtering JavaScript and TypeScript source files, and detecting exported functions using regex-based pattern matching."

**[Wait for scan to complete - shows "🟢 Live GitHub Scan" badge]**

> "And there we have it—live scan complete. Notice the green 'Live GitHub Scan' badge. The system has identified untested functions across the codebase, prioritized by severity. High-severity functions in payment or authentication modules are flagged first."

**[Point to function list showing calculateFinalPrice, applyDiscountCode, etc.]**

---

## 🧪 Step 2: AI-Powered Test Generation (30 seconds)

**[Scroll to calculateFinalPrice function]**

> "Let's focus on this calculateFinalPrice function—a critical payment calculation that currently has no test coverage. I'll click 'Generate Test'."

**[Click "Generate Test" button]**

**[Wait for test generation - shows loading state]**

> "The system is generating a comprehensive Jest test suite. While the current implementation uses template-based generation, the architecture is fully prepared for IBM watsonx.ai Granite model integration."

**[Test code appears with syntax highlighting]**

> "Here's our complete test suite. Let me walk you through the test values that validate this function's behavior:"

**[Point to test code sections]**

- **Base case: 99** — Standard pricing with no modifiers
- **Premium tier: 110** — 10% markup for premium customers  
- **Discount applied: 90** — 10% discount reduces the price
- **Complex calculation: 118.75** — Premium tier (110) plus tax (8.75) for multi-factor scenarios

> "Each test case validates specific business logic, ensuring the function handles normal operations, edge cases, and error conditions correctly."

---

## 🚀 Step 3: Real GitHub Pull Request Creation (30 seconds)

**[Scroll to PR creation section]**

> "Now for the exciting part—let's create an actual GitHub pull request. I'll click 'Create or Preview PR'."

**[Click "Create or Preview PR" button]**

**[Wait for PR creation - shows "✅ Real GitHub PR Created" with "🟢 Live" badge]**

> "Success! TestForge Pro has just created a real pull request in our configured demo repository. Notice the green 'Live' badge—this is a genuine GitHub PR, not a simulation."

**[Point to PR details]**

- **Branch created:** `testforge/add-tests-calculatefinalprice-[timestamp]`
- **File committed:** `__tests__/calculatefinalprice.test.ts`
- **Commit message:** "test: add Jest tests for calculateFinalPrice"
- **PR title:** "Add tests for calculateFinalPrice"

**[Click "🔗 View pull request →" button]**

**[Browser opens to actual GitHub PR]**

> "And here it is on GitHub—a real pull request with our generated test file, complete with diff view, file changes, and a descriptive PR description that reviewers can evaluate."

---

## 🔄 Step 4: Demonstrating Versatility (15 seconds)

**[Return to TestForge Pro dashboard]**

> "Let's demonstrate the platform's versatility by analyzing a different repository."

**[Enter https://github.com/NboTop/testforge-pro in repository field]**

**[Click "Analyze Repository"]**

**[Wait for scan - may show live scan or demo fallback]**

> "The system adapts to different codebases and project structures. Whether it's a Next.js application, a React library, or a Node.js backend, TestForge Pro identifies testable functions and generates appropriate test suites."

---

## 🛡️ Step 5: Security & Safety Controls (20 seconds)

**[Generate test for any detected function]**

**[Click "Create or Preview PR"]**

**[Shows "📋 PR Preview Generated" with "🔵 Simulated" badge]**

> "Notice the blue 'Simulated' badge this time. This is TestForge Pro's safety mechanism in action. The system shows what the pull request would contain without actually creating it."

**[Point to preview details]**

> "This demonstrates our security model: GitHub tokens are stored exclusively server-side and never exposed to clients. Real pull request creation is restricted solely to the pre-configured demonstration repository. The system prevents arbitrary write operations to user repositories without explicit authorization."

**[Point to security note at bottom]**

> "The note clearly states: 'No real pull request was created. Real PR creation is restricted to the configured demo repository.' This transparency and control is essential for production use."

---

## 🎓 Closing: Implementation Transparency (15 seconds)

**[Return to main dashboard view]**

> "Let me be completely transparent about what you just saw:"

**[Point to status badges]**

- **✅ Live public GitHub repository scanning** — Fully implemented and operational using the GitHub API
- **✅ Regex-based code detection** — Implemented and functional for identifying testable functions
- **✅ Controlled pull request creation** — Implemented exclusively for the configured demo repository with appropriate safety constraints
- **🔮 watsonx.ai integration** — Architecturally prepared with provider interfaces ready, but not yet connected to live services

> "The current implementation uses template-based test generation, but the system is architected for seamless integration with IBM watsonx.ai Granite models when that connection is established."

---

## 💡 Closing Pitch (10 seconds)

> "TestForge Pro demonstrates how AI-powered automation can accelerate test coverage while maintaining responsible security practices. From repository analysis to pull request creation in under 2 minutes—that's the power of intelligent test generation."

**[Pause on dashboard showing workflow steps]**

> "For development teams seeking to improve test coverage efficiently, TestForge Pro offers a glimpse into the future of automated quality assurance—balancing powerful automation with security and transparency."

**[End demonstration]**

---

## 📋 Demo Checklist

### Pre-Demo Setup
- [ ] Ensure TestForge Pro is accessible at https://testforge-void.vercel.app/
- [ ] Verify `.env.local` has GITHUB_TOKEN, GITHUB_DEMO_OWNER, GITHUB_DEMO_REPO configured
- [ ] Confirm demo repository (void-logic/testforge-demo-target) is accessible
- [ ] Test the complete workflow once before live demo
- [ ] Have browser ready to open GitHub PRs
- [ ] Clear any previous test data or PRs if needed

### During Demo
- [ ] Speak clearly and maintain steady pace
- [ ] Point to specific UI elements as you mention them
- [ ] Wait for loading states to complete naturally
- [ ] Show actual GitHub PR in browser
- [ ] Emphasize live vs simulated badges
- [ ] Be honest about implementation status

### Key Messages to Emphasize
- ✅ **Real GitHub integration** — Not just mockups
- ✅ **Live repository scanning** — Actual API calls
- ✅ **Controlled PR creation** — Real PRs with safety controls
- ✅ **Security model** — Server-side token handling
- ✅ **Transparency** — Clear about what's implemented vs planned
- ✅ **Production-ready architecture** — Designed for watsonx.ai integration

---

## 🎬 Alternative Demo Flows

### Flow A: Focus on Security (If judges ask about safety)
1. Show live scan of public repo
2. Generate test
3. Attempt PR creation on non-configured repo → Shows simulated preview
4. Explain security model in detail
5. Then show real PR creation on configured demo repo

### Flow B: Focus on Technical Implementation (If judges ask about architecture)
1. Show live scan with regex detection
2. Explain current limitations (regex vs AST)
3. Generate test and explain template vs AI
4. Show PR creation with both modes
5. Discuss watsonx.ai integration roadmap

### Flow C: Focus on User Experience (If judges ask about workflow)
1. Walk through complete workflow step-by-step
2. Emphasize loading states and feedback
3. Show error handling (try invalid repo URL)
4. Demonstrate responsive design (resize browser)
5. Highlight copy-to-clipboard and other UX features

---

## 🔧 Troubleshooting

### If Live Scan Fails
- **Fallback message will appear** — This is expected behavior
- **Explain:** "The system automatically falls back to demo data when live scanning is unavailable due to rate limits, private repositories, or network issues. This ensures a reliable demonstration experience."

### If PR Creation Fails
- **Simulated preview will show** — This is the safety mechanism
- **Explain:** "The automatic fallback to simulated preview demonstrates our security controls. Real PR creation requires exact repository match and valid credentials."

### If GitHub is Slow
- **Use the time to explain** — Talk about the architecture while waiting
- **Mention:** "In production, we'd implement caching and background processing to optimize response times."

---

## 📊 Expected Timing Breakdown

| Section | Time | Cumulative |
|---------|------|------------|
| Opening Hook | 15s | 0:15 |
| Live Repository Analysis | 30s | 0:45 |
| AI-Powered Test Generation | 30s | 1:15 |
| Real GitHub PR Creation | 30s | 1:45 |
| Demonstrating Versatility | 15s | 2:00 |
| Security & Safety Controls | 20s | 2:20 |
| Implementation Transparency | 15s | 2:35 |
| Closing Pitch | 10s | 2:45 |

**Total: ~2:45 minutes** (allows 45 seconds buffer for questions or technical delays)

---

## 🎯 Key Differentiators to Highlight

1. **Live GitHub Integration** — Not just mockups; real API calls and real PRs
2. **Security-First Design** — Controlled PR creation with automatic fallback
3. **Honest Implementation** — Transparent about what's real vs planned
4. **Production Architecture** — Ready for watsonx.ai integration
5. **Complete Workflow** — End-to-end from analysis to PR in minutes
6. **Developer Experience** — Polished UI with clear feedback and status indicators

---

## 💬 Anticipated Questions & Answers

**Q: "Is this really creating GitHub PRs or is it simulated?"**
> A: "Both! For the configured demo repository, it creates real GitHub pull requests using authenticated API calls. For all other repositories, it shows a simulated preview as a safety control. This dual-mode approach demonstrates the capability while preventing unauthorized writes to arbitrary repositories."

**Q: "How does the test generation work?"**
> A: "Currently, it uses template-based generation with pre-written Jest patterns. The architecture is fully prepared for IBM watsonx.ai Granite model integration, with provider interfaces ready. The templates demonstrate the intended output quality while we finalize the AI integration."

**Q: "Can it scan private repositories?"**
> A: "The current implementation scans public repositories using GitHub's unauthenticated API. Private repository support requires OAuth authentication, which is planned for the next phase. The architecture is designed to support this with minimal changes."

**Q: "What about test coverage verification?"**
> A: "The current implementation uses regex-based function detection. Real test coverage verification requires AST-based code analysis, which is planned for Phase 1 of the production roadmap. The system currently identifies functions that appear untested based on file structure."

**Q: "How secure is the GitHub token handling?"**
> A: "Extremely secure. The token is stored in `.env.local` (never committed to git), handled exclusively server-side in API routes, never exposed to the frontend, never logged, and only works for the exact configured demo repository. No arbitrary repository writes are possible."

---

**Demo Script Version:** 1.0  
**Last Updated:** 2026-05-16  
**Prepared for:** IBM Bob Hackathon 2026 Final Submission