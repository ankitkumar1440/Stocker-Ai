'use client';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import Link from 'next/link';
import { useAuthStore, useAIStore, useWatchlistStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import MarketChart from '@/components/MarketChart';

export default function DashboardPage() {
  const watchlistItems = useWatchlistStore((state) => state.watchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);
  const user = useAuthStore((state) => state.user);
  const aiStore = useAIStore();
  const [mounted, setMounted] = useState(false);
  const [chartRange, setChartRange] = useState<'1D'|'1W'|'1M'|'1Y'>('1M');
  useEffect(() => setMounted(true), []);

  const displayStocks = mounted ? watchlistItems : [];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col space-y-8 relative z-10">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">
          {user ? `${user.name.split(' ')[0]}'s Portfolio` : 'Personal Dashboard'}
        </h1>
        <div className="text-sm text-on-surface-variant bg-surface-highest px-4 py-2 rounded-full border border-outline-variant/30">
          Last Updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Portfolio / Market Trend Chart Area */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">NIFTY 50 Overview</h2>
            <div className="flex bg-surface-highest rounded-lg p-1">
               {['1D', '1W', '1M', '1Y'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setChartRange(tab as any)}
                   className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                     chartRange === tab 
                       ? 'bg-primary/20 text-primary shadow-sm' 
                       : 'text-on-surface-variant hover:text-on-surface'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-surface-highest/20 rounded-2xl flex items-center justify-center border border-outline-variant/10 relative overflow-hidden">
             {mounted && <MarketChart symbol="^NSEI" range={chartRange} />}
          </div>
        </div>

        {/* AI Predictions / Insights Sidebar */}
        <div className="col-span-1 glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-gradient">Recent AI Insights</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
          </h2>
          
          {aiStore.suggestions.length > 0 ? (
            aiStore.suggestions.slice(0, 2).map((rec: any, idx) => (
              <div key={rec.id} className={`bg-surface-highest p-4 rounded-xl border transition-colors ${idx === 0 ? 'border-outline-variant/20 hover:border-primary/50' : 'border-outline-variant/20 hover:border-secondary/50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold font-display ${idx === 0 ? 'text-primary' : 'text-secondary'}`}>{rec.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${idx === 0 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    {rec.prediction.split('/')[0]}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-3">{rec.reason}</p>
              </div>
            ))
          ) : (
            <div className="bg-surface-highest p-4 rounded-xl border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant italic">No recent AI generations. Visit Suggestions to scan the market.</p>
            </div>
          )}
          
          <Link href="/suggestions" className="text-primary text-sm font-medium mt-auto flex items-center gap-1 hover:underline">
            Generate More Predictions &rarr;
          </Link>
        </div>
      </div>

      {/* Stock Cards Grid (Synced with Wishlist) */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold">Your Watchlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStocks.length === 0 ? (
            <div className="col-span-full py-12 text-center border border-dashed border-outline-variant/30 rounded-3xl bg-surface-highest/50">
              <h3 className="text-xl font-bold mb-2">Your Watchlist is Empty</h3>
              <p className="text-on-surface-variant mb-6">Search and view details of live stocks to automatically populate your recent history.</p>
              <Link href="/stocks" className="btn-neon px-6 py-3 rounded-full font-bold">Search Global Market</Link>
            </div>
          ) : (
            displayStocks.map((stock) => {
              const isPositive = stock.change > 0 || stock.isPositive;
              return (
                <div key={stock.id} className="glass-panel p-5 rounded-2xl hover:-translate-y-1 transition-transform duration-300 group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg pr-8">{stock.symbol}</h3>
                      <p className="text-xs text-on-surface-variant truncate w-32">{stock.name}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFromWatchlist(stock.id); }}
                      className="absolute top-3 right-3 p-2 bg-surface text-error border border-error/50 hover:bg-error hover:text-white rounded-full transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-md z-20"
                      title="Remove from Dashboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold">{formatCurrency(stock.price)}</span>
                    </div>
                    <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-[#00E5FF]' : 'text-[#ff716c]'}`}>
                      {isPositive ? '▲' : '▼'} {Math.abs(stock.change)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
