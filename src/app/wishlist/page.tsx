'use client';
import { formatCurrency } from '@/lib/utils';
import { useWishlistStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col space-y-8 relative z-10" />;

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col space-y-8 relative z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-display font-bold">Your Wishlist</h1>
        <span className="text-on-surface-variant bg-surface-highest px-4 py-2 rounded-full border border-outline-variant/30 text-sm">
          {wishlist.length} Stocks Saved
        </span>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        {wishlist.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl">
            <p className="text-on-surface-variant mb-4">Your wishlist is empty.</p>
            <p className="text-sm text-primary">Explore Insights or Stocks to add them to your tracking list.</p>
          </div>
        ) : (
          wishlist.map(stock => {
            const isPositive = stock.change > 0;
            return (
              <div key={stock.id} className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 sm:gap-6 hover:bg-surface-highest/50 transition-colors group border-l-4 border-l-transparent hover:border-l-primary relative">
                 <div className="flex-1 w-full sm:w-auto min-w-[120px]">
                   <h3 className="font-display font-bold text-lg sm:text-xl pr-10 sm:pr-0">{stock.symbol}</h3>
                   <p className="text-xs sm:text-sm text-on-surface-variant truncate">{stock.name}</p>
                 </div>
                 
                 <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 sm:gap-6">
                   <div className="text-left sm:text-right">
                     <p className="text-xs text-on-surface-variant mb-1">PRICE</p>
                     <span className="text-lg font-bold">{formatCurrency(stock.price)}</span>
                   </div>

                   <div className="text-right">
                     <p className="text-xs text-on-surface-variant mb-1">24H</p>
                     <span className={`text-sm font-bold ${isPositive ? 'text-[#00E5FF]' : 'text-[#ff716c]'}`}>
                       {isPositive ? '+' : ''}{stock.change}%
                     </span>
                   </div>
                 </div>

                 <div className="absolute top-4 right-4 sm:static sm:top-auto sm:right-auto sm:pl-6 sm:border-l sm:border-outline-variant/20">
                   <button 
                     onClick={() => removeFromWishlist(stock.id)}
                     className="p-2 text-on-surface-variant hover:text-error transition-colors bg-surface-highest hover:bg-surface rounded-full shadow-lg border border-outline-variant/20" 
                     title="Remove from wishlist"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                 </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  );
}
