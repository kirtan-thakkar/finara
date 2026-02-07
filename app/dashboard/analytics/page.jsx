"use client";
import localFont from "next/font/local";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Loader2,
  ReceiptText,
  Percent,
} from "lucide-react";
import { AppSidebar } from "../../../components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../../components/ui/sidebar";
import { Separator } from "../../../components/ui/separator";
import CustomTooltip from "../../../components/CustomTooltip";

gsap.registerPlugin(ScrollTrigger);

const generalSans = localFont({
  src: "../../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
});

const PRESET_OPTIONS = [
  { value: "30days", label: "Last 30 Days" },
  { value: "lastMonth", label: "Last Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "1year", label: "Last Year" },
  { value: "allTime", label: "All Time" },
];

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon, change, changeLabel, color = "black", prefix = "$" }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-black/50 uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          color === "emerald" ? "bg-emerald-50 text-emerald-600" :
          color === "rose" ? "bg-rose-50 text-rose-600" :
          color === "blue" ? "bg-blue-50 text-blue-600" :
          "bg-slate-100 text-black/60"
        }`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-medium text-black tabular-nums">
          {prefix}{typeof value === "number" ? value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
        </p>
        {change != null && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change)}%
            </span>
            {changeLabel && <span className="text-xs text-black/40">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Income vs Expenses Area Chart ─── */
function IncomeExpenseAreaChart({ data }) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-medium text-black">Income vs Expenses</h3>
        <Activity className="w-4 h-4 text-black/30" />
      </div>
      <p className="text-sm text-black/50 mb-5">Daily comparison over time</p>
      <div className="flex items-center gap-4 text-xs font-medium text-black mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
        </span>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-sm text-black/30">No data available</p>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="aIncGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
              <YAxis width={45} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2}
                fill="url(#aIncGrad)" activeDot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2}
                fill="url(#aExpGrad)" activeDot={{ r: 4, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─── Category Pie Chart ─── */
function CategoryPieChart({ data, totalSpent }) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-medium text-black">Spending Breakdown</h3>
        <PieChartIcon className="w-4 h-4 text-black/30" />
      </div>
      <p className="text-sm text-black/50 mb-5">Expense distribution by category</p>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-sm text-black/30">No expenses yet</p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="h-[220px] w-[220px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90} paddingAngle={3} strokeWidth={0}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-sm font-medium text-black">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-black tabular-nums">${cat.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
                  <span className="text-xs text-black/40 ml-1.5">{cat.percentage}%</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-black/50">Total</span>
              <span className="text-sm font-medium text-black tabular-nums">${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Top Categories Bar Chart ─── */
function CategoryBarChart({ data }) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-medium text-black">Top Categories</h3>
        <BarChart3 className="w-4 h-4 text-black/30" />
      </div>
      <p className="text-sm text-black/50 mb-5">Highest spending categories</p>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-sm text-black/30">No data available</p>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`} />
              <YAxis type="category" dataKey="name" width={85} fontSize={11}
                tickLine={false} axisLine={false} tick={{ fill: "#64748b" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="value" name="Amount" radius={[0, 6, 6, 0]} barSize={28}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─── Cumulative Savings Line Chart ─── */
function SavingsLineChart({ data }) {
  const cumulative = useMemo(() => {
    let running = 0;
    return data.map((d) => {
      running += (d.income || 0) - (d.expenses || 0);
      return { date: d.date, savings: running };
    });
  }, [data]);

  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-medium text-black">Cumulative Savings</h3>
        <PiggyBank className="w-4 h-4 text-black/30" />
      </div>
      <p className="text-sm text-black/50 mb-5">Net savings growth over time</p>
      {cumulative.length === 0 ? (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-sm text-black/30">No data available</p>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulative} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
              <YAxis width={45} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="savings" name="Net Savings" stroke="#3b82f6" strokeWidth={2}
                fill="url(#savingsGrad)" activeDot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─── Daily Net Flow Bar Chart ─── */
function DailyNetFlowChart({ data }) {
  const netFlow = useMemo(() => {
    return data.map((d) => ({
      date: d.date,
      net: (d.income || 0) - (d.expenses || 0),
    }));
  }, [data]);

  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-medium text-black">Daily Net Cash Flow</h3>
        <Activity className="w-4 h-4 text-black/30" />
      </div>
      <p className="text-sm text-black/50 mb-5">Income minus expenses per day</p>
      <div className="flex items-center gap-4 text-xs font-medium text-black mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative
        </span>
      </div>
      {netFlow.length === 0 ? (
        <div className="flex items-center justify-center h-[250px]">
          <p className="text-sm text-black/30">No data available</p>
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={netFlow} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
              <YAxis width={45} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="net" name="Net Flow" radius={[4, 4, 0, 0]} barSize={16}>
                {netFlow.map((entry, i) => (
                  <Cell key={i} fill={entry.net >= 0 ? "#10b981" : "#f43f5e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─── Previous Period Comparison ─── */
function PeriodComparison({ analytics }) {
  const { percentChange = {}, totalIncome = 0, totalExpense = 0 } = analytics || {};
  const prev = percentChange.previousValues || {};
  const rows = [
    { label: "Income", current: totalIncome, previous: prev.incomeAmount || 0, change: percentChange.income, color: "emerald" },
    { label: "Expenses", current: totalExpense, previous: prev.expenseAmount || 0, change: percentChange.expense, color: "rose", invertColor: true },
    { label: "Net Balance", current: totalIncome - totalExpense, previous: prev.balanceAmount || 0, change: percentChange.balance, color: "blue" },
  ];

  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-medium text-black">Period Comparison</h3>
        <TrendingUp className="w-4 h-4 text-black/30" />
      </div>
      <p className="text-sm text-black/50 mb-5">Current vs previous period performance</p>
      <div className="space-y-4">
        {rows.map((row) => {
          const isUp = row.change >= 0;
          const changeColor = row.invertColor
            ? (isUp ? "text-red-500" : "text-emerald-600")
            : (isUp ? "text-emerald-600" : "text-red-500");
          return (
            <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-black">{row.label}</p>
                <p className="text-xs text-black/40 mt-0.5">Previous: ${row.previous.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-medium text-black tabular-nums">${row.current.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                {row.change != null && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${changeColor}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(row.change)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─══════════ MAIN PAGE ══════════─ */
export default function AnalyticsPage() {
  const containerRef = useRef(null);
  const [preset, setPreset] = useState("30days");
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, cRes, chRes] = await Promise.all([
        fetch(`/api/analytics?preset=${preset}`),
        fetch(`/api/analytics/categories?preset=${preset}`),
        fetch(`/api/analytics/chart?preset=${preset}`),
      ]);
      const [aJson, cJson, chJson] = await Promise.all([aRes.json(), cRes.json(), chRes.json()]);

      if (aJson.success) setAnalytics(aJson.data);
      if (cJson.success) {
        setCategoryData(cJson.data.breakdown || []);
        setTotalSpent(cJson.data.totalSpent || 0);
      }
      if (chJson.success) setChartData(chJson.data.chartData || []);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [preset]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll(".a-card");
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    }
  }, { scope: containerRef });

  const { 
    availableBalance = 0, totalIncome = 0, totalExpense = 0,
    savingRate = {}, transactionCount = 0, percentChange = {}
  } = analytics || {};

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={generalSans.className}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" ref={containerRef}>
          {/* Page header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tighter mb-1">Analytics</h2>
              <p className="font-medium text-black/50">Deep dive into your financial performance</p>
            </div>
            <select value={preset} onChange={(e) => setPreset(e.target.value)}
              className="px-3 py-2 text-sm font-medium text-black bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-colors shrink-0">
              {PRESET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {loading && !analytics ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-black/30 animate-spin" />
              <span className="ml-3 text-sm font-medium text-black/50">Loading analytics...</span>
            </div>
          ) : (
            <>
              {/* ── Stat cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="a-card">
                  <StatCard label="Available Balance" value={availableBalance} icon={Wallet} color="blue"
                    change={percentChange.balance} changeLabel="vs prev period" />
                </div>
                <div className="a-card">
                  <StatCard label="Total Income" value={totalIncome} icon={TrendingUp} color="emerald"
                    change={percentChange.income} changeLabel="vs prev period" />
                </div>
                <div className="a-card">
                  <StatCard label="Total Expenses" value={totalExpense} icon={TrendingDown} color="rose"
                    change={percentChange.expense} changeLabel="vs prev period" />
                </div>
                <div className="a-card">
                  <StatCard label="Saving Rate" value={savingRate.percentage ?? 0} icon={PiggyBank} color="black" prefix=""
                    change={null} changeLabel="" />
                  <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ReceiptText className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-medium text-black/50 uppercase tracking-wide">Transactions</span>
                    </div>
                    <span className="text-lg font-medium text-black tabular-nums">{transactionCount}</span>
                  </div>
                </div>
              </div>

              {/* ── Row 1: Area chart + Pie ── */}
              <div className="grid gap-6 lg:grid-cols-5 mb-6">
                <div className="lg:col-span-3 a-card">
                  <IncomeExpenseAreaChart data={chartData} />
                </div>
                <div className="lg:col-span-2 a-card">
                  <CategoryPieChart data={categoryData} totalSpent={totalSpent} />
                </div>
              </div>

              {/* ── Row 2: Savings line + Category bar ── */}
              <div className="grid gap-6 lg:grid-cols-2 mb-6">
                <div className="a-card">
                  <SavingsLineChart data={chartData} />
                </div>
                <div className="a-card">
                  <CategoryBarChart data={categoryData} />
                </div>
              </div>

              {/* ── Row 3: Daily net flow + Period comparison ── */}
              <div className="grid gap-6 lg:grid-cols-5 mb-6">
                <div className="lg:col-span-3 a-card">
                  <DailyNetFlowChart data={chartData} />
                </div>
                <div className="lg:col-span-2 a-card">
                  <PeriodComparison analytics={analytics} />
                </div>
              </div>

              {/* ── Expense ratio gauge ── */}
              <div className="a-card">
                <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-medium text-black">Financial Health</h3>
                    <Percent className="w-4 h-4 text-black/30" />
                  </div>
                  <p className="text-sm text-black/50 mb-6">Key financial ratios at a glance</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Savings Rate */}
                    <div>
                      <p className="text-xs font-medium text-black/50 uppercase tracking-wide mb-2">Savings Rate</p>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(0, Math.min(100, savingRate.percentage || 0))}%` }} />
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-black tabular-nums">{(savingRate.percentage ?? 0).toFixed(1)}%</p>
                      <p className="text-xs text-black/40">of income saved</p>
                    </div>
                    {/* Expense Ratio */}
                    <div>
                      <p className="text-xs font-medium text-black/50 uppercase tracking-wide mb-2">Expense Ratio</p>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(0, Math.min(100, savingRate.expenseRatio || 0))}%` }} />
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-black tabular-nums">{(savingRate.expenseRatio ?? 0).toFixed(1)}%</p>
                      <p className="text-xs text-black/40">of income spent</p>
                    </div>
                    {/* Net Balance */}
                    <div>
                      <p className="text-xs font-medium text-black/50 uppercase tracking-wide mb-2">Net Position</p>
                      <p className={`text-2xl font-medium tabular-nums ${availableBalance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {availableBalance >= 0 ? "+" : "-"}${Math.abs(availableBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-black/40 mt-0.5">{availableBalance >= 0 ? "You're in the green" : "Spending exceeds income"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
