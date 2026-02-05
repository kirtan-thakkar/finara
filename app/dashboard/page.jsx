"use client";
import { Outfit } from "next/font/google";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { faker } from '@faker-js/faker';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, CartesianGrid, YAxis, BarChart, Bar, LabelList } from 'recharts';
import { TrendingDown, TrendingUp, Menu, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { incomeExpenseData, categoryData, monthlyBalanceData } from '../../lib/dashboardData';
import Navbar from "./NavDas";
import Sidebar from "../../components/Sidebar";
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
    <div className="space-y-6" data-variant="outlined">
      <div>
        <h2 className="text-lg font-medium text-[--title-text-color] mb-1">
          Income vs Expenses
        </h2>
        <p className="text-sm text-[--body-text-color] mb-0 mt-1">
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
    <div className="space-y-6" data-variant="outlined">
      <div>
        <h2 className="text-lg font-medium text-[--title-text-color] mb-1">
          Expense Categories
        </h2>
        <p className="text-sm text-[--body-text-color] mb-0 mt-1">
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
    <div data-variant="outlined" className="w-full">
      <h2 className="text-lg font-medium text-[--title-text-color] mb-1">
        Financial Overview
      </h2>
      <p className="text-sm text-[--body-text-color] my-0">
        Your financial summary for this year
      </p>

      <div className="mt-6 grid gap-6 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        <div>
          <span className="text-xs text-[--caption-text-color]">Current Balance</span>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-2xl font-bold text-[--title-text-color]">${currentBalance.toLocaleString()}</span>
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <TrendingUp className="size-4 text-[--body-text-color]" />
              <p className="text-sm text-[--body-text-color] my-0">
                {balanceChange}%
              </p>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:pl-6 sm:pt-0">
          <span className="text-xs text-[--caption-text-color]">Total Income</span>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-2xl font-bold text-[--title-text-color]">${totalIncome.toLocaleString()}</span>
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <TrendingUp className="size-4 text-[--body-text-color]" />
              <p className="text-sm text-[--body-text-color] my-0">
                8.2%
              </p>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:hidden sm:pl-6 sm:pt-0 lg:block">
          <span className="text-xs text-[--caption-text-color]">Total Expenses</span>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-2xl font-bold text-[--title-text-color]">${totalExpenses.toLocaleString()}</span>
            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <TrendingDown className="size-4 text-[--body-text-color]" />
              <p className="text-sm text-[--body-text-color] my-0">
                3.1%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BalanceTrendChart() {
  return (
    <div className="space-y-6" data-variant="outlined">
      <div>
        <h2 className="text-lg font-medium text-[--title-text-color]">
          Balance Trend
        </h2>
        <p className="text-sm text-[--body-text-color] mb-0 mt-1">
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
    <div data-variant="outlined" className="overflow-x-auto lg:overflow-clip">
      <div className="sticky left-0 mb-6">
        <h2 className="text-lg font-medium text-[--title-text-color]">
          Recent Transactions
        </h2>
        <p className="text-sm text-[--body-text-color] mb-0 mt-1">
          Your latest financial activities
        </p>
      </div>
      <table className="min-w-max table-auto border-collapse space-y-1 sm:min-w-full">
        <thead>
          <tr className="text-sm text-[--title-text-color] *:bg-[--ui-soft-bg] *:p-3 *:text-left *:font-medium">
            <th className="rounded-l-[--card-radius]">Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th className="rounded-r-[--card-radius]">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              className="group items-center border-b text-sm text-[--body-text-color] *:p-3 hover:bg-gray-50 dark:hover:bg-gray-500/5"
              key={transaction.id}
            >
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {transaction.type}
                </span>
              </td>
              <td className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                ${Math.abs(transaction.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPage(){
    const containerRef = useRef(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
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
        <div className={outfit.className}>
            <Sidebar isCollapsed={sidebarCollapsed} />
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={containerRef}>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[--title-text-color] mb-2">Financial Dashboard</h1>
                            <p className="text-[--body-text-color]">Track your income, expenses, and financial goals</p>
                        </div>
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-[--ui-soft-bg] rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5 text-[--body-text-color]" />
                        </button>
                    </div>

                    <div className="dashboard-card mb-8">
                        <div className="bg-white dark:bg-gray-800 border border-[--ui-border-color] rounded-[--card-radius] p-6">
                            <FinancialOverview />
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2 mb-8">
                        <div className="dashboard-card">
                            <div className="bg-white dark:bg-gray-800 border border-[--ui-border-color] rounded-[--card-radius] p-6">
                                <IncomeExpenseChart />
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="bg-white dark:bg-gray-800 border border-[--ui-border-color] rounded-[--card-radius] p-6">
                                <ExpenseCategoryChart />
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card mb-8">
                        <div className="bg-white dark:bg-gray-800 border border-[--ui-border-color] rounded-[--card-radius] p-6">
                            <BalanceTrendChart />
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="bg-white dark:bg-gray-800 border border-[--ui-border-color] rounded-[--card-radius] p-6">
                            <TransactionsTable />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}