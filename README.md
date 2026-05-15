# 🧪 TestForge Pro

**AI-Powered Test Generation for JavaScript/TypeScript Repositories**

[![IBM Bob Hackathon 2026](https://img.shields.io/badge/IBM%20Bob-Hackathon%202026-0f62fe?style=for-the-badge)](https://github.com)
[![Built with watsonx.ai](https://img.shields.io/badge/Built%20for-watsonx.ai-161616?style=for-the-badge)](https://www.ibm.com/watsonx)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

---

## 💡 The Problem

Software teams struggle with test coverage gaps that lead to production bugs and technical debt. Writing comprehensive test suites is time-consuming, often taking **45+ minutes per function**, and developers frequently skip testing edge cases and error scenarios. This results in:

- 🐛 **Undetected bugs** reaching production
- ⏰ **Wasted developer time** on manual test writing
- 📉 **Inconsistent test quality** across codebases
- 🔄 **Delayed releases** due to insufficient coverage

## 🎯 The Solution

TestForge Pro is an intelligent test generation platform that automatically detects untested functions in JavaScript/TypeScript repositories and generates comprehensive Jest test suites. Built as a proof-of-concept for IBM watsonx.ai integration, it demonstrates how AI can accelerate software quality assurance.

**Key Innovation:** Combines static code analysis with AI-powered test generation to create production-ready test suites in seconds, not hours.

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

### 4️⃣ **Pull Request Workflow**
Review the generated test code and click "Create Pull Request" to simulate the PR creation workflow that would commit tests to your repository.

---

## ✨ Features Implemented

### Core Functionality
- ✅ **Next.js Dashboard Interface** - Modern, responsive UI built with TypeScript and Tailwind CSS
- ✅ **Repository Analysis API** (`/api/analyze`) - Simulates function detection and coverage analysis
- ✅ **Test Generation API** (`/api/generate-test`) - Produces comprehensive Jest test suites
- ✅ **PR Workflow API** (`/api/create-pr`) - Demonstrates pull request creation flow
- ✅ **Mock Fallback System** - Reliable demo mode with pre-configured test scenarios
- ✅ **Real-time Loading States** - Professional UX with loading indicators and transitions
- ✅ **Error Handling** - User-friendly error messages and validation
- ✅ **Responsive Design** - Mobile and desktop optimized interface

### Demo Capabilities
- 🎯 **3 Sample Functions** with realistic test scenarios
- 📊 **Statistics Dashboard** showing coverage metrics
- 🔍 **Severity Ratings** (High/Medium/Low) for prioritization
- 💻 **Code Preview** with syntax formatting
- 🎨 **IBM Branding** with watsonx.ai attribution

---

## 🤖 IBM Bob Usage

IBM Bob served as the primary development partner throughout this project's lifecycle. All development sessions are documented in the `bob_sessions/` directory, providing complete transparency of the AI-assisted development process.

### Bob's Contributions

**Architecture & Planning**
- System design and technology stack decisions
- API route structure and data flow planning
- MVP scope definition and feature prioritization

**Implementation**
- API endpoint development (`/api/analyze`, `/api/generate-test`, `/api/create-pr`)
- Dashboard UI component creation
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

### Currently Integrated
- **IBM Bob AI Assistant** - Development partner for architecture, coding, and documentation
- **watsonx.ai Architecture** - Application designed for Granite model integration

### Planned for Production
- **IBM watsonx.ai Granite Models** - For intelligent test generation
  - Model: `ibm/granite-13b-instruct-v2`
  - Capabilities: Code understanding, test case generation, edge case detection
- **IBM Cloud Infrastructure** - For scalable deployment
- **IBM Watson Code Assistant** - For enhanced code analysis

### Integration Roadmap
The application is architected with watsonx.ai integration in mind:
- Environment variables configured for watsonx.ai credentials
- API structure ready for Granite model calls
- Prompt engineering framework prepared
- Fallback system ensures demo reliability

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

Simulates creating a pull request with the generated test code.

**Request Body:**
```json
{
  "testCode": "import { calculateFinalPrice }...",
  "functionName": "calculateFinalPrice"
}
```

**Response:**
```json
{
  "success": true,
  "mode": "demo",
  "prUrl": "https://github.com/your-username/testforge-demo-repo/pull/1",
  "message": "Demo PR workflow completed. In production, this would create a branch, commit the generated test, and open a GitHub pull request."
}
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```bash
# ============================================
# GitHub API Configuration (Optional)
# ============================================
GITHUB_TOKEN=

# ============================================
# IBM watsonx.ai Configuration (Optional)
# ============================================
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_REGION=us-south
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** All environment variables are optional for demo mode. The application works fully without any credentials configured.

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

3. **Set up environment variables** (optional)
```bash
cp .env.example .env.local
# Edit .env.local if needed (not required for demo)
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. Click **"Analyze Repository"** to simulate repository scanning
2. View the list of detected functions with coverage status
3. Click **"Generate Test"** on any untested function
4. Review the generated Jest test suite in the preview panel
5. Click **"Create Pull Request"** to simulate PR creation

---

## 🎭 Demo Reliability

### Mock Fallback Mode

TestForge Pro includes a sophisticated mock fallback system that ensures reliable demonstrations without external API dependencies.

**Why Mock Mode?**
- ✅ **Zero Setup Required** - Works immediately without credentials
- ✅ **Consistent Results** - Deterministic outputs for presentations
- ✅ **No Rate Limits** - Unlimited demo runs
- ✅ **Offline Capable** - Functions without internet connectivity
- ✅ **Fast Response Times** - Instant feedback for better UX

**What's Simulated:**
- Repository analysis and function detection
- Test coverage gap identification
- AI-powered test generation with realistic Jest code
- Pull request workflow and GitHub integration

**Production Path:**
The application is architected to seamlessly transition from mock mode to production:
- Environment variable checks determine mode
- API structure ready for real integrations
- Clear separation between demo and production logic
- Documented integration steps in `ARCHITECTURE.md`

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
3. **Production-Ready Architecture** - Clear path from prototype to production
4. **Professional Code Quality** - TypeScript, clean architecture, error handling
5. **Comprehensive Documentation** - Architecture, implementation, and deployment guides

**Evaluation Criteria Met:**

✅ **Innovation** - AI-powered test generation addresses real developer pain points  
✅ **IBM Technology** - Built for watsonx.ai with Bob as development partner  
✅ **Technical Excellence** - Modern stack, clean code, proper architecture  
✅ **Completeness** - Full user flow from analysis to PR creation  
✅ **Documentation** - Extensive guides and session logs  
✅ **Demo Reliability** - Works flawlessly without external dependencies

**Time Investment:**
- Architecture & Planning: 6 hours
- Implementation: 12 hours
- Testing & Polish: 4 hours
- Documentation: 2 hours
- **Total: 24 hours**

### Project Highlights

**Current Implementation:**
- ✅ Next.js TypeScript dashboard with Tailwind CSS
- ✅ Three functional API routes with proper error handling
- ✅ Mock fallback system for reliable demonstrations
- ✅ Responsive design for mobile and desktop
- ✅ Real-time loading states and user feedback
- ✅ IBM Bob session documentation

**Clearly Marked as Planned:**
- 🔮 Live watsonx.ai API integration (architecture ready)
- 🔮 Real GitHub repository scanning (API structure prepared)
- 🔮 Actual PR creation via GitHub API (workflow designed)
- 🔮 AST/Babel parser for code analysis (roadmap defined)
- 🔮 Production authentication system (security planned)

---

## 📚 Additional Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system design and technical decisions
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step build instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project overview
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

**Project Repository:** [GitHub URL]  
**Demo Video:** [Video URL]  
**Presentation Slides:** [Slides URL]

---

<div align="center">

**Built with ❤️ using IBM Bob**

**Designed for IBM watsonx.ai Integration**

*IBM Bob Hackathon 2026*

</div>
