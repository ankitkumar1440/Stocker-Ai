'use client';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useWishlistStore, useWatchlistStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import StockModal from '@/components/StockModal';

const ALL_STOCKS = [
  { id: '1', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.50, change: 2.4, volume: '6.2M' },
  { id: '2', symbol: 'TCS', name: 'Tata Consultancy Services', price: 3820.00, change: -0.5, volume: '2.1M' },
  { id: '3', symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1450.25, change: 1.2, volume: '14.5M' },
  { id: '4', symbol: 'INFY', name: 'Infosys', price: 1640.75, change: 2.1, volume: '5.8M' },
  { id: '5', symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1050.10, change: 0.8, volume: '9.3M' },
  { id: '6', symbol: 'SBIN', name: 'State Bank of India', price: 760.45, change: -1.2, volume: '11.2M' },
];

export default function StocksPage() {
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const [selectedStock, setSelectedStock] = useState<typeof ALL_STOCKS[0] | null>(null);

  const isInWishlist = (id: string) => !!wishlist.find(s => s.id === id);


  const [mounted, setMounted] = useState(false);
  const [liveStocks, setLiveStocks] = useState<any[]>(ALL_STOCKS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Hydration Mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce Text Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 600); // 600ms delay to prevent API spam
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Main Live Market Fetcher
  useEffect(() => {
    if (!mounted) return;

    const fetchLiveStocks = async () => {
      setLoading(true);
      try {
        const endpoint = debouncedTerm.trim().length > 0
           ? `/api/stocks/search?q=${encodeURIComponent(debouncedTerm)}`
           : '/api/stocks?symbols=RELIANCE,TCS,HDFCBANK,INFY,ICICIBANK,SBIN';

        const res = await fetch(endpoint);
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          setLiveStocks(json.data);
        } else {
          setLiveStocks(debouncedTerm.trim() ? [] : ALL_STOCKS);
        }
      } catch (e) {
        console.error('Failed to fetch live/search stocks:', e);
        setLiveStocks(debouncedTerm.trim() ? [] : ALL_STOCKS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLiveStocks();
  }, [debouncedTerm, mounted]);

  if (!mounted) return <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col space-y-8 relative z-10" />;

  const handleWishlistToggle = (stock: typeof ALL_STOCKS[0]) => {
    if (isInWishlist(stock.id)) {
      removeFromWishlist(stock.id);
    } else {
      addToWishlist({
        id: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        isPositive: stock.change > 0
      });
    }
  };

  const handleViewDetails = (stock: typeof ALL_STOCKS[0]) => {
    const addToWatchlist = useWatchlistStore.getState().addToWatchlist;
    addToWatchlist({
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      isPositive: stock.change > 0
    });
    setSelectedStock(stock);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold">{debouncedTerm ? 'Search Results' : 'Market Overview'}</h1>
          <p className="text-on-surface-variant mt-1">{debouncedTerm ? `Global matches for "${debouncedTerm}"` : 'Real-time stock prices and trends'}</p>
        </div>
        <div className="relative w-full md:w-auto">
           <input 
             type="text" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Search global markets..." 
             className="w-full md:w-64 bg-surface-highest border border-outline-variant/30 text-on-surface rounded-full py-2 px-4 focus:outline-none focus:border-primary transition-colors"
           />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20 relative z-20">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(129,236,255,0.5)]"></div>
             <p className="text-secondary font-bold tracking-widest uppercase text-sm animate-pulse">{debouncedTerm ? 'Searching Global Markets...' : 'Establishing Live Market Feed...'}</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {liveStocks.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-medium">No stocks matched your search across global markets.</div>
          ) : (
            liveStocks.map(stock => {
              const isPositive = stock.change > 0;
            const inWishlist = isInWishlist(stock.id);
          
          return (
            <div key={stock.id} className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 group relative overflow-hidden flex flex-col">
              {/* Subtle accent glow on hover based on performance */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${isPositive ? 'bg-[#00e3fd]/5' : 'bg-[#ff716c]/5'} rounded-full blur-[50px] transition-all duration-500 group-hover:scale-150`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl">{stock.symbol}</h3>
                  <p className="text-sm text-on-surface-variant truncate w-40">{stock.name}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isPositive ? 'bg-[#00e3fd]/10 text-[#00E5FF] border-[#00e3fd]/20' : 'bg-[#ff716c]/10 text-[#ff716c] border-[#ff716c]/20'}`}>
                   {isPositive ? '▲' : '▼'} {Math.abs(stock.change)}%
                </div>
              </div>

              <div className="h-16 w-full mb-6 relative">
                 {/* Sparkline Mock Graphic */}
                 <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d={isPositive ? "M0 15 Q25 18, 50 10 T100 2" : "M0 5 Q25 8, 50 15 T100 18"} fill="none" stroke={isPositive ? "var(--color-primary)" : "var(--color-error)"} strokeWidth="1.5" strokeLinecap="round" />
                 </svg>
              </div>

               <div className="mt-auto flex justify-between items-end border-t border-outline-variant/10 pt-4 relative z-20">
                 <div>
                   <p className="text-xs text-on-surface-variant mb-1">PRICE</p>
                   <span className="text-2xl font-bold">{formatCurrency(stock.price)}</span>
                 </div>
                 <div className="flex flex-col items-end gap-3 text-right">
                   <div className="flex items-center gap-2">
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleViewDetails(stock); }}
                       className="text-xs px-3 py-1.5 rounded-full border border-outline-variant/30 hover:bg-surface-highest transition-colors font-medium"
                     >
                       Details
                     </button>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleWishlistToggle(stock);
                       }}
                       className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${inWishlist ? 'border-error/50 text-error hover:bg-error/10' : 'border-primary/50 text-primary hover:bg-primary/10 hover:text-white'}`}
                     >
                       {inWishlist ? '- Remove' : '+ Wishlist'}
                     </button>
                   </div>
                 </div>
              </div>
            </div>
          );
        }))}
      </div>
      )}
      
      {selectedStock && <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </main>
  );
}
