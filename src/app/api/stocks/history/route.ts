import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || '^NSEI';
    const range = searchParams.get('range') || '1M';
    
    // Map UI range to Yahoo Finance parameters
    let yfRange: any = '1mo';
    let yfInterval: any = '1d';
    
    if (range === '1D') {
      yfRange = '1d';
      yfInterval = '5m';
    } else if (range === '1W') {
      yfRange = '5d';
      yfInterval = '15m'; // or 30m
    } else if (range === '1M') {
      yfRange = '1mo';
      yfInterval = '1d';
    } else if (range === '1Y') {
      yfRange = '1y';
      yfInterval = '1d';
    }

    const queryOptions: any = { interval: yfInterval, range: yfRange, period1: '2000-01-01' };
    const chartData = await yahooFinance.chart(symbol, queryOptions);
    
    if (!chartData || !chartData.quotes) {
      return NextResponse.json({ data: [] });
    }

    // Map the YF quotes to a flat array suitable for Recharts
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });

    const parsedData = (chartData.quotes as any[]).map((quote: any) => {
      // YF returns date strings or Date objects
      const dateObj = new Date(quote.date);
      
      let label = '';
      if (range === '1D' || range === '1W') {
        // Show time for daily/weekly
        label = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (range === '1W') {
          // prepended with short day
          label = dateObj.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + label;
        }
      } else {
        // Show date for monthly/yearly
        label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (range === '1Y') {
          // prepended with year for long view
          label = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }
      }

      return {
        time: label,
        price: quote.close ? Number(quote.close.toFixed(2)) : null,
      };
    }).filter((point: any) => point.price !== null); // Filter out nulls from market halts
    
    return NextResponse.json({ data: parsedData });
  } catch (error: any) {
    console.error('Yahoo Finance History Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch historical data' }, { status: 500 });
  }
}
