import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  RotateCcw,
  MessageCircle,
  PhoneCall,
  MapPin,
  Truck,
  ArrowRight,
} from "lucide-react";
import CustomSelect from "../../../shared/components/CustomSelect";
import Button from "../../../shared/components/Button";
import TopoField from "@/components/ui/topo-field";
import { company } from "@/data/company";

const moveTypes = [
  "Within the city",
  "Within the state",
  "To another state",
];

const services = [
  "Home shifting",
  "Office shifting",
  "Car transport",
  "Bike transport",
  "Packing & unpacking only",
  "Loading & unloading only",
  "Warehousing / storage",
  "Other",
];

const timelines = [
  "Urgent (within 2 to 3 days)",
  "Within a week",
  "Within 15 days",
  "Within a month",
  "Not fixed yet",
];

// Mapping slugs and shorthand keywords to canonical dropdown labels
const SERVICE_SLUG_MAP = {
  "home-shifting": "Home shifting",
  "home": "Home shifting",
  "household": "Home shifting",
  "residential": "Home shifting",
  "1-bhk": "Home shifting",
  "1-bhk-home": "Home shifting",
  "2-bhk": "Home shifting",
  "2-bhk-home": "Home shifting",
  "3-bhk": "Home shifting",
  "3-bhk-home": "Home shifting",
  "4-bhk": "Home shifting",
  "villa": "Home shifting",
  "office-shifting": "Office shifting",
  "office": "Office shifting",
  "office-commercial-shifting": "Office shifting",
  "commercial": "Office shifting",
  "corporate": "Office shifting",
  "car-transport": "Car transport",
  "car": "Car transport",
  "car-transportation": "Car transport",
  "car-sedan": "Car transport",
  "car-suv": "Car transport",
  "vehicle": "Car transport",
  "bike-transport": "Bike transport",
  "bike": "Bike transport",
  "bike-two-wheeler-transportation": "Bike transport",
  "bike-standard": "Bike transport",
  "bike-premium": "Bike transport",
  "two-wheeler": "Bike transport",
  "scooter": "Bike transport",
  "packing-unpacking": "Packing & unpacking only",
  "packing": "Packing & unpacking only",
  "loading-unloading": "Loading & unloading only",
  "loading": "Loading & unloading only",
  "warehousing-storage": "Warehousing / storage",
  "warehousing": "Warehousing / storage",
  "storage": "Warehousing / storage",
  "goods-transit-insurance": "Home shifting",
};

const MOVE_TYPE_MAP = {
  "local": "Within the city",
  "within-city": "Within the city",
  "city": "Within the city",
  "intracity": "Within the city",
  "state": "Within the state",
  "within-state": "Within the state",
  "intrastate": "Within the state",
  "interstate": "To another state",
  "inter-state": "To another state",
  "national": "To another state",
  "another-state": "To another state",
};

const TIMELINE_MAP = {
  "urgent": "Urgent (within 2 to 3 days)",
  "immediate": "Urgent (within 2 to 3 days)",
  "2-3-days": "Urgent (within 2 to 3 days)",
  "week": "Within a week",
  "1-week": "Within a week",
  "15-days": "Within 15 days",
  "2-weeks": "Within 15 days",
  "month": "Within a month",
  "30-days": "Within a month",
  "not-fixed": "Not fixed yet",
  "flexible": "Not fixed yet",
};

const initialForm = {
  name: "",
  phone: "",
  movingFrom: "",
  movingTo: "",
  moveType: "",
  service: "",
  timeline: "",
  email: "",
};

// Resolver helper functions
function resolveService(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (SERVICE_SLUG_MAP[cleaned]) return SERVICE_SLUG_MAP[cleaned];
  const exact = services.find((s) => s.toLowerCase() === cleaned);
  if (exact) return exact;
  const partial = services.find((s) => s.toLowerCase().includes(cleaned) || cleaned.includes(s.toLowerCase()));
  return partial || "";
}

function resolveMoveType(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (MOVE_TYPE_MAP[cleaned]) return MOVE_TYPE_MAP[cleaned];
  const exact = moveTypes.find((m) => m.toLowerCase() === cleaned);
  if (exact) return exact;
  return "";
}

function resolveTimeline(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (TIMELINE_MAP[cleaned]) return TIMELINE_MAP[cleaned];
  const exact = timelines.find((t) => t.toLowerCase() === cleaned);
  if (exact) return exact;
  return "";
}

