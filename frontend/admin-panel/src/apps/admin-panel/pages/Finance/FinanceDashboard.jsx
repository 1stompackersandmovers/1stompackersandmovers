import React, { useState } from "react";
import { Link } from "react-router";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  RotateCcw,
  Truck,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import {
  useGetFinanceSummaryQuery,
  useGetMonthlyRevenueQuery,
  useGetTopRoutesQuery,
  useGetPendingPayrollQuery,
} from "../../../../store/apiSlices/financeApiSlice";
import { useUpdateStaffPaymentMutation } from "../../../../store/apiSlices/jobsApiSlice";
import { FormField } from "../../../../components/FormField";

const FinanceDashboard = () => {
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } =
    useGetFinanceSummaryQuery();
  const { data: monthly = [], isLoading: monthlyLoading } = useGetMonthlyRevenueQuery();
  const { data: topRoutes = [], isLoading: routesLoading } = useGetTopRoutesQuery();
  const { data: pendingPayroll = [], isLoading: payrollLoading, refetch: refetchPayroll } =
    useGetPendingPayrollQuery();

  const [updateStaffPayment, { isLoading: paying }] = useUpdateStaffPaymentMutation();

  // Payment modal state for clearing payroll
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [payNotes, setPayNotes] = useState("");

  const handleOpenPayModal = (item) => {
    setSelectedPayroll(item);
    setPayAmount(item.balanceOwed.toString());
    setPayMode("cash");
    setPayNotes("");
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayroll) return;

    try {
      await updateStaffPayment({
        jobId: selectedPayroll.jobId,
        staffId: selectedPayroll.staffId,
        amountPaid: (Number(selectedPayroll.amountPaid) || 0) + Number(payAmount),
        paymentMode: payMode,
        paymentNotes: payNotes || "Cleared from Finance Payroll Dashboard",
      }).unwrap();
      setSelectedPayroll(null);
      refetchPayroll();
      refetchSummary();
    } catch (err) {
      alert("Failed to record pay: " + (err.data?.error || err.message));
    }
  };

  const maxBilled = Math.max(...monthly.map((m) => m.billed), 1);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Finance & Revenue Intelligence</h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-semibold px-2 py-0.5 rounded-full">
              Live Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Billed revenue, customer collections, route profitability & staff payroll ledger
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              refetchSummary();
              refetchPayroll();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-emerald-600 bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer text-xs font-medium"
            title="Refresh financial data"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${summaryLoading ? "animate-spin" : ""}`} />
            <span>Sync Accounts</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Billed</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ₹{(summary?.totalRevenue || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-400">
            This Month: <strong>₹{(summary?.thisMonthRevenue || 0).toLocaleString("en-IN")}</strong>
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Collected Cash</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ₹{(summary?.totalCollected || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Cleared customer receipts</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Outstanding Due</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            ₹{(summary?.totalOutstanding || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-400">Pending customer balance</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Pending Wages</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            ₹{(summary?.pendingStaffWages || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-400">
            Total Paid: <strong>₹{(summary?.totalStaffPaid || 0).toLocaleString("en-IN")}</strong>
          </p>
        </div>
      </div>

      {/* Monthly Revenue Visual Trend & Top Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Revenue Bar Chart (HTML/CSS) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Monthly Billing vs Collections</span>
              </h3>
              <p className="text-xs text-slate-400">Comparison of invoice totals vs cleared receipts</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600"></span>
                <span className="text-slate-600 font-medium">Billed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Collected</span>
              </div>
            </div>
          </div>

          {monthly.length > 0 ? (
            <div className="pt-6 space-y-4">
              <div className="flex items-end gap-3 h-48 sm:h-56 pt-4 border-b border-slate-100 overflow-x-auto">
                {monthly.map((m, idx) => {
                  const billedHeight = Math.round((m.billed / maxBilled) * 100);
                  const collectedHeight = Math.round((m.collected / maxBilled) * 100);

                  return (
                    <div key={idx} className="flex-1 min-w-[50px] flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        Billed: ₹{m.billed.toLocaleString("en-IN")} | Paid: ₹{m.collected.toLocaleString("en-IN")}
                      </div>

                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Billed bar */}
                        <div
                          style={{ height: `${Math.max(5, billedHeight)}%` }}
                          className="w-3 sm:w-5 bg-blue-600 rounded-t-sm transition-all"
                        ></div>
                        {/* Collected bar */}
                        <div
                          style={{ height: `${Math.max(5, collectedHeight)}%` }}
                          className="w-3 sm:w-5 bg-emerald-500 rounded-t-sm transition-all"
                        ></div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 mt-2 truncate w-full text-center">
                        {m.month.slice(5)}/{m.month.slice(2, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              No historical billing data found yet. Generate invoices to populate monthly charts.
            </div>
          )}
        </div>

        {/* Top Routes by Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Top Revenue Routes</span>
            </h3>

            {topRoutes.length > 0 ? (
              <div className="space-y-2.5 divide-y divide-slate-100">
                {topRoutes.slice(0, 5).map((r, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{r.route}</div>
                      <div className="text-[11px] text-slate-400">{r.count} relocations</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">
                        ₹{r.totalRevenue.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-emerald-600">
                        Avg: ₹{Math.round(r.totalRevenue / r.count).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No route data recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Staff Payroll Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Pending Staff Wages & Payroll Ledger</span>
            </h3>
            <p className="text-xs text-slate-500">Unsettled wages for loaders, drivers, and supervisors</p>
          </div>
          <span className="text-xs font-semibold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
            {pendingPayroll.length} Unsettled Records
          </span>
        </div>

        {pendingPayroll.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-left">Staff Name</th>
                  <th className="py-2.5 px-3 text-left">Role</th>
                  <th className="py-2.5 px-3 text-left">Job Ref</th>
                  <th className="py-2.5 px-3 text-left">Move Date</th>
                  <th className="py-2.5 px-3 text-right">Payable</th>
                  <th className="py-2.5 px-3 text-right">Paid</th>
                  <th className="py-2.5 px-3 text-right">Balance Owed</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPayroll.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.staffName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.staffPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 capitalize font-medium">{item.roleOnJob || item.staffRole}</td>
                    <td className="py-2.5 px-3">
                      <Link to={`/jobs/${item.jobId}`} className="font-mono text-blue-600 hover:underline">
                        {item.jobNumber}
                      </Link>
                      <div className="text-[11px] text-slate-500 truncate max-w-[120px]">{item.customerName}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{item.scheduledDate}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{item.amountPayable}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">₹{item.amountPaid}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                      ₹{item.balanceOwed}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleOpenPayModal(item)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                      >
                        Clear Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            All staff wages and driver payments are fully cleared! No pending balances.
          </div>
        )}
      </div>

      {/* MODAL: Pay Staff Member */}
      {selectedPayroll && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Clear Wages: {selectedPayroll.staffName}</span>
              </h3>
              <button onClick={() => setSelectedPayroll(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Job Number:</span>
                  <span className="font-mono font-bold">{selectedPayroll.jobNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span>{selectedPayroll.customerName}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-bold pt-1 border-t border-slate-200">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{selectedPayroll.balanceOwed}</span>
                </div>
              </div>

              <FormField label="Amount to Pay Now (₹)" required>
                <input
                  type="number"
                  min="1"
                  max={selectedPayroll.balanceOwed}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:border-emerald-500 outline-none"
                />
              </FormField>

              <FormField label="Payment Mode" required>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="upi">UPI / PhonePe / GPay</option>
                  <option value="bank">Direct Bank Transfer</option>
                </select>
              </FormField>

              <FormField label="Payment Remarks / Notes">
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Paid cash at terminal"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-emerald-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={paying}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Confirm Wage Payment Receipt</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
