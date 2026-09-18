import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Check,
  ArrowRight,
  Truck,
  Boxes,
  Home,
  Car,
  Bike,
  Building2,
  Clock,
  Receipt,
  ShieldAlert,
  ChevronDown,
  Zap,
  BadgePercent,
  FileText,
  Users,
  Percent,
  CheckCircle,
} from "lucide-react";
import SEO from "../../../../configs/seo";
import { company } from "../../../../data/company";
import Button from "../../shared/components/Button";

// Move estimator configurations
const estimatorOptions = [
  {
    id: "1bhk",
    label: "1 BHK Apartment",
    icon: Home,
    localPrice: "₹3,500 - ₹6,500",
    interstatePrice: "₹8,500 - ₹17,500",
    truck: "10ft - 14ft Closed Container",
    crew: "2-3 Verified Packers",
    duration: "4-6 Hours (Local) / 2-3 Days (Interstate)",
  },
  {
    id: "2bhk",
    label: "2 BHK Apartment",
    icon: Home,
    localPrice: "₹5,500 - ₹10,000",
    interstatePrice: "₹14,000 - ₹27,500",
    truck: "14ft - 17ft Closed Container",
    crew: "3-4 Verified Packers",
    duration: "6-8 Hours (Local) / 3-4 Days (Interstate)",
  },
  {
    id: "3bhk",
    label: "3 BHK Apartment",
    icon: Home,
    localPrice: "₹8,500 - ₹16,000",
    interstatePrice: "₹22,000 - ₹42,000",
    truck: "19ft - 22ft Dedicated Truck",
    crew: "4-6 Verified Packers",
    duration: "Full Day (Local) / 3-5 Days (Interstate)",
  },
  {
    id: "4bhk",
    label: "4+ BHK / Villa",
    icon: Home,
    localPrice: "₹14,000 - ₹26,000",
    interstatePrice: "₹34,000 - ₹65,000+",
    truck: "24ft - 32ft Multi-Axle Carrier",
    crew: "6-8 Verified Packers",
    duration: "1-2 Days (Local) / 4-6 Days (Interstate)",
  },
  {
    id: "bike",
    label: "Two-Wheeler / Bike",
    icon: Bike,
    localPrice: "₹1,500 - ₹2,800",
    interstatePrice: "₹3,500 - ₹6,800",
    truck: "Specialized Crated Carrier",
    crew: "2 Specialized Handlers",
    duration: "Same Day (Local) / 3-5 Days (Interstate)",
  },
  {
    id: "car",
    label: "Car / Sedan / SUV",
    icon: Car,
    localPrice: "₹2,500 - ₹4,500",
    interstatePrice: "₹9,500 - ₹22,000",
    truck: "Hydraulic Enclosed Car Carrier",
    crew: "Vehicle Logistics Specialist",
    duration: "Same Day (Local) / 4-7 Days (Interstate)",
  },
  {
    id: "office",
    label: "Office / Commercial",
    icon: Building2,
    localPrice: "₹9,000 - ₹28,000+",
    interstatePrice: "₹28,000 - ₹85,000+",
    truck: "Dedicated Multi-Fleet Convoy",
    crew: "IT & Modular Relocation Team",
    duration: "Weekend / Overnight Shift",
  },
];

// Tabbed pricing tables
const pricingTabs = [
  { id: "local", label: "Local Home Shifting" },
  { id: "interstate", label: "Interstate Corridors" },
  { id: "vehicles", label: "Vehicle Transport" },
  { id: "addons", label: "Add-Ons & Services" },
];

