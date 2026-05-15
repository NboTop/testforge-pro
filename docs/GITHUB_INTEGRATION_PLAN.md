# GitHub Integration Plan

**TestForge Pro — IBM Bob Hackathon 2026**

## Current State

The `/api/analyze` route returns a hardcoded list of demo functions.
The `/api/create-pr` route returns a simulated PR workflow response.

## Target Integration

**Library:** `@octokit/rest`  
**Auth:** Personal Access Token or GitHub OAuth App

## Repository Analysis Flow

1. Parse owner and repo from the input URL
2. Fetch repository file tree through the GitHub API
3. Filter JavaScript and TypeScript source files
4. Exclude `node_modules`, `dist`, `.test`, and `.spec` files
5. Fetch file contents in batches
6. Parse functions using Babel AST
7. Detect whether matching tests already exist
8. Return structured function list with severity scores

## PR Creation Flow

1. Create a new branch
2. Commit the generated test file
3. Open a pull request
4. Return the PR URL to the frontend

## Required Environment Variable

```env
GITHUB_TOKEN=your_github_token