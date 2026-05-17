# 🧪 TestForge Pro

**Turn idea into impact faster**

[![IBM Bob Hackathon 2026](https://img.shields.io/badge/IBM%20Bob-Hackathon%202026-0f62fe?style=for-the-badge)](https://github.com)
[![Designed for watsonx.ai](https://img.shields.io/badge/Designed%20for-watsonx.ai-161616?style=for-the-badge)](https://www.ibm.com/watsonx)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

---

## 🌐 Live Demo

**🚀 Try TestForge Pro Now:** [https://testforge-void.vercel.app/](https://testforge-void.vercel.app/)

**🔍 Health Check Endpoint:** [https://testforge-void.vercel.app/api/health](https://testforge-void.vercel.app/api/health)

The application is deployed on Vercel and fully functional. You can:
- Analyze public GitHub repositories
- Generate Jest test templates
- View the complete workflow demonstration
- Check system health and configuration status

**Note:** The health endpoint shows `watsonxConfigured: false` as the watsonx.ai API key is not configured in production. The application uses template-based test generation and is architecturally watsonx.ai-ready.

---

## 🎯 Current Status: Live AI Test Generation

> **✅ PRODUCTION: TestForge Pro features live Gemini AI test generation with template fallback.**

**Live AI Test Generation:**
- ✅ **Gemini AI Integration**: Server-side Gemini API invocation when `GEMINI_API_KEY` is configured
- ✅ **Configurable Model**: Uses `gemini-3-flash-preview` by default (configurable via `GEMINI_MODEL`)
- ✅ **Live Inference**: Real AI-powered test generation with "Gemini Live" provider badge
- ✅ **Template Fallback**: Automatic fallback to template-based generation when Gemini unavailable
- ✅ **No Client Exposure**: API keys handled exclusively server-side, never exposed to frontend

**GitHub Integration:**
- ✅ **Public Repository Scanning**: Live GitHub API access for public repositories
- ✅ **Real PR Creation**: Genuine pull requests for configured demo repository (https://github.com/void-logic/testforge-demo-target)
- ✅ **Simulated Preview**: Automatic fallback for all other repositories
- ✅ **Server-Side Security**: GitHub token never exposed to client

**Optional Configuration:**
- Application works without `GEMINI_API_KEY` using template fallback
- Application works without `GITHUB_TOKEN` using simulated PR preview
- Live features activate automatically when environment variables are configured

**watsonx.ai Status:**
- Architecture is watsonx.ai-ready for future integration
- Live watsonx.ai inference is not currently configured
- System designed for easy provider switching

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

## 📋 Current Implementation Status

### ✅ Currently Implemented Features

**Live Gemini AI Test Generation**
- Server-side Gemini API integration when `GEMINI_API_KEY` is configured
- Real AI inference using `gemini-3-flash-preview` model (configurable via `GEMINI_MODEL`)
- "Gemini Live" provider badge displays when live inference succeeds
- Automatic template fallback when Gemini unavailable or fails
- API keys handled exclusively server-side, never exposed to client

**Live Public GitHub Scanning**
- Unauthenticated GitHub API access for public repositories
- Regex-based function detection in JavaScript/TypeScript files
- Source file prioritization (src/, lib/, app/ directories)
- Automatic fallback to demo mode when unavailable

**Controlled Real PR Creation**
- Real GitHub PR creation for configured demo repository: https://github.com/void-logic/testforge-demo-target
- Server-side GitHub token handling (never exposed to frontend)
- Branch creation, file commit, and PR opening via GitHub API
- Requires exact repository URL match for security

**Simulated PR Preview for All Other Repos**
- Automatic fallback when repository doesn't match demo config
- Shows branch name, file path, commit message, and PR title
- No actual GitHub writes for non-configured repositories
- Safe demonstration of PR workflow

**IBM Bob-Assisted Development**
- Complete development partnership documented in `bob_sessions/`
- Architecture planning, implementation, and code review
- Session logs showing AI-assisted development process

**watsonx.ai-Ready Architecture**
- API routes structured for future Granite model integration
- Environment variable checks prepared for production mode
- Clear separation between demo and production logic paths

### ❌ Not Yet Implemented

**Live watsonx.ai Inference**
- Architecture ready for Granite model integration
- Requires IBM Cloud credentials and watsonx.ai setup
- System designed for easy provider switching

**AST-Based Coverage Verification**
- Current implementation uses regex pattern matching
- Real test file detection not implemented
- Coverage percentage calculation planned for future

**GitHub OAuth Authentication**
- No user-based GitHub authentication
- Cannot access private repositories
- Limited to public repos and one configured demo repo

**Private Repository Scanning**
- Only public repositories can be scanned
- OAuth integration required for private repo access

**Arbitrary Repository PR Creation**
- Real PRs only for configured demo repository
- Other repos use simulated preview mode
- OAuth would enable user-authorized PR creation

**Enterprise Team Features**
- No multi-user workspaces
- No team collaboration features
- No analytics or reporting dashboards

---

## 🔒 Security Model

### Server-Side Token Protection

**GitHub Token Security**
- Token stored in `.env.local` (never committed to git)
- Handled exclusively on the server side in API routes
- Never exposed to frontend JavaScript or API responses
- Never logged to console, files, or error messages
- Only used for the exact configured demo repository

**Controlled PR Creation**
- Real PR creation restricted to `GITHUB_DEMO_OWNER/GITHUB_DEMO_REPO`
- Exact URL match required: `https://github.com/${OWNER}/${REPO}`
- All other repositories automatically use simulated preview
- No arbitrary repository writes possible

**Fallback Safety**
- Missing environment variables trigger simulation mode
- GitHub API failures fall back to simulated preview
- Network errors handled gracefully with fallback
- No user data or tokens ever exposed in error messages

**Frontend Isolation**
- Frontend never receives GitHub tokens
- API responses exclude sensitive credentials
- Client-side code cannot trigger arbitrary PR creation
- All GitHub operations server-side only

### Demo Repository Configuration

To enable real PR creation for your demo repository:

1. Create a GitHub Personal Access Token with `repo` scope
2. Add to `.env.local` (never commit this file):
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_DEMO_OWNER=void-logic
   GITHUB_DEMO_REPO=testforge-demo-target
   ```
3. Real PRs will only be created when repository URL exactly matches
4. All other repositories automatically use simulated preview

**Important:** The demo repository should be a test repository you control, not a production codebase.

---

## 🎬 Demo Flow

Follow this workflow to experience all features:

### Step 1: Analyze Configured Demo Repository

1. Enter your configured demo repository URL (if you set up environment variables):
   ```
   https://github.com/void-logic/testforge-demo-target
   ```
   Or click the **"Use demo repo"** button to automatically populate the field.
2. Click **"Analyze Repository"**
3. Observe live GitHub scan fetching real source files
4. See functions detected with regex-based analysis
5. Note the **"🟢 Live GitHub Scan"** badge in the header

### Step 2: Generate Test for calculateFinalPrice

1. Find `calculateFinalPrice` in the detected functions list
2. Click **"Generate Test"** button
3. Review the comprehensive Jest test suite in the preview
4. Note the provider badge:
   - **"🤖 Gemini Live"** when Gemini API successfully generates tests
   - **"📋 Template Fallback"** when using template-based generation
5. See the sanitized filename: `calculateFinalPrice.test.ts`
6. Read the explanation of what was generated
7. Click **"📋 Copy test to clipboard"** to copy the code

### Step 3: Create Real GitHub PR

1. Click **"Create or Preview PR"** button
2. If repository matches your configured demo repo:
   - See **"✅ Real GitHub PR Created"** with **"🟢 Live"** badge
   - View branch name, file path, commit message, and PR title
   - Click **"🔗 View pull request →"** to see the actual PR on GitHub
   - Note: "Created only for the configured demo repository using server-side GitHub credentials."
3. Verify the PR was created in your GitHub repository

### Step 4: Analyze Another Repository

1. Enter a different public repository URL:
   ```
   https://github.com/vercel/next.js
   ```
2. Click **"Analyze Repository"**
3. Observe live scan or demo fallback depending on availability
4. Generate a test for any detected function

### Step 5: Show Simulated PR Preview Fallback

1. Click **"Create or Preview PR"** button
2. Since repository doesn't match configured demo repo:
   - See **"📋 PR Preview Generated"** with **"🔵 Simulated"** badge
   - View what would be prepared for GitHub
   - Note: "No real pull request was created. Real PR creation is restricted to the configured demo repository."
3. Click **"🔗 View repository →"** to see the target repository

### Key Observations

- **Live Scanning**: Works for any public GitHub repository
- **Real PR Creation**: Only for your configured demo repository
- **Simulated Preview**: Automatic fallback for all other repositories
- **Security**: Token never exposed, no arbitrary writes possible
- **Honest Messaging**: Clear badges and notes explain what's real vs simulated

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

### Current Application Status: Live AI with Optional Configuration

**✅ Live Gemini AI Integration**

This production version features **live Gemini AI test generation** with automatic fallback:
- **Live AI inference** when `GEMINI_API_KEY` environment variable is configured
- **Server-side API calls** to Gemini using configured model (default: `gemini-3-flash-preview`)
- **Template fallback** when Gemini unavailable, ensuring application remains functional
- **No client exposure** of API keys or credentials

**Optional credentials for enhanced features:**
- `GEMINI_API_KEY`: Enables live AI test generation (optional, falls back to templates)
- `GITHUB_TOKEN`: Enables real PR creation for demo repository (optional, falls back to simulated preview)
- Application remains fully functional without any credentials using fallback systems

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

### 🔐 Environment Variables

**Optional Configuration for Enhanced Features:**

Create a `.env.local` file to enable live AI generation and real PR creation:

```bash
# ============================================
# Gemini AI Configuration (Optional - Live Test Generation)
# ============================================
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3-flash-preview

# ============================================
# GitHub API Configuration (Optional - Real PR Creation)
# ============================================
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_DEMO_OWNER=void-logic
GITHUB_DEMO_REPO=testforge-demo-target

# ============================================
# IBM watsonx.ai Configuration (Future Integration)
# ============================================
# WATSONX_API_KEY=
# WATSONX_PROJECT_ID=
# WATSONX_REGION=us-south
# WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Configuration Notes:**
- ✅ **Application works without any environment variables** - Uses template fallback and simulated PR preview
- ✅ **GEMINI_API_KEY enables live AI** - Real Gemini inference for test generation
- ✅ **GITHUB_TOKEN enables real PRs** - Only for configured demo repository
- ✅ **Server-side only** - API keys never exposed to client
- ✅ **Automatic fallback** - Template generation when Gemini unavailable

**Security:**
- All API keys handled exclusively server-side
- Never logged or exposed in responses
- GitHub token only works for exact configured repository

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

## 🎭 Current Implementation: Live AI with Template Fallback

### How the Application Works (Production Version)

**✅ This version features live Gemini AI integration with automatic template fallback.**

TestForge Pro operates with **live AI test generation** when configured, using Google's Gemini API for intelligent test creation. The system automatically falls back to template-based generation when Gemini is unavailable, ensuring reliability.

### Live Features (Real API Calls)

**Production functionality with real integrations:**

1. **Repository Analysis** (`/api/analyze`)
   - Live GitHub API calls for public repositories
   - Regex-based function detection in source files
   - Automatic fallback to demo data when unavailable

2. **Test Generation** (`/api/generate-test`)
   - **Live Gemini AI inference** when `GEMINI_API_KEY` is configured
   - Server-side API calls to Gemini using configured model
   - Automatic template fallback when Gemini unavailable or fails
   - Provider badge indicates "Gemini Live" or "Template Fallback"

3. **Pull Request Creation** (`/api/create-pr`)
   - Real GitHub PR creation for configured demo repository
   - Automatic simulated preview for all other repositories
   - Server-side GitHub token handling with strict security

### Why This Architecture?

- ✅ **Live AI When Available** - Real Gemini inference for intelligent test generation
- ✅ **Reliable Fallback** - Template system ensures application always works
- ✅ **Optional Configuration** - Works without credentials using fallback systems
- ✅ **Server-Side Security** - API keys never exposed to client
- ✅ **Production Ready** - Real integrations with proper error handling
- ✅ **Transparent Operation** - Clear badges indicate live vs fallback mode

### watsonx.ai Integration Path

The codebase is **architected for watsonx.ai integration**:

**Integration-Ready Design:**
- Provider interface supports multiple AI backends
- Environment variable structure prepared for watsonx.ai
- Clear separation between AI providers
- Documented transition path in `ARCHITECTURE.md`

**When watsonx.ai integration is implemented:**
- Add watsonx.ai as additional provider option
- Implement Granite model API calls
- Support provider switching via configuration
- Maintain fallback system for reliability

**Current Status:** Production deployment with live Gemini AI, template fallback, and architecture ready for watsonx.ai integration.

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

**Current Implementation:**
- ✅ Next.js TypeScript dashboard with Tailwind CSS
- ✅ Three functional API routes with live integrations
- ✅ **Live Gemini AI test generation** when `GEMINI_API_KEY` configured
- ✅ **Template fallback system** when Gemini unavailable
- ✅ Live public GitHub repository scanning via unauthenticated API
- ✅ **Real GitHub PR creation** for configured demo repository
- ✅ Automatic simulated fallback for all other repositories
- ✅ Responsive design for mobile and desktop
- ✅ Real-time loading states and user feedback
- ✅ IBM Bob session documentation
- ✅ **Server-side API key handling** with strict security
- ✅ **Production deployment** at https://testforge-void.vercel.app/

**Future Integration (Planned):**
- 🔮 Live watsonx.ai API integration (architecture prepared, provider interface ready)
- 🔮 AST/Babel parser for code analysis (roadmap defined, not implemented)
- 🔮 GitHub OAuth for arbitrary repository PR creation (security planned)
- 🔮 Private repository scanning support (OAuth required)

**Important Clarification:**
This production version features live Gemini AI integration with automatic template fallback. The application works without credentials using fallback systems, and activates live features when environment variables are configured.

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
