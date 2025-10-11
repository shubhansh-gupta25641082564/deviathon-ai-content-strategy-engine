# AI Content Strategy Engine - Backend

This is the backend server for the AI Content Strategy Engine, providing comprehensive content analysis, trend discovery, competitor tracking, and strategy generation capabilities with AI-powered insights.

## 🚀 Features

### Core Functionality
- **AI Content Analysis**: Advanced content scoring with sentiment analysis, readability metrics, SEO recommendations, and engagement predictions
- **Real-time Trend Discovery**: Multi-platform trend data from YouTube, Reddit, Hacker News, and Google Trends with AI-powered insights
- **Competitor Intelligence**: Comprehensive competitor tracking, performance analysis, and strategic insights
- **Strategy Generation**: AI-powered content strategy recommendations with personalized calendars and performance tracking
- **Advanced Analytics**: Detailed performance metrics, user insights, and predictive analytics

### Technical Capabilities
- **Secure Authentication**: JWT-based auth with role-based access control and subscription management
- **Intelligent Caching**: Redis-powered caching with smart invalidation strategies
- **Rate Limiting**: Sophisticated rate limiting with tier-based quotas
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling with detailed logging
- **API Documentation**: RESTful API design with comprehensive endpoint documentation

## 🛠 Tech Stack

- **Backend**: Node.js v16+, Express.js v4.18+
- **Database**: MongoDB v4.4+ with Mongoose ODM v8.0+
- **Caching**: Redis v6+ for session management and data caching
- **AI Integration**: OpenAI API v4.20+ for content analysis and recommendations
- **Authentication**: JWT with bcryptjs for secure password hashing
- **External APIs**: YouTube Data API, Reddit API, Hacker News API integration
- **Middleware**: Helmet for security, CORS, compression, express-validator
- **Monitoring**: Built-in health checks and performance monitoring

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher
- **MongoDB**: v4.4 or higher (local or MongoDB Atlas)
- **Redis**: v6.0 or higher (optional but recommended for production)
- **API Keys**: OpenAI API key (required for AI features)

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone [repository-url]
cd ai-content-strategy-engine/Ai_Content/server

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
# At minimum, set:
# - MONGODB_URI
# - JWT_SECRET (minimum 32 characters)
# - OPENAI_API_KEY (for AI features)
```

### 3. Database Setup

```bash
# Make sure MongoDB is running locally, or use MongoDB Atlas
# The application will create necessary collections automatically

# Optional: Run seed script for demo data
npm run seed
```

### 4. Start Development Server

```bash
# Start with auto-reload
npm run dev

# Or start production mode
npm start
```

### 5. Verify Installation

```bash
# Check health endpoint
curl http://localhost:5002/api/health

# Should return:
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "database": "connected",
  "environment": "development"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:5002/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update profile | Yes |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |

### Content Analysis Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/analyze` | Analyze content with AI | Yes |
| GET | `/analyze/history` | Get analysis history | Yes |
| GET | `/analyze/stats` | Get user analytics | Yes |

### Trend Discovery Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trends` | Get trending topics | No |
| GET | `/trends/discover` | Personalized trends | Yes |
| GET | `/trends/analyze/:keyword` | Analyze keyword trend | Yes |
| POST | `/trends/save` | Save trend | Yes |
| GET | `/trends/saved` | Get saved trends | Yes |
| GET | `/trends/stats` | Trending statistics | No |

### Competitor Tracking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/competitors` | Get tracked competitors | Yes |
| POST | `/competitors` | Add new competitor | Yes |
| GET | `/competitors/:id` | Get competitor details | Yes |
| PUT | `/competitors/:id` | Update competitor | Yes |
| DELETE | `/competitors/:id` | Remove competitor | Yes |
| GET | `/competitors/analytics` | Get analytics overview | Yes |
| GET | `/competitors/trending` | Get trending competitors | No |

### Strategy Generation Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/strategies` | Get user strategies | Yes |
| POST | `/strategies` | Create new strategy | Yes |
| GET | `/strategies/:id` | Get strategy details | Yes |
| PUT | `/strategies/:id` | Update strategy | Yes |
| DELETE | `/strategies/:id` | Delete strategy | Yes |
| POST | `/strategies/:id/recommendations` | Add recommendation | Yes |
| PUT | `/strategies/:id/recommendations/:recId` | Update recommendation | Yes |
| POST | `/strategies/generate/recommendations` | Generate AI recommendations | Yes |
| GET | `/strategies/analytics/overview` | Get analytics overview | Yes |

## 🔧 Configuration

### Environment Variables

**Required:**
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/ai-content-strategy-engine
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
OPENAI_API_KEY=your_openai_api_key_here
```

**Optional but Recommended:**
```env
REDIS_URL=redis://localhost:6379
YOUTUBE_API_KEY=your_youtube_api_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### Database Models

- **User**: Authentication, subscription management, usage tracking
- **ContentAnalysis**: Content analysis results and recommendations
- **Trend**: Trending topics and analytics data
- **Competitor**: Competitor tracking and performance data
- **Strategy**: Content strategies and recommendations

### Subscription Tiers

- **Free Tier**: 10 analyses, 5 AI generations, 20 trend analyses per month
- **Pro Tier**: 500 analyses, 200 AI generations, 1000 trend analyses per month

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET` (32+ characters)
   - Configure production database URI
   - Set up Redis for production caching

2. **Security**:
   - Enable HTTPS
   - Configure proper CORS origins
   - Set up rate limiting
   - Use environment variables for all secrets

3. **Performance**:
   - Enable Redis caching
   - Configure MongoDB indexes
   - Set up compression middleware
   - Monitor resource usage

4. **Monitoring**:
   - Set up logging
   - Monitor API endpoints
   - Track database performance
   - Set up alerting

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5002
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=auth.test.js
```

## 📊 Performance & Scaling

### Caching Strategy
- **Redis**: Session data, frequently accessed trends, analytics results
- **TTL**: 1 hour for trends, 24 hours for analytics, 7 days for static data

### Database Optimization
- **Indexes**: Created on frequently queried fields (user_id, platform, created_at)
- **Aggregation**: Optimized pipelines for analytics and reporting
- **Connection Pooling**: Configured for optimal performance

### Rate Limiting
- **Global**: 100 requests per 15 minutes per IP
- **Authenticated**: Higher limits based on subscription tier
- **AI Operations**: Special limits for expensive operations

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the API documentation above
- **Issues**: Create an issue on GitHub
- **Health Check**: Visit `/api/health` to verify server status

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with complete backend functionality
- AI-powered content analysis and recommendations
- Multi-platform trend discovery
- Comprehensive competitor tracking
- Strategy generation with AI insights
- Full authentication and subscription management

## 🚦 Getting Started Examples

### Register a New User
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

### Analyze Content
```bash
curl -X POST http://localhost:5002/api/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Your content to analyze here...",
    "analysisType": "comprehensive"
  }'
```

### Get Trending Topics
```bash
curl "http://localhost:5002/api/trends?platform=YouTube&limit=10"
```