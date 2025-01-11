# API Rate Limiter with Next.js

A modern web application built with Next.js that provides a user interface for testing API rate limiting. The project includes both a frontend interface for testing various APIs and a backend implementation of rate limiting using Redis.

## Features

- Test rate limiting on any API endpoint
- Visual interface showing request logs and rate limit status
- Built-in support for GitHub API testing
- Redis-based rate limiting implementation
- Dark mode UI
- Real-time request tracking

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or later)
- Redis (v6 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd rate-limiter-api
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
REDIS_URL=redis://localhost:6379
```

4. Start Redis:
```bash
# On Windows (WSL)
sudo service redis-server start

# On macOS
brew services start redis

# Using Docker
docker run --name redis -p 6379:6379 -d redis
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. Access the web interface at `http://localhost:3000`
2. Enter an API URL to test
3. Click "Test Rate Limit" to send requests
4. View the request logs and rate limit status in real-time

### Example APIs for Testing

- GitHub API Rate Limits: `https://api.github.com/rate_limit`
- GitHub User Info: `https://api.github.com/users/[username]`
- Test API: `https://jsonplaceholder.typicode.com/posts/1`

## API Endpoints

### Rate Limiter Endpoint

```
GET /api/rate-limiter
```

Returns:
- `200 OK` if request is allowed
- `429 Too Many Requests` if rate limit exceeded

Headers:
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Time until rate limit reset

### URL Testing Endpoint

```
POST /api/test-url
```

Body:
```json
{
  "url": "https://api.example.com"
}
```

## Rate Limiting Configuration

Default settings:
- 10 requests per minute per IP
- 60-second window
- Redis-based storage for rate limit data

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [Redis](https://redis.io/) - Rate limit data storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ioredis](https://github.com/luin/ioredis) - Redis client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Next.js team for the excellent framework
- Vercel for deployment platform
- Redis for rate limiting storage solution