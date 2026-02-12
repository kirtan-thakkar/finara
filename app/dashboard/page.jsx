"use client";
import localFont from "next/font/local";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSession, signIn } from "next-auth/react";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  CartesianGrid,
  YAxis,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Loader2,
  Calendar,
} from "lucide-react";
import { AppSidebar } from "../../components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";
import CustomTooltip from "../../components/CustomTooltip";
import { ReactLenis } from "lenis/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const generalSans = localFont({
  src: "../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
});

const PRESET_OPTIONS = [
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "1year", label: "Last Year" },
  { value: "allTime", label: "All Time" },
];

function IncomeExpenseChart({ data }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl md:text-2xl font-medium text-black tracking-tighter mb-1">
          Income vs Expenses
        </h3>
        <p className="text-sm font-medium text-black/50">
          Daily income and expense comparison
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-black">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
        </span>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-slate-400">No chart data available</p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                width={45}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) =>
                  val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#incomeGradient)"
                activeDot={{
                  r: 4,
                  fill: "#10b981",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#expenseGradient)"
                activeDot={{
                  r: 4,
                  fill: "#f43f5e",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ExpenseCategoryChart({ data }) {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl md:text-2xl font-medium text-black tracking-tighter mb-1">
          Top Expense Categories
        </h3>
        <p className="text-sm font-medium text-black/50">
          Where your money goes
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-slate-400">No expense data available</p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                horizontal={false}
              />
              <XAxis
                type="number"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(val) =>
                  val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={85}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar
                dataKey="value"
                name="Amount"
                radius={[0, 6, 6, 0]}
                barSize={28}
              >
                {" "}
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>{" "}
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
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-0">
        <div className="py-4 sm:py-0 sm:pr-6">
          <p className="text-xs font-medium text-black/50 uppercase tracking-wide">
            Available Balance
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-black">
              $
              {availableBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            {percentChange.balance != null && (
              <div
                className={`flex items-center gap-1 ${percentChange.balance >= 0 ? "text-emerald-600" : "text-red-500"}`}
              >
                {percentChange.balance >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(percentChange.balance)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-slate-200 py-4 sm:py-0 sm:px-6">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
            Total Income
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-black">
              $
              {totalIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            {percentChange.income != null && (
              <div
                className={`flex items-center gap-1 ${percentChange.income >= 0 ? "text-emerald-600" : "text-red-500"}`}
              >
                {percentChange.income >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(percentChange.income)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-slate-200 py-4 sm:py-0 sm:pl-6">
          <p className="text-xs font-medium text-rose-600 uppercase tracking-wide">
            Total Expenses
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-black">
              $
              {totalExpense.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            {percentChange.expense != null && (
              <div
                className={`flex items-center gap-1 ${percentChange.expense >= 0 ? "text-red-500" : "text-emerald-600"}`}
              >
                {percentChange.expense >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(percentChange.expense)}%
                </span>
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
        <h3 className="text-xl md:text-2xl font-medium text-black tracking-tighter">
          Recent Transactions
        </h3>
        <p className="text-sm font-medium text-black/50">
          Your latest financial activities
        </p>
      </div>
      {loading ? (
        <div className="py-8 text-center">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mx-auto" />
          <p className="mt-2 text-sm font-medium text-black/50">Loading...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-black/40">
            No transactions yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">
                  Type
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr className="hover:bg-slate-50 transition-colors" key={t._id}>
                  <td className="py-3 px-4 text-sm font-medium text-black/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-black/30" />
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-black">
                    {t.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-black/70">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        t.type === "INCOME"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.type === "INCOME" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-sm font-medium text-right tabular-nums ${
                      t.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}$
                    {t.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
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

export default function DashboardPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

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

      const [analyticsData, chartJson, categoriesJson, txData] =
        await Promise.all([
          analyticsRes.json(),
          chartRes.json(),
          categoriesRes.json(),
          txRes.json(),
        ]);

      if (analyticsData.success) setAnalytics(analyticsData.data);
      if (chartJson.success) setChartData(chartJson.data.chartData || []);
      if (categoriesJson.success)
        setCategoryData(categoriesJson.data.breakdown || []);
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

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".dashboard-card");
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    },
    { scope: containerRef },
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <ReactLenis root>
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={generalSans.className}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full"
          ref={containerRef}
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tighter mb-1">
                Overview
              </h2>
              <p className="font-medium text-black/50">
                Track your income, expenses, and financial goals
              </p>
            </div>
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger className="min-w-[180px] bg-slate-50 border-slate-200 text-black">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && !analytics ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              <span className="ml-3 text-sm font-medium text-black/50">
                Loading dashboard...
              </span>
            </div>
          ) : (
            <>
              <div className="dashboard-card mb-8">
                <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
                  <FinancialOverview analytics={analytics} />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 mb-8">
                <div className="dashboard-card">
                  <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
                    <IncomeExpenseChart data={chartData} />
                  </div>
                </div>
                <div className="dashboard-card">
                  <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
                    <ExpenseCategoryChart data={categoryData} />
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
                  <TransactionsTable
                    transactions={recentTransactions}
                    loading={loading}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </SidebarInset>
      </SidebarProvider>
    </ReactLenis>
  );
}
