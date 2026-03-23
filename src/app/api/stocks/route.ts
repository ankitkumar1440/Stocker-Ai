import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    
    if (!symbolsParam) {
      return NextResponse.json({ error: 'Missing symbols parameter' }, { status: 400 });
    }

    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());
    
    // Fetch quotes concurrently
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          // Append .NS (National Stock Exchange of India) if missing and not a global baseline query
          const ticker = (symbol.includes('.') || symbol.startsWith('^')) ? symbol : `${symbol}.NS`;
          const quote = await yahooFinance.quote(ticker) as any;
          
          return {
            id: symbol,
            symbol: symbol,
            name: quote.shortName || quote.longName || symbol,
            price: quote.regularMarketPrice || 0,
            change: Number(quote.regularMarketChangePercent?.toFixed(2)) || 0,
            volume: _formatVolume(quote.regularMarketVolume),
            isPositive: (quote.regularMarketChangePercent || 0) >= 0,
            oldPrice: quote.regularMarketPreviousClose || 0,
            currentPrice: quote.regularMarketPrice || 0,
          };
        } catch (error: any) {
          console.error(`Error fetching ${symbol}:`, error);
          return { error: error.message || 'Unknown error', symbol };
        }
      })
    );

    // Filter out invalid/failed fetches
    const validQuotes = quotes.filter(q => q !== null);
    
    return NextResponse.json({ data: validQuotes });
  } catch (error: any) {
    console.error('Yahoo Finance Backend Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch live market data' }, { status: 500 });
  }
}

// Helper to precisely format millions/billions for the Glassmorphism cards
function _formatVolume(volume?: number) {
  if (!volume) return 'N/A';
  if (volume >= 1e9) return (volume / 1e9).toFixed(1) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(1) + 'K';
  return volume.toString();
}
