import React, { useState } from "react";
import {
  Users,
  Plus,
  Phone,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Shield,
  Briefcase,
  UserCheck,
} from "lucide-react";
import {
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
} from "../../../../store/apiSlices/staffApiSlice";
import { FormField } from "../../../../components/FormField";

const ROLES = [
  { value: "driver", label: "Driver", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "supervisor", label: "Supervisor", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "packer", label: "Packer (Specialist)", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "loader", label: "Loader", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "helper", label: "Helper", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const TeamManagement = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: staffList = [], isLoading: loading, refetch } = useGetStaffQuery({
    role: roleFilter !== "all" ? roleFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [addStaff, { isLoading: adding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: updating }] = useUpdateStaffMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "loader",
    specialization: "",
    status: "available",
    idType: "Aadhaar",
    idNumber: "",
    address: "",
    dailyWage: 600,
    joiningDate: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setForm({
      name: "",
      phone: "",
      role: "loader",
      specialization: "",
      status: "available",
      idType: "Aadhaar",
      idNumber: "",
      address: "",
      dailyWage: 600,
      joiningDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s) => {
    setEditingStaff(s);
    setForm({
      name: s.name,
      phone: s.phone,
      role: s.role,
      specialization: s.specialization || "",
      status: s.status || "available",
      idType: s.idType || "Aadhaar",
      idNumber: s.idNumber || "",
      address: s.address || "",
      dailyWage: s.dailyWage || "",
      joiningDate: s.joiningDate || "",
      notes: s.notes || "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Staff name is required";
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errs.phone = "Enter a 10-digit mobile number";
    }
    if (!form.role) errs.role = "Role is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      if (editingStaff) {
        await updateStaff({ id: editingStaff.id, ...form }).unwrap();
      } else {
        await addStaff(form).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Failed to save team member");
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.specialization && s.specialization.toLowerCase().includes(q));
    const matchesRole = roleFilter === "all" || s.role === roleFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const availableCount = staffList.filter((s) => s.status === "available").length;
  const onMoveCount = staffList.filter((s) => s.status === "on_move").length;
  const onLeaveCount = staffList.filter((s) => s.status === "on_leave").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Team & Operations Crew</h2>
            <span className="bg-purple-50 text-purple-700 border border-purple-200/70 text-xs font-semibold px-2 py-0.5 rounded-full">
              {staffList.length} Personnel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisors, expert packers, loading crew, and driver directory
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer text-xs font-medium"
            title="Refresh staff list"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Crew</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{staffList.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Available</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{availableCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">On Move Jobs</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{onMoveCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">On Leave</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{onLeaveCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto text-xs">
          {["all", "driver", "supervisor", "packer", "loader", "helper"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-colors cursor-pointer ${
                roleFilter === r
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((s) => {
          const roleConfig = ROLES.find((r) => r.value === s.role) || {
            label: s.role,
            color: "bg-slate-100 text-slate-700 border-slate-200",
          };

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">{s.name}</h3>
                    <a
                      href={`tel:${s.phone}`}
                      className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>+91 {s.phone}</span>
                    </a>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${roleConfig.color}`}
                  >
                    {roleConfig.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      s.status === "available"
                        ? "bg-emerald-50 text-emerald-700"
                        : s.status === "on_move"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {s.status.replace("_", " ")}
                  </span>
                  {s.dailyWage && (
                    <span className="font-mono text-slate-500 font-medium">
                      ₹{s.dailyWage}/day base rate
                    </span>
                  )}
                </div>

                {s.specialization && (
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Specialty: {s.specialization}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(s)}
                  className="px-3 py-1.5 text-xs text-purple-600 hover:bg-purple-50 rounded-xl font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>{editingStaff ? "Edit Team Member" : "Add Team Member"}</span>
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
                <FormField label="Full Name" required error={formErrors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Raju Yadav"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none"
                  />
                </FormField>

                <FormField label="Phone Number" required error={formErrors.phone}>
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-purple-500 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Primary Role" required error={formErrors.role}>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-purple-500 outline-none cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-purple-500 outline-none cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="on_move">On Move</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Specialization / Skill">
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="e.g. Fragile glassware packing"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none"
                  />
                </FormField>

                <FormField label="Daily Base Wage (₹)">
                  <input
                    type="number"
                    min="0"
                    value={form.dailyWage}
                    onChange={(e) => setForm({ ...form, dailyWage: e.target.value })}
                    placeholder="e.g. 700"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-purple-500 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Govt ID Document">
                  <select
                    value={form.idType}
                    onChange={(e) => setForm({ ...form, idType: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:border-purple-500 outline-none cursor-pointer"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </FormField>

                <FormField label="ID Number">
                  <input
                    type="text"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    placeholder="e.g. 12-digit Aadhaar / DL #"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-purple-500 outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Residential Address">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Local address"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none"
                />
              </FormField>

              <FormField label="Notes & Background Check">
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Police verification completed, reliable loader, 5+ yrs experience..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={adding || updating}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {adding || updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Team Member...</span>
                  </>
                ) : (
                  <span>{editingStaff ? "Update Member Record" : "Save Team Member"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
