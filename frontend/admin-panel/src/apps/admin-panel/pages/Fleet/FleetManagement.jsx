import React, { useState } from "react";
import {
  Truck,
  Plus,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Phone,
  Shield,
  FileText,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useGetVehiclesQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
} from "../../../../store/apiSlices/vehiclesApiSlice";
import { FormField } from "../../../../components/FormField";

const VEHICLE_TYPES = [
  "Tata 407 (Closed Container)",
  "Tata 407 (Open Body)",
  "Tata Ace / Chhota Hathi",
  "Mahindra Bolero Pickup",
  "14ft Container Truck",
  "17ft Container Truck",
  "19ft Container Truck",
  "22ft Multi-Axle Container",
  "32ft High-Capacity Container",
];

const FleetManagement = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vehicles = [], isLoading: loading, refetch } = useGetVehiclesQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [addVehicle, { isLoading: adding }] = useAddVehicleMutation();
  const [updateVehicle, { isLoading: updating }] = useUpdateVehicleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: VEHICLE_TYPES[0],
    capacityTons: 2.5,
    capacityCft: 450,
    defaultDriverName: "",
    defaultDriverPhone: "",
    status: "available",
    insuranceExpiry: "",
    fitnessExpiry: "",
    permitExpiry: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setForm({
      vehicleNumber: "",
      vehicleType: VEHICLE_TYPES[0],
      capacityTons: 2.5,
      capacityCft: 450,
      defaultDriverName: "",
      defaultDriverPhone: "",
      status: "available",
      insuranceExpiry: "",
      fitnessExpiry: "",
      permitExpiry: "",
      notes: "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (v) => {
    setEditingVehicle(v);
    setForm({
      vehicleNumber: v.vehicleNumber,
      vehicleType: v.vehicleType,
      capacityTons: v.capacityTons || "",
      capacityCft: v.capacityCft || "",
      defaultDriverName: v.defaultDriverName || "",
      defaultDriverPhone: v.defaultDriverPhone || "",
      status: v.status || "available",
      insuranceExpiry: v.insuranceExpiry || "",
      fitnessExpiry: v.fitnessExpiry || "",
      permitExpiry: v.permitExpiry || "",
      notes: v.notes || "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.vehicleNumber.trim()) errs.vehicleNumber = "Vehicle number is required";
    if (!form.vehicleType) errs.vehicleType = "Vehicle type is required";
    if (form.defaultDriverPhone && !/^\d{10}$/.test(form.defaultDriverPhone.trim())) {
      errs.defaultDriverPhone = "Driver phone must be 10 digits";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      if (editingVehicle) {
        await updateVehicle({ id: editingVehicle.id, ...form }).unwrap();
      } else {
        await addVehicle(form).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Failed to save vehicle");
    }
  };

  // Expiry check helpers
  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const now = new Date();
    const target = new Date(dateStr);
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const renderExpiryBadge = (label, dateStr) => {
    if (!dateStr) return null;
    const days = getDaysUntil(dateStr);
    let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
    let icon = null;

    if (days <= 0) {
      colorClass = "bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse";
      icon = <AlertTriangle className="w-3 h-3 text-rose-600" />;
    } else if (days <= 30) {
      colorClass = "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      icon = <AlertCircle className="w-3 h-3 text-rose-500" />;
    } else if (days <= 90) {
      colorClass = "bg-amber-50 text-amber-800 border-amber-200";
      icon = <AlertCircle className="w-3 h-3 text-amber-500" />;
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border ${colorClass}`}>
        {icon}
        <span>{label}: {days <= 0 ? "Expired!" : `${days}d left`}</span>
      </span>
    );
  };

  // Find critical document expiries across all vehicles for top banner
  const criticalExpiries = vehicles.filter((v) => {
    const d1 = getDaysUntil(v.insuranceExpiry);
    const d2 = getDaysUntil(v.fitnessExpiry);
    const d3 = getDaysUntil(v.permitExpiry);
    return (d1 !== null && d1 <= 30) || (d2 !== null && d2 <= 30) || (d3 !== null && d3 <= 30);
  });

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(q) ||
      v.vehicleType.toLowerCase().includes(q) ||
      (v.defaultDriverName && v.defaultDriverName.toLowerCase().includes(q));
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableCount = vehicles.filter((v) => v.status === "available").length;
  const onMoveCount = vehicles.filter((v) => v.status === "on_move").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "maintenance").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fleet & Transport Assets</h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-semibold px-2 py-0.5 rounded-full">
              {vehicles.length} Vehicles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Trucks, containers, live availability, and highway compliance documents
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer text-xs font-medium"
            title="Refresh fleet list"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Critical Expiry Warning Sticky Banner */}
      {criticalExpiries.length > 0 && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong className="font-bold">Compliance Alert: </strong>
              <span>
                {criticalExpiries.length} vehicle(s) have insurance, fitness, or road permits expiring within 30 days! Please renew to avoid transport fines on highways.
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {criticalExpiries.map((v) => (
              <span key={v.id} className="font-mono bg-white text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-bold text-[11px]">
                {v.vehicleNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Fleet</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{vehicles.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Available</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{availableCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">On Highway Move</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{onMoveCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">In Maintenance</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{maintenanceCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by truck # or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto text-xs">
          {["all", "available", "on_move", "maintenance", "retired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-mono font-black text-base text-slate-900 tracking-tight">
                    {v.vehicleNumber}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{v.vehicleType}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    v.status === "available"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : v.status === "on_move"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : v.status === "maintenance"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {v.status.replace("_", " ")}
                </span>
              </div>

              {/* Capacities */}
              <div className="flex items-center gap-2 text-xs">
                {v.capacityTons && (
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 font-medium text-slate-600">
                    {v.capacityTons} Tons
                  </span>
                )}
                {v.capacityCft && (
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 font-medium text-slate-600">
                    {v.capacityCft} CFT Volume
                  </span>
                )}
              </div>

              {/* Driver */}
              {v.defaultDriverName && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <div className="font-medium text-slate-800">
                    {v.defaultDriverName} {v.defaultDriverPhone && `(${v.defaultDriverPhone})`}
                  </div>
                </div>
              )}

              {/* Expiry badges */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                {renderExpiryBadge("Insurance", v.insuranceExpiry)}
                {renderExpiryBadge("Fitness", v.fitnessExpiry)}
                {renderExpiryBadge("Permit", v.permitExpiry)}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(v)}
                className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-xl font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit / Status</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>{editingVehicle ? "Edit Fleet Vehicle" : "Add Vehicle to Fleet"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Vehicle Number" required error={formErrors.vehicleNumber}>
                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. JH-01-AB-1234"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono uppercase text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>

                <FormField label="Vehicle Status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="on_move">On Move</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Vehicle Type / Container Model" required error={formErrors.vehicleType}>
                <select
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  {VEHICLE_TYPES.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Payload Capacity (Tons)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.capacityTons}
                    onChange={(e) => setForm({ ...form, capacityTons: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>

                <FormField label="Volume Capacity (CFT)">
                  <input
                    type="number"
                    value={form.capacityCft}
                    onChange={(e) => setForm({ ...form, capacityCft: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Default Assigned Driver">
                  <input
                    type="text"
                    value={form.defaultDriverName}
                    onChange={(e) => setForm({ ...form, defaultDriverName: e.target.value })}
                    placeholder="Driver full name"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>

                <FormField label="Driver Phone Number" error={formErrors.defaultDriverPhone}>
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.defaultDriverPhone}
                    onChange={(e) => setForm({ ...form, defaultDriverPhone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              {/* Compliance & Document Dates */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Legal Transit & Compliance Expiry Dates:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <FormField label="Insurance Expiry">
                    <input
                      type="date"
                      value={form.insuranceExpiry}
                      onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
                    />
                  </FormField>

                  <FormField label="Fitness Cert Expiry">
                    <input
                      type="date"
                      value={form.fitnessExpiry}
                      onChange={(e) => setForm({ ...form, fitnessExpiry: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
                    />
                  </FormField>

                  <FormField label="Road Permit Expiry">
                    <input
                      type="date"
                      value={form.permitExpiry}
                      onChange={(e) => setForm({ ...form, permitExpiry: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
                    />
                  </FormField>
                </div>
              </div>

              <FormField label="Notes & Vehicle Remarks">
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. GPS tracked, FASTag installed, serviced in Ranchi terminal..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={adding || updating}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {adding || updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Vehicle...</span>
                  </>
                ) : (
                  <span>{editingVehicle ? "Update Vehicle Record" : "Save Vehicle to Fleet"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
