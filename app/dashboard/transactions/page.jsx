"use client";

import { Outfit } from "next/font/google";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  ArrowUpDown,
  PenLine,
  CreditCard,
  DollarSign,
  Calendar,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Copy,
  Pencil,
  ScanLine,
  Upload,
  MoreHorizontal,
  CheckSquare,
  Repeat,
} from "lucide-react";
import { AppSidebar } from "../../../components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../../components/ui/sidebar";
import { Separator } from "../../../components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../../../components/ui/sheet";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const CATEGORIES = [
  "Food", "Transport", "Entertainment", "Healthcare", "Shopping",
  "Salary", "Freelance", "Investment", "Utilities", "Education", "Other",
];
const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_PAYMENT", label: "Mobile Payment" },
  { value: "AUTO_DEBIT", label: "Auto Debit" },
  { value: "OTHER", label: "Other" },
];
const RECURRING_INTERVALS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const EMPTY_FORM = {
  title: "",
  type: "EXPENSE",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  description: "",
  paymentMethod: "CASH",
  isRecurring: false,
  recurringInterval: "",
};

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Data state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRecurring, setFilterRecurring] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Sheet state (create / edit)
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete / bulk delete state
  const [deleting, setDeleting] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Duplicate state
  const [duplicating, setDuplicating] = useState(null);

  // Scan receipt state
  const [scanSheetOpen, setScanSheetOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const receiptInputRef = useRef(null);

  // Row action dropdown
  const [openDropdown, setOpenDropdown] = useState(null);

  // Analytics state
  const [analytics, setAnalytics] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNumber: String(page),
        pageSize: String(pageSize),
      });
      if (searchQuery) params.set("keyword", searchQuery);
      if (filterType) params.set("type", filterType);
      if (filterRecurring) params.set("recurringStatus", filterRecurring);

      const res = await fetch(`/api/transaction?${params}`);
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || data.transactions.length);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, filterType, filterRecurring, router]);

  // Fetch analytics summary from /api/analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics?preset=allTime");
      if (res.status === 401) return;
      const data = await res.json();
      console.log("Analytics API response:", data);
      if (data.success && data.data) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);
  useEffect(() => { setPage(1); }, [searchQuery, filterType, filterRecurring]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const handler = () => setOpenDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openDropdown]);

  const refreshAll = () => { fetchTransactions(); fetchAnalytics(); setSelectedIds([]); };

  // ─── Create transaction ───
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const body = {
        title: formData.title,
        type: formData.type,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description || undefined,
        paymentMethod: formData.paymentMethod,
        isRecurring: formData.isRecurring,
        recurringInterval: formData.isRecurring ? formData.recurringInterval : undefined,
      };
      const res = await fetch("/api/transaction/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to create transaction"); return; }
      setSheetOpen(false);
      setFormData({ ...EMPTY_FORM });
      refreshAll();
    } catch { setFormError("Something went wrong. Please try again."); }
    finally { setSaving(false); }
  };

  // ─── Edit / Update transaction (PATCH) ───
  const openEditSheet = (t) => {
    setSheetMode("edit");
    setEditingId(t._id);
    setFormData({
      title: t.title || "",
      type: t.type || "EXPENSE",
      amount: String(t.amount || ""),
      category: t.category || "Food",
      date: t.date ? new Date(t.date).toISOString().split("T")[0] : "",
      description: t.description || "",
      paymentMethod: t.paymentMethod || "CASH",
      isRecurring: t.isRecurring || false,
      recurringInterval: t.recurringInterval || "",
    });
    setFormError("");
    setSheetOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const body = {
        title: formData.title,
        type: formData.type,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description || undefined,
        paymentMethod: formData.paymentMethod,
        isRecurring: formData.isRecurring,
        recurringInterval: formData.isRecurring ? formData.recurringInterval : undefined,
      };
      const res = await fetch(`/api/transaction/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to update transaction"); return; }
      setSheetOpen(false);
      setEditingId(null);
      refreshAll();
    } catch { setFormError("Something went wrong. Please try again."); }
    finally { setSaving(false); }
  };

  // ─── Delete single ───
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      if (res.ok) refreshAll();
    } catch (error) { console.error("Failed to delete:", error); }
    finally { setDeleting(null); }
  };

  // ─── Bulk delete ───
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/transaction/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionsIds: selectedIds }),
      });
      if (res.ok) refreshAll();
    } catch (error) { console.error("Bulk delete failed:", error); }
    finally { setBulkDeleting(false); }
  };

  // ─── Duplicate ───
  const handleDuplicate = async (id) => {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/transaction/${id}/duplicate`, { method: "POST" });
      if (res.ok) refreshAll();
    } catch (error) { console.error("Duplicate failed:", error); }
    finally { setDuplicating(null); }
  };

  // ─── Scan receipt ───
  const handleScanReceipt = async (file) => {
    setScanning(true);
    setScanError("");
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await fetch("/api/transaction/scan-receipt", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setScanError(data.message || "Failed to scan receipt");
        return;
      }
      // Pre-fill the create form with scanned data
      const s = data.data;
      setScanSheetOpen(false);
      setSheetMode("create");
      setFormData({
        title: s.title || "",
        type: s.type || "EXPENSE",
        amount: s.amount ? String(s.amount) : "",
        category: s.category || "Food",
        date: s.date ? new Date(s.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        description: s.description || "",
        paymentMethod: s.paymentMethod || "CASH",
        isRecurring: s.isRecurring || false,
        recurringInterval: s.recurringInterval || "",
      });
      setFormError("");
      setSheetOpen(true);
    } catch { setScanError("Something went wrong while scanning."); }
    finally { setScanning(false); }
  };

  // ─── Selection helpers ───
  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === sortedTransactions.length) setSelectedIds([]);
    else setSelectedIds(sortedTransactions.map((t) => t._id));
  };

  // ─── Sort ───
  const handleSort = (field) => {
    if (sortField === field) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDirection("desc"); }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let cmp = 0;
    if (sortField === "date") cmp = new Date(a.date) - new Date(b.date);
    else if (sortField === "amount") cmp = a.amount - b.amount;
    else if (sortField === "title") cmp = (a.title || "").localeCompare(b.title || "");
    return sortDirection === "asc" ? cmp : -cmp;
  });

  const totalIncome = analytics?.totalIncome ?? 0;
  const totalExpense = analytics?.totalExpense ?? 0;
  const netBalance = analytics?.availableBalance ?? (totalIncome - totalExpense);

  console.log("Render - analytics state:", analytics, "totalIncome:", totalIncome, "totalExpense:", totalExpense);

  const isFormSubmit = sheetMode === "edit" ? handleUpdate : handleCreate;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={outfit.className}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium text-foreground">Transactions</h1>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Page header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white tracking-tighter mb-1">Transactions</h2>
              <p className="text-slate-500 dark:text-slate-400">View and manage all your financial transactions</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setScanSheetOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ScanLine className="w-4 h-4" />
                <span className="hidden sm:inline">Scan Receipt</span>
              </button>
              <button
                onClick={() => { setSheetMode("create"); setFormData({ ...EMPTY_FORM }); setFormError(""); setEditingId(null); setSheetOpen(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-full transition-colors shadow-sm hover:bg-black/80 dark:hover:bg-white/90"
              >
                <PenLine className="w-4 h-4" />
                Add Transaction
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</p>
              </div>
              <p className="text-2xl font-semibold text-black dark:text-white tracking-tight">
                ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              {analytics?.percentChange?.income != null && (
                <p className={`text-xs mt-1 ${analytics.percentChange.income >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {analytics.percentChange.income >= 0 ? "+" : ""}{analytics.percentChange.income.toFixed(1)}% vs prev period
                </p>
              )}
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                  <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
              </div>
              <p className="text-2xl font-semibold text-black dark:text-white tracking-tight">
                ${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              {analytics?.percentChange?.expense != null && (
                <p className={`text-xs mt-1 ${analytics.percentChange.expense >= 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  {analytics.percentChange.expense >= 0 ? "+" : ""}{analytics.percentChange.expense.toFixed(1)}% vs prev period
                </p>
              )}
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Balance</p>
              </div>
              <p className={`text-2xl font-semibold tracking-tight ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {netBalance >= 0 ? "" : "-"}${Math.abs(netBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              {analytics?.savingRate?.percentage != null && (
                <p className="text-xs mt-1 text-slate-500">{analytics.savingRate.percentage.toFixed(1)}% saving rate</p>
              )}
            </div>
          </div>

          {/* Filters + Bulk actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-sm mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <select value={filterRecurring} onChange={(e) => setFilterRecurring(e.target.value)}
                className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                <option value="">All Frequency</option>
                <option value="RECURRING">Recurring</option>
                <option value="NON_RECURRING">One-time</option>
              </select>
            </div>
            {/* Bulk action bar */}
            {selectedIds.length > 0 && (
              <div className="px-4 pb-3 flex items-center gap-3">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{selectedIds.length} selected</p>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                >
                  {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete Selected
                </button>
                <button onClick={() => setSelectedIds([])}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Clear</button>
              </div>
            )}
          </div>

          {/* Transactions table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                <p className="mt-3 text-sm text-slate-500">Loading transactions...</p>
              </div>
            ) : sortedTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">No transactions found</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {totalCount === 0 ? "Start by adding your first transaction." : "Try adjusting your search or filters."}
                </p>
                {totalCount === 0 && (
                  <button onClick={() => { setSheetMode("create"); setFormData({ ...EMPTY_FORM }); setFormError(""); setSheetOpen(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" /> Add Transaction
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="w-10 py-3 px-3">
                        <input type="checkbox" checked={selectedIds.length === sortedTransactions.length && sortedTransactions.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      </th>
                      <th className="text-left py-3 px-4">
                        <button onClick={() => handleSort("date")} className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                          Date <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-4">
                        <button onClick={() => handleSort("title")} className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                          Title <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                      <th className="text-right py-3 px-4">
                        <button onClick={() => handleSort("amount")} className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-auto">
                          Amount <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sortedTransactions.map((t) => (
                      <tr key={t._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${selectedIds.includes(t._id) ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""}`}>
                        <td className="py-3.5 px-3">
                          <input type="checkbox" checked={selectedIds.includes(t._id)} onChange={() => toggleSelect(t._id)}
                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.title}</p>
                              {t.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">{t.description}</p>}
                            </div>
                            {t.isRecurring && <Repeat className="w-3.5 h-3.5 text-blue-500 shrink-0" title={`Recurring: ${t.recurringInterval}`} />}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{t.category}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            t.type === "INCOME" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                          }`}>{t.type === "INCOME" ? "Income" : "Expense"}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            t.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : t.status === "PENDING" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}>{t.status}</span>
                        </td>
                        <td className={`py-3.5 px-4 text-sm font-semibold text-right tabular-nums ${
                          t.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-2 relative">
                          <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === t._id ? null : t._id); }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openDropdown === t._id && (
                            <div className="absolute right-2 top-full z-20 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1"
                              onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => { openEditSheet(t); setOpenDropdown(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <Pencil className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button onClick={() => { handleDuplicate(t._id); setOpenDropdown(null); }}
                                disabled={duplicating === t._id}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
                                {duplicating === t._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />} Duplicate
                              </button>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                              <button onClick={() => { handleDelete(t._id); setOpenDropdown(null); }}
                                disabled={deleting === t._id}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                                {deleting === t._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages} ({totalCount} total)</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ─── Create / Edit Transaction Sheet ─── */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{sheetMode === "edit" ? "Edit Transaction" : "Add Transaction"}</SheetTitle>
              <SheetDescription>{sheetMode === "edit" ? "Update the transaction details." : "Create a new income or expense transaction."}</SheetDescription>
            </SheetHeader>

            <form onSubmit={isFormSubmit} className="flex flex-col gap-5 px-4 pb-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                  <X className="w-4 h-4 shrink-0" />{formError}
                </div>
              )}

              {/* Type toggle */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setFormData({ ...formData, type: "INCOME" })}
                    className={`py-2.5 text-sm font-medium rounded-lg border transition-colors ${formData.type === "INCOME"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"}`}>Income</button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                    className={`py-2.5 text-sm font-medium rounded-lg border transition-colors ${formData.type === "EXPENSE"
                      ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-900/20 dark:border-rose-700 dark:text-rose-400"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"}`}>Expense</button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Title *</label>
                <input id="title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Grocery shopping"
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input id="amount" type="number" required min="0.01" step="0.01" value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Category *</label>
                  <select id="category" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Date *</label>
                  <input id="date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label htmlFor="paymentMethod" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Payment Method</label>
                <select id="paymentMethod" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                  {PAYMENT_METHODS.map((pm) => <option key={pm.value} value={pm.value}>{pm.label}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Description</label>
                <textarea id="description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes..."
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none" />
              </div>

              {/* Recurring toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked, recurringInterval: e.target.checked ? "MONTHLY" : "" })}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recurring transaction</span>
                </label>
                {formData.isRecurring && (
                  <select value={formData.recurringInterval} onChange={(e) => setFormData({ ...formData, recurringInterval: e.target.value })}
                    className="mt-2 w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                    {RECURRING_INTERVALS.map((ri) => <option key={ri.value} value={ri.value}>{ri.label}</option>)}
                  </select>
                )}
              </div>

              <SheetFooter className="px-0 pt-2">
                <SheetClose asChild>
                  <button type="button" className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                </SheetClose>
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? (sheetMode === "edit" ? "Saving..." : "Creating...") : (sheetMode === "edit" ? "Save Changes" : "Create Transaction")}
                </button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* ─── Scan Receipt Sheet ─── */}
        <Sheet open={scanSheetOpen} onOpenChange={setScanSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Scan Receipt</SheetTitle>
              <SheetDescription>Upload a receipt image and our AI will extract the transaction details automatically.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4 mt-4">
              {scanError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg mb-4">
                  <X className="w-4 h-4 shrink-0" />{scanError}
                </div>
              )}
              <div
                onClick={() => !scanning && receiptInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/10 transition-colors"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Scanning receipt...</p>
                    <p className="text-xs text-slate-500 mt-1">AI is extracting transaction details</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload receipt</p>
                    <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WebP — max 5MB</p>
                  </>
                )}
              </div>
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleScanReceipt(file);
                  e.target.value = "";
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  );
}
