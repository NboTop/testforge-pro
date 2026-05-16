# GitHub Integration Plan

**TestForge Pro — IBM Bob Hackathon 2026**

## Current State

### ✅ IMPLEMENTED: Public Repository Scanning

The `/api/analyze` route supports **live scanning** of public GitHub repositories using the unauthenticated GitHub API:

**What's Implemented:**
- ✅ Parse GitHub repository URLs (format: `https://github.com/owner/repo`)
- ✅ Fetch repository metadata using unauthenticated GitHub API
- ✅ Retrieve repository file tree recursively
- ✅ Filter JavaScript/TypeScript source files (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ Prioritize source directories (src/, lib/, app/, components/, utils/)
- ✅ Exclude test files, build artifacts, and dependencies
- ✅ Fetch file contents from raw.githubusercontent.com
- ✅ Detect exported functions using regex patterns
- ✅ Assign severity based on file paths (payment/auth/security = High)
- ✅ Automatic fallback to demo data for errors, private repos, or rate limits
- ✅ Consistent API response with success, mode, message, and note fields

**Current Limitations (Planned for Future):**
- ⚠️ **Regex-based detection only**: No AST parsing (planned for Phase 1)
- ⚠️ **No coverage verification**: Does not check if tests actually exist (planned for Phase 1)
- ⚠️ **Public repositories only**: No authentication or private repo access (planned for Phase 2)
- ⚠️ **Rate limited**: Uses unauthenticated GitHub API (60 requests/hour per IP)
- ⚠️ **Limited scope**: First 8 files, up to 10 functions for performance

### ✅ IMPLEMENTED: Controlled PR Creation for Demo Repository

The `/api/create-pr` route supports **real GitHub pull request creation** for one preconfigured demo repository with automatic fallback:

**What's Implemented:**
- ✅ Real PR creation when repository URL exactly matches configured demo repo
- ✅ Server-side GitHub REST API integration (authenticated)
- ✅ Automatic branch creation with timestamp: `testforge/add-tests-[function]-[timestamp]`
- ✅ File commit to new branch in `__tests__/` directory
- ✅ Pull request creation with detailed description and metadata
- ✅ Automatic fallback to simulated preview for all other repositories
- ✅ Strict security controls (token never exposed to frontend)
- ✅ Error handling with graceful degradation to simulation
- ✅ Consistent API response with success, mode, message, and note fields

**Configuration Required (Optional):**
```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_DEMO_OWNER=your-github-username
GITHUB_DEMO_REPO=your-demo-repo-name
```

**Security Features:**
- ✅ Token handled exclusively server-side in API routes
- ✅ Never logged to console, files, or error messages
- ✅ Never included in API responses or exposed to frontend
- ✅ Only works for exact configured repository URL match
- ✅ Automatic fallback if environment variables missing
- ✅ No arbitrary repository writes possible

**Current Limitations (Planned for Future):**
- ⚠️ **Single repository only**: Limited to one preconfigured demo repository (OAuth planned for Phase 3)
- ⚠️ **No OAuth**: Requires manual token configuration (planned for Phase 3)
- ⚠️ **No multi-user support**: Single token for all users (planned for Phase 3)

### ❌ NOT IMPLEMENTED: OAuth-Based Authentication

**Status:** Planned for Phase 2 and Phase 3

**What's NOT Implemented:**
- ❌ GitHub OAuth flow for user authentication
- ❌ Private repository access
- ❌ User-specific token management
- ❌ Arbitrary repository PR creation (beyond configured demo repo)
- ❌ Multi-user support with individual permissions

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