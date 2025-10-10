# AI Content Analyzer Backend

A powerful backend service for AI-powered content analysis and generation using OpenAI's GPT models.

## Features

- **Content Analysis**: Comprehensive analysis of text content including:
  - Overall quality score (1-100)
  - Readability assessment
  - Engagement potential
  - SEO optimization score
  - Sentiment analysis
  - Key themes extraction
  - Strengths and improvement suggestions

- **Content Generation**: AI-powered content creation based on prompts
- **Multiple Analysis Types**: Comprehensive, SEO-focused, and engagement-focused analysis
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Robust error handling and user-friendly error messages

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp env.example .env
```

Edit the `.env` file and add your OpenAI API key:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the API

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### POST `/api/analyze`
Analyze content for quality, readability, engagement, and SEO.

**Request Body:**
```json
{
  "content": "Your content to analyze...",
  "analysisType": "comprehensive" // optional: "comprehensive", "seo", "engagement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_score": 85,
    "readability_score": 78,
    "engagement_score": 92,
    "seo_score": 73,
    "sentiment": "positive",
    "key_themes": ["AI", "technology", "innovation"],
    "strengths": ["Clear structure", "Engaging tone"],
    "improvements": ["Add more examples", "Improve SEO"],
    "target_audience": "Tech professionals",
    "content_type": "blog",
    "word_count": 450,
    "reading_time": 2,
    "summary": "Well-written article about AI technology..."
  }
}
```

### POST `/api/analyze/generate`
Generate new content based on a prompt.

**Request Body:**
```json
{
  "prompt": "Write about artificial intelligence trends",
  "contentType": "blog", // optional: "blog", "social", "article", "email", "ad"
  "length": "medium" // optional: "short", "medium", "long"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Generated content here...",
    "metadata": {
      "content_type": "blog",
      "length": "medium",
      "word_count": 650,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Frontend Integration

The frontend (`content_analyser.jsx`) is already configured to work with this backend. Make sure:

1. The backend server is running on port 5000
2. Your OpenAI API key is properly configured
3. CORS is enabled for your frontend URL

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid content
- OpenAI API errors (quota exceeded, invalid key, etc.)
- Network timeouts
- Malformed requests

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable in the server configuration

## Security Features

- Helmet.js for security headers
- CORS protection
- Input validation
- Rate limiting
- Environment variable protection

## Development

### Project Structure
```
server/
├── server.js          # Main server file
├── routes/
│   └── analyze.js     # Analysis and generation routes
├── package.json       # Dependencies
└── env.example       # Environment variables template
```

### Adding New Features

1. Create new routes in `routes/analyze.js`
2. Add corresponding frontend integration
3. Update error handling as needed
4. Test thoroughly with different content types

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your OpenAI API key in `.env`
   - Ensure the key is active and has credits

2. **"Quota exceeded" error**
   - Check your OpenAI account billing
   - Upgrade your OpenAI plan if needed

3. **CORS errors**
   - Verify `FRONTEND_URL` in `.env` matches your frontend URL
   - Check that the frontend is making requests to the correct backend URL

4. **Connection refused**
   - Ensure the server is running on port 5000
   - Check for port conflicts

### Debug Mode

Set `NODE_ENV=development` in your `.env` file to get detailed error messages.

## License

MIT License - feel free to use and modify as needed.
