"use client";
import { Outfit } from "next/font/google";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { faker } from '@faker-js/faker';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, CartesianGrid, YAxis, BarChart, Bar, LabelList } from 'recharts';
import { TrendingDown, TrendingUp, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { incomeExpenseData, categoryData, monthlyBalanceData } from '../../lib/dashboardData';
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";
import CustomTooltip from "../../components/CustomTooltip";

gsap.registerPlugin(ScrollTrigger);

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

const transactions = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  description: faker.commerce.productName(),
  category: faker.helpers.arrayElement(['Food', 'Transport', 'Entertainment', 'Healthcare', 'Shopping']),
  date: faker.date.past().toLocaleDateString('en-US'),
  amount: faker.finance.amount(-1000, 500, 2),
  type: Math.random() > 0.3 ? 'expense' : 'income',
}));

function getInitials(name) {
  const parts = name.split(' ');
  let initials = '';
  for (let i = 0; i < Math.min(2, parts.length); i++) {
    if (parts[i].length > 0 && parts[i] !== '') {
      initials += parts[i][0];
    }
  }
  return initials.toUpperCase();
}

function IncomeExpenseChart() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tighter mb-1">
          Income vs Expenses
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly income and expense comparison
        </p>
      </div>
      <div data-shade="900" style={{ aspectRatio: '16/9' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={incomeExpenseData}>
            <YAxis className="text-[--caption-text-color]" width={40} fontSize={12} tickLine={false} axisLine={false} />
            <XAxis height={12} className="text-[--caption-text-color]" dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ stroke: 'var(--ui-border-color)', strokeWidth: 1 }} content={<CustomTooltip />} />
            <CartesianGrid horizontal={false} stroke="currentColor" strokeDasharray={3} />
            <Area
              fill="currentColor"
              stroke="currentColor"
              fillOpacity={0.1}
              dataKey="Income"
              activeDot={{
                color: 'var(--area-primary-stroke)',
                r: 3,
                stroke: 'white',
              }}
            />
            <Area
              fill="currentColor"
              stroke="currentColor"
              fillOpacity={0.05}
              dataKey="Expenses"
              activeDot={{
                color: 'var(--area-accent-stroke)',
                r: 3,
                stroke: 'white',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ExpenseCategoryChart() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tighter mb-1">
          Expense Categories
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly breakdown by category
        </p>
      </div>
      <div data-shade="900" style={{ aspectRatio: '16/9' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <YAxis className="text-[--caption-text-color]" width={34} fontSize={12} tickLine={false} axisLine={false} />
            <XAxis className="text-[--caption-text-color]" height={12} dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid vertical={false} stroke="currentColor" strokeDasharray={3} />
            <Tooltip content={<CustomTooltip />} />
            <Bar radius={[4, 4, 0, 0]} fill="currentColor" dataKey="Food" stackId="a" />
            <Bar radius={[0, 0, 0, 0]} fill="currentColor" dataKey="Transport" stackId="a" />
            <Bar radius={[0, 0, 0, 0]} fill="currentColor" dataKey="Entertainment" stackId="a" />
            <Bar radius={[0, 0, 0, 0]} fill="currentColor" dataKey="Healthcare" stackId="a" />
            <Bar radius={[0, 0, 4, 4]} fill="currentColor" dataKey="Shopping" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FinancialOverview() {
  const currentBalance = monthlyBalanceData[monthlyBalanceData.length - 1].Balance;
  const previousBalance = monthlyBalanceData[monthlyBalanceData.length - 2].Balance;
  const balanceChange = ((currentBalance - previousBalance) / previousBalance * 100).toFixed(1);
  
  const totalIncome = incomeExpenseData.reduce((sum, month) => sum + month.Income, 0);
  const totalExpenses = incomeExpenseData.reduce((sum, month) => sum + month.Expenses, 0);
  
  return (
    <div className="w-full">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tighter mb-1">
        Financial Overview
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Your financial summary for this year
      </p>

      <div className="mt-6 grid gap-6 divide-y divide-slate-200 dark:divide-slate-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current Balance</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-slate-800 dark:text-slate-100">${currentBalance.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{balanceChange}%</span>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:pl-6 sm:pt-0">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Total Income</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-slate-800 dark:text-slate-100">${totalIncome.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">8.2%</span>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:hidden sm:pl-6 sm:pt-0 lg:block">
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">Total Expenses</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-medium text-slate-800 dark:text-slate-100">${totalExpenses.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">3.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BalanceTrendChart() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tighter">
          Balance Trend
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your account balance growth over time
        </p>
      </div>
      <div data-shade="900" style={{ aspectRatio: '16/9' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyBalanceData}>
            <YAxis className="text-[--caption-text-color]" width={40} fontSize={12} tickLine={false} axisLine={false} />
            <XAxis className="text-[--caption-text-color]" height={12} dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <CartesianGrid horizontal={false} stroke="currentColor" strokeDasharray={3} />
            <Area
              fill="currentColor"
              stroke="currentColor"
              fillOpacity={0.1}
              dataKey="Balance"
              activeDot={{
                color: 'var(--area-primary-stroke)',
                r: 3,
                stroke: 'white',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TransactionsTable() {
  return (
    <div className="overflow-hidden">
      <div className="mb-6">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tighter">
          Recent Transactions
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your latest financial activities
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((transaction, index) => (
              <tr
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                key={transaction.id}
              >
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{transaction.date}</td>
                <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-100">{transaction.description}</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{transaction.category}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={`py-3 px-4 text-sm font-medium text-right ${
                  transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  ${Math.abs(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DashboardPage(){
    const containerRef = useRef(null);
    
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
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tighter mb-1">Overview</h2>
                        <p className="text-slate-500 dark:text-slate-400">Track your income, expenses, and financial goals</p>
                    </div>

                    <div className="dashboard-card mb-8">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                            <FinancialOverview />
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2 mb-8">
                        <div className="dashboard-card">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                                <IncomeExpenseChart />
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                                <ExpenseCategoryChart />
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card mb-8">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                            <BalanceTrendChart />
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
                            <TransactionsTable />
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}