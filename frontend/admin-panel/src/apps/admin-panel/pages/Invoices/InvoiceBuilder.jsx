import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Receipt, Building2, Calculator, ShieldCheck } from "lucide-react";
import { useCreateInvoiceMutation } from "../../../../store/apiSlices/invoicesApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const InvoiceBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobId, setJobId] = useState(searchParams.get("jobId") || "");
  const [customerName, setCustomerName] = useState(searchParams.get("name") || "");
  const [customerPhone, setCustomerPhone] = useState(searchParams.get("phone") || "");
  const [customerGstin, setCustomerGstin] = useState("");
  const [pickupAddress, setPickupAddress] = useState(searchParams.get("pickup") || "");
  const [deliveryAddress, setDeliveryAddress] = useState(searchParams.get("delivery") || "");
  const [sacCode, setSacCode] = useState(companyConfig.sacCode || "9965");

  const [subtotal, setSubtotal] = useState(15000);
  const [gstRate, setGstRate] = useState(18); // 0, 5, 18
  const [advancePaid, setAdvancePaid] = useState(5000);
  const [paymentMode, setPaymentMode] = useState("UPI");

  const [createInvoice, { isLoading: saving }] = useCreateInvoiceMutation();

  // Calculations
  const gstAmount = Math.round(((Number(subtotal) || 0) * (Number(gstRate) || 0)) / 100);
  const totalAmount = (Number(subtotal) || 0) + gstAmount;
  const balanceDue = Math.max(0, totalAmount - (Number(advancePaid) || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !pickupAddress || !deliveryAddress) {
      alert("Please fill in customer and address information.");
      return;
    }

    try {
      const payload = {
        jobId: jobId ? Number(jobId) : undefined,
        customerName,
        customerPhone,
        customerGstin: customerGstin || undefined,
        pickupAddress,
        deliveryAddress,
        sacCode,
        subtotal: Number(subtotal) || 0,
        gstRate: Number(gstRate) || 0,
        gstAmount,
        totalAmount,
        advancePaid: Number(advancePaid) || 0,
        balanceDue,
        paymentMode,
      };

      const res = await createInvoice(payload).unwrap();
      navigate(`/invoices/${res.invoice.id}`);
    } catch (err) {
      alert("Failed to generate invoice: " + (err.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create GST Tax Invoice</h2>
          <p className="text-xs text-slate-500">Official moving invoice with HSN/SAC code & UPI QR code</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer & Route */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Bill To & Relocation Addresses</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer / Company Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer GSTIN (Optional - For Corporate Claims)
              </label>
              <input
                type="text"
                value={customerGstin}
                onChange={(e) => setCustomerGstin(e.target.value)}
                placeholder="e.g. 20AAAAA0000A1Z5"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HSN / SAC Code
              </label>
              <input
                type="text"
                value={sacCode}
                onChange={(e) => setSacCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Address *
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Address *
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Amount & Payments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Charges & Payment Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Shifting & Freight Charges (Subtotal ₹) *
              </label>
              <input
                type="number"
                required
                value={subtotal}
                onChange={(e) => setSubtotal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GST Tax Rate
              </label>
              <div className="flex gap-2">
                {[0, 5, 18].map((rate) => (
                  <button
                    type="button"
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`flex-1 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                      gstRate === rate
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Advance Paid Amount (₹)
              </label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option>UPI</option>
                <option>Bank Transfer / NEFT</option>
                <option>Cash</option>
                <option>Cheque</option>
              </select>
            </div>
          </div>

          {/* Real-time Summary Box */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono">₹{Number(subtotal).toLocaleString("en-IN")}</span>
            </div>
            {gstRate > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>GST ({gstRate}%):</span>
                <span className="font-mono">₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
              <span>Total Invoice Amount:</span>
              <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Advance Paid:</span>
              <span className="font-mono">₹{Number(advancePaid).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-amber-400 pt-1 border-t border-slate-800">
              <span>Balance Due on Delivery:</span>
              <span className="font-mono">₹{balanceDue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? "Generating Tax Invoice..." : "Generate Official Tax Invoice"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceBuilder;
