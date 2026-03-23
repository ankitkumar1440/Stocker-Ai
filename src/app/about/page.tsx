export default function AboutPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col space-y-12 relative z-10">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">About Stocker-Ai</h1>
        <p className="text-lg text-on-surface-variant font-light">
          Redefining stock analysis through high-performance artificial intelligence.
        </p>
      </div>

      <section className="glass-panel p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-display font-bold">Platform Overview</h2>
        <p className="text-on-surface-variant leading-relaxed">
          Stocker-Ai is a premium stock analysis platform designed to leverage advanced machine learning models to help you track real-time stock prices, analyze historical trends, and predict future movement. By integrating cutting-edge AI insights with a tactile, 3D deep-space design, we deliver clarity and speed that powers better-informed decisions.
        </p>
      </section>

      <section className="glass-panel p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-display font-bold">Technology Stack</h2>
        <ul className="space-y-4 text-on-surface-variant">
          <li className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#81ecff]"></div>
             <strong>Frontend:</strong> Next.js App Router, Tailwind CSS v4, Framer Motion & GSAP
          </li>
          <li className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#dd8bfb]"></div>
             <strong>Backend & Data:</strong> MongoDB Atlas, Next.js Edge APIs, Alpha Vantage Data
          </li>
          <li className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary-dim shadow-[0_0_8px_#00d4ec]"></div>
             <strong>AI Integration:</strong> Hugging Face Time-Series & NLP models
          </li>
        </ul>
      </section>

      <section className="mt-8 bg-surface-highest border border-[#9f0519]/40 p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#ff716c] to-[#9f0519]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-[#9f0519]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#ffa8a3] mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Comprehensive Legal Disclaimer
        </h2>
        
        <div className="space-y-6 text-on-surface-variant text-sm font-light leading-relaxed">
          <p>
            <strong className="text-on-surface">1. Informational Purposes Only:</strong> The materials, insights, and AI-predicted outcomes provided on the Stocker-Ai platform are intended strictly for educational and informational purposes. They do not constitute financial, investment, legal, or tax advice under any jurisdiction.
          </p>
          <p>
            <strong className="text-on-surface">2. Risk Acknowledgement:</strong> Trading in financial markets involves a high degree of risk. Past performance, whether real or simulated through machine learning, is not a reliable indicator of future results. The value of investments and the income from them can fall as well as rise. You may not get back the amount originally invested.
          </p>
          <p>
            <strong className="text-on-surface">3. AI Prediction Limitations:</strong> The predictive models featured on Stocker-Ai rely on historical data and probabilistic algorithms. These algorithms are subject to the inherent limitations of mathematical forecasting and cannot account for sudden market shocks, geopolitical events, global economic disruptions, or unforeseen corporate actions. 
          </p>
          <p>
            <strong className="text-on-surface">4. Absence of Liability:</strong> Under no circumstances shall Stocker-Ai, its developers, its affiliates, or its data providers be held liable for any direct, indirect, consequential, or incidental losses or damages (including but not limited to loss of capital, profits, or data) arising out of the use of, or inability to use, the insights provided by this platform. 
          </p>
          <p>
            <strong className="text-on-surface">5. Actionable Independence:</strong> All users are strongly urged to conduct their own independent research, verify pricing data with certified brokers, and consult with registered financial advisors prior to executing any trades based on information accessed on Stocker-Ai. 
          </p>
          <div className="w-full h-px bg-outline-variant/30 my-4" />
          <p className="text-xs uppercase tracking-widest text-[#ffa8a3]/80 font-semibold text-center mt-6">
            By proceeding to use this application, you explicitly agree to these terms and assume full responsibility for your financial decisions.
          </p>
        </div>
      </section>

    </main>
  );
}
