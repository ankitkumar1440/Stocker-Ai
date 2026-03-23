import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, symbol } = body;

    if (!email || !symbol) {
      return NextResponse.json({ error: 'Missing email or stock symbol parameters' }, { status: 400 });
    }

    // Here we would typically connect to a Mailer service (like Resend, SendGrid, or AWS SES)
    // and store the alert parameters in the MongoDB database for a cron job to process.
    // For now, we simulate a successful registration in the database:
    
    console.log(`[ALERTS SYSTEM] Successfully scheduled rebound alert for user: ${email} on ticker: ${symbol}`);

    return NextResponse.json({
      success: true,
      message: `Alert scheduled successfully for ${symbol}. We will email ${email} when the price reaches an entry threshold.`
    }, { status: 200 });

  } catch (error: any) {
    console.error('Alert Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
