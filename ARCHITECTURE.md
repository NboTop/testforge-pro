# TestForge Pro — Architecture Overview

**IBM Bob Hackathon 2026**

---

## Current Implementation

TestForge Pro is a Next.js application that demonstrates an AI-assisted test generation workflow. The MVP features live public GitHub repository scanning, regex-based function detection, template-based Jest test generation, controlled real GitHub PR creation for one configured demo repository, and automatic simulated preview fallback for all other repositories.

### Purpose

This demonstration validates the complete developer workflow:
1. Analyze a repository (live scan for public repos or demo fallback)
2. Identify untested functions (regex-based detection)
3. Generate Jest tests (template-based generation)
4. Create pull requests (real PR for configured demo repo, simulated preview for others)

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS
- **UI Library:** React 19

### Backend
- **API Layer:** Next.js API Routes (serverless functions)
- **Runtime:** Node.js / Vercel-compatible

### Development Tools
- **AI Partner:** IBM Bob (development assistant, not runtime API)
- **Code Quality:** ESLint
- **Version Control:** Git

---

## Current API Routes

| Route | Method | Current Behavior |
|---|---:|---|
| `/api/analyze` | POST | **Optional live GitHub scan** for public repositories using unauthenticated API, with automatic fallback to demo data. Detects exported functions using regex patterns. |
| `/api/generate-test` | POST | Returns pre-written Jest test templates from local mock data |
| `/api/create-pr` | POST | **Dual-mode PR creation**: Real GitHub PR for configured demo repository, simulated preview for all other repositories |

**Note:** The `/api/analyze` route supports optional live scanning of public GitHub repositories without authentication. It falls back to demo data for private repos, rate limits, errors, or when no functions are detected. The `/api/create-pr` route creates real PRs only for the exact configured demo repository (requires `GITHUB_TOKEN`, `GITHUB_DEMO_OWNER`, `GITHUB_DEMO_REPO` environment variables), with automatic fallback to simulated preview for all other repositories.

---

## Current Data Flow

```
User enters repository URL
        ↓
POST /api/analyze
        ↓
    ┌─────────────────────────────────────┐
    │ Valid public GitHub URL?            │
    └─────────────────────────────────────┘
            ↓ Yes                ↓ No
    Live GitHub Scan      Demo Fallback
    (regex-based)         (mock data)
            ↓                    ↓
    ┌─────────────────────────────────────┐
    │ Functions detected?                 │
    └─────────────────────────────────────┘
            ↓ Yes                ↓ No
    Return live data      Return demo data
            ↓                    ↓
    ┌─────────────────────────────────────┐
    │ App displays detected functions     │
    └─────────────────────────────────────┘
        ↓
User selects a function
        ↓
POST /api/generate-test (returns pre-written test template)
        ↓
App displays Jest test code from mock data
        ↓
User clicks Create Pull Request
        ↓
POST /api/create-pr
        ↓
    ┌─────────────────────────────────────┐
    │ Repository matches configured demo? │
    │ AND GITHUB_TOKEN exists?            │
    └─────────────────────────────────────┘
            ↓ Yes                ↓ No
    Real GitHub PR        Simulated Preview
    (authenticated)       (no GitHub write)
            ↓                    ↓
    Create branch,        Generate preview
    commit file,          with branch name,
    open PR               file path, PR details
            ↓                    ↓
    Return PR URL         Return preview data
            ↓                    ↓
    ┌─────────────────────────────────────┐
    │ App displays result with badge      │
    │ (Live or Simulated)                 │
    └─────────────────────────────────────┘
```

---

## Current Implementation Status

### ✅ Currently Implemented Features

**Live Public GitHub Repository Scanning**
- Unauthenticated GitHub API access for public repositories
- Regex-based function detection in JavaScript/TypeScript files
- Source file prioritization (src/, lib/, app/ directories)
- Automatic fallback to demo mode when unavailable
- Severity assignment based on file paths

**Template-Based Jest Test Generation**
- Pre-written test templates for common patterns
- Route handler test templates for Next.js API routes
- React component test starters
- Regular function test templates with edge cases
- Copy-to-clipboard functionality

**Dual-Mode PR Creation**
- Real GitHub PR creation for one configured demo repository
- Server-side GitHub token handling (never exposed to frontend)
- Branch creation, file commit, and PR opening via GitHub API
- Requires exact repository URL match for security
- Automatic fallback to simulated preview for all other repositories

