import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import api from '../../utils/api';

export default function AnalyticsChart() {
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get('/analytics/performance');
        setPerformanceData(res.data);
      } catch (err) {
        console.error("Chart fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 bg-white h-full flex flex-col shadow-xs">
      <h3 className="text-lg font-display font-bold text-black mb-6">Performance Trend</h3>
      <div className="flex-1 w-full min-h-[200px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', background: '#FFFFFF' }}
                itemStyle={{ color: '#000000', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="score" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
