"use client";
import { Outfit } from "next/font/google";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect, useCallback } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, CartesianGrid, YAxis, BarChart, Bar } from 'recharts';
import { TrendingDown, TrendingUp, DollarSign, Loader2, Calendar } from 'lucide-react';
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";
import CustomTooltip from "../../components/CustomTooltip";

gsap.registerPlugin(ScrollTrigger);

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

const PRESET_OPTIONS = [
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "1year", label: "Last Year" },
  { value: "allTime", label: "All Time" },
];

function IncomeExpenseChart({ data }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-medium text-black dark:text-white tracking-tighter mb-1">
          Income vs Expenses
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Daily income and expense comparison
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
          <p className="text-sm text-slate-400">No chart data available</p>
        </div>
      ) : (
        <div data-shade="900" style={{ aspectRatio: '16/9' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <YAxis className="text-[--caption-text-color]" width={40} fontSize={12} tickLine={false} axisLine={false} />
              <XAxis height={12} className="text-[--caption-text-color]" dataKey="date" fontSize={12} tickLine={false} axisLine={false}
                tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth()+1}/${d.getDate()}`; }}
              />
              <Tooltip cursor={{ stroke: 'var(--ui-border-color)', strokeWidth: 1 }} content={<CustomTooltip />} />
              <CartesianGrid horizontal={false} stroke="currentColor" strokeDasharray={3} />
              <Area
                fill="currentColor"
                stroke="currentColor"
                fillOpacity={0.1}
                dataKey="income"
                name="Income"
                activeDot={{ color: 'var(--area-primary-stroke)', r: 3, stroke: 'white' }}
              />
              <Area
                fill="currentColor"
                stroke="currentColor"
                fillOpacity={0.05}
                dataKey="expenses"
                name="Expenses"
                activeDot={{ color: 'var(--area-accent-stroke)', r: 3, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ExpenseCategoryChart({ data }) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-medium text-black dark:text-white tracking-tighter mb-1">
          Top Expense Categories
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Where your money goes
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
          <p className="text-sm text-slate-400">No expense data available</p>
        </div>
      ) : (
        <div data-shade="900" style={{ aspectRatio: '16/9' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} className="text-[--caption-text-color]" />
              <YAxis type="category" dataKey="name" width={80} fontSize={12} tickLine={false} axisLine={false} className="text-[--caption-text-color]" />
              <CartesianGrid horizontal={false} stroke="currentColor" strokeDasharray={3} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function FinancialOverview({ analytics }) {
  const {
    availableBalance = 0,
    totalIncome = 0,
    totalExpense = 0,
    percentChange = {},
  } = analytics || {};

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-medium text-black dark:text-white tracking-tighter mb-1">
        Financial Overview
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Your financial summary
      </p>

      <div className="mt-6 grid gap-6 divide-y divide-slate-200 dark:divide-slate-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Available Balance</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-slate-800 dark:text-slate-100">
              ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            {percentChange.balance != null && (
              <div className={`flex items-center gap-1 ${percentChange.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                {percentChange.balance >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm font-medium">{Math.abs(percentChange.balance)}%</span>
              </div>
            )}
          </div>
        </div>
        <div className="pt-6 sm:pl-6 sm:pt-0">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Total Income</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-slate-800 dark:text-slate-100">
              ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            {percentChange.income != null && (
              <div className={`flex items-center gap-1 ${percentChange.income >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                {percentChange.income >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm font-medium">{Math.abs(percentChange.income)}%</span>
              </div>
            )}
          </div>
        </div>
        <div className="pt-6 sm:hidden sm:pl-6 sm:pt-0 lg:block">
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">Total Expenses</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-slate-800 dark:text-slate-100">
              ${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            {percentChange.expense != null && (
              <div className={`flex items-center gap-1 ${percentChange.expense >= 0 ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {percentChange.expense >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm font-medium">{Math.abs(percentChange.expense)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionsTable({ transactions, loading }) {
  return (
    <div className="overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-medium text-black dark:text-white tracking-tighter">
          Recent Transactions
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your latest financial activities
        </p>
      </div>
      {loading ? (
        <div className="py-8 text-center">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-slate-500">Loading...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Title</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((t) => (
                <tr
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  key={t._id}
                >
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-100">{t.title}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === 'INCOME' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {t.type === 'INCOME' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm font-medium text-right tabular-nums ${
                    t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage(){
    const containerRef = useRef(null);

    // State for API data
    const [preset, setPreset] = useState("30days");
    const [analytics, setAnalytics] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all dashboard data
    const fetchDashboardData = useCallback(async () => {
      setLoading(true);
      try {
        const [analyticsRes, chartRes, categoriesRes, txRes] = await Promise.all([
          fetch(`/api/analytics?preset=${preset}`),
          fetch(`/api/analytics/chart?preset=${preset}`),
          fetch(`/api/analytics/categories?preset=${preset}`),
          fetch("/api/transaction?pageSize=8&pageNumber=1"),
        ]);

        const [analyticsData, chartJson, categoriesJson, txData] = await Promise.all([
          analyticsRes.json(),
          chartRes.json(),
          categoriesRes.json(),
          txRes.json(),
        ]);

        if (analyticsData.success) setAnalytics(analyticsData.data);
        if (chartJson.success) setChartData(chartJson.data.chartData || []);
        if (categoriesJson.success) setCategoryData(categoriesJson.data.breakdown || []);
        if (txData.transactions) setRecentTransactions(txData.transactions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }, [preset]);

    useEffect(() => {
      fetchDashboardData();
    }, [fetchDashboardData]);
    
    useGSAP(() => {
        const cards = containerRef.current?.querySelectorAll('.dashboard-card');
        if (cards) {
            gsap.fromTo(cards, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }, { scope: containerRef });

    return(
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className={outfit.className}>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" ref={containerRef}>
                    <div className="mb-8 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white tracking-tighter mb-1">Overview</h2>
                            <p className="text-slate-500 dark:text-slate-400">Track your income, expenses, and financial goals</p>
                        </div>
                        <select
                          value={preset}
                          onChange={(e) => setPreset(e.target.value)}
                          className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors shrink-0"
                        >
                          {PRESET_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                    </div>

                    {loading && !analytics ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                        <span className="ml-3 text-sm text-slate-500">Loading dashboard...</span>
                      </div>
                    ) : (
                      <>
                        <div className="dashboard-card mb-8">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                                <FinancialOverview analytics={analytics} />
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2 mb-8">
                            <div className="dashboard-card">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                                    <IncomeExpenseChart data={chartData} />
                                </div>
                            </div>
                            <div className="dashboard-card">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                                    <ExpenseCategoryChart data={categoryData} />
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                                <TransactionsTable transactions={recentTransactions} loading={loading} />
                            </div>
                        </div>
                      </>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}