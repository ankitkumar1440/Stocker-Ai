import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Missing search query parameter' }, { status: 400 });
    }

    // Step 1: Perform Global Search via Yahoo Finance
    const searchResults = await yahooFinance.search(query, {
      quotesCount: 8,
      newsCount: 0
    });

    // Filter to valid equities, ETFs, or index funds
    const validSymbols = searchResults.quotes
      .filter((q: any) => ['EQUITY', 'ETF', 'INDEX', 'MUTUALFUND'].includes(q.quoteType) && q.symbol)
      .map((q: any) => q.symbol);

    if (validSymbols.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Step 2: For the top matches, fetch their LIVE quotes instantly
    const quotes = await Promise.all(
      validSymbols.map(async (symbol: string) => {
        try {
          const quote = await yahooFinance.quote(symbol) as any;
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
          console.error(`Error fetching global quote ${symbol}:`, error);
          return null; // Ignore invalid lookups
        }
      })
    );

    // Filter out invalid/failed fetches
    const validQuotes = quotes.filter((q: any) => q !== null);
    
    return NextResponse.json({ data: validQuotes });
  } catch (error: any) {
    console.error('Yahoo Finance Search API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to search global market data' }, { status: 500 });
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
