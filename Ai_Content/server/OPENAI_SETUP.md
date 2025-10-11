# OpenAI API Integration Guide

## Overview
This AI Content Strategy Engine integrates with OpenAI's API to provide advanced content analysis, generation, and optimization features.

## Getting Your OpenAI API Key

### Step 1: Create an OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up for an account or log in if you already have one
3. Verify your email address

### Step 2: Set Up Billing
⚠️ **Important**: OpenAI API requires billing information even for free tier usage
1. Go to [Billing Settings](https://platform.openai.com/account/billing)
2. Add a payment method
3. Consider setting up usage limits to control costs

### Step 3: Generate API Key
1. Navigate to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a descriptive name (e.g., "AI Content Strategy Engine")
4. Copy the key immediately (you won't be able to see it again)

### Step 4: Configure Environment
1. Open the `.env` file in the server directory
2. Replace the empty `OPENAI_API_KEY=` with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
3. Save the file

## Features Enabled by OpenAI Integration

### Content Analysis
- **AI-Powered Recommendations**: Get specific, actionable suggestions for content improvement
- **Advanced Sentiment Analysis**: Beyond basic sentiment, understand emotional tone and context
- **Content Optimization**: AI-driven suggestions for better engagement and performance

### Content Generation
- **Platform-Specific Content**: Generate optimized content for different social media platforms
- **SEO-Optimized Writing**: Create content that performs well in search engines
- **Brand Voice Consistency**: Maintain consistent tone across all content

### Strategy Development
- **Competitive Analysis**: AI-powered insights into competitor content strategies
- **Trend Integration**: Combine trending topics with your brand message
- **Audience Targeting**: Generate content tailored to specific audience segments

## API Usage and Costs

### Pricing (as of 2024)
- **GPT-3.5-turbo**: $0.002 per 1K tokens (input), $0.002 per 1K tokens (output)
- **GPT-4**: $0.03 per 1K tokens (input), $0.06 per 1K tokens (output)

### Typical Usage
- Content Analysis: ~500-1000 tokens per analysis
- Content Generation: ~1000-2000 tokens per generation
- Strategy Recommendations: ~1500 tokens per strategy

### Cost Management
1. Set usage limits in OpenAI dashboard
2. Monitor usage in the [Usage Dashboard](https://platform.openai.com/usage)
3. The application includes built-in rate limiting

## Without OpenAI API Key

If you don't provide an OpenAI API key, the application will still work with:
- ✅ Basic content analysis (sentiment, readability, SEO scoring)
- ✅ Trend discovery from external sources
- ✅ Competitor tracking
- ✅ Basic keyword extraction
- ❌ AI-powered recommendations
- ❌ Advanced content generation
- ❌ AI strategy insights

## Testing the Integration

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Check the console for OpenAI initialization:
   ```
   ✅ OpenAI API initialized successfully
   ```

3. Test content analysis through the frontend or API directly

## Troubleshooting

### Common Issues

**"OpenAI API key not provided"**
- Check that your API key is correctly set in the `.env` file
- Ensure there are no extra spaces or quotes around the key

**"Insufficient quota" or "Rate limit exceeded"**
- Check your OpenAI billing dashboard
- Verify you have available credits
- The application includes rate limiting, but OpenAI has its own limits

**"Model not found" errors**
- Ensure your OpenAI account has access to GPT-3.5-turbo
- Some models require additional access approval

### Getting Help
- OpenAI Documentation: https://platform.openai.com/docs
- OpenAI Community: https://community.openai.com/
- Check the server logs for detailed error messages

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** (as implemented)
3. **Set usage limits** in OpenAI dashboard
4. **Monitor usage regularly**
5. **Rotate keys periodically** for enhanced security

## Alternative AI Providers

If you prefer not to use OpenAI, the codebase can be modified to work with:
- Anthropic Claude
- Google Gemini
- Azure OpenAI Service
- Local models via Ollama

Contact the development team for assistance with alternative providers.