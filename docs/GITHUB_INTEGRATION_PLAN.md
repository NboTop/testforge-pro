# GitHub Integration Plan

**TestForge Pro — IBM Bob Hackathon 2026**

## Current State

### ✅ Partially Implemented: Public Repository Scanning

The `/api/analyze` route now supports **optional live scanning** of public GitHub repositories:

**What's Implemented:**
- ✅ Parse GitHub repository URLs (format: `https://github.com/owner/repo`)
- ✅ Fetch repository metadata using unauthenticated GitHub API
- ✅ Retrieve repository file tree recursively
- ✅ Filter JavaScript/TypeScript source files (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ Exclude test files, build artifacts, and dependencies
- ✅ Fetch file contents from raw.githubusercontent.com
- ✅ Detect exported functions using regex patterns
- ✅ Assign severity based on file paths
- ✅ Automatic fallback to demo data for errors or private repos

**Limitations:**
- ⚠️ **Regex-based detection only**: No AST parsing yet
- ⚠️ **No coverage verification**: Does not check if tests actually exist
- ⚠️ **Public repositories only**: No authentication or private repo access
- ⚠️ **Rate limited**: Uses unauthenticated GitHub API (60 requests/hour per IP)
- ⚠️ **Limited scope**: First 8 files, up to 10 functions

### ❌ Not Yet Implemented: PR Creation

The `/api/create-pr` route still returns a simulated PR workflow response.

## Future Enhancement Plan

### Phase 1: AST-Based Analysis (Priority)

**Objective:** Replace regex-based detection with accurate code parsing

1. Integrate Babel parser for JavaScript/TypeScript
2. Build AST traversal for function detection
3. Extract function signatures and metadata
4. Detect matching test files
5. Verify actual test coverage

**Library:** `@babel/parser`, `@babel/traverse`

### Phase 2: Authenticated GitHub Access

**Objective:** Support private repositories and higher rate limits

1. Implement GitHub OAuth flow
2. Store and manage access tokens securely
3. Enable private repository scanning
4. Increase API rate limits with authentication

**Library:** `@octokit/rest`
**Auth:** GitHub OAuth App or Personal Access Token

### Phase 3: Pull Request Creation

**Objective:** Enable actual PR creation with generated tests

1. Create a new branch in the repository
2. Commit the generated test file
3. Open a pull request with description
4. Return the actual PR URL to the frontend

**Required Permissions:** `repo` scope for private repos, `public_repo` for public repos

## Required Environment Variables (Future)

```env
# For authenticated access and PR creation
GITHUB_TOKEN=your_github_token
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret