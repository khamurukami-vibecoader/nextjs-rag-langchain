
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGroq({ 
  model: 'llama-3.3-70b-versatile',
  apiKey: process.env.GROQ_API_KEY!,
  temperature: 0
});

const prompt = ChatPromptTemplate.fromMessages([
  ['system', `ForumNXT User Manual Assistant (from attached HTML).
  Key modules/steps:
- Login: Masters > Login > URL > Steps
- Sales Order: Sales > SO > Customer > Product > Save Draft > Publish
- GRN: Inventory > GRN > Vendor > Items > Save > Publish
- Stock Adjustment: Inventory > Adjustment > Godown > New Qty > Publish
- Full manual covers Masters (Customers/Vendors), Purchase, Sales, Inventory, Payments.

Always respond with numbered steps/navigation. Concise.

Context from manual: {context}
Query: {input}`],
  ['human', '{input}'],
]);

export async function POST(req: NextRequest) {
  try {
    console.log('GROQ key OK:', !!process.env.GROQ_API_KEY);
    const { messages } = await req.json();
    const question = messages[messages.length - 1]?.content || '';

    const chain = await prompt.pipe(llm);
    const response = await chain.invoke({ context: 'Full manual loaded', input: question });

    return NextResponse.json({
      messages: [...messages.slice(0, -1), { role: 'assistant', content: response }]
    });
  } catch (error: any) {
    console.error('ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
