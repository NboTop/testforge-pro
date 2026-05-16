# 🧪 TestForge Pro

**AI-Test-Generation Workflow Demo for JavaScript/TypeScript Repositories**

[![IBM Bob Hackathon 2026](https://img.shields.io/badge/IBM%20Bob-Hackathon%202026-0f62fe?style=for-the-badge)](https://github.com)
[![Built with watsonx.ai](https://img.shields.io/badge/Built%20for-watsonx.ai-161616?style=for-the-badge)](https://www.ibm.com/watsonx)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

---

## 🎯 Current Status: Demonstration Mode

> **⚠️ IMPORTANT: This MVP operates entirely in demonstration mode using simulated responses and mock data.**

**No External Services Required:**
- ✅ No IBM Cloud account needed
- ✅ No watsonx.ai API credentials required
- ✅ No GitHub tokens or authentication needed
- ✅ No external API calls made
- ✅ Works completely offline after installation
- ✅ Zero configuration required to run

**What This Means:**
- All AI functionality uses pre-written mock responses
- Repository analysis returns simulated data
- Test generation uses pre-configured templates
- Pull request workflow is demonstrated, not executed
- **You can evaluate all features without any credentials**

**Future Integration:**
While the current version uses only simulated responses, the codebase includes a prepared API route architecture designed to facilitate future connection to IBM watsonx.ai Granite models when that integration is implemented.

---

## 🔍 Optional Live GitHub Scan

TestForge Pro now includes **optional live scanning of public GitHub repositories** without requiring any credentials or authentication. This feature provides a glimpse into real repository analysis while maintaining the demo fallback for reliability.

### How It Works

- **Public Repository Support**: Enter any public GitHub repository URL (format: `https://github.com/owner/repo`)
- **Unauthenticated API**: Uses GitHub's public API without requiring tokens or authentication
- **Regex-Based Detection**: Detects exported functions using pattern matching on source code
- **Automatic Fallback**: Falls back to demo mode for private repos, rate limits, errors, or when no functions are detected

### What's Detected

The live scan:
- ✅ Fetches repository metadata and file tree from GitHub's public API
- ✅ Filters JavaScript/TypeScript source files (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ Excludes test files, build artifacts, and dependencies
- ✅ Detects exported functions using regex patterns
- ✅ Assigns severity based on file paths (payment/auth/security = High, validation/parser/api = Medium, others = Low)
- ✅ Limits scan to first 8 files and up to 10 functions for performance

### What's NOT Yet Implemented

- ❌ **Real Test Coverage Verification**: Does not check if tests actually exist or verify coverage
- ❌ **AST-Based Analysis**: Uses regex instead of Abstract Syntax Tree parsing
- ❌ **Private Repository Access**: Only works with public repositories
- ❌ **Authenticated Scanning**: No OAuth or token-based authentication

### Fallback Behavior

The system automatically falls back to demo mode when:
- Repository URL is invalid or malformed
- Repository is private or inaccessible
- GitHub API rate limits are reached
- No functions are detected in the scanned files
- Network errors or API failures occur

### Future Roadmap

- **AST-Based Coverage Verification**: Parse code structure for accurate analysis
- **Real Test Detection**: Verify actual test file existence and coverage
- **Authenticated Access**: Support private repositories via OAuth
- **Enhanced Analysis**: Deeper code understanding with IBM watsonx.ai integration

---

## 🔗 Controlled GitHub PR Creation

TestForge Pro now supports **real GitHub pull request creation** for one preconfigured demo repository, with automatic fallback to simulated preview for all other repositories.

### How It Works

- **Demo Repository Only**: Real PRs are created exclusively when environment variables `GITHUB_TOKEN`, `GITHUB_DEMO_OWNER`, and `GITHUB_DEMO_REPO` are configured
- **Exact Match Required**: Repository URL must exactly match `https://github.com/${GITHUB_DEMO_OWNER}/${GITHUB_DEMO_REPO}`
- **Automatic Fallback**: All other repositories automatically use simulated preview mode
- **Server-Side Security**: GitHub token is never exposed to frontend or included in responses

### Configuration

To enable real PR creation for your demo repository, add these environment variables to `.env.local`:

```bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_DEMO_OWNER=your-github-username
GITHUB_DEMO_REPO=your-demo-repo-name
```

**Security Notes:**
- Token is handled exclusively server-side
- Never logged to console or files
- Never included in API responses
- Only works for the exact configured repository

### Real PR Creation Flow

When configured and repository matches:
1. Fetches repository metadata to get default branch
2. Creates new branch: `testforge/add-tests-[function-name]-[timestamp]`
3. Commits test file to new branch
4. Creates pull request with detailed description
5. Returns PR URL for immediate viewing

### Fallback Behavior

Simulated preview is used when:
- Repository URL doesn't match configured demo repository
- Environment variables are not set
- GitHub API calls fail or throw errors
- Any network or authentication issues occur

### Future Plans

- **OAuth Integration**: Support arbitrary repositories via user authentication
- **Multi-Repository Support**: Configure multiple demo repositories
- **Enhanced PR Templates**: Customizable PR descriptions and labels

---

## 💡 The Problem

Software teams struggle with test coverage gaps that lead to production bugs and technical debt. Writing comprehensive test suites is time-consuming, often taking **45+ minutes per function**, and developers frequently skip testing edge cases and error scenarios. This results in:

- 🐛 **Undetected bugs** reaching production
- ⏰ **Wasted developer time** on manual test writing
- 📉 **Inconsistent test quality** across codebases
- 🔄 **Delayed releases** due to insufficient coverage

## 🎯 The Solution

TestForge Pro is a demonstration platform that simulates detecting untested JavaScript/TypeScript functions and generating comprehensive Jest test suites through an API-backed mock workflow. This MVP version operates entirely in **demonstration mode** using simulated responses and mock data, requiring no external API credentials or authentication.

**Key Innovation:** Demonstrates how AI-powered test generation could accelerate software quality assurance, with a prepared architecture for future IBM watsonx.ai integration.

**Current Status:** This is a fully functional demonstration application that showcases the complete user experience and workflow without requiring any IBM Cloud accounts, API keys, or external service credentials.

---

## 🎬 Demo Flow

### 1️⃣ **Repository Analysis**
Enter a GitHub repository URL and click "Analyze Repository". The system simulates scanning the codebase to detect functions and their test coverage status.

### 2️⃣ **Coverage Gap Detection**
View a list of untested functions with severity ratings (High/Medium/Low) and explanations of why each function needs testing.

### 3️⃣ **AI Test Generation**
Select any untested function and click "Generate Test". The system produces a comprehensive Jest test suite with:
- ✅ Normal case scenarios
- ✅ Edge case handling
- ✅ Error condition tests
- ✅ Input validation checks

### 4️⃣ **Pull Request Preview**
Review the generated test code and click "Create Pull Request" to see a realistic PR workflow preview showing branch name, file path, commit message, and PR details that would be prepared for GitHub in production.

---

## ✨ Features Implemented (Demonstration Mode)

### Core Functionality
- ✅ **Next.js Dashboard Interface** - Modern, responsive UI built with TypeScript and Tailwind CSS
- ✅ **Repository Analysis API** (`/api/analyze`) - Simulates function detection using mock data
- ✅ **Test Generation API** (`/api/generate-test`) - Returns pre-written Jest test templates
- ✅ **PR Creation API** (`/api/create-pr`) - Real GitHub PR creation for configured demo repository with automatic fallback to simulated preview
- ✅ **Mock Data System** - Complete demo experience with pre-configured scenarios
- ✅ **Real-time Loading States** - Professional UX with loading indicators and transitions
- ✅ **Error Handling** - User-friendly error messages and validation
- ✅ **Responsive Design** - Mobile and desktop optimized interface
- ✅ **Zero External Dependencies** - Runs completely without API credentials

### Demo Capabilities
- 🎯 **3 Sample Functions** with realistic test scenarios (pre-configured)
- 📊 **Statistics Dashboard** showing simulated coverage metrics
- 🔍 **Severity Ratings** (High/Medium/Low) for prioritization
- 💻 **Code Preview** with syntax formatting
- 🎨 **IBM-aligned positioning** with watsonx.ai-ready architecture
- 🚀 **Instant Setup** - No credentials, accounts, or configuration required

### What's NOT Implemented (Planned for Future)
- ❌ **Live watsonx.ai Integration** - Currently uses mock responses only
- ❌ **OAuth-Based PR Creation** - Real PR creation limited to one preconfigured demo repository
- ❌ **Code Parsing** - Limited regex-based detection (AST/Babel analysis planned)
- ❌ **Multi-Repository PR Support** - OAuth authentication for arbitrary repositories planned

---

## 🤖 IBM Bob Usage

IBM Bob served as the primary development partner throughout this project's lifecycle. All development sessions are documented in the `bob_sessions/` directory, providing a documented record of the AI-assisted development process.

### Bob's Contributions

**Architecture & Planning**
- System design and technology stack decisions
- API route structure and data flow planning
- MVP scope definition and feature prioritization

**Implementation**
- API endpoint development (`/api/analyze`, `/api/generate-test`, `/api/create-pr`)
- Dashboard UI review, API integration, and polish
- Mock data generation for reliable demos
- TypeScript type definitions and interfaces

**Code Quality**
- Code review and optimization suggestions
- Error handling implementation
- Loading state management
- Responsive design improvements

**Documentation**
- Architecture documentation (`ARCHITECTURE.md`)
- Implementation guide creation
- Deployment instructions
- Session documentation structure

### Session Documentation

All Bob interactions are preserved in `bob_sessions/`:
- `001-architecture-planning.md` - Initial system design
- `01-architecture-and-current-review.md` - Architecture refinement
- `02-api-routes-and-test-generation.md` - API implementation
- `03-final-review-and-polish.md` - Final polish and review
- `README.md` - Session documentation index

**Note:** IBM Bob was used as a development assistant, not as a runtime API within the application.

---

## 🔧 IBM Technologies

### Currently Used in Development
- **IBM Bob AI Assistant** - Development partner for architecture, coding, and documentation
  - Used as a development tool, not as a runtime API
  - All development sessions documented in `bob_sessions/`

### Current Application Status: Demonstration Mode Only

**⚠️ Important: No Live watsonx.ai Integration**

This MVP version **does not** connect to IBM watsonx.ai services or any external APIs. The application operates entirely in demonstration mode using:
- **Simulated responses** for all AI-related functionality
- **Mock data** for repository analysis and test generation
- **Pre-configured test scenarios** that run locally without external calls

**No credentials required:** You can run, test, and evaluate all application features without:
- IBM Cloud accounts
- watsonx.ai API keys
- GitHub tokens
- Any external service authentication

### Future Integration Architecture

While the current version uses only simulated responses, the codebase includes a **prepared API route architecture** designed to facilitate future connection to IBM watsonx.ai:

**Planned for Future Production:**
- **IBM watsonx.ai Granite Models** - For intelligent test generation
  - Target Model: `ibm/granite-13b-instruct-v2`
  - Planned Capabilities: Code understanding, test case generation, edge case detection
- **IBM Cloud Infrastructure** - For scalable deployment
- **IBM Watson Code Assistant** - For enhanced code analysis

**Integration-Ready Architecture:**
- Environment variable structure prepared for watsonx.ai credentials
- API route layer designed for easy Granite model integration
- Prompt engineering framework ready for implementation
- Clear separation between demo mode and future production logic
- Documented integration steps in `ARCHITECTURE.md`

---

## 🏗️ Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Repository  │  │   Function   │  │     Test     │  │
│  │    Input     │  │     List     │  │   Preview    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   API Routes Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   /analyze   │  │/generate-test│  │  /create-pr  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Mock Fallback System (Demo)                 │
│  • Pre-configured test scenarios                         │
│  • Realistic function detection simulation               │
│  • Comprehensive Jest test templates                     │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript 5.0
- Tailwind CSS
- React 19

**Backend**
- Next.js API Routes
- RESTful API design
- JSON response format

**Development**
- IBM Bob AI Assistant
- ESLint for code quality
- Git for version control

---

## 📡 API Routes

### POST `/api/analyze`

Analyzes a repository to detect functions and their test coverage status.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "repo": "https://github.com/username/repo",
  "totalFunctions": 3,
  "untestedFunctions": 2,
  "generatedTests": 0,
  "estimatedTimeSaved": "0 min",
  "functions": [
    {
      "name": "calculateFinalPrice",
      "file": "src/paymentService.ts",
      "tested": false,
      "severity": "High",
      "reason": "Payment calculation has no matching test coverage"
    }
  ]
}
```

### POST `/api/generate-test`

Generates a comprehensive Jest test suite for a specified function.

**Request Body:**
```json
{
  "functionName": "calculateFinalPrice"
}
```

**Response:**
```json
{
  "functionName": "calculateFinalPrice",
  "provider": "mock-fallback",
  "testCode": "import { calculateFinalPrice } from \"../src/paymentService\";\n\ndescribe(\"calculateFinalPrice\", () => {\n  // Test cases...\n});",
  "explanation": "Generated comprehensive Jest tests covering normal calculation, error handling..."
}
```

### POST `/api/create-pr`

Creates a real GitHub pull request for the configured demo repository, or returns a simulated preview for all other repositories.

**Request Body:**
```json
{
  "testCode": "import { calculateFinalPrice }...",
  "functionName": "calculateFinalPrice",
  "repoUrl": "https://github.com/username/repo"
}
```

**Response (Real PR - when configured):**
```json
{
  "success": true,
  "mode": "real-github-pr",
  "message": "Successfully created pull request #123 in owner/repo",
  "prUrl": "https://github.com/owner/repo/pull/123",
  "branchName": "testforge/add-tests-calculatefinalprice-1234567890",
  "filePath": "__tests__/calculatefinalprice.test.ts",
  "commitMessage": "test: add Jest tests for calculateFinalPrice",
  "prTitle": "Add tests for calculateFinalPrice",
  "note": "This is a real GitHub pull request created in the configured demo repository."
}
```

**Response (Simulated - default):**
```json
{
  "success": true,
  "mode": "simulated-pr-preview",
  "message": "No real PR was created. This preview shows what would be prepared for GitHub.",
  "repositoryUrl": "https://github.com/username/repo",
  "branchName": "testforge/add-tests-calculatefinalprice",
  "filePath": "__tests__/calculatefinalprice.test.ts",
  "commitMessage": "test: add Jest tests for calculateFinalPrice",
  "prTitle": "Add tests for calculateFinalPrice",
  "prBody": "This simulated pull request would add generated Jest tests...",
  "note": "Real PR creation is only available for the configured demo repository."
}
```

---

## 🔐 Environment Variables

### ⚠️ No Credentials Required for Current Version

**The application runs completely without any environment variables or credentials.** All features work out-of-the-box in demonstration mode.

### Optional Configuration File

If you want to prepare for future integrations, you can create a `.env.local` file, but **this is entirely optional** for the current MVP:

```bash
# ============================================
# GitHub API Configuration (Optional - Demo PR Creation)
# ============================================
# GITHUB_TOKEN=your_github_personal_access_token
# GITHUB_DEMO_OWNER=your-github-username
# GITHUB_DEMO_REPO=your-demo-repo-name

# ============================================
# IBM watsonx.ai Configuration (NOT USED - Future)
# ============================================
# WATSONX_API_KEY=
# WATSONX_PROJECT_ID=
# WATSONX_REGION=us-south
# WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- ✅ **No IBM Cloud account needed** - Application runs entirely locally
- ✅ **No watsonx.ai credentials needed** - All AI functionality is simulated
- ✅ **No GitHub token needed** - Repository analysis uses mock data
- ✅ **No external API calls** - Everything runs in demonstration mode
- ✅ **Works offline** - No internet connection required after installation

The environment variables shown above are **placeholders for future integration** and are not currently used by the application.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd testforge-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server** (no configuration needed)
```bash
npm run dev
```

4. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

**That's it!** No environment variables, credentials, or additional configuration required. The application works immediately in demonstration mode.

### Usage

1. Click **"Analyze Repository"** to simulate repository scanning
2. View the list of detected functions with coverage status
3. Click **"Generate Test"** on any untested function
4. Review the generated Jest test suite in the preview panel
5. Click **"Create Pull Request"** to simulate PR creation

---

## 🎭 Current Implementation: Demonstration Mode

### How the Application Works (MVP Version)

**⚠️ This version uses simulated responses and mock data exclusively.**

TestForge Pro currently operates in **demonstration mode only**, using a sophisticated mock system that simulates all AI and external API functionality. There is **no active connection** to IBM watsonx.ai, GitHub APIs, or any external services.

### What's Simulated (Not Real API Calls)

**All functionality uses pre-configured mock data:**

1. **Repository Analysis** (`/api/analyze`)
   - Simulates scanning a GitHub repository
   - Returns pre-defined list of 3 sample functions
   - No actual GitHub API calls or repository access

2. **Test Generation** (`/api/generate-test`)
   - Returns pre-written Jest test templates
   - No watsonx.ai API calls or AI model inference
   - Uses locally stored mock test code

3. **Pull Request Preview** (`/api/create-pr`)
   - Prepares realistic PR workflow preview with structured details
   - No actual GitHub commits or PR creation
   - Returns branch name, file path, commit message, and PR details
   - Clarifies that real PR creation requires GitHub authentication

### Why Demonstration Mode?

- ✅ **Zero Setup Required** - Works immediately without any credentials
- ✅ **No External Dependencies** - Runs completely offline after installation
- ✅ **Consistent Results** - Deterministic outputs for reliable presentations
- ✅ **No Rate Limits** - Unlimited demo runs without API quotas
- ✅ **Fast Response Times** - Instant feedback without network latency
- ✅ **No Costs** - No API usage fees or service charges

### Future Production Architecture

While the current version uses only simulated responses, the codebase is **architected for future integration**:

**Integration-Ready Design:**
- API routes structured to accept real watsonx.ai calls
- Environment variable checks prepared for production mode
- Clear separation between demo logic and integration points
- Documented transition path in `ARCHITECTURE.md`

**When watsonx.ai integration is implemented:**
- Replace mock responses with actual Granite model API calls
- Add authentication and credential management
- Implement real GitHub repository scanning
- Enable actual PR creation via GitHub API

**Current Status:** Fully functional demonstration showcasing the complete user experience without requiring any external services or credentials.

---

## 🗺️ Roadmap

### Phase 1: Real API Integration (Post-Hackathon)
- [ ] Integrate IBM watsonx.ai Granite model for test generation
- [ ] Implement GitHub API for actual repository scanning
- [ ] Add Babel/TypeScript parser for real code analysis
- [ ] Enable authentic GitHub PR creation via API
- [ ] Implement OAuth authentication for GitHub

### Phase 2: Enhanced Intelligence
- [ ] Multi-language support (Python, Java, Go, Ruby)
- [ ] Test quality scoring and recommendations
- [ ] Custom test template configuration
- [ ] Code coverage analysis integration
- [ ] Intelligent test prioritization

### Phase 3: Team Collaboration
- [ ] Team workspace management
- [ ] Test review and approval workflow
- [ ] Analytics dashboard with metrics
- [ ] CI/CD pipeline integration
- [ ] Slack/Teams notifications

### Phase 4: Enterprise Features
- [ ] Enterprise SSO (SAML, OAuth)
- [ ] Role-based access control
- [ ] Audit logging and compliance
- [ ] On-premise deployment option
- [ ] SLA monitoring and support

---

## 🏆 Hackathon Submission Notes

### For Judges

**What Makes This Project Special:**

1. **Complete Working Demo** - All features functional without setup
2. **IBM Bob Partnership** - Extensive documentation of AI-assisted development
3. **Production Path Defined** - Clear roadmap from prototype to production
4. **Professional Code Quality** - TypeScript, clean architecture, error handling
5. **Comprehensive Documentation** - Architecture, implementation, and deployment guides

**Evaluation Criteria Met:**

✅ **Innovation** - AI-powered test generation addresses real developer pain points
✅ **IBM Technology** - Built for watsonx.ai with Bob as development partner
✅ **Technical Excellence** - Modern stack, clean code, proper architecture
✅ **Completeness** - Full demo user flow from analysis to PR workflow simulation
✅ **Documentation** - Extensive guides and session logs
✅ **Demo Reliability** - Works flawlessly without external dependencies

**Time Investment:**
Development was completed during the hackathon window, with time focused on MVP scoping, API-backed demo implementation, documentation, and deployment preparation.

### Project Highlights

**Current Implementation (Demonstration Mode):**
- ✅ Next.js TypeScript dashboard with Tailwind CSS
- ✅ Three functional API routes with simulated responses
- ✅ Mock data system for complete demo experience
- ✅ Responsive design for mobile and desktop
- ✅ Real-time loading states and user feedback
- ✅ IBM Bob session documentation
- ✅ **Zero external dependencies** - No credentials required
- ✅ **Runs completely offline** after installation

**Future Integration (Not Currently Implemented):**
- 🔮 Live watsonx.ai API integration (architecture prepared, not connected)
- 🔮 Real GitHub repository scanning (API structure ready, uses mock data)
- 🔮 Actual PR creation via GitHub API (workflow designed, currently simulated)
- 🔮 AST/Babel parser for code analysis (roadmap defined, not implemented)
- 🔮 Production authentication system (security planned, not required for demo)

**Important Clarification:**
This MVP demonstrates the complete user experience and workflow using simulated responses. No external APIs are called, and no credentials are needed to run, test, or evaluate the application.

---

## 📚 Additional Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system design and technical decisions
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step build instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[AGENTS.md](./AGENTS.md)** - Agent configuration and guidelines
- **[bob_sessions/](./bob_sessions/)** - IBM Bob development session logs

---

## 🤝 Contributing

This is a hackathon submission project. For questions or feedback, please open an issue.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **IBM Bob** - AI development partner throughout the project
- **IBM watsonx.ai** - Target platform for production AI integration
- **Next.js Team** - Excellent framework and documentation
- **Vercel** - Hosting and deployment platform

---

## 📞 Contact

**Project Repository:** https://github.com/NboTop/testforge-pro
**Documentation:** See project files for comprehensive guides
**IBM Bob Sessions:** Available in `bob_sessions/` directory

---

<div align="center">

**Built with ❤️ using IBM Bob**

**Designed for IBM watsonx.ai Integration**

*IBM Bob Hackathon 2026*

</div>
