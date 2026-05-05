/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  RefreshCcw, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnalyticsData {
  kpis: {
    total_spend: number;
    total_income: number;
    savings: number;
    savings_rate: number;
  };
  monthly_trend: { month: string; amount: number }[];
  monthly_spend: { month: string; amount: number }[];
  category_dist: { category: string; amount: number }[];
  recent_transactions: {
    tx_date: string;
    description: string;
    amount: number;
    category: string;
    account: string;
  }[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function App() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        setData(null);
      } else {
        setData(json);
        setError(null);
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const initDemo = async () => {
    setInitializing(true);
    try {
      await fetch('/api/init', { method: 'POST' });
      await fetchAnalytics();
    } catch (err) {
      setError('Failed to initialize demo data.');
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">FinTrack.py</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            label="Dashboard" 
            icon={<Activity className="w-4 h-4" />} 
          />
          <SidebarLink 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')} 
            label="Transactions" 
            icon={<RefreshCcw className="w-4 h-4" />} 
          />
        </nav>

        <div className="mt-auto p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Project Mode</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs text-slate-400 italic">Synthetic Data Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 flex flex-col custom-scrollbar">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h2>
            <p className="text-slate-500 text-sm">Aggregated insights from manual entries and CSV imports</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={initDemo}
              disabled={initializing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {initializing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Import CSV
            </button>
            <button 
              onClick={fetchAnalytics}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-800 rounded-lg transition-colors"
            >
              <RefreshCcw className={cn("w-4 h-4 text-slate-400", loading && "animate-spin")} />
            </button>
          </div>
        </header>

        {loading && !data && (
          <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
            <Activity className="w-12 h-12 text-slate-800 mb-4" />
            <p className="text-slate-600 font-medium">Analyzing transaction patterns...</p>
          </div>
        )}

        {error && !initializing && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center">
            <p className="text-rose-400 font-medium mb-6">{error}</p>
            <button 
              onClick={initDemo}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
            >
              Initialize Engine
            </button>
          </div>
        )}

        {data && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="dashboard-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Net Savings" 
                  value={`$${data.kpis.savings.toLocaleString()}`} 
                  icon={<TrendingUp className="text-emerald-400 w-5 h-5" />}
                  detail={`Rate: ${data.kpis.savings_rate.toFixed(1)}%`}
                  accent="emerald"
                />
                <StatCard 
                  title="Total Spending" 
                  value={`$${data.kpis.total_spend.toLocaleString()}`} 
                  icon={<TrendingDown className="text-rose-400 w-5 h-5" />}
                  detail="Current Period"
                  accent="rose"
                />
                <StatCard 
                  title="Total Income" 
                  value={`$${data.kpis.total_income.toLocaleString()}`} 
                  icon={<ArrowUpRight className="text-blue-400 w-5 h-5" />}
                  detail="Steady Flow"
                  accent="blue"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Trend Chart */}
                <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                  <h4 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] text-slate-500">Monthly Spending Trend</h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.monthly_spend}>
                        <defs>
                          <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
                          itemStyle={{ color: '#10b981', fontWeight: 700 }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEmerald)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Allocation */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                  <h4 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] text-slate-500">Spending by Category</h4>
                  <div className="space-y-6">
                    {data.category_dist.slice(0, 5).map((item, idx) => {
                      const percentage = (item.amount / data.kpis.total_spend) * 100;
                      return (
                        <div key={item.category}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400 font-medium">{item.category}</span>
                            <span className="text-slate-200 font-mono font-bold">${item.amount.toLocaleString()} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-emerald-500/80 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/10">
                  <h4 className="text-sm font-bold text-slate-200">Recent Activity</h4>
                  <button className="text-xs text-emerald-400 font-bold hover:underline">Export as XLSX</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Description</th>
                        <th className="px-8 py-4">Category</th>
                        <th className="px-8 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {data.recent_transactions.map((tx, idx) => (
                        <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                          <td className="px-8 py-4 text-slate-400 font-mono text-xs">{tx.tx_date}</td>
                          <td className="px-8 py-4 font-semibold text-slate-100">{tx.description}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold tracking-wider">
                              {tx.category}
                            </span>
                          </td>
                          <td className={cn(
                            "px-8 py-4 text-right font-mono font-bold",
                            tx.amount < 0 ? "text-rose-400" : "text-emerald-400"
                          )}>
                            {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function SidebarLink({ active, label, icon, onClick }: { active: boolean, label: string, icon: ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-slate-800/50 text-emerald-400 border border-slate-700/50" 
          : "text-slate-400 hover:text-white hover:bg-slate-800/30"
      )}
    >
      {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
      <span className={cn("text-sm font-medium", !active && "ml-4")}>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, detail, accent }: { title: string, value: string, icon: ReactNode, detail: string, accent: string }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <div className="p-2 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-black text-white tracking-tight mb-2">{value}</h3>
      <p className="text-xs text-slate-500 font-medium">{detail}</p>
    </div>
  );
}

