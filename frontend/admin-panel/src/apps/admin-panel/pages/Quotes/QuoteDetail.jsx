import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  CheckCircle,
  Truck,
  Building2,
  Calendar,
  Phone,
  MapPin,
  Clock,
  X,
} from "lucide-react";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteStatusMutation,
} from "../../../../store/apiSlices/quotesApiSlice";
import { useCreateJobMutation } from "../../../../store/apiSlices/jobsApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const QuoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quote, isLoading: loading } = useGetQuoteByIdQuery(id);
  const [updateQuoteStatus] = useUpdateQuoteStatusMutation();
  const [createJob, { isLoading: converting }] = useCreateJobMutation();

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  // Job form state
  const [jobForm, setJobForm] = useState({
    scheduledDate: "",
    scheduledTime: "08:00 AM",
    vehicleAssigned: "Tata 407 (Closed Container)",
    driverName: "",
    driverPhone: "",
    crewMembers: "4 Loaders + 1 Supervisor",
    specialNotes: "",
  });

  useEffect(() => {
    if (quote?.moveDate) {
      setJobForm((prev) => ({ ...prev, scheduledDate: quote.moveDate }));
    }
  }, [quote]);

  const handleUpdateStatus = async (status) => {
    try {
      await updateQuoteStatus({ id, status }).unwrap();
    } catch (err) {
      alert("Failed to update quote status: " + (err.data?.error || err.message));
    }
  };

  const handleConvertToJob = async (e) => {
    e.preventDefault();
    if (!jobForm.scheduledDate) {
      alert("Please select scheduled moving date.");
      return;
    }

    try {
      const res = await createJob({
        quoteId: quote.id,
        leadId: quote.leadId,
        customerName: quote.customerName,
        customerPhone: quote.customerPhone,
        pickupAddress: quote.movingFrom,
        deliveryAddress: quote.movingTo,
        scheduledDate: jobForm.scheduledDate,
        scheduledTime: jobForm.scheduledTime,
        vehicleAssigned: jobForm.vehicleAssigned,
        driverName: jobForm.driverName,
        driverPhone: jobForm.driverPhone,
        crewMembers: jobForm.crewMembers,
        specialNotes: jobForm.specialNotes,
      }).unwrap();

      setIsJobModalOpen(false);
      navigate(`/jobs/${res.job.id}`);
    } catch (err) {
      alert("Failed to convert quote to job: " + (err.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading quotation...</div>;
  }

  if (!quote) {
    return <div className="text-center py-12 text-rose-500 text-sm">Quotation not found.</div>;
  }

  const inventory = quote.inventoryData ? JSON.parse(quote.inventoryData) : [];

  const whatsAppMessage = `*Official Relocation Quotation from ${companyConfig.name}*
Quote No: ${quote.quoteNumber}
Customer: ${quote.customerName}
Route: ${quote.movingFrom} ➔ ${quote.movingTo}
-----------------------------
• Freight Charges: ₹${quote.transportCharges.toLocaleString("en-IN")}
• Packing & Material: ₹${quote.packagingCharges.toLocaleString("en-IN")}
• Loading Charges: ₹${quote.loadingCharges.toLocaleString("en-IN")}
• Unloading Charges: ₹${quote.unloadingCharges.toLocaleString("en-IN")}
${quote.insuranceCharges > 0 ? `• Transit Insurance: ₹${quote.insuranceCharges.toLocaleString("en-IN")}\n` : ""}${quote.discount > 0 ? `• Discount: -₹${quote.discount.toLocaleString("en-IN")}\n` : ""}${quote.gstAmount > 0 ? `• GST (${quote.gstRate}%): ₹${quote.gstAmount.toLocaleString("en-IN")}\n` : ""}-----------------------------
*Total Estimated Amount: ₹${quote.totalAmount.toLocaleString("en-IN")}*
-----------------------------
Payment Terms: 50% advance at loading, 50% balance before unloading.
Contact: ${companyConfig.phone} | ${companyConfig.email}`;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-2 print:hidden">
        <button
          onClick={() => navigate("/quotes")}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quotes List</span>
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
            href={`https://wa.me/91${quote.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              whatsAppMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Quote</span>
          </a>

          {quote.status !== "accepted" && (
            <button
              onClick={() => setIsJobModalOpen(true)}
              className="flex items-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Convert to Job</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Quotation Paper / Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
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
              <p>{companyConfig.headOffice.address}, {companyConfig.headOffice.city}, {companyConfig.headOffice.state} - {companyConfig.headOffice.pincode}</p>
              <p>Phone: {companyConfig.phone} | Email: {companyConfig.email}</p>
              <p className="font-semibold text-slate-800">GSTIN: {companyConfig.gstin} | SAC Code: {companyConfig.sacCode}</p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Formal Quotation
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">{quote.quoteNumber}</p>
            <p className="text-xs text-slate-500">
              Date: {new Date(quote.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            {quote.validUntil && (
              <p className="text-xs text-slate-500">Valid Until: {quote.validUntil}</p>
            )}
          </div>
        </div>

        {/* Customer & Route Details */}
        <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
              Quotation Prepared For
            </h4>
            <p className="text-sm font-bold text-slate-900">{quote.customerName}</p>
            <p className="font-mono text-slate-600">Phone: {quote.customerPhone}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
              Relocation Route
            </h4>
            <p className="text-slate-800"><span className="font-semibold">From:</span> {quote.movingFrom}</p>
            <p className="text-slate-800"><span className="font-semibold">To:</span> {quote.movingTo}</p>
            {quote.moveDate && (
              <p className="text-blue-700 font-semibold mt-1">Planned Date: {quote.moveDate}</p>
            )}
          </div>
        </div>

        {/* Inventory Table (if available) */}
        {inventory.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Surveyed Household Inventory
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Particulars / Goods Item</th>
                    <th className="py-2 px-3 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-medium text-slate-800">{item.name}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-700">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Cost & Estimation Breakdown
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Service Heads</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2 px-3">Freight & Dedicated Transportation Charges</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.transportCharges.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Standard Packing Material & Labor Charges</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.packagingCharges.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Loading Charges at Origin</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.loadingCharges.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Unloading & Placement Charges at Destination</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.unloadingCharges.toLocaleString("en-IN")}</td>
                </tr>
                {quote.insuranceCharges > 0 && (
                  <tr>
                    <td className="py-2 px-3">
                      Transit Insurance (Declared Value: ₹{quote.insuranceDeclaredValue?.toLocaleString("en-IN")} @ {quote.insuranceRatePercent}%)
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.insuranceCharges.toLocaleString("en-IN")}</td>
                  </tr>
                )}
                {quote.otherCharges > 0 && (
                  <tr>
                    <td className="py-2 px-3">Other Charges (Toll, Permits, Surcharges)</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.otherCharges.toLocaleString("en-IN")}</td>
                  </tr>
                )}
                {quote.discount > 0 && (
                  <tr className="text-emerald-700">
                    <td className="py-2 px-3">Special Discount</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">-₹{quote.discount.toLocaleString("en-IN")}</td>
                  </tr>
                )}
                {quote.gstAmount > 0 && (
                  <tr>
                    <td className="py-2 px-3">Goods & Services Tax (GST @ {quote.gstRate}%)</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">₹{quote.gstAmount.toLocaleString("en-IN")}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-black text-sm">
                <tr>
                  <td className="py-3 px-3">Total Estimated Amount</td>
                  <td className="py-3 px-3 text-right text-amber-400 font-mono text-base">
                    ₹{quote.totalAmount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Banking & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
          <div className="bg-slate-50 p-3 rounded-xl space-y-1">
            <h5 className="font-bold text-slate-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Bank Payment Details</span>
            </h5>
            <p>Account Name: <span className="font-semibold">{companyConfig.bankDetails.accountName}</span></p>
            <p>Bank: {companyConfig.bankDetails.bankName}</p>
            <p>A/C No: <span className="font-mono font-semibold">{companyConfig.bankDetails.accountNumber}</span></p>
            <p>IFSC: <span className="font-mono font-semibold">{companyConfig.bankDetails.ifsc}</span></p>
            <p className="text-blue-800 font-semibold">UPI ID: {companyConfig.upi.id}</p>
          </div>

          <div className="space-y-1 text-slate-500 text-[11px]">
            <h5 className="font-bold text-slate-700">Terms & Conditions:</h5>
            <ul className="list-disc pl-4 space-y-0.5">
              {companyConfig.terms.quotation.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Convert to Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Confirm Move & Create Active Job</span>
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertToJob} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheduled Moving Date *
                </label>
                <input
                  type="date"
                  required
                  value={jobForm.scheduledDate}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, scheduledDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Vehicle / Truck
                </label>
                <input
                  type="text"
                  value={jobForm.vehicleAssigned}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, vehicleAssigned: e.target.value })
                  }
                  placeholder="e.g. Tata 407 (JH-01-AB-1234)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={jobForm.driverName}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, driverName: e.target.value })
                    }
                    placeholder="Driver Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Phone
                  </label>
                  <input
                    type="tel"
                    value={jobForm.driverPhone}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, driverPhone: e.target.value })
                    }
                    placeholder="10-digit phone"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crew Assignment
                </label>
                <input
                  type="text"
                  value={jobForm.crewMembers}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, crewMembers: e.target.value })
                  }
                  placeholder="e.g. 4 Packers & Loaders"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Handling Instructions
                </label>
                <textarea
                  rows={2}
                  value={jobForm.specialNotes}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, specialNotes: e.target.value })
                  }
                  placeholder="Fragile items, mirror, floor climbing without lift, etc."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={converting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {converting ? "Creating Job Record..." : "Confirm & Create Active Job"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteDetail;
