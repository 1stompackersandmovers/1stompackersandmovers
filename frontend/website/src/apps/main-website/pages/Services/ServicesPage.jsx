import { Link } from "react-router";
import { Home, Building2, Car, Bike, Package, Boxes, Warehouse, ShieldCheck, ChevronRight } from "lucide-react";
import SEO from "../../../../configs/seo";

const servicePages = [
  {
    icon: Home,
    title: "Home Shifting",
    slug: "home-shifting",
    description:
      "Moving your household means moving the rhythm of daily life. We treat each item like it belongs to us.",
    points: [
      "Detailed pre-move survey and itemised quote",
      "High-grade packing materials matched to each item type",
      "Dedicated vehicle so your goods do not share space with another family's move",
      "Room-by-room unloading and placement at destination",
      "Optional unpacking and debris removal",
    ],
  },
  {
    icon: Building2,
    title: "Office & Commercial Shifting",
    slug: "office-commercial-shifting",
    description:
      "Business moves have a hard deadline. Your team needs to be operational in the new office, not waiting on delayed furniture. We plan around your schedule, not ours.",
    points: [
      "After-hours and weekend moves to minimise business downtime",
      "IT equipment packed by trained staff using anti-static materials",
      "Furniture dismantling and reassembly at destination",
      "Branded carton labelling for easy department-wise setup",
      "Factory, warehouse, and retail shifting handled",
    ],
  },
  {
    icon: Car,
    title: "Car Transportation",
    slug: "car-transportation",
    description:
      "Your car is one of the largest purchases you have made. It travels on a closed multi-car carrier, never driven on the road, and arrives clean and undamaged.",
    points: [
      "Closed-body carrier transport without open-deck road driving",
      "Pre-loading condition inspection and sign-off",
      "Transit insurance included as standard",
      "Door-to-door delivery at destination city",
      "All car types: hatchback, sedan, SUV, luxury",
    ],
  },
  {
    icon: Bike,
    title: "Bike Transportation",
    slug: "bike-transportation",
    description:
      "Two-wheelers packed in protective wooden crates, transported on the same routes and with the same care as your household goods.",
    points: [
      "Crate packing for full protection during transit",
      "Fuel drained and battery disconnected for safety compliance",
      "Transit insurance",
      "Can be clubbed with household shifting for combined billing",
      "Scooters, motorcycles, sports bikes all handled",
    ],
  },
  {
    icon: Package,
    title: "Packing & Unpacking",
    slug: "packing-unpacking",
    description:
      "Good packing is what separates a damaged delivery from a perfect one. We bring the right materials for every category of item.",
    points: [
      "Bubble wrap, foam sheets, and corrugated boxes matched to item fragility",
      "Art, antiques, and electronics packed with extra protection layers",
      "All boxes labelled by room and item type",
      "Unpacking service available at destination",
      "Packing-only service available if you are using your own transport",
    ],
  },
  {
    icon: Boxes,
    title: "Loading & Unloading",
    slug: "loading-unloading",
    description:
      "Trained labour who know how to handle heavy items without scratching floors, damaging door frames, or straining their backs doing it wrong.",
    points: [
      "Experienced crew familiar with apartments, stairs, and tight corridors",
      "Furniture disassembly and reassembly where required",
      "Appliance handling for refrigerators, washing machines, and air conditioners",
      "Labour-only service available for self-arranged transport",
      "Available for both loading at origin and unloading at destination",
    ],
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    slug: "warehousing-storage",
    description:
      "When your new home is not ready yet, our facilities keep everything dry, secure, and accessible.",
    points: [
      "Secure, weatherproof storage facilities",
      "Short-term and long-term storage available",
      "Inventory tracking so you know exactly what is stored",
      "Easy retrieval without sorting through a warehouse yourself",
      "Available as an add-on to any shifting service",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Goods Insurance",
    slug: "goods-insurance",
    description:
      "Transit insurance covers your goods for their declared value, not a fraction of it. If something is damaged in transit, you are compensated properly.",
    points: [
      "Transit insurance for all goods types",
      "Declared value coverage, not depreciated replacement",
      "Claim process handled by our team, not left to you alone",
      "Available for all shifting types: home, office, vehicle",
      "Documentation provided for each insured consignment",
    ],
  },
];

const ServicesPage = () => {
  return (
    <>
      <SEO
        title="Packing & Relocation Services"
        description="Comprehensive household and commercial moving services: home shifting, office relocation, vehicle transport, packing, and warehousing."
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Services</span></li>
            </ol>
          </nav>
          <h1
            className="font-display font-bold text-text mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Our services
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-xl">
            From the first roll of tape to the last item placed in your new home, every part of your move is handled.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="space-y-12" role="list">
            {servicePages.map((service) => {
              const Icon = service.icon;
              return (
                <li
                  key={service.slug}
                  id={service.slug}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="lg:col-span-1 flex flex-col">
                    <Icon size={28} strokeWidth={1.75} className="text-primary mb-4" aria-hidden="true" />
                    <h2 className="font-display font-bold text-text text-xl mb-3">
                      {service.title}
                    </h2>
                    <p className="text-text-muted text-sm leading-relaxed mb-5 flex-1">
                      {service.description}
                    </p>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-sm font-semibold text-primary hover:underline self-start"
                    >
                      Full details
                    </Link>
                  </div>
                  <div className="lg:col-span-2">
                    <ul className="space-y-3" role="list">
                      {service.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5" aria-hidden="true">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="text-sm text-text-muted leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