const localHouseholdRates = [
  {
    size: "1 BHK (Studio / 1 Bedroom)",
    packing: "5-ply cartons, bubble wrap & cling film",
    vehicle: "Tata Ace / 10ft Closed Container",
    crew: "2-3 Men",
    time: "4 - 6 Hours",
    priceRange: "₹3,500 - ₹6,500",
    slug: "home-shifting",
  },
  {
    size: "2 BHK (Standard Apartment)",
    packing: "Heavy corrugated sheets, foam & cartons",
    vehicle: "14ft - 17ft Closed Container",
    crew: "3-4 Men",
    time: "6 - 8 Hours",
    priceRange: "₹5,500 - ₹10,000",
    slug: "home-shifting",
  },
  {
    size: "3 BHK (Large Apartment)",
    packing: "Multi-layer furniture padding & crating",
    vehicle: "19ft Dedicated Closed Truck",
    crew: "4-6 Men",
    time: "1 Full Day",
    priceRange: "₹8,500 - ₹16,000",
    slug: "home-shifting",
  },
  {
    size: "4+ BHK / Independent Villa",
    packing: "Comprehensive master packing & wardrobe boxes",
    vehicle: "22ft - 32ft Container or 2 Trucks",
    crew: "6-8 Men",
    time: "1 - 2 Days",
    priceRange: "₹14,000 - ₹26,000",
    slug: "home-shifting",
  },
];

const interstateCorridors = [
  {
    corridor: "Bihar to Delhi NCR (Gurgaon, Noida, Delhi)",
    distance: "~1,050 km",
    transit: "2 - 3 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "₹12,000 - ₹18,000",
    range2BHK: "₹18,000 - ₹28,000",
    range3BHK: "₹28,000 - ₹48,000",
  },
  {
    corridor: "Bihar to West Bengal (Kolkata, Siliguri)",
    distance: "~580 km",
    transit: "1 - 2 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "₹9,000 - ₹14,000",
    range2BHK: "₹14,000 - ₹22,000",
    range3BHK: "₹22,000 - ₹36,000",
  },
  {
    corridor: "Bihar to Jharkhand (Ranchi, Jamshedpur, Dhanbad)",
    distance: "~340 km",
    transit: "1 Day (Overnight)",
    truckType: "Dedicated Sealed Container",
    range1BHK: "₹7,500 - ₹12,000",
    range2BHK: "₹11,000 - ₹18,000",
    range3BHK: "₹18,000 - ₹30,000",
  },
  {
    corridor: "Bihar to Uttar Pradesh (Lucknow, Kanpur, Varanasi)",
    distance: "~520 km",
    transit: "1 - 2 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "₹8,500 - ₹13,500",
    range2BHK: "₹13,000 - ₹21,000",
    range3BHK: "₹21,000 - ₹35,000",
  },
  {
    corridor: "Bihar to Maharashtra (Mumbai, Pune, Nagpur)",
    distance: "~1,850 km",
    transit: "4 - 5 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "₹18,000 - ₹28,000",
    range2BHK: "₹26,000 - ₹42,000",
    range3BHK: "₹40,000 - ₹72,000",
  },
  {
    corridor: "Bihar to Karnataka & South (Bengaluru, Hyderabad)",
    distance: "~2,050 km",
    transit: "4 - 6 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "₹20,000 - ₹32,000",
    range2BHK: "₹28,000 - ₹48,000",
    range3BHK: "₹45,000 - ₹80,000",
  },
];

const vehicleRates = [
  {
    vehicleType: "Standard Bike / Scooter (100cc - 150cc)",
    method: "Timber Crate Packaging + Bubble Foam",
    insurance: "Included (Up to ₹50,000 declared)",
    localRate: "₹1,500 - ₹2,500",
    interstateRate: "₹3,500 - ₹5,500",
    slug: "bike-transportation",
  },
  {
    vehicleType: "Sports / Cruiser Motorcycle (200cc - 500cc+)",
    method: "Reinforced Heavy Timber Crate",
    insurance: "Included (Up to ₹1,50,000 declared)",
    localRate: "₹2,000 - ₹3,200",
    interstateRate: "₹4,800 - ₹8,000",
    slug: "bike-transportation",
  },
  {
    vehicleType: "Hatchback Car (Swift, i10, Baleno, Tiago)",
    method: "Hydraulic Enclosed Multi-Car Carrier",
    insurance: "Transit Insurance with Pre-Inspection",
    localRate: "₹2,500 - ₹3,800",
    interstateRate: "₹8,500 - ₹15,000",
    slug: "car-transportation",
  },
  {
    vehicleType: "Sedan Car (City, Verna, Ciaz, Slavia)",
    method: "Hydraulic Enclosed Multi-Car Carrier",
    insurance: "Transit Insurance with Pre-Inspection",
    localRate: "₹2,800 - ₹4,200",
    interstateRate: "₹10,500 - ₹18,000",
    slug: "car-transportation",
  },
  {
    vehicleType: "SUV / Luxury EV (Creta, Fortuner, XUV700)",
    method: "Hydraulic Enclosed Carrier (Dedicated Slot)",
    insurance: "Transit Insurance with Pre-Inspection",
    localRate: "₹3,500 - ₹5,000",
    interstateRate: "₹13,500 - ₹24,000",
    slug: "car-transportation",
  },
];

