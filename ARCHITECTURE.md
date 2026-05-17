# TestForge Pro — Architecture Overview

**IBM Bob Hackathon 2026**

---

## Current Implementation

TestForge Pro is a Next.js application featuring live Gemini AI test generation with template fallback. The production system includes live public GitHub repository scanning, regex-based function detection, server-side Gemini AI inference for test generation, controlled real GitHub PR creation for one configured demo repository, and automatic simulated preview fallback for all other repositories.

### Purpose

This production system delivers the complete developer workflow:
1. Analyze a repository (live scan for public repos or demo fallback)
2. Identify untested functions (regex-based detection)
3. Generate Jest tests (live Gemini AI with template fallback)
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
| `/api/health` | GET | Returns system health status including Gemini configuration, active model, and test generation mode |
| `/api/analyze` | POST | **Optional live GitHub scan** for public repositories using unauthenticated API, with automatic fallback to demo data. Detects exported functions using regex patterns. |
| `/api/generate-test` | POST | **Live Gemini AI inference** when `GEMINI_API_KEY` configured, with automatic template fallback when unavailable |
| `/api/create-pr` | POST | **Dual-mode PR creation**: Real GitHub PR for configured demo repository, simulated preview for all other repositories |

**Note:** The `/api/health` route reports Gemini configuration status and active model. The `/api/generate-test` route invokes Gemini API server-side when configured, falling back to templates when Gemini unavailable. The `/api/create-pr` route creates real PRs only for the exact configured demo repository (requires `GITHUB_TOKEN`, `GITHUB_DEMO_OWNER`, `GITHUB_DEMO_REPO` environment variables), with automatic fallback to simulated preview for all other repositories.

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
POST /api/generate-test
        ↓
    ┌─────────────────────────────────────┐
    │ GEMINI_API_KEY configured?          │
    └─────────────────────────────────────┘
            ↓ Yes                ↓ No
    Invoke Gemini API     Template Fallback
    (server-side)         (pre-written tests)
            ↓                    ↓
    ┌─────────────────────────────────────┐
    │ Gemini inference successful?        │
    └─────────────────────────────────────┘
            ↓ Yes                ↓ No
    Return AI tests       Template Fallback
    (Gemini Live badge)   (Template badge)
            ↓                    ↓
    ┌─────────────────────────────────────┐
    │ App displays Jest test code         │
    │ with provider badge                 │
    └─────────────────────────────────────┘
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

**Live Gemini AI Test Generation**
- Server-side Gemini API integration when `GEMINI_API_KEY` configured
- Real AI inference using configurable model (default: `gemini-3-flash-preview`)
- "Gemini Live" provider badge when AI successfully generates tests
- Automatic template fallback when Gemini unavailable or fails
- API keys handled exclusively server-side, never exposed to client

**Live Public GitHub Repository Scanning**
- Unauthenticated GitHub API access for public repositories
- Regex-based function detection in JavaScript/TypeScript files
- Source file prioritization (src/, lib/, app/ directories)
- Automatic fallback to demo mode when unavailable
- Severity assignment based on file paths

**Health Monitoring Endpoint**
- `/api/health` reports system configuration status
- Returns `geminiConfigured` boolean indicating Gemini API key presence
- Returns `geminiModel` string showing active AI model
- Returns `testGeneration` mode: "gemini-live-with-template-fallback" or "template-only"
- Enables verification of live AI integration status

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
- Provider interface supports multiple AI backends
- Environment variable structure prepared for watsonx.ai
- Clear separation between AI providers
- Easy provider switching via configuration

### ❌ Features Not Yet Implemented

The following features are **not currently implemented** and are planned for future production versions:

**Live watsonx.ai Integration**
- Architecture ready for Granite model integration
- Provider interface supports easy backend switching
- Requires IBM Cloud credentials and watsonx.ai setup

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

### Current Production Configuration

The application works without environment variables using fallback systems. Optional configuration enables live features:

```bash
# Gemini AI (for live test generation)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3-flash-preview

# GitHub API (for repository scanning and PR creation)
GITHUB_TOKEN=ghp_your_token_here
GITHUB_DEMO_OWNER=void-logic
GITHUB_DEMO_REPO=testforge-demo-target

# IBM watsonx.ai (future integration)
WATSONX_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_REGION=us-south
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# Application Configuration
NEXT_PUBLIC_APP_URL=https://testforge-void.vercel.app
```

**Configuration Notes:**
- Application remains functional without any environment variables
- `GEMINI_API_KEY` enables live AI inference (falls back to templates when absent)
- `GITHUB_TOKEN` enables real PR creation for demo repository only
- All API keys handled server-side, never exposed to client

---

## Deployment

### Current Production Deployment

The production version is deployed on Vercel with live Gemini AI integration:
- **Live URL**: https://testforge-void.vercel.app/
- **Health Endpoint**: https://testforge-void.vercel.app/api/health
- **Gemini AI**: Configured and operational
- **GitHub Integration**: Live scanning and controlled PR creation

Deployment platforms supported:
- **Vercel** (current production deployment)
- **Docker** containers
- **Cloud platforms** (AWS, Google Cloud, Azure)

Production deployment includes:
- Gemini API key configuration for live AI
- GitHub token for controlled PR creation
- Environment variable security
- Health monitoring endpoint
- Automatic fallback systems

### Future Enhanced Deployment

Enhanced production deployment will add:
- IBM Cloud account with watsonx.ai access
- GitHub OAuth application setup
- Multi-provider AI configuration
- Advanced rate limiting
- Enhanced monitoring and analytics

---

## Summary

**Current State:** Production application with live Gemini AI integration and template fallback

**Live Features:** Gemini AI test generation, GitHub repository scanning, controlled PR creation

**Future Vision:** Multi-provider AI platform with watsonx.ai integration and enhanced features

**Development Approach:** Production-first with reliability through fallback systems

**IBM Bob Role:** Development partner for architecture, coding, and documentation (not a runtime API)

---

**Built with IBM Bob for the IBM Bob Hackathon 2026**