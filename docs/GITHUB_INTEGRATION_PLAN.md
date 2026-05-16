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

### ✅ Partially Implemented: Controlled PR Creation

The `/api/create-pr` route now supports **real GitHub pull request creation** for one preconfigured demo repository:

**What's Implemented:**
- ✅ Real PR creation for exact configured repository match
- ✅ Server-side GitHub REST API integration
- ✅ Automatic branch creation with timestamp
- ✅ File commit to new branch
- ✅ Pull request creation with detailed description
- ✅ Automatic fallback to simulated preview for all other repositories
- ✅ Strict security controls (token never exposed to frontend)
- ✅ Error handling with graceful degradation

**Configuration Required:**
```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_DEMO_OWNER=your-github-username
GITHUB_DEMO_REPO=your-demo-repo-name
```

**Security Features:**
- Token handled exclusively server-side
- Never logged to console or files
- Never included in API responses
- Only works for exact configured repository URL

**Limitations:**
- ⚠️ **Single repository only**: Limited to one preconfigured demo repository
- ⚠️ **No OAuth**: Requires manual token configuration
- ⚠️ **No multi-user support**: Single token for all users

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

### Phase 3: OAuth-Based PR Creation (Next Priority)

**Objective:** Enable PR creation for arbitrary repositories via user authentication

**Current State:** ✅ Basic PR creation implemented for one preconfigured demo repository

**Next Steps:**
1. Implement GitHub OAuth flow for user authentication
2. Store user tokens securely (encrypted database or session storage)
3. Enable PR creation for any repository the user has access to
4. Support multiple users with their own tokens
5. Add repository selection UI
6. Implement token refresh and expiration handling

**Required Permissions:** `repo` scope for private repos, `public_repo` for public repos

**Benefits Over Current Implementation:**
- Users can create PRs in their own repositories
- No need to configure demo repository
- Multi-user support with individual permissions
- More secure (users control their own tokens)

## Environment Variables

### Current Implementation (Demo PR Creation)

```env
# Required for real PR creation in demo repository
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_DEMO_OWNER=your-github-username
GITHUB_DEMO_REPO=your-demo-repo-name
```

**Security Notes:**
- Token is handled exclusively server-side
- Never exposed to frontend or logged
- Only works for exact configured repository
- Automatic fallback to simulation if not configured

### Future Implementation (OAuth-Based)

```env
# For OAuth-based user authentication
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/callback