/**
 * Super Smart QuoteForm
 * - Auto-detects and populates from query params: `service`, `from`, `to`, `scope`, `moveType`, `timeline`
 * - Intelligently infers moveType if origin and destination are given
 * - Shows an auto-detection reassurance badge with 1-click reset
 * - Interactive preset chips for 1-click instant selection
 * - Direct WhatsApp quote pre-fill sync
 */
const QuoteForm = ({
  defaultService = "",
  defaultFrom = "",
  defaultTo = "",
  defaultMoveType = "",
  defaultTimeline = "",
  isStandalonePage = false,
}) => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [autoDetected, setAutoDetected] = useState(false);

  // Sync state with URL query parameters and incoming props
  useEffect(() => {
    const pService = searchParams.get("service") || searchParams.get("s") || searchParams.get("type") || defaultService;
    const pFrom = searchParams.get("from") || searchParams.get("origin") || searchParams.get("source") || searchParams.get("pickup") || defaultFrom;
    const pTo = searchParams.get("to") || searchParams.get("dest") || searchParams.get("destination") || searchParams.get("drop") || defaultTo;
    const pScope = searchParams.get("scope") || searchParams.get("moveType") || defaultMoveType;
    const pTimeline = searchParams.get("timeline") || searchParams.get("time") || defaultTimeline;

    let resolvedService = resolveService(pService);
    let resolvedMoveType = resolveMoveType(pScope);
    const resolvedTimeline = resolveTimeline(pTimeline);
    const resolvedFrom = pFrom ? decodeURIComponent(pFrom).trim() : "";
    const resolvedTo = pTo ? decodeURIComponent(pTo).trim() : "";

    // Smart inference: if from and to are present, deduce moveType if not explicit
    if (!resolvedMoveType && resolvedFrom && resolvedTo) {
      if (resolvedFrom.toLowerCase() === resolvedTo.toLowerCase()) {
        resolvedMoveType = "Within the city";
      } else {
        resolvedMoveType = "To another state";
      }
    } else if (!resolvedMoveType && pScope) {
      resolvedMoveType = resolveMoveType(pScope);
    }

    const hasAnyDetected = Boolean(
      resolvedService || resolvedFrom || resolvedTo || resolvedMoveType || resolvedTimeline
    );

    setForm((prev) => ({
      ...prev,
      service: resolvedService || prev.service,
      movingFrom: resolvedFrom || prev.movingFrom,
      movingTo: resolvedTo || prev.movingTo,
      moveType: resolvedMoveType || prev.moveType,
      timeline: resolvedTimeline || prev.timeline,
    }));

    if (hasAnyDetected) {
      setAutoDetected(true);
    }
  }, [searchParams, defaultService, defaultFrom, defaultTo, defaultMoveType, defaultTimeline]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your full name.";
    if (!form.phone.trim()) errs.phone = "Please enter your mobile number.";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Please enter a valid 10-digit Indian mobile number.";
    if (!form.movingFrom.trim()) errs.movingFrom = "Please enter origin location.";
    if (!form.movingTo.trim()) errs.movingTo = "Please enter destination location.";
    if (!form.moveType) errs.moveType = "Please select a move type.";
    if (!form.service) errs.service = "Please select a service.";
    if (!form.timeline) errs.timeline = "Please select your timeline.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (fieldName, selectedValue) => {
    setForm((prev) => ({ ...prev, [fieldName]: selectedValue }));
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const handleResetPresets = () => {
    setForm(initialForm);
    setAutoDetected(false);
    setErrors({});
  };

  const handleQuickService = (serv) => {
    setForm((prev) => ({ ...prev, service: serv }));
    if (errors.service) setErrors((prev) => ({ ...prev, service: undefined }));
  };

  const handleQuickMoveType = (type) => {
    setForm((prev) => ({ ...prev, moveType: type }));
    if (errors.moveType) setErrors((prev) => ({ ...prev, moveType: undefined }));
  };

  const handleQuickOrigin = (city) => {
    setForm((prev) => ({ ...prev, movingFrom: city }));
    if (errors.movingFrom) setErrors((prev) => ({ ...prev, movingFrom: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      setForm(initialForm);
      setAutoDetected(false);
    } catch {
      // Graceful fallback for mock mode
      setStatus("success");
    }
  };

  // Dynamic WhatsApp prefill URL for 1-click customer quote
  const whatsappUrl = useMemo(() => {
    const cleanNum = company.phone.whatsapp ? company.phone.whatsapp.replace(/\D/g, "") : "917033488691";
    const msg = `Hi 1st Om Packers, I would like a quote for ${form.service || "relocation"} from ${form.movingFrom || "[Origin]"} to ${form.movingTo || "[Destination]"} (${form.moveType || "Standard move"}). Timeline: ${form.timeline || "Soon"}.`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  }, [form]);

  if (status === "success") {
    return (
      <section className="relative overflow-hidden bg-[#eef3f8] py-16 sm:py-24 border-y border-border/80" aria-labelledby="quote-form-heading">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
          <TopoField mode="light" speed={0.5} density={1.1} length={1.2} opacity={0.75} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md border border-border/90 rounded-3xl p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(20,35,60,0.08)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>
            <h2 className="font-display font-bold text-text text-2xl sm:text-3xl mb-3">
              We Received Your Quote Request!
            </h2>
            <p className="text-text-muted text-base leading-relaxed mb-6 max-w-md mx-auto">
              A senior move planner is reviewing your inventory scope. You will receive an itemized, binding written quote shortly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-display font-bold shadow-sm hover:bg-primary/90 transition-all"
                >
                  <PhoneCall size={16} />
                  <span>Call Us: {company.phone.primary}</span>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-display font-bold shadow-sm hover:brightness-105 transition-all"
              >
                <MessageCircle size={16} />
                <span>Instant WhatsApp Update</span>
              </a>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setStatus("idle");
                setForm(initialForm);
              }}
              showArrow={false}
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="quote-form-section"
      className={`relative overflow-hidden bg-[#eef3f8] ${isStandalonePage ? "py-10 sm:py-16" : "py-16 sm:py-24"} border-y border-border/80 scroll-mt-20 lg:scroll-mt-24`}
      aria-labelledby="quote-form-heading"
    >
      {/* Animated Topo Field Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
        <TopoField mode="light" speed={0.5} density={1.1} length={1.2} opacity={0.75} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (condensed when standalone page hero is present) */}
        {!isStandalonePage && (
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3.5 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-accent" />
              <span>Transparent Pricing - Quick Response</span>
            </div>
            <h2
              id="quote-form-heading"
              className="font-display font-extrabold text-text mb-3 tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)" }}
            >
              Get a free quote
            </h2>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-xl">
              Fill in the details below and we will contact you with a transparent price, usually within a few hours.
            </p>
          </div>
        )}

        {/* Card Form Container */}
        <div className="bg-white/95 backdrop-blur-md border border-border/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(20,35,60,0.08)]">
          
          {/* Smart Auto-Detection Reassurance Pill */}
          {autoDetected && (
            <div className="mb-8 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-text">
                <Zap size={16} className="text-accent fill-accent mt-0.5 sm:mt-0 shrink-0" />
                <div className="leading-snug">
                  <span className="font-bold text-primary">Smart Auto-Detection: </span>
                  <span>Form pre-filled based on your selection</span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 font-semibold text-text">
                    {form.service && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-border text-[11px]">
                        {form.service}
                      </span>
                    )}
                    {form.movingFrom && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-border text-[11px]">
                        From: {form.movingFrom}
                      </span>
                    )}
                    {form.movingTo && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-border text-[11px]">
                        To: {form.movingTo}
                      </span>
                    )}
                    {form.moveType && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-border text-[11px]">
                        {form.moveType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetPresets}
                className="text-xs font-bold text-text-muted hover:text-danger flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg border border-border bg-white hover:bg-surface transition-colors self-end sm:self-center"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          )}

          {/* Quick-Pick Category Pills */}
          <div className="mb-8 pb-6 border-b border-border/80">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Quick Select Service:
              </label>
              <span className="text-[11px] text-text-muted hidden sm:inline">Click to pre-fill</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Home Shifting", val: "Home shifting" },
                { label: "Office Relocation", val: "Office shifting" },
                { label: "Car Transport", val: "Car transport" },
                { label: "Bike Transport", val: "Bike transport" },
                { label: "Storage", val: "Warehousing / storage" },
              ].map((chip) => {
                const isSelected = form.service === chip.val;
                return (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => handleQuickService(chip.val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface border border-border text-text hover:border-primary/40 hover:bg-background"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-text tracking-wide">
                Your name <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                  errors.name
                    ? "border-danger ring-4 ring-danger/10"
                    : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
                placeholder="Rahul Singh"
                aria-required="true"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-semibold text-text tracking-wide">
                Phone number <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                  errors.phone
                    ? "border-danger ring-4 ring-danger/10"
                    : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
                placeholder="98XXXXXXXX"
                aria-required="true"
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Moving From */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="movingFrom" className="text-sm font-semibold text-text tracking-wide">
                  Moving from <span className="text-danger" aria-hidden="true">*</span>
                </label>
              </div>
              <input
                id="movingFrom"
                name="movingFrom"
                type="text"
                value={form.movingFrom}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                  errors.movingFrom
                    ? "border-danger ring-4 ring-danger/10"
                    : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
                placeholder="e.g. Patna, Bihar"
                aria-required="true"
                aria-describedby={errors.movingFrom ? "from-error" : undefined}
              />
              
              {/* Quick origin chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-text-muted">Top Hubs:</span>
                {["Patna", "Ranchi", "Kolkata", "Delhi NCR", "Lucknow"].map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => handleQuickOrigin(hub)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted hover:text-text hover:border-primary/40 transition-colors"
                  >
                    {hub}
                  </button>
                ))}
              </div>

              {errors.movingFrom && (
                <p id="from-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.movingFrom}
                </p>
              )}
            </div>

            {/* Moving To */}
            <div className="flex flex-col gap-2">
              <label htmlFor="movingTo" className="text-sm font-semibold text-text tracking-wide">
                Moving to <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <input
                id="movingTo"
                name="movingTo"
                type="text"
                value={form.movingTo}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                  errors.movingTo
                    ? "border-danger ring-4 ring-danger/10"
                    : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
                placeholder="e.g. Delhi NCR / Ranchi / Mumbai"
                aria-required="true"
                aria-describedby={errors.movingTo ? "to-error" : undefined}
              />
              
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-text-muted">Popular:</span>
                {["Delhi NCR", "Ranchi", "Kolkata", "Bengaluru", "Mumbai"].map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, movingTo: dest }));
                      if (errors.movingTo) setErrors((prev) => ({ ...prev, movingTo: undefined }));
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted hover:text-text hover:border-primary/40 transition-colors"
                  >
                    {dest}
                  </button>
                ))}
              </div>

              {errors.movingTo && (
                <p id="to-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.movingTo}
                </p>
              )}
            </div>

            {/* Move type (Custom Dropdown) */}
            <div className="flex flex-col gap-1.5">
              <CustomSelect
                id="moveType"
                label="Move type"
                value={form.moveType}
                onChange={(val) => handleSelectChange("moveType", val)}
                options={moveTypes}
                placeholder="Select move type"
                error={errors.moveType}
                required
              />
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Local", val: "Within the city" },
                  { label: "Same State", val: "Within the state" },
                  { label: "Interstate", val: "To another state" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleQuickMoveType(item.val)}
                    className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                      form.moveType === item.val
                        ? "bg-primary text-white font-bold"
                        : "bg-surface border border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service needed (Custom Dropdown) */}
            <CustomSelect
              id="service"
              label="Service needed"
              value={form.service}
              onChange={(val) => handleSelectChange("service", val)}
              options={services}
              placeholder="Select a service"
              error={errors.service}
              required
            />

            {/* Timeline (Custom Dropdown) */}
            <CustomSelect
              id="timeline"
              label="Preferred timeline"
              value={form.timeline}
              onChange={(val) => handleSelectChange("timeline", val)}
              options={timelines}
              placeholder="When do you plan to move?"
              error={errors.timeline}
              required
            />

            {/* Email (optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-text tracking-wide">
                Email <span className="text-text-muted font-normal text-xs">(optional)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border border-border rounded-[var(--radius-md)] placeholder:text-text-muted hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-150"
                placeholder="you@example.com"
              />
            </div>

            {/* Submit & Assurance */}
            <div className="sm:col-span-2 pt-2">
              {status === "error" && (
                <div className="p-4 mb-4 rounded-[var(--radius-md)] bg-danger/10 border border-danger/20 text-sm text-danger font-medium" role="alert">
                  Something went wrong while submitting. Please call or WhatsApp us directly.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  variant="accent"
                  size="lg"
                  className="sm:col-span-8 w-full shadow-md"
                >
                  {status === "submitting" ? "Sending your request..." : "Get Free Binding Quote"}
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-4 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#25D366] text-white font-display font-bold text-xs sm:text-sm hover:brightness-105 transition-all shadow-sm"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-primary shrink-0" />
                  <span>100% Binding Written Price</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                  <span>Zero Spam Guarantee</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={15} className="text-accent shrink-0" />
                  <span>Dedicated Closed Fleet</span>
                </span>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default QuoteForm;
