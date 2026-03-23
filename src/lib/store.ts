import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  isPositive?: boolean;
}

interface WishlistState {
  wishlist: StockData[];
  addToWishlist: (stock: StockData) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [
        { id: '1', symbol: 'ITC', name: 'ITC Limited', price: 420.30, change: 0.4 },
        { id: '2', symbol: 'WIPRO', name: 'Wipro Limited', price: 490.15, change: -1.2 },
      ], // Initial mock data so it looks populated on first load
      addToWishlist: (stock) => {
        if (!get().wishlist.find((s) => s.id === stock.id)) {
          set((state) => ({ wishlist: [...state.wishlist, stock] }));
        }
      },
      removeFromWishlist: (id) => {
        set((state) => ({ wishlist: state.wishlist.filter((s) => s.id !== id) }));
      },
      isInWishlist: (id) => {
        return !!get().wishlist.find((s) => s.id === id);
      },
    }),
    {
      name: 'stocker-ai-wishlist', 
    }
  )
);

interface WatchlistState {
  watchlist: StockData[];
  addToWatchlist: (stock: StockData) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (stock) => {
        if (!get().watchlist.find((s) => s.id === stock.id)) {
          // Limit to 10 most recently viewed items for performance, newest first
          set((state) => ({ 
             watchlist: [stock, ...state.watchlist].slice(0, 10) 
          }));
        }
      },
      removeFromWatchlist: (id) => {
        set((state) => ({ watchlist: state.watchlist.filter((s) => s.id !== id) }));
      },
      isInWatchlist: (id) => {
        return !!get().watchlist.find((s) => s.id === id);
      },
    }),
    {
      name: 'stocker-ai-watchlist-history', 
    }
  )
);

interface AIState {
  suggestions: any[];
  suggestionsTimestamp: number;
  mprofitStocks: any[];
  mprofitTimestamp: number;
  setSuggestions: (data: any[]) => void;
  setMprofitStocks: (data: any[]) => void;
  clearCache: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      suggestions: [],
      suggestionsTimestamp: 0,
      mprofitStocks: [],
      mprofitTimestamp: 0,
      setSuggestions: (data) => set({ suggestions: data, suggestionsTimestamp: Date.now() }),
      setMprofitStocks: (data) => set({ mprofitStocks: data, mprofitTimestamp: Date.now() }),
      clearCache: () => set({ suggestions: [], suggestionsTimestamp: 0, mprofitStocks: [], mprofitTimestamp: 0 })
    }),
    { name: 'stocker-ai-cache' }
  )
);

interface AuthState {
  token: string | null;
  user: { id: string; name: string; email: string; } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'stocker-ai-auth' }
  )
);
