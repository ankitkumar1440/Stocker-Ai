'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 w-full relative z-10 animate-in fade-in zoom-in-95">
         <div className="glass-panel p-12 rounded-3xl w-full max-w-md text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2 text-gradient">Account Created</h1>
            <p className="text-on-surface-variant">Redirecting to login portal...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
       <div className="absolute inset-0 z-0 bg-gradient-radial from-secondary/10 to-transparent opacity-50 pointer-events-none" />
       
       <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 border border-outline-variant/30 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
          <h1 className="text-3xl font-display font-bold text-center mb-2">Join Stocker-Ai</h1>
          <p className="text-on-surface-variant text-center mb-8">Unlock unlimited AI market insights</p>
          
          {error && <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase block mb-2">Full Name</label>
               <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-highest/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-all focus:bg-surface-highest" placeholder="John Doe" />
             </div>
             <div>
               <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase block mb-2">Email Address</label>
               <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-highest/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-all focus:bg-surface-highest" placeholder="you@domain.com" />
             </div>
             <div>
               <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase block mb-2">Password</label>
               <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface-highest/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-all focus:bg-surface-highest" placeholder="••••••••" />
             </div>
             <button disabled={loading} type="submit" className={`w-full py-4 rounded-xl font-bold mt-4 transition-all ${loading ? 'bg-surface-highest text-on-surface-variant border border-outline-variant cursor-wait' : 'bg-secondary hover:bg-secondary/90 text-background hover:scale-[1.02] shadow-[0_0_20px_rgba(255,165,0,0.4)]'}`}>
               {loading ? 'Creating Account...' : 'Create Account'}
             </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Already have an account? <Link href="/login" className="text-secondary hover:underline font-bold">Sign In</Link>
          </p>
       </div>
    </div>
  );
}
