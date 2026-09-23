import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Truck,
  Calendar,
  MapPin,
  ArrowRight,
  Phone,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  X,
} from "lucide-react";
import { useGetJobsQuery } from "../../../../store/apiSlices/jobsApiSlice";

const JobsList = () => {
  const { data: jobs = [], isLoading: loading, refetch: fetchJobs } =
    useGetJobsQuery();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredJobs = jobs.filter((j) => {
    const s = searchQuery.toLowerCase();
    const matchesQuery =
      (j.jobNumber && j.jobNumber.toLowerCase().includes(s)) ||
      (j.customerName && j.customerName.toLowerCase().includes(s)) ||
      (j.customerPhone && j.customerPhone.includes(s)) ||
      (j.pickupAddress && j.pickupAddress.toLowerCase().includes(s)) ||
      (j.deliveryAddress && j.deliveryAddress.toLowerCase().includes(s));

    const matchesStatus =
      statusFilter === "all" ? true : j.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalJobs = jobs.length;
  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const scheduledCount = jobs.filter((j) => j.status === "scheduled").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Scheduled
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            In Transit
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Jobs & Moves</h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-semibold px-2 py-0.5 rounded-full">
              {totalJobs} Movements
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Scheduled relocations, dispatch, team assignment & vehicle tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchJobs}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer text-xs font-medium"
            title="Refresh active jobs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Moves</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">{totalJobs}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">All confirmed relocations</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Transit</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 font-mono">{inProgressCount}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Vehicles on the road</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2 font-mono">{scheduledCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Upcoming move dates</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">{completedCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {totalJobs > 0 ? `${Math.round((completedCount / totalJobs) * 100)}% Fulfilled` : "0%"}
          </p>
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
            placeholder="Search by job #, customer name, phone, or route..."
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
            { id: "all", label: "All Jobs", count: totalJobs },
            { id: "scheduled", label: "Scheduled", count: scheduledCount },
            { id: "in_progress", label: "In Transit", count: inProgressCount },
            { id: "completed", label: "Completed", count: completedCount },
            { id: "cancelled", label: "Cancelled", count: jobs.filter((j) => j.status === "cancelled").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
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

      {/* Jobs Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <RotateCcw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading jobs & dispatches...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active jobs found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No moves match "${searchQuery}".`
              : "When a customer accepts a quotation, convert it into an active job to schedule dispatch."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {job.jobNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mt-1.5 truncate group-hover:text-blue-600 transition-colors">
                      {job.customerName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{job.customerPhone}</p>
                  </div>
                  <div className="shrink-0">{getStatusBadge(job.status)}</div>
                </div>

                <div className="mt-3 bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{job.pickupAddress}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-semibold text-blue-950 truncate">{job.deliveryAddress}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{job.movingDate ? new Date(job.movingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Date TBD"}</span>
                    </span>
                    <span className="font-mono font-medium text-slate-700">
                      {job.vehicleAssigned ? `🚛 ${job.vehicleAssigned}` : "Truck pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                <span className="text-[11px]">
                  Driver: <span className="font-medium text-slate-700">{job.driverName || "Unassigned"}</span>
                </span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px]">
                  <span>Manage Job</span>
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

export default JobsList;
