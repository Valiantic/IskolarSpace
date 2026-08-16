import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '../../../lib/auth/apiAuth';

const MAX_PROMPT = 4000;

/** Per-user rate limit. In-memory, so it resets on redeploy and is per-instance.
 *  Good enough to stop casual abuse; move to Upstash/Redis if you scale out. */
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = hits.get(userId);

  if (!entry || now > entry.resetAt) {
    hits.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// POST: generate a study plan. Requires a signed-in user — this endpoint spends
// money against GEMINI_API_KEY, so it must never be open to the public.
export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;

  if (rateLimited(auth.userId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const prompt = body?.prompt;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT) {
    return NextResponse.json({ error: 'Prompt too long' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const plan = result.response.text();

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
