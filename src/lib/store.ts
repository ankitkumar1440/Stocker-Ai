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
  setWishlist: (stocks: StockData[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [], // Cleared the hardcoded mocks so real cloud data loads purely
      addToWishlist: (stock) => {
        if (!get().wishlist.find((s) => s.id === stock.id)) {
          set((state) => ({ wishlist: [...state.wishlist, stock] }));
          const token = useAuthStore.getState().token;
          if (token) {
            fetch('/api/user/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ stock })
            }).catch(e => console.error('Cloud sync add failed', e));
          }
        }
      },
      removeFromWishlist: (id) => {
        set((state) => ({ wishlist: state.wishlist.filter((s) => s.id !== id) }));
        const token = useAuthStore.getState().token;
        if (token) {
          fetch(`/api/user/wishlist?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(e => console.error('Cloud sync remove failed', e));
        }
      },
      isInWishlist: (id) => {
        return !!get().wishlist.find((s) => s.id === id);
      },
      setWishlist: (stocks) => set({ wishlist: stocks }),
      clearWishlist: () => set({ wishlist: [] }),
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
  clearWatchlist: () => void;
  setWatchlist: (stocks: StockData[]) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (stock) => {
        set((state) => {
          const filtered = state.watchlist.filter((s) => s.id !== stock.id);
          const newWatchlist = [stock, ...filtered].slice(0, 10);
          
          const token = useAuthStore.getState().token;
          if (token) {
            fetch('/api/user/watchlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ stock })
            }).catch(e => console.error('Watchlist sync failed', e));
          }
          
          return { watchlist: newWatchlist };
        });
      },
      removeFromWatchlist: (id) => {
        set((state) => ({ watchlist: state.watchlist.filter((s) => s.id !== id) }));
        const token = useAuthStore.getState().token;
        if (token) {
          fetch(`/api/user/watchlist?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(e => console.error('Watchlist remove failed', e));
        }
      },
      isInWatchlist: (id) => {
        return !!get().watchlist.find((s) => s.id === id);
      },
      clearWatchlist: () => set({ watchlist: [] }),
      setWatchlist: (stocks) => set({ watchlist: stocks }),
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
      login: (token, user) => {
        set({ token, user });
        // Hydrate all cloud state in one unified sync call
        fetch('/api/user/sync', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => {
          if (json.data) {
             if (json.data.wishlist) useWishlistStore.getState().setWishlist(json.data.wishlist);
             if (json.data.watchlist) useWatchlistStore.getState().setWatchlist(json.data.watchlist);
          }
        }).catch(e => console.error('Cloud sync hydration failed', e));
      },
      logout: () => {
        set({ token: null, user: null });
        useWishlistStore.getState().clearWishlist();
        useWatchlistStore.getState().clearWatchlist();
      },
    }),
    { name: 'stocker-ai-auth' }
  )
);
