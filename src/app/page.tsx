import Link from 'next/link';
import ScrollSequence from '@/components/ScrollSequence';

export default function Home() {
  return (
    <div className="relative flex flex-col w-full">
      
      {/* Abstract Background Accents */}
      <div className="fixed top-[10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section with Scroll Animation */}
      <main id="hero-track" className="min-h-[250vh] relative z-10 w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 h-screen sticky top-0 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Column: Content */}
          <div className="flex-1 flex flex-col items-start justify-center space-y-8 z-20 w-full md:pr-10 pt-20 md:pt-0">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
              AI-Powered Stock Analysis <br />
              <span className="text-gradient">At Your Fingertips</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl font-light leading-relaxed">
              Invest smarter, faster, and with greater precision. Track live market trends using <span className="text-on-surface font-semibold">₹ INR</span>, get AI-backed predictions, and uncover deep insights. 
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <Link href="/dashboard" className="btn-neon px-8 py-4 rounded-full text-base font-bold flex items-center gap-2">
                Explore Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/stocks" className="glass-panel px-8 py-4 rounded-full text-base font-medium hover:bg-surface-highest transition-colors">
                View Markets
              </Link>
            </div>
          </div>

          {/* Right Column: 3D / Scroll Animation Trading Element */}
          <div className="flex-1 w-full h-full relative z-10 flex items-center justify-center order-first md:order-last">
             <ScrollSequence />
          </div>

        </div>
      </main>

      {/* Floating Stock Preview Ticker Element (Restored) */}
      <div className="w-full flex justify-center pb-20 pt-10 relative z-20">
         <div className="flex flex-col items-center gap-4">
           <span className="text-sm tracking-widest text-on-surface-variant uppercase">Scroll to Explore</span>
           <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent animate-pulse" />
         </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 mb-32 relative z-20">
        <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col items-start gap-1">
             <span className="text-on-surface-variant text-sm font-semibold tracking-wider">AI RECOMMENDATION</span>
             <div className="flex items-end gap-3">
               <span className="text-3xl font-display font-bold">RELIANCE</span>
               <span className="text-lg text-[#00E5FF] font-medium">+2.4%</span>
             </div>
             <span className="text-2xl font-light">₹2,945.50</span>
          </div>
          
          <div className="h-24 w-full md:w-1/2 flex items-center justify-center border-l border-outline-variant/30 pl-6">
             <div className="w-full h-12 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full relative overflow-hidden">
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#81ecff]"></div>
                <div className="absolute left-2/4 top-1/3 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#81ecff]"></div>
                <div className="absolute left-3/4 top-1/4 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#dd8bfb]"></div>
                {/* Mock sparkline path */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0 15 Q20 15, 25 10 T50 12 T75 5 T100 2" fill="none" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="15" x2="100" y2="2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#81ecff"/>
                      <stop offset="1" stopColor="#dd8bfb"/>
                    </linearGradient>
                  </defs>
                </svg>
             </div>
          </div>

          <div className="flex flex-col items-end gap-1">
             <span className="text-on-surface-variant text-sm font-semibold tracking-wider">CONFIDENCE</span>
             <span className="text-4xl font-display font-bold text-gradient">92%</span>
          </div>
        </div>
      </div>

      {/* New Capabilities Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Why Choose <span className="text-gradient">Stocker-Ai?</span></h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">Our platform combines institutional-grade speed with cutting edge machine learning to give you an unparalleled advantage in the market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(129,236,255,0.1)] transition-all duration-300">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_15px_rgba(129,236,255,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3 text-on-surface">Real-Time Processing</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">Experience zero-latency data streaming directly from live market APIs, ensuring your INR trades are executed with perfect timing.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(221,139,251,0.1)] transition-all duration-300">
            <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 border border-secondary/30 shadow-[0_0_15px_rgba(221,139,251,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3 text-on-surface">AI Deep Learning</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">Our proprietary AI pipeline analyzes thousands of stock points, generating probabilistic confidence scores for every recommendation.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,227,253,0.1)] transition-all duration-300">
            <div className="w-14 h-14 bg-[#00e3fd]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#00e3fd]/30 shadow-[0_0_15px_rgba(0,227,253,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#00E5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
               </svg>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3 text-on-surface">Custom mProfit</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">Discover deep value hidden in the market. Filter specifically for recently discounted stocks poised for high-growth rebounds.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
