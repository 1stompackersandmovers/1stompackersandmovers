import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Plus,
  Search,
  MapPin,
  ArrowRight,
  Truck,
  RotateCcw,
  CheckCircle,
  Package,
  IndianRupee,
  X,
} from "lucide-react";
import { useGetBiltiesQuery } from "../../../../store/apiSlices/biltiesApiSlice";
import { CardGridSkeleton } from "../../shared/components/Skeleton";

const BiltiesList = () => {
  const { data: bilties = [], isLoading, isFetching, refetch: fetchBilties } =
    useGetBiltiesQuery();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchBilties(),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "—";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime())
        ? (dateStr.length > 20 ? "—" : dateStr)
        : d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    } catch {
      return "—";
    }
  };

  const filteredBilties = bilties.filter((bilty) => {
    const s = searchQuery.toLowerCase();
    const matchesQuery =
      (bilty.lrNumber && bilty.lrNumber.toLowerCase().includes(s)) ||
      (bilty.truckNumber && bilty.truckNumber.toLowerCase().includes(s)) ||
      (bilty.driverName && bilty.driverName.toLowerCase().includes(s)) ||
      (bilty.consignorName && bilty.consignorName.toLowerCase().includes(s)) ||
      (bilty.consigneeName && bilty.consigneeName.toLowerCase().includes(s)) ||
      (bilty.fromCity && bilty.fromCity.toLowerCase().includes(s)) ||
      (bilty.toCity && bilty.toCity.toLowerCase().includes(s));

    const matchesStatus =
      statusFilter === "all" ? true : bilty.freightStatus === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalBilties = bilties.length;
  const totalFreight = bilties.reduce((acc, b) => acc + (b.freightAmount || 0), 0);
  const totalPackages = bilties.reduce((acc, b) => acc + (Number(b.packagesCount) || 0), 0);
  const paidBilties = bilties.filter((b) => b.freightStatus === "paid").length;
  const toPayBilties = bilties.filter((b) => b.freightStatus === "to_pay").length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Highway Bilties (LR)</h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-semibold px-2 py-0.5 rounded-full">
              {totalBilties} Consignments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Lorry Receipts, driver dispatch permits, and carrier compliance notes
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
            title="Refresh & sync consignment notes"
            aria-label="Refresh & sync consignment notes"
          >
            <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => navigate("/bilties/new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Bilty (LR)</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Consignments</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">{totalBilties}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Official road permits</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Freight</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            ₹{totalFreight.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{paidBilties} paid / {toPayBilties} To-Pay</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Packages Manifest</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2 font-mono">{totalPackages}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total cartons & items moved</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Truck Fleet</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2 font-mono">
            {new Set(bilties.map((b) => b.truckNumber)).size}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Unique vehicles dispatched</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by LR #, truck #, sender, or destination city..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: "All LRs", count: totalBilties },
            { id: "paid", label: "Freight Paid", count: paidBilties },
            { id: "to_pay", label: "To Pay (Delivery)", count: toPayBilties },
            { id: "billed", label: "Billed to Account", count: bilties.filter((b) => b.freightStatus === "billed").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 border-slate-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bilties Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredBilties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No consignment notes found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No LRs match "${searchQuery}".`
              : "Generate an official Lorry Receipt for your trucks before highway dispatch."}
          </p>
          <button
            onClick={() => navigate("/bilties/new")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Lorry Receipt</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBilties.map((bilty) => (
            <div
              key={bilty.id}
              onClick={() => navigate(`/bilties/${bilty.id}`)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                      {bilty.lrNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mt-1.5 truncate group-hover:text-blue-600 transition-colors">
                      {bilty.consignorName} ➔ {bilty.consigneeName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Truck: <span className="font-bold text-slate-800 uppercase">{bilty.truckNumber}</span> • Driver: {bilty.driverName}
                    </p>
                  </div>
                  <div className="text-right space-y-1 shrink-0">
                    <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {bilty.freightStatus}
                    </span>
                    <p className="text-lg font-black text-slate-900 font-mono pt-1">
                      ₹{Number(bilty.freightAmount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <span className="truncate">{bilty.fromCity}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-bold text-blue-900 truncate">{bilty.toCity}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px] shrink-0">
                    {bilty.packagesCount} pkgs
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                <span className="text-[11px]">
                  Dispatch: {formatDate(bilty.createdAt)}
                </span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px]">
                  <span>View Consignment</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BiltiesList;
