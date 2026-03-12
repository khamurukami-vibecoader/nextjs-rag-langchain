
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('=== API HIT ===');
  console.log('GROQ_KEY exists:', !!process.env.GROQ_API_KEY);
  console.log('KEY preview:', process.env.GROQ_API_KEY?.slice(0,10) + '...');
  console.log('Req body:', await req.text());

  const body = await req.json().catch(() => ({}));
  console.log('Parsed messages:', body.messages);

  if (!process.env.GROQ_API_KEY) {
    console.error('NO GROQ KEY!');
    return NextResponse.json({ error: 'Missing GROQ_API_KEY in .env.local' }, { status: 400 });
  }

  return NextResponse.json({ 
    status: 'OK', 
    keyOK: true, 
    groqPreview: process.env.GROQ_API_KEY?.slice(0,20),
    received: body.messages?.length || 0 
  });
}
