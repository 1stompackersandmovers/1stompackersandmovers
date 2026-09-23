import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
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
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteStatusMutation,
} from "../../../../store/apiSlices/quotesApiSlice";
import { useCreateJobMutation } from "../../../../store/apiSlices/jobsApiSlice";
import { companyConfig } from "../../../../configs/company.config";
import { FormField } from "../../../../components/FormField";

const QuoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quote, isLoading: loading } = useGetQuoteByIdQuery(id);
  const [updateQuoteStatus] = useUpdateQuoteStatusMutation();
  const [createJob, { isLoading: converting }] = useCreateJobMutation();

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [modalErrors, setModalErrors] = useState({});
  const [convertError, setConvertError] = useState("");

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

  const validateModal = () => {
    const errs = {};
    if (!jobForm.scheduledDate) errs.scheduledDate = "Scheduled moving date is required";
    if (!jobForm.vehicleAssigned.trim()) errs.vehicleAssigned = "Vehicle allocation is required";
    if (!jobForm.driverName.trim()) errs.driverName = "Driver name is required";
    if (jobForm.driverPhone.trim() && !/^\d{10}$/.test(jobForm.driverPhone.trim())) {
      errs.driverPhone = "Driver phone must be 10 digits";
    }
    setModalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConvertToJob = async (e) => {
    e.preventDefault();
    setConvertError("");
    if (!validateModal()) return;

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
      setConvertError(err.data?.error || err.message || "Failed to convert quote to job");
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
Client: ${quote.customerName}
Route: ${quote.movingFrom} ➔ ${quote.movingTo}
Move Date: ${quote.moveDate || "To be confirmed"}

*Estimated Charges:*
• Freight / Transport: ₹${quote.transportCharges}
• Packing & Materials: ₹${quote.packagingCharges}
• Loading & Placement: ₹${quote.loadingCharges + quote.unloadingCharges}
${quote.insuranceCharges ? `• Insurance Cover: ₹${quote.insuranceCharges}\n` : ""}${
    quote.discount ? `• Special Discount: -₹${quote.discount}\n` : ""
}• GST (${quote.gstRate}%): ₹${quote.gstAmount}
━━━━━━━━━━━━━━━━━━
*Total Amount Payable: ₹${quote.totalAmount}*
━━━━━━━━━━━━━━━━━━

For booking confirmation, reply to this message or call ${companyConfig.contact.primaryPhone}.
Govt Approved & Verified Mover.`;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Relational Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/quotes")}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quotes List</span>
          </button>

          {quote.leadId && (
            <Link
              to={`/leads/${quote.leadId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>← View Lead #{quote.leadId}</span>
            </Link>
          )}
        </div>

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
        {/* Header Strip */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md">
              1OM
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {companyConfig.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{companyConfig.tagline}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                GSTIN: {companyConfig.legal.gstin} | PAN: {companyConfig.legal.pan}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-black text-xs rounded-lg uppercase tracking-wider mb-1 font-mono">
              Quotation
            </span>
            <div className="text-sm font-mono font-bold text-slate-900">{quote.quoteNumber}</div>
            <div className="text-xs text-slate-500">
              Date: {new Date(quote.createdAt).toLocaleDateString("en-IN")}
            </div>
          </div>
        </div>

        {/* Customer & Route Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Customer Details
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{quote.customerName}</div>
            <div className="text-xs text-slate-600 flex items-center gap-1 font-mono mt-0.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+91 {quote.customerPhone}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Move Route & Schedule
            </span>
            <div className="text-xs font-medium text-slate-700 mt-1 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>From:</strong> {quote.movingFrom}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-700 mt-1 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>To:</strong> {quote.movingTo}
              </span>
            </div>
            {quote.moveDate && (
              <div className="text-xs font-medium text-slate-700 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>Target Date:</strong> {quote.moveDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Articles Table */}
        {inventory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Goods & Articles Included for Relocation
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 text-left w-12">#</th>
                    <th className="py-2 px-3 text-left">Article Description</th>
                    <th className="py-2 px-3 text-center w-24">Quantity</th>
                    <th className="py-2 px-3 text-right w-28">Est. Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{item.name}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-700">
                        {item.qty}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">
                        {item.cft * item.qty} CFT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Breakdown Sheet */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Professional Charge Breakdown
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-2.5 px-4 bg-slate-50/50 font-medium">
              <span className="text-slate-700">Safe Highway Transport Freight</span>
              <span className="font-mono font-semibold">
                ₹{quote.transportCharges.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between py-2.5 px-4">
              <span className="text-slate-600">
                Multi-layer Protective Packing & Materials
              </span>
              <span className="font-mono">₹{quote.packagingCharges.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4">
              <span className="text-slate-600">Skilled Loading Operations</span>
              <span className="font-mono">₹{quote.loadingCharges.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2.5 px-4">
              <span className="text-slate-600">Unloading & Placement at Destination</span>
              <span className="font-mono">₹{quote.unloadingCharges.toLocaleString("en-IN")}</span>
            </div>
            {quote.insuranceCharges > 0 && (
              <div className="flex justify-between py-2.5 px-4">
                <span className="text-slate-600">
                  Transit Insurance Cover (Declared Value: ₹
                  {quote.insuranceDeclaredValue.toLocaleString("en-IN")})
                </span>
                <span className="font-mono">
                  ₹{quote.insuranceCharges.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {quote.discount > 0 && (
              <div className="flex justify-between py-2.5 px-4 text-emerald-700 bg-emerald-50/50">
                <span className="font-medium">Special Promotional Discount</span>
                <span className="font-mono font-bold">
                  -₹{quote.discount.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2.5 px-4 bg-slate-50 font-semibold">
              <span className="text-slate-800">Taxable Subtotal</span>
              <span className="font-mono text-slate-900">
                ₹
                {(
                  quote.totalAmount - (quote.gstAmount || 0)
                ).toLocaleString("en-IN")}
              </span>
            </div>
            {quote.gstRate > 0 && (
              <div className="flex justify-between py-2.5 px-4 text-slate-700">
                <span>Goods & Service Tax (GST {quote.gstRate}%)</span>
                <span className="font-mono font-semibold">
                  ₹{quote.gstAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 px-4 bg-blue-50/80 text-blue-900 text-sm font-black border-t-2 border-blue-200">
              <span>Total Estimated Investment</span>
              <span className="font-mono text-base text-blue-700">
                ₹{quote.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Banking Details & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment & Bank Details
            </h5>
            <p>
              Bank: <strong>{companyConfig.bankDetails.bankName}</strong>
            </p>
            <p>
              Account: <strong>{companyConfig.bankDetails.accountNumber}</strong>
            </p>
            <p>
              IFSC: <strong>{companyConfig.bankDetails.ifsc}</strong>
            </p>
            <p>
              UPI ID: <strong>{companyConfig.bankDetails.upiId}</strong>
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Terms & Conditions
            </h5>
            <ul className="list-disc pl-4 space-y-0.5">
              {companyConfig.terms.quotation.slice(0, 3).map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Convert to Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Convert Quotation to Active Job
                </h3>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {convertError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{convertError}</span>
              </div>
            )}

            <form onSubmit={handleConvertToJob} className="space-y-3.5 text-xs">
              <FormField label="Scheduled Moving Date" required error={modalErrors.scheduledDate}>
                <input
                  type="date"
                  value={jobForm.scheduledDate}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, scheduledDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Preferred Time Slot">
                <input
                  type="text"
                  value={jobForm.scheduledTime}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, scheduledTime: e.target.value })
                  }
                  placeholder="e.g. 08:00 AM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Allocated Vehicle Type" required error={modalErrors.vehicleAssigned}>
                <input
                  type="text"
                  value={jobForm.vehicleAssigned}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, vehicleAssigned: e.target.value })
                  }
                  placeholder="e.g. Tata 407 (Closed Container)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Primary Driver Name" required error={modalErrors.driverName}>
                  <input
                    type="text"
                    value={jobForm.driverName}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, driverName: e.target.value })
                    }
                    placeholder="Driver Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>
                <FormField label="Driver Phone" error={modalErrors.driverPhone}>
                  <input
                    type="tel"
                    maxLength={10}
                    value={jobForm.driverPhone}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, driverPhone: e.target.value })
                    }
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Crew Assignment">
                <input
                  type="text"
                  value={jobForm.crewMembers}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, crewMembers: e.target.value })
                  }
                  placeholder="e.g. 4 Packers & Loaders"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Special Handling Instructions">
                <textarea
                  rows={2}
                  value={jobForm.specialNotes}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, specialNotes: e.target.value })
                  }
                  placeholder="Fragile items, mirror, floor climbing without lift, etc."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={converting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {converting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Active Job Record...</span>
                  </>
                ) : (
                  <span>Confirm & Create Active Job</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteDetail;
