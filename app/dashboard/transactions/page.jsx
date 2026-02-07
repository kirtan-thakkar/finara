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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { Switch } from "../../../components/ui/switch";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../../components/ui/pagination";
import {
  Avatar,
  AvatarFallback,
} from "../../../components/ui/avatar";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const CATEGORIES = [
  "Food", "Transport", "Entertainment", "Healthcare", "Shopping",
  "Salary", "Freelance", "Investment", "Utilities", "Education", "Other",
];
const CATEGORY_ICONS = {
  Food: "🍔", Transport: "🚗", Entertainment: "🎬", Healthcare: "🏥", Shopping: "🛍️",
  Salary: "💰", Freelance: "💼", Investment: "📈", Utilities: "⚡", Education: "📚", Other: "📌",
};
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

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRecurring, setFilterRecurring] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleting, setDeleting] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [duplicating, setDuplicating] = useState(null);

  const [scanSheetOpen, setScanSheetOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const receiptInputRef = useRef(null);

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

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

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics?preset=allTime");
      if (res.status === 401) return;
      const data = await res.json();
      if (data.success && data.data) setAnalytics(data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);
  useEffect(() => { setPage(1); }, [searchQuery, filterType, filterRecurring]);

  const refreshAll = () => { fetchTransactions(); fetchAnalytics(); setSelectedIds([]); };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const body = {
        title: formData.title, type: formData.type, amount: Number(formData.amount),
        category: formData.category, date: formData.date, description: formData.description || undefined,
        paymentMethod: formData.paymentMethod, isRecurring: formData.isRecurring,
        recurringInterval: formData.isRecurring ? formData.recurringInterval : undefined,
      };
      const res = await fetch("/api/transaction/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to create"); return; }
      setSheetOpen(false); setFormData({ ...EMPTY_FORM }); refreshAll();
    } catch { setFormError("Something went wrong."); }
    finally { setSaving(false); }
  };

  const openEditSheet = (t) => {
    setSheetMode("edit"); setEditingId(t._id);
    setFormData({
      title: t.title || "", type: t.type || "EXPENSE", amount: String(t.amount || ""),
      category: t.category || "Food", date: t.date ? new Date(t.date).toISOString().split("T")[0] : "",
      description: t.description || "", paymentMethod: t.paymentMethod || "CASH",
      isRecurring: t.isRecurring || false, recurringInterval: t.recurringInterval || "",
    });
    setFormError(""); setSheetOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError("");
    try {
      const body = {
        title: formData.title, type: formData.type, amount: Number(formData.amount),
        category: formData.category, date: formData.date, description: formData.description || undefined,
        paymentMethod: formData.paymentMethod, isRecurring: formData.isRecurring,
        recurringInterval: formData.isRecurring ? formData.recurringInterval : undefined,
      };
      const res = await fetch(`/api/transaction/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to update"); return; }
      setSheetOpen(false); setEditingId(null); refreshAll();
    } catch { setFormError("Something went wrong."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" }); if (res.ok) refreshAll(); }
    catch (error) { console.error("Failed to delete:", error); }
    finally { setDeleting(null); }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/transaction/bulk-delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactionsIds: selectedIds }) });
      if (res.ok) refreshAll();
    } catch (error) { console.error("Bulk delete failed:", error); }
    finally { setBulkDeleting(false); }
  };

  const handleDuplicate = async (id) => {
    setDuplicating(id);
    try { const res = await fetch(`/api/transaction/${id}/duplicate`, { method: "POST" }); if (res.ok) refreshAll(); }
    catch (error) { console.error("Duplicate failed:", error); }
    finally { setDuplicating(null); }
  };

  const handleScanReceipt = async (file) => {
    setScanning(true); setScanError("");
    try {
      const fd = new FormData(); fd.append("receipt", file);
      const res = await fetch("/api/transaction/scan-receipt", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) { setScanError(data.message || "Failed to scan"); return; }
      const s = data.data;
      setScanSheetOpen(false); setSheetMode("create");
      setFormData({
        title: s.title || "", type: s.type || "EXPENSE", amount: s.amount ? String(s.amount) : "",
        category: s.category || "Food", date: s.date ? new Date(s.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        description: s.description || "", paymentMethod: s.paymentMethod || "CASH",
        isRecurring: s.isRecurring || false, recurringInterval: s.recurringInterval || "",
      });
      setFormError(""); setSheetOpen(true);
    } catch { setScanError("Something went wrong while scanning."); }
    finally { setScanning(false); }
  };

  const toggleSelect = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleSelectAll = () => {
    if (selectedIds.length === sortedTransactions.length) setSelectedIds([]);
    else setSelectedIds(sortedTransactions.map((t) => t._id));
  };

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
  const isFormSubmit = sheetMode === "edit" ? handleUpdate : handleCreate;

  // Pagination helpers
  const getPaginationRange = () => {
    const range = [];
    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={outfit.className}>
        {/* Header with breadcrumbs */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Transactions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Page header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">Transactions</h2>
              <p className="text-sm text-muted-foreground">Manage your income and expenses</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setScanSheetOpen(true)}>
                      <ScanLine className="w-4 h-4" />
                      <span className="hidden sm:inline">Scan</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>AI receipt extraction</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                onClick={() => { setSheetMode("create"); setFormData({ ...EMPTY_FORM }); setFormError(""); setEditingId(null); setSheetOpen(true); }}
                className="rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90"
                size="sm"
              >
                <PenLine className="w-4 h-4" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {analytics === null ? (
              [1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="w-9 h-9 rounded-lg" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-3 w-16 mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Income</span>
                    </div>
                    <p className="text-2xl font-semibold tracking-tight">${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    {analytics?.percentChange?.income != null && (
                      <p className={`text-xs mt-1.5 ${analytics.percentChange.income >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                        {analytics.percentChange.income >= 0 ? "+" : ""}{analytics.percentChange.income.toFixed(1)}%
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/40">
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Expenses</span>
                    </div>
                    <p className="text-2xl font-semibold tracking-tight">${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    {analytics?.percentChange?.expense != null && (
                      <p className={`text-xs mt-1.5 ${analytics.percentChange.expense >= 0 ? "text-rose-500" : "text-emerald-600"}`}>
                        {analytics.percentChange.expense >= 0 ? "+" : ""}{analytics.percentChange.expense.toFixed(1)}%
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Balance</span>
                    </div>
                    <p className={`text-2xl font-semibold tracking-tight ${netBalance >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                      {netBalance >= 0 ? "" : "-"}${Math.abs(netBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    {analytics?.savingRate?.percentage != null && (
                      <p className="text-xs mt-1.5 text-muted-foreground">{analytics.savingRate.percentage.toFixed(1)}% saving rate</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-9" />
                </div>
                <Select value={filterType || "ALL"} onValueChange={(v) => setFilterType(v === "ALL" ? "" : v)}>
                  <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRecurring || "ALL"} onValueChange={(v) => setFilterRecurring(v === "ALL" ? "" : v)}>
                  <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="All Frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Frequency</SelectItem>
                    <SelectItem value="RECURRING">Recurring</SelectItem>
                    <SelectItem value="NON_RECURRING">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedIds.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t flex items-center gap-2">
                  <Badge variant="secondary">{selectedIds.length} selected</Badge>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={bulkDeleting} className="h-7 text-xs">
                    {bulkDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="h-7 text-xs">Clear</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"><Skeleton className="w-4 h-4" /></TableHead>
                      <TableHead><Skeleton className="h-3 w-8" /></TableHead>
                      <TableHead><Skeleton className="h-3 w-8" /></TableHead>
                      <TableHead><Skeleton className="h-3 w-14" /></TableHead>
                      <TableHead><Skeleton className="h-3 w-8" /></TableHead>
                      <TableHead className="text-right"><Skeleton className="h-3 w-12 ml-auto" /></TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(6)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="w-4 h-4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><div className="flex items-center gap-2"><Skeleton className="w-7 h-7 rounded-full" /><Skeleton className="h-4 w-28" /></div></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="w-6 h-6 rounded" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : sortedTransactions.length === 0 ? (
              <div className="p-16 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">No transactions found</p>
                <p className="text-sm text-muted-foreground mb-5">
                  {totalCount === 0 ? "Start by adding your first transaction." : "Try adjusting your filters."}
                </p>
                {totalCount === 0 && (
                  <Button size="sm" onClick={() => { setSheetMode("create"); setFormData({ ...EMPTY_FORM }); setFormError(""); setSheetOpen(true); }}>
                    <Plus className="w-4 h-4" /> Add Transaction
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 px-3">
                        <Checkbox
                          checked={selectedIds.length === sortedTransactions.length && sortedTransactions.length > 0}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>
                        <button onClick={() => handleSort("date")} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                          Date <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button onClick={() => handleSort("title")} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                          Transaction <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right">
                        <button onClick={() => handleSort("amount")} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors ml-auto">
                          Amount <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((t) => (
                      <TableRow
                        key={t._id}
                        className="group"
                        data-state={selectedIds.includes(t._id) ? "selected" : undefined}
                      >
                        <TableCell className="px-3">
                          <Checkbox checked={selectedIds.includes(t._id)} onCheckedChange={() => toggleSelect(t._id)} aria-label={`Select ${t.title}`} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-muted">{CATEGORY_ICONS[t.category] || "📌"}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium truncate">{t.title}</p>
                                {t.isRecurring && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild><Repeat className="w-3 h-3 text-blue-500 shrink-0" /></TooltipTrigger>
                                      <TooltipContent><p>Recurring: {t.recurringInterval}</p></TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              {t.description && <p className="text-xs text-muted-foreground truncate max-w-[180px]">{t.description}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{t.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              t.status === "COMPLETED" ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                              : t.status === "PENDING" ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                              : "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                            }
                          >
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-sm font-semibold text-right tabular-nums ${
                          t.type === "INCOME" ? "text-emerald-600" : "text-rose-500"
                        }`}>
                          {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[140px]">
                              <DropdownMenuItem onClick={() => openEditSheet(t)}>
                                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(t._id)} disabled={duplicating === t._id}>
                                {duplicating === t._id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(t._id)} disabled={deleting === t._id} className="text-red-600 focus:text-red-600">
                                {deleting === t._id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t px-4 py-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{totalCount} transactions</p>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => page > 1 && setPage(page - 1)}
                            className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {getPaginationRange().map((item, idx) => (
                          <PaginationItem key={idx}>
                            {item === "..." ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                isActive={page === item}
                                onClick={() => setPage(item)}
                                className="cursor-pointer"
                              >
                                {item}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => page < totalPages && setPage(page + 1)}
                            className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Card>
        </main>

        {/* Create / Edit Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{sheetMode === "edit" ? "Edit Transaction" : "New Transaction"}</SheetTitle>
              <SheetDescription>{sheetMode === "edit" ? "Update the details below." : "Fill in the details to create a transaction."}</SheetDescription>
            </SheetHeader>

            <form onSubmit={isFormSubmit} className="flex flex-col gap-5 px-4 pb-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  <X className="w-4 h-4 shrink-0" />{formError}
                </div>
              )}

              {/* Type */}
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={formData.type === "INCOME" ? "default" : "outline"}
                    className={formData.type === "INCOME" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                    onClick={() => setFormData({ ...formData, type: "INCOME" })}>Income</Button>
                  <Button type="button" variant={formData.type === "EXPENSE" ? "default" : "outline"}
                    className={formData.type === "EXPENSE" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}
                    onClick={() => setFormData({ ...formData, type: "EXPENSE" })}>Expense</Button>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Grocery shopping" />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input id="amount" type="number" required min="0.01" step="0.01" value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="pl-7" />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <span className="mr-1.5">{CATEGORY_ICONS[cat]}</span>{cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((pm) => <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes..."
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none" />
              </div>

              {/* Recurring */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recurring" className="cursor-pointer">Recurring</Label>
                  <Switch id="recurring" checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked, recurringInterval: checked ? "MONTHLY" : "" })} />
                </div>
                {formData.isRecurring && (
                  <Select value={formData.recurringInterval} onValueChange={(v) => setFormData({ ...formData, recurringInterval: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Interval" /></SelectTrigger>
                    <SelectContent>
                      {RECURRING_INTERVALS.map((ri) => <SelectItem key={ri.value} value={ri.value}>{ri.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Separator />

              <SheetFooter className="px-0">
                <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving..." : (sheetMode === "edit" ? "Save Changes" : "Create")}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Scan Receipt Sheet */}
        <Sheet open={scanSheetOpen} onOpenChange={setScanSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Scan Receipt</SheetTitle>
              <SheetDescription>Upload a receipt and AI will extract the details.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4 mt-4">
              {scanError && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg mb-4">
                  <X className="w-4 h-4 shrink-0" />{scanError}
                </div>
              )}
              <div onClick={() => !scanning && receiptInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-foreground/30 transition-colors">
                {scanning ? (
                  <><Loader2 className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium">Scanning...</p>
                    <p className="text-xs text-muted-foreground mt-1">Extracting transaction details</p></>
                ) : (
                  <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP — max 5MB</p></>
                )}
              </div>
              <input ref={receiptInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleScanReceipt(file); e.target.value = ""; }} />
            </div>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  );
}
