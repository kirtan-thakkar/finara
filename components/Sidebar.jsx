import { Home, CreditCard, TrendingUp, PieChart, Settings, User, LogOut, DollarSign, Receipt, BarChart3 } from 'lucide-react';

export default function Sidebar({ isCollapsed = false }) {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: CreditCard, label: 'Transactions', href: '/transactions', active: false },
    { icon: TrendingUp, label: 'Analytics', href: '/analytics', active: false },
    { icon: PieChart, label: 'Budget', href: '/budget', active: false },
    { icon: Receipt, label: 'Receipts', href: '/receipts', active: false },
    { icon: BarChart3, label: 'Reports', href: '/reports', active: false },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: LogOut, label: 'Logout', href: '/logout' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-[--ui-border-color] transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} z-40`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-[--ui-border-color]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold text-[--title-text-color]">FinanceTracker</span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-[--body-text-color] hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[--ui-border-color]">
          <ul className="space-y-2">
            {bottomItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-[--body-text-color] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
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