import {
  Home,
  CreditCard,
  TrendingUp,
  Settings,
  User,
  LogOut,
  DollarSign,
  Receipt,
  BarChart3,
} from "lucide-react";

export default function Sidebar({ isCollapsed = false }) {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    {
      icon: CreditCard,
      label: "Transactions",
      href: "/transactions",
      active: false,
    },
    { icon: TrendingUp, label: "Analytics", href: "/analytics", active: false },
    { icon: Receipt, label: "Receipts", href: "/receipts", active: false },
    { icon: BarChart3, label: "Reports", href: "/reports", active: false },
  ];

  const bottomItems = [
    { icon: LogOut, label: "Logout", href: "/logout" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-700/50 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} z-40`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-medium text-slate-800 dark:text-slate-100">
                FinanceTracker
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      item.active
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/50">
          <ul className="space-y-1">
            {bottomItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}