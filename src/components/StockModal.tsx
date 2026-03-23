'use client';
import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function StockModal({ stock, onClose }: { stock: any, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Escape key closes modal
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handleEsc);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!stock || !mounted) return null;
  const isPositive = stock.change > 0 || stock.isPositive || (stock.growthPrediction && stock.growthPrediction.includes('+'));

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 pt-24 pb-8">
      {/* Backdrop (closes modal on click) */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content Wrapper */}
      <div 
        className="relative w-full max-w-lg glass-panel rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 border border-outline-variant/30 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Fixed Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error bg-surface/80 backdrop-blur-md hover:bg-surface rounded-full transition-colors z-[60] shadow-sm border border-outline-variant/20"
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Inner Content */}
        <div className="p-8 pt-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-6 pr-8">
             <div>
                <h2 className="text-3xl font-display font-bold text-gradient">{stock.symbol}</h2>
                <p className="text-on-surface-variant font-medium mt-1">{stock.name}</p>
             </div>
             {stock.price || stock.currentPrice ? (
               <div className="text-right">
                  <p className="text-xs text-on-surface-variant mb-1 uppercase tracking-widest">Market Price</p>
                  <span className="text-2xl font-bold">{formatCurrency(stock.price || stock.currentPrice)}</span>
               </div>
             ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
             {stock.change !== undefined && (
               <div className="bg-surface-highest/80 p-4 rounded-xl backdrop-blur-lg">
                 <span className="text-xs text-on-surface-variant block mb-1">24H CHANGE</span>
                 <span className={`text-xl font-bold ${isPositive ? 'text-[#00E5FF]' : 'text-[#ff716c]'}`}>
                   {isPositive ? '+' : ''}{stock.change}%
                 </span>
               </div>
             )}
             {stock.volume && (
               <div className="bg-surface-highest/80 p-4 rounded-xl backdrop-blur-lg">
                 <span className="text-xs text-on-surface-variant block mb-1">TRADING VOLUME</span>
                 <span className="text-xl font-bold text-on-surface">{stock.volume}</span>
               </div>
             )}
             {stock.prediction && (
               <div className="bg-surface-highest/80 p-4 rounded-xl backdrop-blur-lg">
                 <span className="text-xs text-on-surface-variant block mb-1">AI PREDICTION</span>
                 <span className="text-xl font-bold text-primary">{stock.prediction}</span>
               </div>
             )}
             {stock.confidence && (
               <div className="bg-surface-highest/80 p-4 rounded-xl backdrop-blur-lg">
                 <span className="text-xs text-on-surface-variant block mb-1">CONFIDENCE SCORE</span>
                 <span className="text-xl font-bold text-secondary">{stock.confidence}%</span>
               </div>
             )}
             {stock.growthPrediction && (
               <div className="bg-primary/5 p-4 rounded-xl col-span-2 text-center border border-primary/20 backdrop-blur-lg">
                 <span className="text-xs text-primary block mb-1 tracking-widest uppercase">Deep Value Upside</span>
                 <span className="text-3xl font-bold text-[#00E5FF]">{stock.growthPrediction}</span>
               </div>
             )}
          </div>

          {stock.reason && (
             <div className="mb-6 bg-surface-highest border border-outline-variant/10 p-5 rounded-xl text-left relative z-10">
               <h4 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-2 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                 </svg>
                 Automated Technical Analysis
               </h4>
               <p className="text-sm text-on-surface leading-relaxed">{stock.reason}</p>
             </div>
          )}

          <div className="w-full h-32 mt-2 relative flex items-end overflow-hidden border-t border-outline-variant/10 pt-4">
             {/* Mock Chart Area Background */}
             <div className="absolute inset-0 bg-gradient-to-t from-surface-highest/30 to-transparent pointer-events-none"></div>
             <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d={isPositive ? "M0 35 Q10 32, 20 25 T40 15 T60 20 T80 5 T100 2" : "M0 5 Q10 8, 20 15 T40 25 T60 20 T80 35 T100 38"} fill="none" stroke={isPositive ? "url(#primaryGradientChart)" : "url(#errorGradientChart)"} strokeWidth="2.5" strokeLinecap="round" />
                <path d={isPositive ? "M0 35 Q10 32, 20 25 T40 15 T60 20 T80 5 T100 2 L100 40 L0 40 Z" : "M0 5 Q10 8, 20 15 T40 25 T60 20 T80 35 T100 38 L100 40 L0 40 Z"} fill={isPositive ? "url(#primaryGradient)" : "url(#errorGradient)"} opacity="0.1" />
                <defs>
                  <linearGradient id="primaryGradientChart" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#81ecff" />
                    <stop offset="100%" stopColor="#dd8bfb" />
                  </linearGradient>
                  <linearGradient id="errorGradientChart" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff716c" />
                    <stop offset="100%" stopColor="#ffb9b6" />
                  </linearGradient>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-error)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
             </svg>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
