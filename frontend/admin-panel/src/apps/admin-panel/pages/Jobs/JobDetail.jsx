import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Truck,
  Phone,
  MessageSquare,
  Receipt,
  FileText,
  Calendar,
  MapPin,
  User,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "../../../../store/apiSlices/jobsApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading: loading } = useGetJobByIdQuery(id);
  const [updateJob] = useUpdateJobMutation();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateJob({ id, status: newStatus }).unwrap();
    } catch (err) {
      alert("Failed to update status: " + (err.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading job...</div>;
  }

  if (!job) {
    return <div className="text-center py-12 text-rose-500 text-sm">Job not found.</div>;
  }

  const reviewMessage = `*Thank you for moving with ${companyConfig.name}!*
Dear ${job.customerName}, we hope your relocation to ${job.deliveryAddress} went smoothly.
Could you please take 30 seconds to leave us a 5-star review on Google? It means the world to our team!
👉 ${companyConfig.website}`;

  const dispatchMessage = `*Relocation Update from ${companyConfig.name}*
Dear ${job.customerName}, your moving truck has been dispatched!
Vehicle: ${job.vehicleAssigned || "Assigned Transport"}
Driver: ${job.driverName || "Our Staff"} (${job.driverPhone || companyConfig.phone})
Scheduled Date: ${job.scheduledDate} ${job.scheduledTime ? `at ${job.scheduledTime}` : ""}`;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigate("/jobs")}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Jobs List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate(
                `/invoices/new?jobId=${job.id}&name=${encodeURIComponent(
                  job.customerName
                )}&phone=${encodeURIComponent(
                  job.customerPhone
                )}&pickup=${encodeURIComponent(
                  job.pickupAddress
                )}&delivery=${encodeURIComponent(job.deliveryAddress)}`
              )
            }
            className="flex items-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Generate Tax Bill</span>
          </button>

          <button
            onClick={() =>
              navigate(
                `/bilties/new?jobId=${job.id}&consignor=${encodeURIComponent(
                  job.customerName
                )}&consignorPhone=${encodeURIComponent(
                  job.customerPhone
                )}&pickup=${encodeURIComponent(
                  job.pickupAddress
                )}&consignee=${encodeURIComponent(
                  job.customerName
                )}&consigneePhone=${encodeURIComponent(
                  job.customerPhone
                )}&delivery=${encodeURIComponent(
                  job.deliveryAddress
                )}&truck=${encodeURIComponent(
                  job.vehicleAssigned || ""
                )}&driver=${encodeURIComponent(
                  job.driverName || ""
                )}&driverPhone=${encodeURIComponent(job.driverPhone || "")}`
              )
            }
            className="flex items-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Bilty (LR)</span>
          </button>
        </div>
      </div>

      {/* Main Job Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-blue-600">
              {job.jobNumber}
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {job.customerName}
            </h2>
            <p className="text-xs text-slate-500 font-mono">{job.customerPhone}</p>
          </div>

          <div className="text-right">
            <span className="inline-block bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {job.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Status Switcher Bar */}
        <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Move Lifecycle:</span>
          <div className="flex gap-1.5">
            {["scheduled", "in_progress", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1 rounded-lg capitalize font-medium text-xs transition-colors cursor-pointer ${
                  job.status === st
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Route Details */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Route & Addresses
          </h4>
          <div className="space-y-1.5 text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Pickup Address:</span> {job.pickupAddress}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Delivery Address:</span> {job.deliveryAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Fleet Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl space-y-1">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Schedule Details</span>
            </h5>
            <p><span className="text-slate-500">Date:</span> <span className="font-bold text-slate-900">{job.scheduledDate}</span></p>
            {job.scheduledTime && (
              <p><span className="text-slate-500">Time:</span> {job.scheduledTime}</p>
            )}
            <p className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Crew: {job.crewMembers || "Standard relocation team"}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl space-y-1">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Fleet & Driver Allocation</span>
            </h5>
            <p><span className="text-slate-500">Vehicle:</span> <span className="font-bold text-slate-900">{job.vehicleAssigned || "To be allocated"}</span></p>
            <p><span className="text-slate-500">Driver:</span> {job.driverName || "Assigned at terminal"}</p>
            {job.driverPhone && (
              <p><span className="text-slate-500">Driver Phone:</span> <a href={`tel:${job.driverPhone}`} className="text-blue-600 font-mono underline">{job.driverPhone}</a></p>
            )}
          </div>
        </div>

        {job.specialNotes && (
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Special Handling Instructions:
            </span>
            <p>{job.specialNotes}</p>
          </div>
        )}

        {/* 1-Tap Customer WhatsApp Communication Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            1-Tap WhatsApp Customer Updates:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={`https://wa.me/91${job.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                dispatchMessage
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors text-center"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Send Truck Dispatch Update</span>
            </a>

            <a
              href={`https://wa.me/91${job.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                reviewMessage
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors text-center"
            >
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Send Completion & Review Request</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
