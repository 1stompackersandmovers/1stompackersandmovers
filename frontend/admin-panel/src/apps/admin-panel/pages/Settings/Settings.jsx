import {
  AlertCircle,
  Building2,
  Check,
  CreditCard,
  Database,
  Download,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Key,
  Lock,
  Mail,
  MapPin,
  QrCode,
  RefreshCw,
  Save,
  Shield,
  ShieldCheck,
  Sliders,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../store/AuthContext";
import { api, setAuthToken } from "../../../../util/api";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../../../store/apiSlices/settingsApiSlice";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangePasswordMutation,
  useToggleTwoFactorMutation,
} from "../../../../store/apiSlices/adminApiSlice";

const Settings = () => {
  const { admin, setAdminProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("company");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // RTK Query Hooks
  const { data: dbSettings, isLoading: isSettingsLoading } =
    useGetSettingsQuery();
  const { data: profileRes, isLoading: isProfileLoading } =
    useGetAdminProfileQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateSettingsMutation();
  const [updateAdminProfile, { isLoading: profileSaving }] =
    useUpdateAdminProfileMutation();
  const [changePassword, { isLoading: passwordSaving }] =
    useChangePasswordMutation();
  const [toggleTwoFactor, { isLoading: toggling2FA }] =
    useToggleTwoFactorMutation();

  const isLoading = isSettingsLoading || isProfileLoading;

  // Admin Profile & Security State
  const [profileUsername, setProfileUsername] = useState(admin?.username || "");
  const [profileEmail, setProfileEmail] = useState(admin?.email || "");
  const [twoFactorActive, setTwoFactorActive] = useState(
    !!admin?.twoFactorEnabled,
  );
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Settings State (Loaded directly from Database)
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    gstin: "",
    pan: "",
    sacCode: "9965",
    headOffice: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    },
    upi: {
      id: "",
      payeeName: "",
    },
    bankDetails: {
      accountName: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
      branch: "",
    },
    terms: {
      quotation: [],
      invoice: [],
      bilty: [],
    },
  });

  // Sync settings when loaded from RTK Query
  useEffect(() => {
    if (dbSettings) {
      setFormData((prev) => ({
        ...prev,
        ...dbSettings,
        headOffice: {
          ...prev.headOffice,
          ...(dbSettings.headOffice || {}),
        },
        upi: { ...prev.upi, ...(dbSettings.upi || {}) },
        bankDetails: {
          ...prev.bankDetails,
          ...(dbSettings.bankDetails || {}),
        },
        terms: {
          quotation: dbSettings.terms?.quotation || prev.terms.quotation,
          invoice: dbSettings.terms?.invoice || prev.terms.invoice,
          bilty: dbSettings.terms?.bilty || prev.terms.bilty,
        },
      }));
    }
  }, [dbSettings]);

  // Sync admin profile when loaded from RTK Query or auth state
  useEffect(() => {
    if (profileRes?.admin) {
      const adminData = profileRes.admin;
      setProfileUsername(adminData.username || "");
      setProfileEmail(adminData.email || "");
      setTwoFactorActive(!!adminData.twoFactorEnabled);
    } else if (admin) {
      setProfileUsername(admin.username || "");
      setProfileEmail(admin.email || "");
      setTwoFactorActive(!!admin.twoFactorEnabled);
    }
  }, [profileRes, admin?.username, admin?.email, admin?.twoFactorEnabled]);

  // Update Username and Email Profile via RTK Query mutation
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    try {
      const res = await updateAdminProfile({
        username: profileUsername,
        email: profileEmail,
      }).unwrap();

      if (res.token) {
        setAuthToken(res.token);
      }
      if (res.admin) {
        setAdminProfile(res.admin);
      }
      setProfileSuccess("Account username & email updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(
        err.data?.error || err.message || "Failed to update account profile",
      );
    }
  };

  // Toggle Two-Factor Authentication (2FA) via RTK Query mutation
  const handleToggle2FA = async () => {
    if (!twoFactorActive && !profileEmail) {
      setProfileError(
        "Please enter and save a valid email address before enabling 2FA.",
      );
      return;
    }

    setProfileSuccess("");
    setProfileError("");

    try {
      const targetState = !twoFactorActive;
      const res = await toggleTwoFactor({ enabled: targetState }).unwrap();
      setTwoFactorActive(res.twoFactorEnabled);
      setAdminProfile({ twoFactorEnabled: res.twoFactorEnabled });
      setProfileSuccess(res.message);
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(err.data?.error || err.message || "Failed to toggle 2FA");
    }
  };

  // Change Admin Password via RTK Query mutation
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();
      setPasswordSuccess(res.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err) {
      setPasswordError(
        err.data?.error || err.message || "Failed to update password",
      );
    }
  };

  // Save Company Settings via RTK Query mutation
  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    try {
      await updateSettings(formData).unwrap();
      setSavedSuccess(true);
      setStatusMessage("Settings updated successfully!");
      setTimeout(() => {
        setSavedSuccess(false);
        setStatusMessage("");
      }, 3500);
    } catch (err) {
      console.error("Save settings failed:", err);
      setErrorMessage(
        err.data?.error ||
          err.message ||
          "Failed to save settings. Please try again.",
      );
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  // Export full operations backup (Leads, Quotes, Jobs, Invoices, Bilties)
  const handleExportData = async () => {
    setExporting(true);
    try {
      const [leadsRes, quotesRes, jobsRes, invoicesRes, biltiesRes] =
        await Promise.allSettled([
          api.get("/leads"),
          api.get("/quotes"),
          api.get("/jobs"),
          api.get("/invoices"),
          api.get("/bilties"),
        ]);

      const backupData = {
        exportDate: new Date().toISOString(),
        company: formData.name,
        adminUser: admin?.username || "Account",
        leads:
          leadsRes.status === "fulfilled" ? leadsRes.value.leads || [] : [],
        quotes:
          quotesRes.status === "fulfilled" ? quotesRes.value.quotes || [] : [],
        jobs: jobsRes.status === "fulfilled" ? jobsRes.value.jobs || [] : [],
        invoices:
          invoicesRes.status === "fulfilled"
            ? invoicesRes.value.invoices || []
            : [],
        bilties:
          biltiesRes.status === "fulfilled"
            ? biltiesRes.value.bilties || []
            : [],
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `1stom_ops_backup_${new Date().toISOString().slice(0, 10)}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert("Failed to export backup data: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "compliance", label: "Tax & Compliance", icon: FileText },
    { id: "payments", label: "UPI & Banking", icon: CreditCard },
    { id: "security", label: "Account Settings", icon: ShieldCheck },
    { id: "backup", label: "Data Backup", icon: Database },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              System & Company Settings
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure company identity, GST tax details, UPI accounts, terms,
            and account preferences
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>Loading...</span>
            </span>
          </div>
        )}
      </div>

      {/* Alert Banners Below the Header Strip */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {statusMessage || "Settings saved successfully!"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Tab 1: Company Profile & Contact Info */}
        {activeTab === "company" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Brand Identity & Legal Name</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Appears on invoices, bilties, and formal documents.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Brand Display Name (Short Name)
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) =>
                      setFormData({ ...formData, shortName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Head Office */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Head Office & Contact Channels</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Primary Hotline *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      WhatsApp Support *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Support Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Head Office Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.headOffice.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        headOffice: {
                          ...formData.headOffice,
                          address: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.headOffice.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headOffice: {
                            ...formData.headOffice,
                            city: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.headOffice.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headOffice: {
                            ...formData.headOffice,
                            state: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.headOffice.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headOffice: {
                            ...formData.headOffice,
                            pincode: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tax & Compliance */}
        {activeTab === "compliance" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>GST Registration & Statutory Codes</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) =>
                      setFormData({ ...formData, gstin: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs uppercase"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Printed on Tax Invoices & Bilty notes.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Permanent Account Number (PAN)
                  </label>
                  <input
                    type="text"
                    value={formData.pan}
                    onChange={(e) =>
                      setFormData({ ...formData, pan: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    GTA SAC / HSN Code
                  </label>
                  <input
                    type="text"
                    value={formData.sacCode}
                    onChange={(e) =>
                      setFormData({ ...formData, sacCode: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default 9965 (Goods Transport Agency).
                  </p>
                </div>
              </div>
            </div>

            {/* Standard Terms & Conditions for Documents */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Default Document Terms & Conditions</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quotation Terms (One term per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.terms.quotation.join("\n")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terms: {
                          ...formData.terms,
                          quotation: e.target.value.split("\n").filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Invoice Terms & Conditions (One term per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.terms.invoice.join("\n")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terms: {
                          ...formData.terms,
                          invoice: e.target.value.split("\n").filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bilty / Consignment Carrier Terms (One term per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.terms.bilty.join("\n")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terms: {
                          ...formData.terms,
                          bilty: e.target.value.split("\n").filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Banking & UPI */}
        {activeTab === "payments" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic UPI Payment Settings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>UPI Payment & Instant QR Generation</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Virtual Payment Address (VPA / UPI ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.upi.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        upi: { ...formData.upi, id: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used to render dynamic payment QR codes on invoices.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    UPI Payee Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.upi.payeeName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        upi: { ...formData.upi, payeeName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* NEFT / RTGS Bank Transfer Account */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Official Bank Account (NEFT / RTGS)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: {
                          ...formData.bankDetails,
                          accountName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.bankDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: {
                            ...formData.bankDetails,
                            bankName: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={formData.bankDetails.branch}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: {
                            ...formData.bankDetails,
                            branch: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: {
                            ...formData.bankDetails,
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={formData.bankDetails.ifsc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: {
                            ...formData.bankDetails,
                            ifsc: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Admin Account & Security */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Top Feedback Alerts */}
            {profileSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Account Profile (Username & Email) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Account Profile</span>
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Username *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={profileUsername}
                        onChange={(e) => setProfileUsername(e.target.value)}
                        placeholder="username"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="account@1stompackersandmovers.com"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Used to receive verification codes for two-step
                      authentication and password resets.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={profileSaving}
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {profileSaving && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      )}
                      <span>
                        {profileSaving
                          ? "Saving Profile..."
                          : "Update Profile Details"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Two-Factor Authentication (2FA) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Two-Factor Authentication</span>
                  </h3>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      twoFactorActive
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                        : "text-slate-600 bg-slate-100 border-slate-200"
                    }`}
                  >
                    {twoFactorActive ? "ENABLED" : "DISABLED"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Enhance account security with two-step email verification.
                  When active, sign-ins will require entering a one-time 6-digit
                  code delivered to{" "}
                  <strong className="text-slate-900 font-mono">
                    {profileEmail || "(no email registered)"}
                  </strong>
                  .
                </p>

                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        twoFactorActive
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {twoFactorActive
                          ? "Two-Step Verification Active"
                          : "Standard Sign-In Mode"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {twoFactorActive
                          ? "Email verification code required on every sign-in"
                          : "Direct sign-in using password only"}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    disabled={toggling2FA}
                    onClick={handleToggle2FA}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      twoFactorActive ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                    role="switch"
                    aria-checked={twoFactorActive}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        twoFactorActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {!profileEmail && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      Please enter and save your email address in the
                      Account Profile box before enabling two-factor
                      authentication.
                    </span>
                  </div>
                )}
              </div>

              {/* Card 3: Change Password Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Change Account Password</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        New Password (min 6) *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={
                        passwordSaving ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {passwordSaving && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      )}
                      <span>
                        {passwordSaving
                          ? "Updating Password..."
                          : "Update Password"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4: Account Security Guidelines */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Account Security Guidelines</span>
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
                    <p className="font-semibold text-slate-800">
                      Best Practices for Account Protection:
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
                      <li>
                        Keep Two-Factor Authentication enabled for all
                        account access.
                      </li>
                      <li>
                        Use a strong, unique password with letters, numbers, and
                        symbols.
                      </li>
                      <li>
                        Never share verification codes or account credentials
                        with anyone.
                      </li>
                      <li>
                        Always sign out after completing work on shared office
                        computers.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 text-blue-900 p-3 rounded-xl text-[11px] space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Protected Account</span>
                    </p>
                    <p>
                      All account sessions are securely authenticated.
                      Password updates and two-step verification changes take
                      effect immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Data Backup & Export */}
        {activeTab === "backup" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Full Operational Data Backup & Export</span>
            </h3>

            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Export an archive containing your complete database of customer
              inquiries, quotations, scheduled jobs, vehicle assignments, tax
              invoices, and highway bilty consignment notes.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-800">
                  Complete JSON Operations Snapshot
                </p>
                <p className="text-slate-500 text-[11px]">
                  Includes all leads, quotes, bills, bilties, and routes in
                  standard JSON format.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportData}
                disabled={exporting}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Download
                  className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`}
                />
                <span>
                  {exporting
                    ? "Exporting Records..."
                    : "Download Backup (JSON)"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Save Bar at Bottom */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
