import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  QrCode,
  Building2,
  CheckCircle,
  Truck,
  DollarSign,
  X,
  CreditCard,
  Plus,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  useGetInvoiceByIdQuery,
  useGetInvoicePaymentsQuery,
  useRecordInvoicePaymentMutation,
} from "../../../../store/apiSlices/invoicesApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { FormField } from "../../../../components/FormField";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading: loading } = useGetInvoiceByIdQuery(id);
  const { data: dbSettings } = useGetSettingsQuery();
  const company = dbSettings || {};
  const { data: payments = [], isLoading: paymentsLoading } = useGetInvoicePaymentsQuery(id);
  const [recordPayment, { isLoading: recordingPayment }] = useRecordInvoicePaymentMutation();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "—";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime()) ? (dateStr.length > 20 ? "—" : dateStr) : d.toLocaleDateString("en-IN");
    } catch {
      return "—";
    }
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handleOpenPaymentModal = () => {
    if (invoice) {
      setPaymentAmount(invoice.balanceDue > 0 ? invoice.balanceDue.toString() : "");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setTransactionRef("");
      setPaymentNotes("");
      setPaymentError("");
    }
    setIsPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setPaymentError("Payment amount must be greater than 0");
      return;
    }

    try {
      await recordPayment({
        invoiceId: id,
        amount: Number(paymentAmount),
        paymentMode,
        paymentDate,
        transactionRef,
        notes: paymentNotes,
      }).unwrap();
      setIsPaymentModalOpen(false);
    } catch (err) {
      setPaymentError(err.data?.error || err.message || "Failed to record payment");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-12 text-rose-500 text-sm">Invoice not found.</div>;
  }

  // Dynamic UPI Payment Intent String
  const upiId = company.upi?.id || company.bankDetails?.upiId || "";
  const payeeName = company.upi?.payeeName || company.name || "1st Om Packers and Movers";
  const upiPayload = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${invoice.balanceDue > 0 ? invoice.balanceDue : invoice.totalAmount}&cu=INR&tn=${encodeURIComponent(
    invoice.invoiceNumber
  )}`;

  const whatsAppMessage = `*Tax Invoice from ${company.name || "1st Om Packers and Movers"}*
