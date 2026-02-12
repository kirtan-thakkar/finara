"use client";
import localFont from "next/font/local";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Switch } from "../../../components/ui/switch";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../../components/ui/dropdown-menu";
import { ReactLenis, useLenis } from "lenis/react";

const generalSans = localFont({
  src: "../../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
});

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Salary",
  "Freelance",
  "Investment",
  "Utilities",
  "Education",
  "Other",
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
  const router = useRouter();
  const { data: session, status } = useSession();
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
  const [sheetMode, setSheetMode] = useState("create");
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
  const [analytics, setAnalytics] = useState(null);
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
      if (res.status === 401) {
        router.push("/login");
        return;
      }
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

  // Fetch analytics summary
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics?preset=allTime");
      if (res.status === 401) return;
      const data = await res.json();
      if (data.success && data.data) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, filterRecurring]);

  const refreshAll = () => {
    fetchTransactions();
    fetchAnalytics();
    setSelectedIds([]);
  };

  // --- Create transaction ---
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
        recurringInterval: formData.isRecurring
          ? formData.recurringInterval
          : undefined,
      };
      const res = await fetch("/api/transaction/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Failed to create transaction");
        return;
      }
      setSheetOpen(false);
      setFormData({ ...EMPTY_FORM });
      refreshAll();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // --- Edit / Update transaction (PATCH) ---
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
        recurringInterval: formData.isRecurring
          ? formData.recurringInterval
          : undefined,
      };
      const res = await fetch(`/api/transaction/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Failed to update transaction");
        return;
      }
      setSheetOpen(false);
      setEditingId(null);
      refreshAll();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // --- Delete single ---
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      if (res.ok) refreshAll();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleting(null);
    }
  };

  // --- Bulk delete ---
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
    } catch (error) {
      console.error("Bulk delete failed:", error);
    } finally {
      setBulkDeleting(false);
    }
  };

  // --- Duplicate ---
  const handleDuplicate = async (id) => {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/transaction/${id}/duplicate`, {
        method: "POST",
      });
      if (res.ok) refreshAll();
    } catch (error) {
      console.error("Duplicate failed:", error);
    } finally {
      setDuplicating(null);
    }
  };

  // --- Scan receipt ---
  const handleScanReceipt = async (file) => {
    setScanning(true);
    setScanError("");
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await fetch("/api/transaction/scan-receipt", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setScanError(data.message || "Failed to scan receipt");
        return;
      }
      const s = data.data;
      setScanSheetOpen(false);
      setSheetMode("create");
      setFormData({
        title: s.title || "",
        type: s.type || "EXPENSE",
        amount: s.amount ? String(s.amount) : "",
        category: s.category || "Food",
        date: s.date
          ? new Date(s.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: s.description || "",
        paymentMethod: s.paymentMethod || "CASH",
        isRecurring: s.isRecurring || false,
        recurringInterval: s.recurringInterval || "",
      });
      setFormError("");
      setSheetOpen(true);
    } catch {
      setScanError("Something went wrong while scanning.");
    } finally {
      setScanning(false);
    }
  };

  // --- Selection helpers ---
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === sortedTransactions.length) setSelectedIds([]);
    else setSelectedIds(sortedTransactions.map((t) => t._id));
  };

  // --- Sort ---
  const handleSort = (field) => {
    if (sortField === field)
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let cmp = 0;
    if (sortField === "date") cmp = new Date(a.date) - new Date(b.date);
    else if (sortField === "amount") cmp = a.amount - b.amount;
    else if (sortField === "title")
      cmp = (a.title || "").localeCompare(b.title || "");
    return sortDirection === "asc" ? cmp : -cmp;
  });

  const totalIncome = analytics?.totalIncome ?? 0;
  const totalExpense = analytics?.totalExpense ?? 0;
  const netBalance = analytics?.availableBalance ?? totalIncome - totalExpense;

  const isFormSubmit = sheetMode === "edit" ? handleUpdate : handleCreate;

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
      {" "}
      <SidebarProvider>
        {" "}
        <AppSidebar />
        <SidebarInset className={generalSans.className}>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-medium text-foreground">
              Transactions
            </h1>{" "}
          </header>{" "}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {" "}
            {/* Page header */}{" "}
            <div className="mb-8 flex items-start justify-between gap-4">
              {" "}
              <div>
                {" "}
                <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white tracking-tighter mb-1">
                  Transactions
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  View and manage all your financial transactions
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setScanSheetOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg"
                >
                  <ScanLine className="w-4 h-4" />
                  <span className="hidden sm:inline">Scan Receipt</span>
                </Button>
                <Button
                  onClick={() => {
                    setSheetMode("create");
                    setFormData({ ...EMPTY_FORM });
                    setFormError("");
                    setEditingId(null);
                    setSheetOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-sm"
                >
                  <PenLine className="w-4 h-4" />
                  Add Transaction
                </Button>
              </div>
            </div>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm p-0 gap-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Total Income
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-black dark:text-white tracking-tight">
                    $
                    {totalIncome.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {analytics?.percentChange?.income != null && (
                    <p
                      className={`text-xs mt-1 ${analytics.percentChange.income >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {analytics.percentChange.income >= 0 ? "+" : ""}
                      {analytics.percentChange.income.toFixed(1)}% vs prev
                      period
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm p-0 gap-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                      <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Total Expenses
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-black dark:text-white tracking-tight">
                    $
                    {totalExpense.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {analytics?.percentChange?.expense != null && (
                    <p
                      className={`text-xs mt-1 ${analytics.percentChange.expense >= 0 ? "text-rose-600" : "text-emerald-600"}`}
                    >
                      {analytics.percentChange.expense >= 0 ? "+" : ""}
                      {analytics.percentChange.expense.toFixed(1)}% vs prev
                      period
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm p-0 gap-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Net Balance
                    </p>
                  </div>
                  <p
                    className={`text-2xl font-semibold tracking-tight ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                  >
                    {netBalance >= 0 ? "" : "-"}$
                    {Math.abs(netBalance).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {analytics?.savingRate?.percentage != null && (
                    <p className="text-xs mt-1 text-slate-500">
                      {analytics.savingRate.percentage.toFixed(1)}% saving rate
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Filters + Bulk actions */}
            <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm mb-6 p-0 gap-0">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <Select
                    value={filterType || "ALL"}
                    onValueChange={(val) =>
                      setFilterType(val === "ALL" ? "" : val)
                    }
                  >
                    <SelectTrigger className="w-[150px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterRecurring || "ALL"}
                    onValueChange={(val) =>
                      setFilterRecurring(val === "ALL" ? "" : val)
                    }
                  >
                    <SelectTrigger className="w-40 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
                      <SelectValue placeholder="All Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Frequency</SelectItem>
                      <SelectItem value="RECURRING">Recurring</SelectItem>
                      <SelectItem value="NON_RECURRING">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Bulk action bar */}
                {selectedIds.length > 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {selectedIds.length} selected
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={bulkDeleting}
                      className="gap-1.5"
                    >
                      {bulkDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete Selected
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIds([])}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Transactions table */}
            <Card className="border-slate-200/60 dark:border-slate-700/50 shadow-sm overflow-hidden p-0 gap-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40 flex-1" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : sortedTransactions.length === 0 ? (
                <div className="p-12 text-center">
                  <CreditCard className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                    No transactions found
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {totalCount === 0
                      ? "Start by adding your first transaction."
                      : "Try adjusting your search or filters."}
                  </p>
                  {totalCount === 0 && (
                    <Button
                      onClick={() => {
                        setSheetMode("create");
                        setFormData({ ...EMPTY_FORM });
                        setFormError("");
                        setSheetOpen(true);
                      }}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="w-4 h-4" /> Add Transaction
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-200 dark:border-slate-700">
                        <TableHead className="w-10 py-3 px-3">
                          <Checkbox
                            checked={
                              selectedIds.length ===
                                sortedTransactions.length &&
                              sortedTransactions.length > 0
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="py-3 px-4">
                          <button
                            onClick={() => handleSort("date")}
                            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          >
                            Date <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead className="py-3 px-4">
                          <button
                            onClick={() => handleSort("title")}
                            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          >
                            Title <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Category
                        </TableHead>
                        <TableHead className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Type
                        </TableHead>
                        <TableHead className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Status
                        </TableHead>
                        <TableHead className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleSort("amount")}
                            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-auto"
                          >
                            Amount <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTransactions.map((t) => (
                        <TableRow
                          key={t._id}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${selectedIds.includes(t._id) ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""}`}
                        >
                          <TableCell className="py-3.5 px-3">
                            <Checkbox
                              checked={selectedIds.includes(t._id)}
                              onCheckedChange={() => toggleSelect(t._id)}
                            />
                          </TableCell>
                          <TableCell className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(t.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                  {t.title}
                                </p>
                                {t.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">
                                    {t.description}
                                  </p>
                                )}
                              </div>
                              {t.isRecurring && (
                                <Repeat
                                  className="w-3.5 h-3.5 text-blue-500 shrink-0"
                                  title={`Recurring: ${t.recurringInterval}`}
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 px-4">
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {t.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3.5 px-4">
                            <Badge
                              variant="secondary"
                              className={
                                t.type === "INCOME"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                              }
                            >
                              {t.type === "INCOME" ? "Income" : "Expense"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3.5 px-4">
                            <Badge
                              variant="secondary"
                              className={
                                t.status === "COMPLETED"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                  : t.status === "PENDING"
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              }
                            >
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`py-3.5 px-4 text-sm font-semibold text-right tabular-nums ${
                              t.type === "INCOME"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {t.type === "INCOME" ? "+" : "-"}$
                            {t.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="py-3.5 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={() => openEditSheet(t)}
                                >
                                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDuplicate(t._id)}
                                  disabled={duplicating === t._id}
                                >
                                  {duplicating === t._id ? (
                                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 mr-2" />
                                  )}{" "}
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(t._id)}
                                  disabled={deleting === t._id}
                                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                >
                                  {deleting === t._id ? (
                                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                  )}{" "}
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Page {page} of {totalPages} ({totalCount} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </main>
          {/* --- Create / Edit Transaction Dialog --- */}
          <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
            <DialogContent
              className={`sm:max-w-lg max-h-[90vh] overflow-y-auto ${generalSans.className}`}
            >
              <DialogHeader>
                <DialogTitle
                  className={`${generalSans.className} text-2xl tracking-tight font-medium text-black`}
                >
                  {sheetMode === "edit"
                    ? "Edit Transaction "
                    : "Add Transaction"}
                </DialogTitle>
                <DialogDescription className="text-sm text-black/50">
                  {sheetMode === "edit"
                    ? "Update the transaction details."
                    : "Create a new income or expense transaction."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={isFormSubmit} className="flex flex-col gap-5">
                {formError && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg">
                    <X className="w-4 h-4 shrink-0" />
                    {formError}
                  </div>
                )}

                {/* Type toggle */}
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-black">
                    Type
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({ ...formData, type: "INCOME" })
                      }
                      className={`py-2.5 rounded-lg transition-colors ${
                        formData.type === "INCOME"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          : ""
                      }`}
                    >
                      Income
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({ ...formData, type: "EXPENSE" })
                      }
                      className={`py-2.5 rounded-lg transition-colors ${
                        formData.type === "EXPENSE"
                          ? "bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-50"
                          : ""
                      }`}
                    >
                      Expense
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label
                    htmlFor="title"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Grocery shopping"
                    className="bg-slate-50 border-slate-200 rounded-lg"
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label
                    htmlFor="amount"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Amount *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/40">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="0.00"
                      className="pl-7 bg-slate-50 border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="category"
                      className="mb-1.5 block text-sm font-medium text-black"
                    >
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData({ ...formData, category: val })
                      }
                    >
                      <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="date"
                      className="mb-1.5 block text-sm font-medium text-black"
                    >
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <Label
                    htmlFor="paymentMethod"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Payment Method
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(val) =>
                      setFormData({ ...formData, paymentMethod: val })
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-lg">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((pm) => (
                        <SelectItem key={pm.value} value={pm.value}>
                          {pm.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Description
                  </Label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional notes..."
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-colors resize-none"
                  />
                </div>

                {/* Recurring toggle */}
                <div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isRecurring: checked,
                          recurringInterval: checked ? "MONTHLY" : "",
                        })
                      }
                    />
                    <Label className="cursor-pointer text-sm font-medium text-black">
                      Recurring transaction
                    </Label>
                  </div>
                  {formData.isRecurring && (
                    <Select
                      value={formData.recurringInterval}
                      onValueChange={(val) =>
                        setFormData({ ...formData, recurringInterval: val })
                      }
                    >
                      <SelectTrigger className="mt-2 w-full bg-slate-50 border-slate-200 rounded-lg">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECURRING_INTERVALS.map((ri) => (
                          <SelectItem key={ri.value} value={ri.value}>
                            {ri.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="gap-2 bg-black text-white hover:bg-black/80 rounded-lg"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving
                      ? sheetMode === "edit"
                        ? "Saving..."
                        : "Creating..."
                      : sheetMode === "edit"
                        ? "Save Changes"
                        : "Create Transaction"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          {/* --- Scan Receipt Dialog --- */}
          <Dialog open={scanSheetOpen} onOpenChange={setScanSheetOpen}>
            <DialogContent className={`sm:max-w-md ${generalSans.className}`}>
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-black">
                  Scan Receipt
                </DialogTitle>
                <DialogDescription className="text-sm text-black/50">
                  Upload a receipt image and our AI will extract the transaction
                  details automatically.
                </DialogDescription>
              </DialogHeader>
              <div>
                {scanError && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg mb-4">
                    <X className="w-4 h-4 shrink-0" />
                    {scanError}
                  </div>
                )}
                <div
                  onClick={() => !scanning && receiptInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-black/30 hover:bg-slate-50 transition-colors"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-8 h-8 text-black/40 animate-spin mx-auto mb-3" />
                      <p className="text-sm font-medium text-black">
                        Scanning receipt...
                      </p>
                      <p className="text-xs text-black/50 mt-1">
                        AI is extracting transaction details
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-black/30 mx-auto mb-3" />
                      <p className="text-sm font-medium text-black">
                        Click to upload receipt
                      </p>
                      <p className="text-xs text-black/50 mt-1">
                        JPEG, PNG, WebP — max 5MB
                      </p>
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
            </DialogContent>
          </Dialog>
        </SidebarInset>
      </SidebarProvider>
    </ReactLenis>
  );
}
