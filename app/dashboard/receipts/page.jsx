"use client";
import localFont from "next/font/local";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Upload,
  Loader2,
  X,
  ReceiptText,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ScanLine,
  ExternalLink,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { AppSidebar } from "../../../components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../../components/ui/sidebar";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../components/ui/dialog";

gsap.registerPlugin(ScrollTrigger);

const generalSans = localFont({
  src: "../../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
});

const PAGE_SIZE = 24;

export default function ReceiptsPage() {
  const containerRef = useRef(null);
  const receiptInputRef = useRef(null);

  // Data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  // Scan
  const [scanOpen, setScanOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState(null);

  // Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTx, setPreviewTx] = useState(null);

  // Saving scanned receipt as transaction
  const [saving, setSaving] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Delete
  const [deleting, setDeleting] = useState(null);

  // ── Fetch transactions that have receiptUrl ──
  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageSize: String(PAGE_SIZE),
        pageNumber: String(page),
      });
      if (search.trim()) params.set("keyword", search.trim());

      const res = await fetch(`/api/transaction?${params.toString()}`);
      const json = await res.json();
      if (json.transactions) {
        // Filter to only those with a receiptUrl
        const withReceipts = json.transactions.filter((t) => t.receiptUrl);
        setTransactions(withReceipts);
        setTotalCount(json.pagination?.totalCount || 0);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch receipts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // ── Scan receipt ──
  const handleScanReceipt = async (file) => {
    setScanning(true);
    setScanError("");
    setScanResult(null);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await fetch("/api/transaction/scan-receipt", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setScanError(data.error || data.message || "Failed to scan receipt");
        return;
      }
      setScanResult(data.data);
    } catch {
      setScanError("Something went wrong while scanning.");
    } finally {
      setScanning(false);
    }
  };

  // ── Save scanned receipt as transaction ──
  const handleSaveScanned = async () => {
    if (!scanResult) return;
    setSaving(true);
    try {
      const body = {
        title: scanResult.title || "Receipt Transaction",
        type: scanResult.type || "EXPENSE",
        amount: Number(scanResult.amount),
        category: scanResult.category || "Other",
        date: scanResult.date || new Date().toISOString().split("T")[0],
        description: scanResult.description || "Scanned from receipt",
        paymentMethod: scanResult.paymentMethod || "CASH",
        isRecurring: false,
        receiptUrl: scanResult.receiptUrl || undefined,
      };
      const res = await fetch("/api/transaction/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setScanOpen(false);
        setScanResult(null);
        fetchReceipts();
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete transaction ──
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      if (res.ok) fetchReceipts();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  // ── GSAP animation ──
  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll(".r-card");
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    }
  }, { scope: containerRef, dependencies: [transactions, viewMode] });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={generalSans.className}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" ref={containerRef}>
          {/* ── Page header ── */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tighter mb-1">Receipts</h2>
              <p className="font-medium text-black/50">Scan, store, and manage your receipt images</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => { setScanOpen(true); setScanResult(null); setScanError(""); }}
                className="bg-black text-white hover:bg-black/80 rounded-full px-5 gap-2">
                <ScanLine className="w-4 h-4" /> Scan Receipt
              </Button>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <Input
                placeholder="Search receipts..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 bg-slate-50 border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-black/40 mr-2">{transactions.length} receipts</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-black text-white" : "text-black/40 hover:bg-slate-50"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-black/40 hover:bg-slate-50"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-black/30 animate-spin" />
              <span className="ml-3 text-sm font-medium text-black/50">Loading receipts...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <ReceiptText className="w-8 h-8 text-black/20" />
              </div>
              <h3 className="text-lg font-medium text-black mb-1">No receipts found</h3>
              <p className="text-sm text-black/40 mb-6 text-center max-w-sm">
                {search ? "No receipts match your search. Try a different keyword." : "Scan your first receipt to get started. Our AI will automatically extract the transaction details."}
              </p>
              {!search && (
                <Button onClick={() => { setScanOpen(true); setScanResult(null); setScanError(""); }}
                  className="bg-black text-white hover:bg-black/80 rounded-full px-5 gap-2">
                  <ScanLine className="w-4 h-4" /> Scan Receipt
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* ── Grid View ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {transactions.map((t) => (
                <div key={t._id} className="r-card group bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Receipt image */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    {t.receiptUrl ? (
                      <img src={t.receiptUrl} alt={t.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-black/10" />
                      </div>
                    )}
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => { setPreviewTx(t); setPreviewOpen(true); }}
                        className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                        <Eye className="w-4 h-4 text-black" />
                      </button>
                      {t.receiptUrl && (
                        <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                          <ExternalLink className="w-4 h-4 text-black" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(t._id)} disabled={deleting === t._id}
                        className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50 transition-colors">
                        {deleting === t._id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4 text-red-500" />}
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-medium text-black truncate flex-1 mr-2">{t.title}</h4>
                      <Badge variant="outline" className={`text-xs shrink-0 ${t.type === "INCOME" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-rose-200 text-rose-700 bg-rose-50"}`}>
                        {t.type === "INCOME" ? "Income" : "Expense"}
                      </Badge>
                    </div>
                    <p className={`text-lg font-medium tabular-nums ${t.type === "INCOME" ? "text-emerald-600" : "text-black"}`}>
                      {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-black/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-black/50">{t.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── List View ── */
            <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">Receipt</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">Title</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">Date</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide">Amount</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-black/50 uppercase tracking-wide w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr key={t._id} className="r-card hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {t.receiptUrl ? (
                            <img src={t.receiptUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-black/10" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-black">{t.title}</p>
                        {t.description && <p className="text-xs text-black/40 mt-0.5 truncate max-w-[200px]">{t.description}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-black/70">{t.category}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-black/70">
                        {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium text-right tabular-nums ${t.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                        {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setPreviewTx(t); setPreviewOpen(true); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:text-black hover:bg-slate-100 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {t.receiptUrl && (
                            <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:text-black hover:bg-slate-100 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => handleDelete(t._id)} disabled={deleting === t._id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:text-red-500 hover:bg-red-50 transition-colors">
                            {deleting === t._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-black/40">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  className="h-8 w-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* ── Scan Receipt Dialog ── */}
        <Dialog open={scanOpen} onOpenChange={setScanOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium text-black">Scan Receipt</DialogTitle>
              <DialogDescription className="text-sm text-black/50">
                Upload a receipt image and our AI will extract the transaction details automatically.
              </DialogDescription>
            </DialogHeader>

            {scanError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg">
                <X className="w-4 h-4 shrink-0" />{scanError}
              </div>
            )}

            {!scanResult ? (
              <div>
                <div
                  onClick={() => !scanning && receiptInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-black/30 hover:bg-slate-50 transition-colors"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-8 h-8 text-black/40 animate-spin mx-auto mb-3" />
                      <p className="text-sm font-medium text-black">Scanning receipt...</p>
                      <p className="text-xs text-black/50 mt-1">AI is extracting transaction details</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-black/30 mx-auto mb-3" />
                      <p className="text-sm font-medium text-black">Click to upload receipt</p>
                      <p className="text-xs text-black/50 mt-1">JPEG, PNG, WebP — max 5MB</p>
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
            ) : (
              /* ── Scan result preview ── */
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-black/50 uppercase tracking-wide">Extracted Details</span>
                    <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">AI Scanned</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-black/40">Title</p>
                      <p className="text-sm font-medium text-black">{scanResult.title || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40">Amount</p>
                      <p className="text-sm font-medium text-black">${Number(scanResult.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40">Category</p>
                      <p className="text-sm font-medium text-black">{scanResult.category || "Other"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40">Date</p>
                      <p className="text-sm font-medium text-black">{scanResult.date || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-black/40">Description</p>
                      <p className="text-sm font-medium text-black">{scanResult.description || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40">Payment Method</p>
                      <p className="text-sm font-medium text-black">{scanResult.paymentMethod || "CASH"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40">Type</p>
                      <p className="text-sm font-medium text-black">{scanResult.type || "EXPENSE"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                  <Button type="button" variant="outline" className="rounded-lg"
                    onClick={() => setScanResult(null)}>Scan Another</Button>
                  <Button onClick={handleSaveScanned} disabled={saving}
                    className="gap-2 bg-black text-white hover:bg-black/80 rounded-lg">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? "Saving..." : "Save Transaction"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Receipt Preview Dialog ── */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium text-black">{previewTx?.title || "Receipt"}</DialogTitle>
              <DialogDescription className="text-sm text-black/50">Receipt details and image preview</DialogDescription>
            </DialogHeader>

            {previewTx && (
              <div className="space-y-4">
                {/* Receipt image */}
                {previewTx.receiptUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={previewTx.receiptUrl} alt={previewTx.title}
                      className="w-full max-h-[400px] object-contain" />
                  </div>
                )}

                {/* Details grid */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-black/40 mb-0.5">Amount</p>
                      <p className={`text-lg font-medium tabular-nums ${previewTx.type === "INCOME" ? "text-emerald-600" : "text-black"}`}>
                        {previewTx.type === "INCOME" ? "+" : "-"}${previewTx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40 mb-0.5">Type</p>
                      <Badge variant="outline" className={`text-xs ${previewTx.type === "INCOME" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-rose-200 text-rose-700 bg-rose-50"}`}>
                        {previewTx.type === "INCOME" ? "Income" : "Expense"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-black/40 mb-0.5">Category</p>
                      <p className="text-sm font-medium text-black">{previewTx.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40 mb-0.5">Date</p>
                      <p className="text-sm font-medium text-black">
                        {new Date(previewTx.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40 mb-0.5">Payment</p>
                      <p className="text-sm font-medium text-black">{previewTx.paymentMethod || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/40 mb-0.5">Status</p>
                      <p className="text-sm font-medium text-black">{previewTx.status || "COMPLETED"}</p>
                    </div>
                  </div>
                  {previewTx.description && (
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <p className="text-xs text-black/40 mb-0.5">Description</p>
                      <p className="text-sm text-black">{previewTx.description}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  {previewTx.receiptUrl && (
                    <a href={previewTx.receiptUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2 rounded-lg">
                        <ExternalLink className="w-4 h-4" /> Open Full Image
                      </Button>
                    </a>
                  )}
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-lg">Close</Button>
                  </DialogClose>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
