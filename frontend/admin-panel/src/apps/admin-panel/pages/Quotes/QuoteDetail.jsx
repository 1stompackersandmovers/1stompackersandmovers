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
  Edit2,
  Trash2,
} from "lucide-react";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteStatusMutation,
  useDeleteQuoteMutation,
} from "../../../../store/apiSlices/quotesApiSlice";
import { useCreateJobMutation } from "../../../../store/apiSlices/jobsApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { useGetVehiclesQuery } from "../../../../store/apiSlices/vehiclesApiSlice";
import { useGetStaffQuery } from "../../../../store/apiSlices/staffApiSlice";
import { FormField } from "../../../../components/FormField";

const QuoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quote, isLoading: loading } = useGetQuoteByIdQuery(id);
  const { data: dbSettings } = useGetSettingsQuery();
  const company = dbSettings || {};
  const [updateQuoteStatus] = useUpdateQuoteStatusMutation();
  const [deleteQuote, { isLoading: deleting }] = useDeleteQuoteMutation();
  const [createJob, { isLoading: converting }] = useCreateJobMutation();

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

  const handleDeleteQuote = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete quotation ${quote.quoteNumber}?`)) {
      return;
    }
    try {
      await deleteQuote(id).unwrap();
      navigate(quote.leadId ? `/leads/${quote.leadId}` : "/quotes");
    } catch (err) {
      alert("Failed to delete quotation: " + (err.data?.error || err.message));
    }
  };

  const { data: availableVehicles = [] } = useGetVehiclesQuery({});
  const { data: allStaff = [] } = useGetStaffQuery({});

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

  const whatsAppMessage = `*Official Relocation Quotation from ${company.name || "1st Om Packers and Movers"}*
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

For booking confirmation, reply to this message or call ${company.phone || "+91 7033488691"}.
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
            onClick={() => navigate(`/quotes/${quote.id}/edit`)}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
            <span>Edit Quote</span>
          </button>

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

          <button
            onClick={handleDeleteQuote}
            disabled={deleting}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Quotation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Quotation Paper / Sheet */}
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
                GSTIN: {company.gstin || "N/A"} | PAN: {company.pan || "N/A"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-black text-xs rounded-lg uppercase tracking-wider mb-1 font-mono">
              Quotation
            </span>
            <div className="text-sm font-mono font-bold text-slate-900">{quote.quoteNumber}</div>
            <div className="text-xs text-slate-500">
              Date: {formatDate(quote.createdAt)}
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

          {(quote.lead?.service || quote.lead?.moveType || quote.lead?.timeline) && (
            <div className="col-span-1 sm:col-span-2 bg-blue-50/70 p-3 rounded-lg border border-blue-100 flex flex-wrap gap-6 text-xs">
              {quote.lead?.service && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                    Service Requested
                  </span>
                  <span className="font-semibold text-slate-900">{quote.lead.service}</span>
                </div>
              )}
              {quote.lead?.moveType && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                    Move Category
                  </span>
                  <span className="font-semibold text-slate-900">{quote.lead.moveType}</span>
                </div>
              )}
              {quote.lead?.timeline && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                    Customer Timeline
                  </span>
                  <span className="font-semibold text-slate-900">{quote.lead.timeline}</span>
                </div>
              )}
            </div>
          )}
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
              Bank: <strong>{company.bankDetails?.bankName || "State Bank of India"}</strong>
            </p>
            <p>
              Account: <strong>{company.bankDetails?.accountNumber || "N/A"}</strong>
            </p>
            <p>
              IFSC: <strong>{company.bankDetails?.ifsc || "N/A"}</strong>
            </p>
            <p>
              UPI ID: <strong>{company.upi?.id || company.bankDetails?.upiId || "N/A"}</strong>
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Terms & Conditions
            </h5>
            <ul className="list-disc pl-4 space-y-0.5">
              {(company.terms?.quotation || [
                "Quotation is valid for 15 days from the date of issue.",
                "Toll tax, octroi, parking & state entry tax will be charged as actual if applicable.",
                "Transit Insurance will be charged extra at 3% on declared goods value."
              ]).slice(0, 3).map((term, i) => (
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
                <select
                  value={jobForm.scheduledTime}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, scheduledTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none bg-white"
                >
                  {["06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Allocated Vehicle" required error={modalErrors.vehicleAssigned}>
                {availableVehicles.filter((v) => v.status !== "retired").length === 0 ? (
                  <div className="w-full px-3 py-2 border border-amber-200 bg-amber-50 rounded-xl text-xs text-amber-700">
                    No vehicles added yet — add vehicles in Fleet section first.
                  </div>
                ) : (
                  <select
                    value=""
                    onChange={(e) => {
                      const v = availableVehicles.find((v) => v.id === parseInt(e.target.value));
                      if (v) setJobForm({
                        ...jobForm,
                        vehicleAssigned: `${v.vehicleNumber} (${v.vehicleType})`,
                        driverName: v.defaultDriverName || jobForm.driverName,
                        driverPhone: v.defaultDriverPhone || jobForm.driverPhone,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Select from fleet --</option>
                    {availableVehicles.filter((v) => v.status !== "retired").map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} — {v.vehicleType} [{v.status}]
                      </option>
                    ))}
                  </select>
                )}
                {jobForm.vehicleAssigned && (
                  <div className="mt-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex justify-between items-center">
                    <span>{jobForm.vehicleAssigned}</span>
                    <button type="button" onClick={() => setJobForm({ ...jobForm, vehicleAssigned: "" })} className="text-rose-500 hover:text-rose-700 font-bold ml-2">×</button>
                  </div>
                )}
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

              <FormField label="Crew Members">
                <div className="space-y-1.5">
                  {allStaff.filter((s) => s.status !== "inactive").length === 0 ? (
                    <div className="px-3 py-2 border border-amber-200 bg-amber-50 rounded-xl text-xs text-amber-700">
                      No crew added yet — add staff in Team section.
                    </div>
                  ) : (
                    <select
                      value=""
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const s = allStaff.find((s) => s.id === parseInt(e.target.value));
                        if (!s) return;
                        const entry = `${s.name} (${s.role})`;
                        const current = jobForm.crewMembers ? jobForm.crewMembers.split(", ").filter(Boolean) : [];
                        if (!current.includes(entry)) {
                          setJobForm({ ...jobForm, crewMembers: [...current, entry].join(", ") });
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">+ Add crew member from team...</option>
                      {allStaff.filter((s) => s.status !== "inactive").map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.role} [{s.status}]
                        </option>
                      ))}
                    </select>
                  )}
                  {jobForm.crewMembers && (
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex justify-between items-start gap-2">
                      <span>{jobForm.crewMembers}</span>
                      <button type="button" onClick={() => setJobForm({ ...jobForm, crewMembers: "" })} className="text-rose-500 hover:text-rose-700 font-bold shrink-0">Clear</button>
                    </div>
                  )}
                </div>
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
