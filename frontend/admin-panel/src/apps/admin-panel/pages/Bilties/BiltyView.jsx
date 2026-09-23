import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  Truck,
  ShieldCheck,
  Building2,
  FileText,
} from "lucide-react";
import { useGetBiltyByIdQuery } from "../../../../store/apiSlices/biltiesApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const BiltyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bilty, isLoading: loading } = useGetBiltyByIdQuery(id);

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading consignment note...</div>;
  }

  if (!bilty) {
    return <div className="text-center py-12 text-rose-500 text-sm">Bilty not found.</div>;
  }

  const whatsAppMessage = `*Official Consignment Note (LR/Bilty) from ${companyConfig.name}*
LR No: ${bilty.lrNumber}
Truck No: ${bilty.truckNumber}
Driver: ${bilty.driverName} (${bilty.driverPhone || "N/A"})
From: ${bilty.fromCity} ➔ To: ${bilty.toCity}
Packages: ${bilty.packagesCount} units
Freight: ₹${bilty.freightAmount.toLocaleString("en-IN")} (${bilty.freightStatus.toUpperCase()})
Risk: ${bilty.riskType.toUpperCase().replace("_", " ")}
-----------------------------
Emergency Transport Helpline: ${companyConfig.phone}`;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Bar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-2 print:hidden">
        <button
          onClick={() => navigate("/bilties")}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bilties List</span>
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
            href={`https://wa.me/91${bilty.consignorPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              whatsAppMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp to Sender / Driver</span>
          </a>
        </div>
      </div>

      {/* Official Lorry Receipt / Bilty Printable Sheet */}
      <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 sm:p-8 shadow-sm space-y-5 print:border-2 print:border-black print:shadow-none print:p-4">
        {/* LR Top Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 text-amber-400 p-2 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {companyConfig.name}
                </h1>
                <p className="text-[11px] font-semibold text-slate-600">
                  GOVT. REGD. PACKERS & HIGHWAY TRANSPORT CONTRACTORS
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Head Office: {companyConfig.headOffice.address}, {companyConfig.headOffice.city}, {companyConfig.headOffice.state}
            </p>
            <p className="text-xs font-semibold text-slate-800">
              GSTIN: {companyConfig.gstin} | Helpline: {companyConfig.phone}
            </p>
          </div>

          <div className="sm:text-right border-2 border-slate-900 p-2 rounded-xl bg-slate-50 min-w-44">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
              CONSIGNMENT NOTE (LR)
            </span>
            <p className="text-base font-black font-mono text-blue-900">{bilty.lrNumber}</p>
            <p className="text-xs text-slate-700 font-semibold">
              Date: {new Date(bilty.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Consignor & Consignee Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-300 rounded-xl p-3 text-xs">
          <div className="border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-3 space-y-1">
            <span className="bg-slate-800 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
              CONSIGNOR (SENDER)
            </span>
            <p className="text-sm font-bold text-slate-900 pt-1">{bilty.consignorName}</p>
            <p className="text-slate-600">Phone: <span className="font-mono">{bilty.consignorPhone}</span></p>
            <p className="text-slate-700">From City: <span className="font-bold">{bilty.fromCity}</span></p>
            <p className="text-slate-600">Pickup Address: {bilty.consignorAddress}</p>
          </div>

          <div className="space-y-1 sm:pl-2">
            <span className="bg-slate-800 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
              CONSIGNEE (RECEIVER)
            </span>
            <p className="text-sm font-bold text-slate-900 pt-1">{bilty.consigneeName}</p>
            <p className="text-slate-600">Phone: <span className="font-mono">{bilty.consigneePhone}</span></p>
            <p className="text-slate-700">To City: <span className="font-bold">{bilty.toCity}</span></p>
            <p className="text-slate-600">Delivery Address: {bilty.consigneeAddress}</p>
          </div>
        </div>

        {/* Vehicle & Highway Details Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Vehicle Reg No.</span>
            <span className="font-black font-mono text-sm text-slate-900">{bilty.truckNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Driver Name</span>
            <span className="font-bold text-slate-900">{bilty.driverName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Driver Mobile</span>
            <span className="font-mono font-bold text-slate-900">{bilty.driverPhone || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Risk Coverage</span>
            <span className="font-bold text-amber-700 uppercase">{bilty.riskType.replace("_", " ")}</span>
          </div>
        </div>

        {/* Goods Description & Packages */}
        <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white font-semibold">
              <tr>
                <th className="py-2 px-3">No. of Pkgs</th>
                <th className="py-2 px-3">Description of Goods (Said to Contain)</th>
                <th className="py-2 px-3 text-right">Declared Value (₹)</th>
                <th className="py-2 px-3 text-right">Freight Charges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-sm">{bilty.packagesCount} Boxes</td>
                <td className="py-3 px-3">
                  <p className="font-semibold">{bilty.goodsDescription}</p>
                  <p className="text-[10px] text-slate-500">Carefully packed in corrugated boxes & bubble wrap.</p>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold">
                  ₹{bilty.declaredValue.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <span className="block font-black text-sm text-slate-900">
                    ₹{bilty.freightAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-blue-700">
                    [{bilty.freightStatus.replace("_", " ")}]
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legal Terms & Signatures */}
        <div className="space-y-4 pt-2">
          <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-200 pt-2">
            <p className="font-bold text-slate-700">NOTICE & CONDITIONS:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {companyConfig.terms.bilty.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-[11px] font-bold text-slate-700">
            <div className="border-t border-slate-400 pt-1">
              Consignor / Sender Signature
            </div>
            <div className="border-t border-slate-400 pt-1">
              Driver Signature
            </div>
            <div className="border-t border-slate-400 pt-1">
              For {companyConfig.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiltyView;