const addOnServices = [
  {
    service: "Packing & Unpacking Labor Only",
    description: "Export-grade cartons, bubble wrap & professional packers without transport",
    rate: "₹1,800 - ₹10,000",
    unit: "Per move based on items",
    slug: "packing-unpacking",
  },
  {
    service: "Loading & Unloading Crew Only",
    description: "Trained crew with appliance dollies and lifting straps for client's vehicle",
    rate: "₹1,500 - ₹7,500",
    unit: "Per shift / floor levels",
    slug: "loading-unloading",
  },
  {
    service: "Secure Warehousing & Storage",
    description: "Moisture-free, 24/7 CCTV guarded warehouse bays with barcode inventory",
    rate: "₹1,200 - ₹8,500",
    unit: "Per month / volume",
    slug: "warehousing-storage",
  },
  {
    service: "Wooden Crating for Delicate Goods",
    description: "Custom carpentry timber box for LED TVs (>55\"), crystal chandeliers & mirrors",
    rate: "₹1,200 - ₹3,500",
    unit: "Per crated article",
    slug: "packing-unpacking",
  },
  {
    service: "Comprehensive Goods Transit Insurance",
    description: "All-risk 100% declared valuation policy with fast company-assisted claims",
    rate: "1.5% of Declared Value",
    unit: "Optional add-on",
    slug: "goods-insurance",
  },
];

const inclusionsVsExtras = [
  {
    feature: "5-Ply Virgin Corrugated Cartons & Bubble Wrap",
    included: true,
    note: "All standard boxes, tape, and padding are included in your quote.",
  },
  {
    feature: "Dedicated Closed-Body Container Truck",
    included: true,
    note: "Your goods never share space with another family's consignment.",
  },
  {
    feature: "Full Loading, Transport & Room-by-Room Unloading",
    included: true,
    note: "Items placed directly in the respective bedrooms and living spaces.",
  },
  {
    feature: "Basic Furniture Dismantling & Reassembly",
    included: true,
    note: "Double beds, dining tables, and modular furniture dismantled and rebuilt.",
  },
  {
    feature: "Highway Toll Taxes, Fuel Surcharges & Driver Allowance",
    included: true,
    note: "No surprise toll bills or driver meal charges requested on the road.",
  },
  {
    feature: "Dedicated Move Coordinator with WhatsApp Updates",
    included: true,
    note: "Single point of contact from pre-move survey to delivery.",
  },
  {
    feature: "Wooden Crating for Large LED TVs (>55\") & Crystal Mirrors",
    included: false,
    note: "Quoted transparently at ₹1,200-₹3,500 per item if needed.",
  },
  {
    feature: "Manual Rope Hoisting (if no elevator & narrow stairwells)",
    included: false,
    note: "Quoted upfront if balcony hoisting is necessary for oversized sofas.",
  },
  {
    feature: "All-Risk Transit Insurance Policy",
    included: false,
    note: "Calculated transparently at 1.5% of your declared inventory valuation.",
  },
  {
    feature: "Extended Warehousing Storage Beyond Transit Window",
    included: false,
    note: "Billed on flexible weekly or monthly terms from ₹1,200/mo.",
  },
];

