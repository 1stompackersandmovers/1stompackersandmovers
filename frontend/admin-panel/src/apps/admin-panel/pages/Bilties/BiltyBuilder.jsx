import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, FileText, Truck, ShieldCheck } from "lucide-react";
import { useCreateBiltyMutation } from "../../../../store/apiSlices/biltiesApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const BiltyBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobId, setJobId] = useState(searchParams.get("jobId") || "");
  const [consignorName, setConsignorName] = useState(searchParams.get("consignor") || "");
  const [consignorPhone, setConsignorPhone] = useState(searchParams.get("consignorPhone") || "");
  const [consignorAddress, setConsignorAddress] = useState(searchParams.get("pickup") || "");

  const [consigneeName, setConsigneeName] = useState(searchParams.get("consignee") || "");
  const [consigneePhone, setConsigneePhone] = useState(searchParams.get("consigneePhone") || "");
  const [consigneeAddress, setConsigneeAddress] = useState(searchParams.get("delivery") || "");

  const [fromCity, setFromCity] = useState("Ranchi");
  const [toCity, setToCity] = useState("Patna");

  const [truckNumber, setTruckNumber] = useState(searchParams.get("truck") || "JH-01-AB-1234");
  const [driverName, setDriverName] = useState(searchParams.get("driver") || "");
  const [driverPhone, setDriverPhone] = useState(searchParams.get("driverPhone") || "");

  const [packagesCount, setPackagesCount] = useState(25);
  const [goodsDescription, setGoodsDescription] = useState(
    "Household Goods, Furniture & Personal Effects (Packed)"
  );
  const [declaredValue, setDeclaredValue] = useState(150000);
  const [freightAmount, setFreightAmount] = useState(18000);
  const [freightStatus, setFreightStatus] = useState("to_pay");
  const [riskType, setRiskType] = useState("owner_risk");

  const [createBilty, { isLoading: saving }] = useCreateBiltyMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consignorName || !consigneeName || !truckNumber || !driverName) {
      alert("Please fill in Consignor, Consignee, Truck # and Driver details.");
      return;
    }

    try {
      const payload = {
        jobId: jobId ? Number(jobId) : undefined,
        consignorName,
        consignorAddress,
        consignorPhone,
        consigneeName,
        consigneeAddress,
        consigneePhone,
        fromCity,
        toCity,
        truckNumber,
        driverName,
        driverPhone,
        packagesCount: Number(packagesCount) || 1,
        goodsDescription,
        declaredValue: Number(declaredValue) || 0,
        freightAmount: Number(freightAmount) || 0,
        freightStatus,
        riskType,
      };

      const res = await createBilty(payload).unwrap();
      navigate(`/bilties/${res.bilty.id}`);
    } catch (err) {
      alert("Failed to generate Bilty: " + (err.data?.error || err.message));
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Generate Consignment Note (Bilty / LR)</h2>
          <p className="text-xs text-slate-500">Official highway transit documentation under Carriage by Road Act</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Consignor (Sender) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Consignor Details (Sender / Origin)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consignor Name *
              </label>
              <input
                type="text"
                required
                value={consignorName}
                onChange={(e) => setConsignorName(e.target.value)}
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
                value={consignorPhone}
                onChange={(e) => setConsignorPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                From City / Terminal *
              </label>
              <input
                type="text"
                required
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Address *
              </label>
              <input
                type="text"
                required
                value={consignorAddress}
                onChange={(e) => setConsignorAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Consignee (Receiver) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Consignee Details (Receiver / Destination)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consignee Name *
              </label>
              <input
                type="text"
                required
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
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
                value={consigneePhone}
                onChange={(e) => setConsigneePhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                To City / Destination *
              </label>
              <input
                type="text"
                required
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Address *
              </label>
              <input
                type="text"
                required
                value={consigneeAddress}
                onChange={(e) => setConsigneeAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Transport & Truck Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>Vehicle, Driver & Highway Cargo Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Truck / Vehicle Reg Number *
              </label>
              <input
                type="text"
                required
                value={truckNumber}
                onChange={(e) => setTruckNumber(e.target.value)}
                placeholder="e.g. JH-01-AB-1234"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Driver Name *
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Driver full name"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Driver Mobile Phone
              </label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. of Packages / Boxes
              </label>
              <input
                type="number"
                value={packagesCount}
                onChange={(e) => setPackagesCount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Declared Goods Value (₹)
              </label>
              <input
                type="number"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Freight Charges (₹)
              </label>
              <input
                type="number"
                value={freightAmount}
                onChange={(e) => setFreightAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Freight Payment Status
              </label>
              <select
                value={freightStatus}
                onChange={(e) => setFreightStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option value="to_pay">To Pay (Pay on Delivery)</option>
                <option value="paid">Paid (Advance Cleared)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Risk Type
              </label>
              <select
                value={riskType}
                onChange={(e) => setRiskType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option value="owner_risk">Owner's Risk (Standard)</option>
                <option value="carrier_risk">Carrier's Risk (Insured)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Description of Goods Contained
              </label>
              <input
                type="text"
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? "Generating Bilty..." : "Generate Official Highway Bilty (LR)"}
        </button>
      </form>
    </div>
  );
};

export default BiltyBuilder;
