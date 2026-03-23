'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <header className="sticky top-0 z-50 w-full px-6 py-4"><nav className="glass-panel mx-auto max-w-7xl h-16 rounded-2xl"></nav></header>;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Stocks', href: '/stocks' },
    { name: 'AI Suggestions', href: '/suggestions' },
    { name: 'mProfit', href: '/mprofit' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4">
      <nav className={`glass-panel mx-auto max-w-7xl rounded-2xl px-6 py-3 shadow-lg flex flex-col items-center justify-between transition-all duration-300 ${isMobileMenuOpen ? 'backdrop-blur-3xl' : ''}`}>
        
        {/* Top bar */}
        <div className="w-full flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Link href="/" className="text-2xl font-bold font-display text-gradient tracking-tight">
               Stocker-Ai
             </Link>
           </div>
           
           {/* Desktop Links */}
           <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
             {navLinks.map((link) => {
               const isActive = pathname === link.href;
               return (
                 <Link 
                   key={link.name} 
                   href={link.href} 
                   className={`transition-colors relative ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                 >
                   {link.name}
                   {/* Active Underline Indicator */}
                   {isActive && (
                     <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_#81ecff] rounded-full" />
                   )}
                 </Link>
               );
             })}
           </div>
           
           <div className="hidden lg:flex items-center gap-4">
             {user ? (
               <div className="relative" ref={profileRef}>
                 <button 
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className="flex items-center gap-3 hover:bg-surface-highest p-1 pr-3 rounded-full transition-colors border border-outline-variant/30 group"
                 >
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-background font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all">
                     {user.name.charAt(0).toUpperCase()}
                   </div>
                   <span className="text-sm font-bold text-on-surface">{user.name.split(' ')[0]}</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-on-surface-variant transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </button>
                 
                 {isProfileOpen && (
                   <div className="absolute right-0 mt-3 w-56 bg-[#0a0c10]/95 backdrop-blur-3xl rounded-2xl shadow-2xl border border-outline-variant/50 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                     <div className="px-4 py-3 border-b border-outline-variant/20 mb-2">
                       <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
                       <p className="text-xs text-on-surface-variant truncate">{user.email || 'Member Account'}</p>
                     </div>
                     <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-on-surface hover:text-primary hover:bg-primary/5 transition-colors">
                       My Dashboard
                     </Link>
                     <Link href="/wishlist" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-on-surface hover:text-primary hover:bg-primary/5 transition-colors">
                       Saved Wishlist
                     </Link>
                     <button 
                       onClick={() => { setIsProfileOpen(false); logout(); }} 
                       className="w-full text-left mt-2 border-t border-outline-variant/20 pt-2 block px-4 py-2 text-sm text-error font-medium hover:bg-error/10 transition-colors"
                     >
                       Sign Out
                     </button>
                   </div>
                 )}
               </div>
             ) : (
               <>
                 <Link href="/login" className="text-sm font-medium text-on-surface hover:text-primary transition-colors">Log In</Link>
                 <Link href="/signup" className="btn-neon px-5 py-2 rounded-full text-sm font-bold">Get Started</Link>
               </>
             )}
           </div>

           {/* Mobile Menu Toggle Button */}
           <button 
             className="lg:hidden p-2 text-on-surface hover:text-primary transition-colors"
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             aria-label="Toggle navigation menu"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
             </svg>
           </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
           <div className="w-full lg:hidden flex flex-col gap-4 mt-6 pt-6 border-t border-outline-variant/20 animate-in fade-in slide-in-from-top-4">
             {navLinks.map((link) => {
               const isActive = pathname === link.href;
               return (
                 <Link 
                   key={link.name} 
                   href={link.href} 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`text-lg transition-colors py-2 flex items-center gap-2 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                 >
                   {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                   {link.name}
                 </Link>
               );
             })}
             <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/10">
               {user ? (
                 <>
                   <span className="text-lg font-bold text-on-surface py-2">Account: {user.name}</span>
                   <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-error py-2">Logout</button>
                 </>
               ) : (
                 <>
                   <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-on-surface py-2 hover:text-primary">Log In</Link>
                   <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-neon px-5 py-3 text-center rounded-full text-lg font-bold">Get Started</Link>
                 </>
               )}
             </div>
           </div>
        )}

      </nav>
    </header>
  );
}