const scamComparison = [
  {
    aspect: "Initial Quoted Price",
    scam: "Artificially low bait quote (₹2,500 - ₹3,500) given over the phone without questions.",
    firstOm: "Transparent, realistic estimate based on inventory volume, distance & floor access.",
  },
  {
    aspect: "Moving Day Cartons & Tape",
    scam: "Arrives with minimal supplies; demands ₹3,000-₹5,000 extra for 'special boxes & tape'.",
    firstOm: "100% all-inclusive. All boxes, bubble wrap, and stretch film are covered in the quote.",
  },
  {
    aspect: "Stairs & Floor Surcharges",
    scam: "Demands extra ₹500-₹1,000 per floor suddenly midway through carrying furniture.",
    firstOm: "Survey accounts for floor access upfront. Zero surprise surcharge on moving day.",
  },
  {
    aspect: "Vehicle Allocation",
    scam: "Goods co-loaded in open-top trucks with strangers' cargo; risk of loss or water damage.",
    firstOm: "100% dedicated closed container locked and sealed exclusively for your family.",
  },
  {
    aspect: "Final Amount Paid",
    scam: "Ends up costing 2x-3x more than quoted, with goods held hostage until paid in cash.",
    firstOm: "Exact binding quote agreed prior to packing. Transparent payment with official invoice.",
  },
];

