'use client';
import { formatCurrency } from '@/lib/utils';
import { useWishlistStore, useAIStore, useWatchlistStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import StockModal from '@/components/StockModal';

export default function SuggestionsPage() {
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  
  const aiStore = useAIStore();
  const [recommendations, setRecommendations] = useState<any[]>(aiStore.suggestions || []);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [loading, setLoading] = useState(aiStore.suggestions.length === 0);

  const isInWishlist = (id: string) => !!wishlist.find(s => s.id === id);

  // Hydration & Initial AI Load with Cache checking
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const fetchInitialAIPicks = async () => {
      // Use cache if under 10 minutes (600,000 ms) and exists
      if (aiStore.suggestions.length > 0 && (Date.now() - aiStore.suggestionsTimestamp < 600000)) {
        setRecommendations(aiStore.suggestions);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_suggestions' })
        });
        const json = await res.json();
        if (res.ok && json.data && Array.isArray(json.data)) {
          setRecommendations(json.data);
          aiStore.setSuggestions(json.data);
        }
      } catch (e) {
        console.error('Failed to fetch initial AI suggestions:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialAIPicks();
  }, []);

  if (!mounted) return <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col space-y-8 relative z-10" />;

  const handleWishlistToggle = (rec: any) => {
    if (isInWishlist(rec.id)) {
      removeFromWishlist(rec.id);
    } else {
      addToWishlist({
        id: rec.id,
        symbol: rec.symbol,
        name: rec.name,
        price: rec.price,
        change: rec.change,
        isPositive: rec.change >= 0
      });
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col space-y-8 relative z-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold text-gradient">AI Suggestions</h1>
        <p className="text-on-surface-variant">Intelligent stock recommendations driven by predictive modeling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {recommendations.map((rec) => {
          const inWishlist = isInWishlist(rec.id);
          
          return (
            <div key={rec.id} className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
              {/* Ambient Background Gradient */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-500"></div>
              
              <div className="flex justify-between items-start mb-6">
                 <div className="flex flex-col">
                    <h3 className="text-3xl font-display font-bold">{rec.symbol}</h3>
                    <p className="text-on-surface-variant">{rec.name}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-bold">{formatCurrency(rec.price)}</span>
                 </div>
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className="bg-surface-highest border border-primary/30 px-4 py-2 rounded-xl">
                    <span className="text-xs text-on-surface-variant block mb-1">PREDICTION</span>
                    <span className="text-primary font-bold">{rec.prediction}</span>
                 </div>
                 <div className="bg-surface-highest border border-secondary/30 px-4 py-2 rounded-xl">
                    <span className="text-xs text-on-surface-variant block mb-1">CONFIDENCE</span>
                    <span className="text-secondary font-display font-bold">{rec.confidence}%</span>
                 </div>
              </div>

              <div className="bg-surface-highest/50 p-4 rounded-xl border border-outline-variant/10 relative z-10">
                 <p className="text-sm leading-relaxed text-on-surface-variant">
                   <strong className="text-on-surface">AI Analysis:</strong> {rec.reason}
                 </p>
              </div>

              <div className="mt-6 flex justify-end relative z-20 gap-3">
                 <button 
                   onClick={() => { setSelectedStock(rec); addToWatchlist({ id: rec.id, symbol: rec.symbol, name: rec.name, price: rec.price, change: rec.change, isPositive: rec.change > 0 }); }}
                   className="text-sm font-bold flex items-center gap-2 transition-colors px-4 py-2 border rounded-full border-outline-variant/30 hover:bg-surface-highest"
                 >
                   Details
                 </button>
                 <button 
                   onClick={() => handleWishlistToggle(rec)}
                   className={`text-sm font-bold flex items-center gap-2 transition-colors px-4 py-2 border rounded-full ${inWishlist ? 'text-error border-error/50 hover:bg-error/10' : 'text-primary border-primary/50 hover:bg-primary/10 hover:text-white'}`}
                 >
                   {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                   {inWishlist ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                     </svg>
                   )}
                 </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center pt-8 w-full relative z-20">
        <button 
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generate_suggestions' })
              });
              const json = await res.json();
              if (res.ok && json.data && Array.isArray(json.data)) {
                const newArr = [...recommendations, ...json.data];
                setRecommendations(newArr);
                aiStore.setSuggestions(newArr);
              } else {
                if (json.missingKey) alert('Missing GEMINI_API_KEY in .env.local!');
                else console.error("AI Error:", json.error);
              }
            } catch (e) {
              console.error('AI Request Error:', e);
            } finally {
              setLoading(false);
            }
          }}
          className={`btn-neon px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-transform ${loading ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
        >
           {loading ? (
             <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
           )}
           {loading ? 'AI Analyzing Models...' : 'Generate Live AI Prediction'}
        </button>
      </div>

      {selectedStock && <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </main>
  );
}