**IBM Bob-Assisted Development**
- Complete development partnership documented in `bob_sessions/`
- Architecture planning, implementation, and code review
- Session logs showing AI-assisted development process

**watsonx.ai-Ready Architecture**
- API routes structured for future Granite model integration
- Environment variable checks prepared for production mode
- Clear separation between demo and production logic paths

### ❌ Features Not Yet Implemented

The following features are **not currently implemented** and are planned for future production versions:

**Live watsonx.ai Integration**
- No connection to IBM watsonx.ai Granite models
- No real AI inference or model API calls
- Test generation uses pre-written templates only

**AST-Based Code Analysis**
- No Abstract Syntax Tree parsing
- No Babel or TypeScript compiler integration
- No real test coverage verification
- Function detection uses regex patterns only

**GitHub OAuth Authentication**
- No GitHub OAuth or token-based user authentication
- No private repository access
- Limited to public repos and one configured demo repo
- No multi-user support with individual permissions

**Unrestricted PR Creation**
- Real PRs only for configured demo repository
- Other repos use simulated preview mode
- OAuth would enable user-authorized PR creation to arbitrary repositories

**Enterprise Features**
- No user authentication system
- No persistent database or user accounts
- No API key management for individual users
- No team collaboration features

---

## Intended Future Production Architecture

### Phase 1: Enhanced Integrations (Post-Hackathon)

**IBM watsonx.ai Integration:**
- Connect to IBM Granite model (`ibm/granite-13b-instruct-v2`)
- Implement prompt engineering for test generation
- Add streaming responses for real-time feedback
- Handle API authentication and rate limiting

**Enhanced GitHub Integration:**
- Implement GitHub OAuth for authenticated access
- Add support for private repositories
- Enable actual PR creation with branch commits
- Implement real test coverage verification

**AST-Based Code Analysis:**
- Integrate Babel parser for JavaScript/TypeScript AST
- Replace regex-based detection with accurate parsing
- Implement real test file detection and coverage verification
- Add code complexity metrics and deeper analysis

### Phase 2: Enhanced Features

- Multi-language support (Python, Java, Go)
- Test quality scoring and recommendations
- Custom test template configuration
- Batch processing for multiple repositories
- CI/CD pipeline integration

### Phase 3: Enterprise Capabilities

- Team workspace management
- Analytics dashboard with usage metrics
- Enterprise SSO and RBAC
- Audit logging and compliance features
- On-premise deployment options

---

## IBM Bob Usage

IBM Bob served as the **development partner** throughout this project, assisting with:

- **Architecture Planning:** System design and technology decisions
- **Implementation:** API route development and UI integration
- **Code Review:** Quality improvements and best practices
- **Documentation:** Architecture docs, guides, and session logs

**Important Distinction:** IBM Bob was used as a development tool during the build process, not as a runtime API within the application itself.

### Session Documentation

All Bob collaboration is documented in `bob_sessions/`:
- `001-architecture-planning.md` - Initial system design
- `01-architecture-and-current-review.md` - Architecture refinement
- `02-api-routes-and-test-generation.md` - API implementation
- `03-final-review-and-polish.md` - Final polish and review

---

## Environment Configuration

### Current Demo Mode (No Configuration Required)

The application runs completely without environment variables. All features work out-of-the-box using mock data.

### Future Production Configuration

When integrations are implemented, the following environment variables will be required:

```bash
# GitHub API (for repository scanning and PR creation)
GITHUB_TOKEN=ghp_your_token_here

# IBM watsonx.ai (for AI-powered test generation)
WATSONX_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_REGION=us-south
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# Application Mode
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://your-production-url.com
```

---

## Deployment

### Current Demo Deployment

The demo version can be deployed to any Next.js-compatible platform:
- **Vercel** (recommended for demos)
- **Docker** containers
- **Cloud platforms** (AWS, Google Cloud, Azure)

No environment variables or external service credentials are required for demo deployment.

### Future Production Deployment

Production deployment will require:
- IBM Cloud account with watsonx.ai access
- GitHub OAuth application setup
- Environment variable configuration
- Security hardening and rate limiting
- Monitoring and error tracking setup

---

## Summary

**Current State:** Fully functional demonstration application using mock data exclusively

**Future Vision:** Production-ready platform with live IBM watsonx.ai and GitHub integrations

**Development Approach:** Demo-first to validate UX, with clear path to production implementation

**IBM Bob Role:** Development partner for architecture, coding, and documentation (not a runtime API)

---

**Built with IBM Bob for the IBM Bob Hackathon 2026**