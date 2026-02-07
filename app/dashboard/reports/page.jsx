"use client";

import localFont from "next/font/local";
import { BarChart3 } from "lucide-react";
import { AppSidebar } from "../../../components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../../components/ui/sidebar";
import { Separator } from "../../../components/ui/separator";

const generalSans = localFont({
  src: "../../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
});

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={generalSans.className}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium text-foreground">Reports</h1>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white tracking-tighter mb-1">
              Reports
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Generate and view financial reports
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-sm">
            <div className="p-16 text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                Reports coming soon
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We&apos;re building powerful financial reporting tools to help you gain deeper insights into your finances.
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