Invoice No: ${invoice.invoiceNumber}
Customer: ${invoice.customerName}
-----------------------------
Total Amount: ₹${invoice.totalAmount.toLocaleString("en-IN")}
Advance Paid: ₹${invoice.advancePaid.toLocaleString("en-IN")}
*Balance Due: ₹${invoice.balanceDue.toLocaleString("en-IN")}*
Status: ${invoice.paymentStatus.toUpperCase()}
-----------------------------
${upiId ? `You can pay via UPI to: ${upiId}\n` : ""}Bank: ${company.bankDetails?.bankName || "State Bank of India"} | A/C: ${company.bankDetails?.accountNumber || "N/A"} | IFSC: ${company.bankDetails?.ifsc || "N/A"}
-----------------------------
Thank you for choosing ${company.name || "1st Om Packers & Movers"}!`;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/invoices")}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Invoices List</span>
          </button>

          {invoice.jobId && (
            <Link
              to={`/jobs/${invoice.jobId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>← Job #{invoice.jobId}</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenPaymentModal}
            className="flex items-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <a
            href={`https://wa.me/91${invoice.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              whatsAppMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Bill</span>
          </a>
        </div>
      </div>

      {/* Invoice Document Paper Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Header Strip */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <img
              src={company.logo?.primary || "/images/primary-logo.webp"}
              alt={company.name || "Company Logo"}
              className="h-14 w-auto object-contain max-w-44"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {company.name || "1st Om Packers and Movers"}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{company.tagline || ""}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                GSTIN: {company.gstin || "N/A"} | PAN: {company.pan || "N/A"} | SAC: {invoice.sacCode || company.sacCode || "9965"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 font-black text-xs rounded-lg uppercase tracking-wider mb-1 font-mono ${
                invoice.paymentStatus === "paid"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : invoice.paymentStatus === "partial"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              Tax Invoice • {invoice.paymentStatus}
            </span>
            <div className="text-sm font-mono font-bold text-slate-900">{invoice.invoiceNumber}</div>
            <div className="text-xs text-slate-500">
              Date: {formatDate(invoice.createdAt)}
            </div>
          </div>
        </div>

        {/* Billed To & Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Billed To Customer
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{invoice.customerName}</div>
            <div className="text-slate-600 font-mono mt-0.5">+91 {invoice.customerPhone}</div>
            {invoice.customerGstin && (
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                GSTIN: <strong>{invoice.customerGstin}</strong>
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Relocation Addresses
            </span>
            <div className="text-slate-700 mt-1">
              <strong>Pickup:</strong> {invoice.pickupAddress}
            </div>
            <div className="text-slate-700 mt-1">
              <strong>Delivery:</strong> {invoice.deliveryAddress}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 text-left">Service Description</th>
                <th className="py-2.5 px-4 text-center w-24">SAC Code</th>
                <th className="py-2.5 px-4 text-right w-32">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">
                    Comprehensive Packers & Movers Service
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Safe loading, highway container transit, unloading, unpacking & domestic relocation
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-600">{invoice.sacCode || "9965"}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  ₹{invoice.subtotal.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing & Balance Calculation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* UPI QR Payment Block */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0">
              <QRCodeSVG value={upiPayload} size={90} />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Instant UPI Payment</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Scan with GPay, PhonePe, or Paytm to settle balance directly
              </p>
              {upiId && (
                <div className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                  {upiId}
                </div>
              )}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-2 px-3 bg-slate-50 font-medium">
              <span className="text-slate-600">Taxable Shifting Charges</span>
              <span className="font-mono">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {invoice.gstRate > 0 && (
              <div className="flex justify-between py-2 px-3">
                <span className="text-slate-600">GST ({invoice.gstRate}%)</span>
                <span className="font-mono">₹{invoice.gstAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between py-2.5 px-3 font-bold text-slate-900 bg-slate-50">
              <span>Total Invoice Amount</span>
              <span className="font-mono">₹{invoice.totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2 px-3 text-emerald-700 bg-emerald-50/50">
              <span>Advance Paid</span>
              <span className="font-mono font-semibold">₹{invoice.advancePaid.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2.5 px-3 bg-blue-50/80 text-blue-900 font-black text-sm border-t-2 border-blue-200">
              <span>Balance Due</span>
              <span className="font-mono text-base text-blue-700">₹{invoice.balanceDue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Customer Payment History Table (Visible on Screen & Print) */}
        {payments.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recorded Payment Receipts</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Mode</th>
                    <th className="py-2 px-3 text-left">Reference / Notes</th>
                    <th className="py-2 px-3 text-right">Amount Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono">{p.paymentDate}</td>
                      <td className="py-2 px-3 uppercase font-medium">{p.paymentMode}</td>
                      <td className="py-2 px-3 text-slate-500">{p.transactionRef || p.notes || "—"}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                        ₹{Number(p.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bank Details & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bank Account for Direct NEFT / RTGS
            </h5>
            <p>Bank: <strong>{company.bankDetails?.bankName || "State Bank of India"}</strong></p>
            <p>Account: <strong>{company.bankDetails?.accountNumber || "N/A"}</strong></p>
            <p>IFSC: <strong>{company.bankDetails?.ifsc || "N/A"}</strong></p>
          </div>
          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice & Terms
            </h5>
            <p>
              Please make all cheques or digital payments payable to <strong>{company.name || "1st Om Packers and Movers"}</strong>. 
              Payment is due upon successful unloading & verification at destination.
            </p>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Record Customer Payment
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3.5 text-xs">
              <FormField label="Payment Amount (₹)" required>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:border-blue-500 outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Current Balance Due: <strong>₹{invoice.balanceDue.toLocaleString("en-IN")}</strong>
                </span>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Payment Mode" required>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="neft">Bank / NEFT</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>

                <FormField label="Payment Date" required>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              <FormField label="UTR / Transaction Reference (Optional)">
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UPI Ref / Bank Txn ID"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Notes / Remarks">
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid balance upon delivery"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={recordingPayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {recordingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Payment...</span>
                  </>
                ) : (
                  <span>Save Payment & Update Balance</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;
