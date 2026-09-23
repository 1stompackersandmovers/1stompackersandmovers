import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  useGetInvoiceByIdQuery,
  useUpdateInvoicePaymentMutation,
} from "../../../../store/apiSlices/invoicesApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading: loading } = useGetInvoiceByIdQuery(id);
  const [updateInvoicePayment, { isLoading: updatingPayment }] =
    useUpdateInvoicePaymentMutation();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newAdvancePaid, setNewAdvancePaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");

  useEffect(() => {
    if (invoice) {
      setNewAdvancePaid(invoice.advancePaid?.toString() || "0");
      setPaymentMode(invoice.paymentMode || "UPI");
    }
  }, [invoice]);

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await updateInvoicePayment({
        id,
        advancePaid: Number(newAdvancePaid) || 0,
        paymentMode,
      }).unwrap();
      setIsPaymentModalOpen(false);
    } catch (err) {
      alert("Failed to update payment: " + (err.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-12 text-rose-500 text-sm">Invoice not found.</div>;
  }

  // Dynamic UPI Payment Intent String
  const upiPayload = `upi://pay?pa=${companyConfig.upi.id}&pn=${encodeURIComponent(
    companyConfig.upi.payeeName
  )}&am=${invoice.balanceDue > 0 ? invoice.balanceDue : invoice.totalAmount}&cu=INR&tn=${encodeURIComponent(
    invoice.invoiceNumber
  )}`;

  const whatsAppMessage = `*Tax Invoice from ${companyConfig.name}*
Invoice No: ${invoice.invoiceNumber}
Customer: ${invoice.customerName}
-----------------------------
Total Amount: ₹${invoice.totalAmount.toLocaleString("en-IN")}
Advance Paid: ₹${invoice.advancePaid.toLocaleString("en-IN")}
*Balance Due: ₹${invoice.balanceDue.toLocaleString("en-IN")}*
Status: ${invoice.paymentStatus.toUpperCase()}
-----------------------------
You can pay via UPI to: ${companyConfig.upi.id}
Bank: ${companyConfig.bankDetails.bankName} | A/C: ${companyConfig.bankDetails.accountNumber} | IFSC: ${companyConfig.bankDetails.ifsc}
-----------------------------
Thank you for choosing 1st Om Packers & Movers!`;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Bar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-2 print:hidden">
        <button
          onClick={() => navigate("/invoices")}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Invoices List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          <a
            href={`https://wa.me/91${invoice.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              whatsAppMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Bill</span>
          </a>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-900 text-white p-2 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight">
                  {companyConfig.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{companyConfig.tagline}</p>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-2 space-y-0.5">
              <p>{companyConfig.headOffice.address}, {companyConfig.headOffice.city}, {companyConfig.headOffice.state}</p>
              <p>Phone: {companyConfig.phone} | Email: {companyConfig.email}</p>
              <p className="font-semibold text-slate-900">
                GSTIN: {companyConfig.gstin} | PAN: {companyConfig.pan}
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Tax Invoice
            </span>
            <p className="text-base font-mono font-bold text-slate-900">{invoice.invoiceNumber}</p>
            <p className="text-xs text-slate-500">
              Date: {new Date(invoice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-xs text-slate-500">SAC Code: <span className="font-mono font-semibold">{invoice.sacCode}</span></p>
            <div className="pt-1">
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  invoice.paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : invoice.paymentStatus === "partial"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Route Details */}
        <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
              Billed To (Customer Details)
            </h4>
            <p className="text-sm font-bold text-slate-900">{invoice.customerName}</p>
            <p className="font-mono text-slate-600">Phone: {invoice.customerPhone}</p>
            {invoice.customerGstin && (
              <p className="font-mono text-blue-900 font-semibold mt-0.5">
                GSTIN: {invoice.customerGstin}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
              Relocation Addresses
            </h4>
            <p className="text-slate-800"><span className="font-semibold">From:</span> {invoice.pickupAddress}</p>
            <p className="text-slate-800"><span className="font-semibold">To:</span> {invoice.deliveryAddress}</p>
          </div>
        </div>

        {/* Invoice Line Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Description of Services</th>
                <th className="py-2.5 px-3">SAC Code</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-3">
                  <p className="font-semibold text-slate-900">
                    Household / Commercial Relocation & Transportation Charges
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Includes dedicated vehicle freight, professional packaging material, loading and unloading.
                  </p>
                </td>
                <td className="py-3 px-3 font-mono">{invoice.sacCode}</td>
                <td className="py-3 px-3 text-right font-mono font-semibold">
                  ₹{invoice.subtotal.toLocaleString("en-IN")}
                </td>
              </tr>
              {invoice.gstAmount > 0 && (
                <tr>
                  <td colSpan={2} className="py-2 px-3 font-medium text-slate-600 text-right">
                    Goods & Services Tax (GST @ {invoice.gstRate}%)
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">
                    ₹{invoice.gstAmount.toLocaleString("en-IN")}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t border-slate-200 bg-slate-50">
              <tr>
                <td colSpan={2} className="py-2.5 px-3 font-bold text-slate-800 text-right">
                  Total Bill Amount:
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-sm text-slate-900">
                  ₹{invoice.totalAmount.toLocaleString("en-IN")}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 px-3 font-semibold text-emerald-700 text-right">
                  Advance / Payment Received:
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">
                  -₹{invoice.advancePaid.toLocaleString("en-IN")}
                </td>
              </tr>
              <tr className="bg-slate-900 text-white font-black text-sm">
                <td colSpan={2} className="py-3 px-3 text-right uppercase tracking-wider">
                  Net Balance Due on Delivery:
                </td>
                <td className="py-3 px-3 text-right font-mono text-base text-amber-400">
                  ₹{invoice.balanceDue.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Dynamic UPI Payment QR Code & Bank Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="space-y-1 text-xs text-slate-700">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Bank & Payment Details</span>
            </h5>
            <p>A/C Name: <span className="font-semibold">{companyConfig.bankDetails.accountName}</span></p>
            <p>Bank: {companyConfig.bankDetails.bankName} ({companyConfig.bankDetails.branch})</p>
            <p>A/C No: <span className="font-mono font-bold">{companyConfig.bankDetails.accountNumber}</span></p>
            <p>IFSC: <span className="font-mono font-bold">{companyConfig.bankDetails.ifsc}</span></p>
            <p className="text-blue-900 font-bold">UPI ID: {companyConfig.upi.id}</p>
          </div>

          <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
            <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 inline-block">
              <QRCodeSVG value={upiPayload} size={110} level="M" />
            </div>
            <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Scan with GPay / PhonePe / Paytm</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Instant settlement to {companyConfig.upi.id}
            </p>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-2 text-slate-400 text-[10px] flex justify-between items-center border-t border-slate-100">
          <p>Subject to Ranchi jurisdiction. This is a computer-generated tax invoice.</p>
          <p className="font-bold text-slate-600">Authorised Signatory for {companyConfig.name}</p>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Record Payment / Update Advance
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Advance Paid So Far (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newAdvancePaid}
                  onChange={(e) => setNewAdvancePaid(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Total Bill: ₹{invoice.totalAmount.toLocaleString("en-IN")} | Balance remaining will be: ₹
                  {Math.max(0, invoice.totalAmount - (Number(newAdvancePaid) || 0)).toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={updatingPayment}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {updatingPayment ? "Updating..." : "Save Payment Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;
