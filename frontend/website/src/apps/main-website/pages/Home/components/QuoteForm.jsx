import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import CustomSelect from "../../../shared/components/CustomSelect";
import Button from "../../../shared/components/Button";
import TopoField from "@/components/ui/topo-field";

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

/**
 * QuoteForm — the lead capture form.
 *
 * Designed with generous spacing, single crisp borders, custom dropdowns,
 * and clear typographic hierarchy to eliminate cramped layouts and double outlines.
 */
const QuoteForm = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

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
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="relative overflow-hidden bg-[#eef3f8] py-16 sm:py-24 border-y border-border/80" aria-labelledby="quote-form-heading">
        {/* Animated Topo Field Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
          <TopoField mode="light" speed={0.5} density={1.1} length={1.2} opacity={0.75} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md border border-border/90 rounded-3xl p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(20,35,60,0.08)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>
            <h2 className="font-display font-bold text-text text-2xl sm:text-3xl mb-3">
              We received your request
            </h2>
            <p className="text-text-muted text-base leading-relaxed mb-8 max-w-md mx-auto">
              Our team will review your route and contact you with an itemised quote. For immediate assistance, feel free to call or WhatsApp our helpline directly.
            </p>
            <Button
              variant="outline"
              onClick={() => setStatus("idle")}
              showArrow={false}
            >
              Submit another request
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden bg-[#eef3f8] py-16 sm:py-24 border-y border-border/80"
      aria-labelledby="quote-form-heading"
    >
      {/* Animated Topo Field Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
        <TopoField mode="light" speed={0.5} density={1.1} length={1.2} opacity={0.75} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with breathing room */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3.5 backdrop-blur-xs">
            <ShieldCheck size={14} className="text-accent" />
            <span>Transparent Pricing • Quick Response</span>
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

        {/* Card Form Container */}
        <div className="bg-white/95 backdrop-blur-md border border-border/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(20,35,60,0.08)]">
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
              <label htmlFor="movingFrom" className="text-sm font-semibold text-text tracking-wide">
                Moving from <span className="text-danger" aria-hidden="true">*</span>
              </label>
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
                placeholder="e.g. Delhi NCR"
                aria-required="true"
                aria-describedby={errors.movingTo ? "to-error" : undefined}
              />
              {errors.movingTo && (
                <p id="to-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.movingTo}
                </p>
              )}
            </div>

            {/* Move type (Custom Dropdown) */}
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
              <Button
                type="submit"
                disabled={status === "submitting"}
                variant="accent"
                size="lg"
                className="w-full"
              >
                {status === "submitting" ? "Sending your request…" : "Send my request"}
              </Button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-text-muted">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>We usually respond within a few hours. No spam, no automated calls.</span>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default QuoteForm;
