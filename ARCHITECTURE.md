# TestForge Pro — Architecture Overview

**IBM Bob Hackathon 2026**

---

## Current Implementation: Demo Mode

TestForge Pro is a Next.js application demonstrating an AI-assisted test generation workflow. The current MVP operates entirely in **demo mode** using mock data and simulated responses to showcase the intended user experience without requiring external API credentials.

### Purpose

This demonstration validates the complete developer workflow:
1. Analyze a repository
2. Identify untested functions
3. Generate Jest tests
4. Simulate a pull request workflow

**Important:** No live integrations are currently implemented. All functionality uses pre-configured mock data to ensure reliable demonstrations without external dependencies.

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

All routes return simulated responses using mock data:

| Route | Method | Current Behavior |
|---|---:|---|
| `/api/analyze` | POST | Returns pre-configured list of 3 sample functions with mock coverage data |
| `/api/generate-test` | POST | Returns pre-written Jest test templates from local mock data |
| `/api/create-pr` | POST | Returns simulated PR workflow response with mock URL |

**Note:** No external API calls are made. All responses are generated locally using hardcoded mock data.

---

## Current Data Flow

```
User enters repository URL
        ↓
POST /api/analyze (returns mock data)
        ↓
App displays 3 pre-configured sample functions
        ↓
User selects a function
        ↓
POST /api/generate-test (returns pre-written test template)
        ↓
App displays Jest test code from mock data
        ↓
User clicks Create Pull Request
        ↓
POST /api/create-pr (returns simulated success message)
        ↓
App displays mock PR URL (no actual PR created)
```

---

## What's NOT Implemented

The following features are **not currently implemented** and are planned for future production versions:

### ❌ Live watsonx.ai Integration
- No connection to IBM watsonx.ai Granite models
- No real AI inference or model API calls
- Test generation uses pre-written templates only

### ❌ Real GitHub API Integration
- No GitHub repository scanning or file access
- No actual pull request creation
- No GitHub OAuth or authentication
- Repository analysis returns hardcoded sample data

### ❌ Code Parsing & Analysis
- No AST (Abstract Syntax Tree) parsing
- No Babel or TypeScript compiler integration
- No actual code analysis of real repositories
- Function detection is simulated with mock data

### ❌ Authentication & Security
- No user authentication system
- No API key management
- No OAuth flows
- No credential storage

---

## Intended Future Production Architecture

### Phase 1: Core Integrations (Post-Hackathon)

**IBM watsonx.ai Integration:**
- Connect to IBM Granite model (`ibm/granite-13b-instruct-v2`)
- Implement prompt engineering for test generation
- Add streaming responses for real-time feedback
- Handle API authentication and rate limiting

**GitHub API Integration:**
- Implement GitHub OAuth for user authentication
- Add repository scanning via GitHub REST API
- Enable file content retrieval and parsing
- Implement actual PR creation with commits

**Code Analysis:**
- Integrate Babel parser for JavaScript/TypeScript AST
- Implement function detection and signature extraction
- Add test coverage analysis
- Build code complexity metrics

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