import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
});

const RATE_LIMIT_WINDOW = 60;
const MAX_REQUESTS = 5;

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const redisKey = `rate-limit:${ip}`;

  try {
    const pipeline = redis.pipeline();
    pipeline.incr(redisKey);
    pipeline.expire(redisKey, RATE_LIMIT_WINDOW);

    const pipelineResult = await pipeline.exec();
    if (!pipelineResult) {
      throw new Error('Redis pipeline returned null.');
    }

    const [incrError, requestCount] = pipelineResult[0];
    if (incrError) {
      throw incrError;
    }

    const currentRequestCount = requestCount as number;

    if (currentRequestCount > MAX_REQUESTS) {
      return NextResponse.json(
        { message: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json({
      message: 'Request successful!',
      requestsLeft: MAX_REQUESTS - currentRequestCount,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}