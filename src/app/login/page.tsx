'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
       <div className="absolute inset-0 z-0 bg-gradient-radial from-primary/10 to-transparent opacity-50 pointer-events-none" />
       
       <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 border border-outline-variant/30 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
          <h1 className="text-3xl font-display font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant text-center mb-8">Login to your Stocker-Ai account</p>
          
          {error && <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
             <div>
               <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase block mb-2">Email Address</label>
               <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-highest/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:bg-surface-highest transition-all" placeholder="you@domain.com" />
             </div>
             <div>
               <div className="flex justify-between items-center mb-2">
                 <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase block">Password</label>
                 <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
               </div>
               <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface-highest/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:bg-surface-highest transition-all" placeholder="••••••••" />
             </div>
             <button disabled={loading} type="submit" className={`w-full py-4 rounded-xl font-bold mt-2 transition-all ${loading ? 'bg-surface-highest text-on-surface-variant border border-outline-variant cursor-wait' : 'btn-neon hover:scale-[1.02]'}`}>
               {loading ? 'Authenticating...' : 'Sign In'}
             </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline font-bold">Create Account</Link>
          </p>
       </div>
    </div>
  );
}
