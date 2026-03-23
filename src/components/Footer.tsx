export default function Footer() {
  return (
    <footer className="mt-auto py-8 text-center border-t border-outline-variant/20 relative z-10 glass-panel border-x-0 border-b-0 rounded-none">
      <p className="text-sm text-on-surface-variant">
        &copy; {new Date().getFullYear()} Stocker-Ai Platform. All rights reserved. <br/>
        <span className="text-xs opacity-70 mt-2 block">Disclaimer: This platform provides automated insights and is not definitive financial advice.</span>
      </p>
    </footer>
  );
}
