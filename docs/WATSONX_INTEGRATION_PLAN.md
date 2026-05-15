# watsonx.ai Integration Plan

**TestForge Pro — IBM Bob Hackathon 2026**

## Current State

The `/api/generate-test` route uses pre-written Jest test templates as a mock fallback.
The architecture is structured so that replacing the mock with a live watsonx.ai call requires changes to a single function in this route.

## Target Integration

**Model:** `ibm/granite-13b-instruct-v2`  
**Service:** IBM watsonx.ai Text Generation API  
**Region:** `us-south`

## Required Environment Variables

```env
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_REGION=us-south
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2
```

## Prompt Template

```typescript
function buildTestPrompt(functionName: string, functionCode: string): string {
  return `You are an expert JavaScript/TypeScript test engineer using Jest.

Generate a comprehensive test suite for the following function.
Include: happy path, edge cases, error conditions.
Output ONLY valid Jest test code. No explanations.

Function to test:
\`\`\`typescript
${functionCode}
\`\`\`

Begin the test file now:`;
}
```

## Integration Steps

1. Install IBM watsonx.ai SDK:
```bash
npm install @ibm-cloud/watsonx-ai
```

2. Replace mock logic in `/api/generate-test/route.ts`:

```typescript
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

const watsonx = new WatsonXAI({
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
  region: process.env.WATSONX_REGION || 'us-south'
});

async function generateTestWithWatsonX(functionName: string, functionCode: string) {
  const prompt = buildTestPrompt(functionName, functionCode);
  
  const response = await watsonx.generateText({
    modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-instruct-v2',
    input: prompt,
    parameters: {
      max_new_tokens: 1500,
      temperature: 0.3,
      top_p: 0.9
    }
  });
  
  return response.results[0].generated_text;
}
```

3. Update route handler to call `generateTestWithWatsonX()` instead of returning mock templates.

## Testing Strategy

- Test with simple utility functions first
- Validate Jest syntax in generated output
- Adjust temperature/top_p for code quality
- Add retry logic for API failures
- Implement token usage tracking

## Fallback Behavior

If watsonx.ai is unavailable:
- Return mock templates with clear indication
- Log error for monitoring
- Allow user to retry

## Cost Estimation

- Model: granite-13b-instruct-v2
- Estimated tokens per request: ~2000 (input + output)
- Pricing: Refer to IBM Cloud watsonx.ai pricing page

## Security Considerations

- Store API keys in environment variables only
- Never commit credentials to repository
- Use IBM Cloud IAM for access control
- Rotate API keys regularly
- Implement rate limiting on API routes

## Performance Optimization

- Cache common test patterns
- Implement request queuing for high load
- Set appropriate timeout values (30s recommended)
- Monitor response times and adjust parameters

## Next Steps

1. Obtain IBM Cloud account and watsonx.ai access
2. Create project in watsonx.ai console
3. Generate API key with appropriate permissions
4. Add environment variables to deployment platform
5. Test integration in development environment
6. Deploy to production with monitoring enabled