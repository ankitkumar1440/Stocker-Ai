'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketChartProps {
  symbol: string;
  range: '1D' | '1W' | '1M' | '1Y';
}

export default function MarketChart({ symbol, range }: MarketChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stocks/history?symbol=${encodeURIComponent(symbol)}&range=${range}`);
        const json = await res.json();
        if (mounted && json.data) {
          setData(json.data);
        }
      } catch (e) {
        console.error('Failed to load chart data', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => { mounted = false; };
  }, [symbol, range]);

  if (loading) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center">
         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(129,236,255,0.5)]"></div>
         <p className="text-secondary font-bold tracking-widest uppercase text-xs animate-pulse mt-4">Loading Chart Engine...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm">No historical data available</div>;
  }

  // Determine trend to color chart green (primary) or red (error)
  const isPositive = data[0]?.price <= data[data.length - 1]?.price;
  const strokeColor = isPositive ? '#00E5FF' : '#ff716c';
  const fillColor = isPositive ? 'url(#colorPositive)' : 'url(#colorNegative)';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff716c" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ff716c" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        {/* Hide axes for the sleek sparkline look, but keep them for tooling access */}
        <XAxis dataKey="time" hide />
        <YAxis domain={['auto', 'auto']} hide />
        
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
          labelStyle={{ color: '#8b949e', marginBottom: '4px' }}
          formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Price']}
        />
        
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke={strokeColor} 
          strokeWidth={3}
          fillOpacity={1} 
          fill={fillColor} 
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