const pricingFaqs = [
  {
    q: "Why do moving quotes differ between two similar 2 BHK apartments?",
    a: "Every household is unique. Relocation pricing depends on the actual physical volume (cubic feet) of furniture, quantity of delicate glassware or electronics requiring custom crating, floor levels and elevator availability at both locations, walking distance from truck to doorway, and total transit distance. A pre-move survey ensures you receive an accurate, binding quote tailored to your exact inventory.",
  },
  {
    q: "Are packing materials and cartons included in the written price?",
    a: "Yes. All standard packing supplies - including export-grade 5-ply cartons, bubble wrap, stretch film, heavy corrugated sheets, and industrial sealing tape - are fully covered in your written quotation. There are zero surprise box fees on moving day.",
  },
  {
    q: "Do I have to pay an advance before the survey is conducted?",
    a: "No. Our pre-move surveys (both in-person and video call) are 100% complimentary with zero booking fees and zero obligation. You only confirm with a standard booking token once you are completely satisfied with our written itemized quote.",
  },
  {
    q: "Can you provide an official GST invoice for corporate relocation reimbursement?",
    a: "Yes, absolutely. 1st Om Packers and Movers Pvt. Ltd. is a legally registered corporate entity. We issue full GST-compliant tax invoices, consignment notes (LR copy), and itemized packing lists required for employer relocation reimbursements.",
  },
  {
    q: "What happens if my relocation date changes? Is there a cancellation fee?",
    a: "We understand moving schedules can shift. You can reschedule your moving date with 24 hours prior notice with zero cancellation or rescheduling penalties before the dedicated vehicle is dispatched.",
  },
  {
    q: "How is Goods Transit Insurance calculated and is it compulsory?",
    a: "Transit insurance is optional but strongly recommended for long-distance and interstate moves. The premium is calculated at 1.5% of your declared consignment value. In the rare event of transit damage, our dedicated coordinator manages the paperless claim directly with the insurance provider.",
  },
];

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("local");
  const [calcMoveType, setCalcMoveType] = useState("2bhk");
  const [calcRouteType, setCalcRouteType] = useState("local");
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [includeUnpacking, setIncludeUnpacking] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const selectedEstimator =
    estimatorOptions.find((item) => item.id === calcMoveType) ||
    estimatorOptions[1];

  return (
    <>
      <SEO
        title="Transparent Pricing & Relocation Cost Estimates | 1st Om Packers and Movers"
        description="Clear, upfront pricing with zero hidden charges. Calculate moving costs for 1 BHK, 2 BHK, 3 BHK, car, bike, and commercial moves locally and across India."
      />

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        {/* Glow ambient lights */}
        <div
          className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-text-muted" role="list">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={13} className="text-text-muted/60" />
              </li>
              <li>
                <span className="text-text font-semibold">Pricing</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck size={15} className="text-accent" />
                <span>Zero-Hidden-Fee Guarantee</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Transparent Moving Estimates. What You Agree To Is What You Pay.
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
                We believe in complete pricing honesty. No bait-and-switch quotes, no surprise moving-day demands for tape or stairs, and no hidden highway tolls.
              </p>
            </div>

            {/* Quick Hero Call/Quote Action Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <Button to="/get-quote" size="md" className="w-full sm:w-auto shadow-md">
                Get a Fixed Binding Quote
              </Button>
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-text text-xs sm:text-sm font-semibold hover:border-primary/40 hover:bg-background transition-colors"
                >
                  <PhoneCall size={15} className="text-primary" />
                  <span>Call: {company.phone.primary}</span>
                </a>
              )}
            </div>
          </div>

          {/* ── 2. FOUR TRUST PILLARS BAR ───────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Receipt size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">Binding Written Quote</p>
                <p className="text-xs text-text-muted">Zero moving-day surprises</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">Free Pre-Move Survey</p>
                <p className="text-xs text-text-muted">In-person or virtual survey</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">Tolls & Fuel Included</p>
                <p className="text-xs text-text-muted">No road extortion</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">GST Invoice Ready</p>
                <p className="text-xs text-text-muted">100% corporate claimable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE LIVE RELOCATION COST CALCULATOR ────────── */}
      <section className="bg-background py-12 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Zap size={14} className="text-accent" />
              <span>Real-Time Relocation Calculator</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Estimate Your Relocation Cost in 30 Seconds
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Adjust your consignment size, distance scope, and add-on preferences to view realistic price brackets.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface rounded-3xl border border-border shadow-md p-6 sm:p-8">
            
            {/* Step 1: Distance / Scope */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                Step 1: Choose Transit Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalcRouteType("local")}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    calcRouteType === "local"
                      ? "border-primary bg-primary text-white shadow-xs"
                      : "border-border bg-background text-text hover:border-primary/40"
                  }`}
                >
                  Local Move (Within City / &le; 40 km)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcRouteType("interstate")}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    calcRouteType === "interstate"
                      ? "border-primary bg-primary text-white shadow-xs"
                      : "border-border bg-background text-text hover:border-primary/40"
                  }`}
                >
                  Interstate Move (City-to-City)
                </button>
              </div>
            </div>

            {/* Step 2: Consignment Volume */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                Step 2: Choose Consignment Volume
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {estimatorOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = calcMoveType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCalcMoveType(opt.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col justify-between gap-2 text-left cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-background text-text hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon size={16} className={isSelected ? "text-primary" : "text-text-muted"} />
                        {isSelected && <Check size={14} className="text-primary" />}
                      </div>
                      <span className="leading-snug">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Add-on Toggles */}
            <div className="mb-8 pt-4 border-t border-border">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Step 3: Service Customizations
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer select-none hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={includeUnpacking}
                    onChange={(e) => setIncludeUnpacking(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text block">Destination Unpacking & Room Setup</span>
                    <span className="text-text-muted text-[11px]">Included in household shifting quotes</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer select-none hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text block">All-Risk Goods Transit Insurance</span>
                    <span className="text-text-muted text-[11px]">Recommended for long distance & interstate (+1.5%)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dynamic Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-background to-primary/5 border border-primary/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <BadgePercent size={14} />
                  <span>Estimated Total ({calcRouteType === "local" ? "Local Move" : "Interstate Corridor"})</span>
                </div>

                <p className="font-display font-black text-text text-3xl sm:text-4xl">
                  {calcRouteType === "local"
                    ? selectedEstimator.localPrice
                    : selectedEstimator.interstatePrice}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-text-muted pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={14} className="text-primary" />
                    {selectedEstimator.truck}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    {selectedEstimator.crew}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    {selectedEstimator.duration}
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Button
                  to={`/get-quote?service=${
                    calcMoveType === "car"
                      ? "car-transportation"
                      : calcMoveType === "bike"
                      ? "bike-transportation"
                      : calcMoveType === "office"
                      ? "office-commercial-shifting"
                      : "home-shifting"
                  }&type=${calcMoveType}&scope=${calcRouteType}`}
                  size="md"
                  className="w-full md:w-auto shadow-md"
                >
                  Book Free Survey & Lock Price
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center mt-3">
              *Estimates are indicative and based on typical consignments. Actual price is confirmed in writing post-survey with zero hidden extras.
            </p>
          </div>

        </div>
      </section>

      {/* ── 4. SEGMENTED RATE TABLES (TABBED NAVIGATION) ──────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Boxes size={14} />
                <span>Rate Master Matrix</span>
              </div>
              <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight">
                Standard Pricing Reference Brackets
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-background border border-border/80 overflow-x-auto scrollbar-none shadow-2xs">
              {pricingTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap select-none ${
                      isActive ? "text-white" : "text-text-muted hover:text-text"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activePricingTabPill"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        className="absolute inset-0 rounded-full bg-primary shadow-xs"
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="bg-background rounded-2xl border border-border shadow-xs overflow-hidden">
            
            {/* TAB 1: Local Household Rates */}
            {activeTab === "local" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Home Size / Volume</th>
                      <th className="p-4 sm:p-5 hidden md:table-cell">Packing Standard</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Vehicle & Crew</th>
                      <th className="p-4 sm:p-5">Duration</th>
                      <th className="p-4 sm:p-5 text-right">Indicative Range</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {localHouseholdRates.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.size}
                          <span className="block text-xs font-normal text-text-muted md:hidden mt-1">
                            {row.packing}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden md:table-cell">
                          {row.packing}
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden sm:table-cell">
                          <span className="font-semibold text-text block">{row.vehicle}</span>
                          <span className="text-xs">{row.crew}</span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted">{row.time}</td>
                        <td className="p-4 sm:p-5 font-display font-bold text-text text-right whitespace-nowrap">
                          {row.priceRange}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to={`/get-quote?service=${row.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Quote</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: Interstate Corridors */}
            {activeTab === "interstate" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Interstate Corridor</th>
                      <th className="p-4 sm:p-5">Distance & Transit</th>
                      <th className="p-4 sm:p-5">1 BHK Est.</th>
                      <th className="p-4 sm:p-5">2 BHK Est.</th>
                      <th className="p-4 sm:p-5">3 BHK Est.</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {interstateCorridors.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.corridor}
                          <span className="block text-xs font-normal text-text-muted mt-0.5">
                            {row.truckType}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted">
                          <span className="font-semibold text-text block">{row.distance}</span>
                          <span className="text-xs">{row.transit}</span>
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-text whitespace-nowrap">
                          {row.range1BHK}
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-text whitespace-nowrap">
                          {row.range2BHK}
                        </td>
                        <td className="p-4 sm:p-5 font-bold text-primary whitespace-nowrap">
                          {row.range3BHK}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to="/get-quote?scope=interstate"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Lock Rate</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Vehicle Transportation */}
            {activeTab === "vehicles" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Vehicle Category</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Transit Mode</th>
                      <th className="p-4 sm:p-5 hidden md:table-cell">Insurance Coverage</th>
                      <th className="p-4 sm:p-5">Local Transit</th>
                      <th className="p-4 sm:p-5 text-right">Interstate Transit</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vehicleRates.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.vehicleType}
                          <span className="block text-xs font-normal text-text-muted sm:hidden mt-0.5">
                            {row.method}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden sm:table-cell">
                          {row.method}
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                            <ShieldCheck size={14} />
                            {row.insurance}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-text whitespace-nowrap">
                          {row.localRate}
                        </td>
                        <td className="p-4 sm:p-5 font-bold text-primary text-right whitespace-nowrap">
                          {row.interstateRate}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to={`/get-quote?service=${row.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Book</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: Add-ons & Standalone Services */}
            {activeTab === "addons" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Service Description</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Details & Inclusions</th>
                      <th className="p-4 sm:p-5">Billing Unit</th>
                      <th className="p-4 sm:p-5 text-right">Standard Rate</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {addOnServices.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.service}
                          <span className="block text-xs font-normal text-text-muted sm:hidden mt-0.5">
                            {row.description}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden sm:table-cell">
                          {row.description}
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted">
                          {row.unit}
                        </td>
                        <td className="p-4 sm:p-5 font-display font-bold text-primary text-right whitespace-nowrap">
                          {row.rate}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to={`/get-quote?service=${row.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Add</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          <p className="text-xs text-text-muted mt-4">
            Note: All prices are starting estimates based on standard route conditions. Final quote is guaranteed in writing post physical or virtual survey.
          </p>

        </div>
      </section>

      {/* ── 5. "WHAT'S INCLUDED VS WHAT'S EXTRA" TRANSPARENCY CHECKLIST ── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 size={14} />
              <span>100% Bill Transparency</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              What Is Included In Every Quote vs. Optional Extras
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              We eliminate unexpected moving-day arguments by declaring every deliverable in writing before packing begins.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              
              {/* Left Column: Standard Inclusions */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-emerald-600 font-display font-bold text-base mb-6">
                  <CheckCircle2 size={20} />
                  <h3>Always Included As Standard</h3>
                </div>

                <ul className="space-y-4" role="list">
                  {inclusionsVsExtras
                    .filter((item) => item.included)
                    .map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 shrink-0 mt-0.5">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <div>
                          <strong className="text-text block font-semibold">{item.feature}</strong>
                          <span className="text-text-muted text-xs">{item.note}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Right Column: Quoted Separately */}
              <div className="p-6 sm:p-8 bg-background sm:bg-surface">
                <div className="flex items-center gap-2 text-text font-display font-bold text-base mb-6">
                  <Percent size={20} className="text-accent" />
                  <h3>Quoted Upfront / Optional Add-Ons</h3>
                </div>

                <ul className="space-y-4" role="list">
                  {inclusionsVsExtras
                    .filter((item) => !item.included)
                    .map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5 font-bold text-[11px]">
                          +
                        </span>
                        <div>
                          <strong className="text-text block font-semibold">{item.feature}</strong>
                          <span className="text-text-muted text-xs">{item.note}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 6. "WHY LOW-BALL COMPETITORS COST 3X MORE" ─────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert size={14} />
              <span>Consumer Protection Notice</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Beware of Low-Ball Estimates: The Hidden Cost Trap
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Unverified aggregators lure customers with a fake low quote, then extort money once your goods are inside their truck.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-background rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 bg-primary text-white p-4 font-display font-bold text-xs uppercase tracking-wider">
              <div className="hidden md:block">Cost Consideration</div>
              <div className="text-accent flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                <span>1st Om Upfront Pricing</span>
              </div>
              <div className="text-white/60 flex items-center gap-1.5 mt-2 md:mt-0">
                <ShieldAlert size={15} />
                <span>Low-Ball Aggregator Scams</span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {scamComparison.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 p-4 sm:p-5 gap-3 text-xs">
                  <div className="font-bold text-text flex items-center">
                    {item.aspect}
                  </div>
                  <div className="text-text bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 font-medium">
                    <span className="md:hidden font-bold block text-emerald-600 mb-1">1st Om:</span>
                    {item.firstOm}
                  </div>
                  <div className="text-text-muted bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                    <span className="md:hidden font-bold block text-red-500 mb-1">Other Movers:</span>
                    {item.scam}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. PRICING FAQS ACCORDION ─────────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} />
              <span>Transparent Answers</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Frequently Asked Questions About Moving Prices
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Everything you need to know about quotes, insurance, and billing policies.
            </p>
          </div>

          <div className="space-y-3" role="list">
            {pricingFaqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-primary/50 bg-surface shadow-xs"
                      : "border-border bg-background hover:border-border/90"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left font-display font-bold text-sm sm:text-base text-text flex items-center justify-between gap-4 select-none cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-text-muted shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border/50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 8. FINAL HIGH-CONVERTING BOTTOM CTA BANNER ──────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Zero Advance Required
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Get Your Fixed, Binding Relocation Quote Today
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Schedule a free doorstep or video inventory check. We guarantee a written, all-inclusive price with zero hidden surprises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/get-quote" size="lg" className="w-full sm:w-auto shadow-lg">
                Book Free Pre-Move Survey
              </Button>
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 bg-white/10 text-white font-display font-bold text-sm hover:bg-white hover:text-primary transition-all shadow-md"
                >
                  <PhoneCall size={16} />
                  <span>Call: {company.phone.primary}</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> 100% Binding Written Quote
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Zero Moving-Day Demands
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Full GST Invoices
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
