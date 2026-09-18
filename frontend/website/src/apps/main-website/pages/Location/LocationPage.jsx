import { useParams, Link, Navigate } from "react-router";
import { ChevronRight, MapPin, Truck, PhoneCall, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { allServiceLocations, primaryHub, placeImages } from "../../../../data/locations/index";
import { company } from "../../../../data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

/**
 * Localized information mapping for major hubs and regions to ensure content uniqueness
 */
const locationContexts = {
  patna: {
    corridors: "NH 19 and NH 31, connecting seamlessly across northern and southern Bihar",
    logisticsNote: "As our central operations base, Patna consignments benefit from direct fleet dispatch, immediate pre-move surveys, and round-the-clock supervisor availability.",
    popularDestinations: ["Ranchi", "Delhi NCR", "Kolkata", "Muzaffarpur", "Gaya"],
  },
  gaya: {
    corridors: "Grand Trunk Road (NH 19) corridor connecting southern Bihar and Jharkhand",
    logisticsNote: "Crews coordinate closely with our Patna hub, operating specialized transit vehicles equipped for both old town lanes and wide highway transit.",
    popularDestinations: ["Patna", "Kolkata", "Delhi NCR", "Ranchi"],
  },
  muzaffarpur: {
    corridors: "NH 27 and NH 22, the key commercial distribution gateway of North Bihar",
    logisticsNote: "Regular shuttles connect directly with our central warehouse, providing swift transit for both residential and commercial moves across Tirhut region.",
    popularDestinations: ["Patna", "Delhi NCR", "Siliguri", "Kolkata"],
  },
  bhagalpur: {
    corridors: "NH 80 along the southern bank of the Ganges toward West Bengal",
    logisticsNote: "Dedicated vehicles operate regular schedules linking Bhagalpur directly with Kolkata, Patna, and Ranchi.",
    popularDestinations: ["Patna", "Kolkata", "Ranchi", "Delhi NCR"],
  },
  ranchi: {
    corridors: "NH 20 and NH 33 connecting central Jharkhand to Bihar and West Bengal",
    logisticsNote: "Our dedicated regional fleet handles local shifts across Ranchi urban zones as well as high-volume interstate journeys to Patna and Delhi NCR.",
    popularDestinations: ["Patna", "Delhi NCR", "Kolkata", "Jamshedpur", "Bengaluru"],
  },
  jamshedpur: {
    corridors: "NH 18 connecting industrial belts of Jharkhand with Odisha and West Bengal",
    logisticsNote: "Specialised in heavy commercial and industrial relocations alongside corporate family home transfers.",
    popularDestinations: ["Kolkata", "Ranchi", "Patna", "Delhi NCR"],
  },
  dhanbad: {
    corridors: "NH 19 (GT Road) providing direct high-speed freight access to Kolkata and Delhi",
    logisticsNote: "Regularly scheduled dispatches ensure rapid transit for coal-belt families moving to Kolkata, Patna, or northern metros.",
    popularDestinations: ["Kolkata", "Patna", "Ranchi", "Delhi NCR"],
  },
  delhi: {
    corridors: "Eastern and Western Peripheral Expressways connecting to all major northern and eastern highways",
    logisticsNote: "Dedicated interstate arrivals are handled with scheduled morning deliveries to navigate local Delhi NCR commercial vehicle entry regulations.",
    popularDestinations: ["Patna", "Ranchi", "Lucknow", "Kolkata"],
  },
  kolkata: {
    corridors: "NH 19 and NH 12 corridors connecting West Bengal with Bihar and North East",
    logisticsNote: "Experienced crews manage Kolkata bridge and city-entry commercial restrictions, ensuring punctuality for domestic and interstate moves.",
    popularDestinations: ["Patna", "Ranchi", "Siliguri", "Delhi NCR"],
  },
};

const LocationPage = () => {
  const { slug } = useParams();
  const location = allServiceLocations.find((loc) => loc.slug === slug);

  if (!location) {
    return <Navigate to="/where-we-serve" replace />;
  }

  const context = locationContexts[location.slug] || {
    corridors: `regional highway routes connecting ${location.state}`,
    logisticsNote: `Coordinated directly through our primary ${location.state} transport network with direct link to our central ${primaryHub?.name || "Patna"} hub.`,
    popularDestinations: ["Patna", "Delhi NCR", "Ranchi", "Kolkata"],
  };

  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20packers%20and%20movers%20in%20${encodeURIComponent(location.name)}.`
    : "#";

  return (
    <>
      <SEO
        title={`Packers and Movers in ${location.name}, ${location.state}`}
        description={`Professional household packing and moving services in ${location.name}. Dedicated closed trucks, experienced crew, and fixed pricing.`}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "MovingCompany",
          "name": `${company.brandName} - ${location.name}`,
          "telephone": company.phone.primary || undefined,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": location.name,
            "addressRegion": location.state,
            "addressCountry": "IN"
          }
        }}
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link to="/where-we-serve" className="hover:text-text transition-colors">Locations</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">{location.name}</span></li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className={placeImages[location.state] ? "lg:col-span-7" : "max-w-3xl"}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <MapPin size={13} />
                <span>{location.state} Service Area</span>
              </div>

              <h1
                className="font-display font-bold text-text mb-4"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                Packers and movers in {location.name}
              </h1>
              <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-6">
                Safe, on-schedule home and commercial shifting services across {location.name}. Managed with experienced crews, dedicated closed-body vehicles, and upfront fixed pricing.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                {company.phone.primary && (
                  <a
                    href={`tel:${company.phone.primary}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <PhoneCall size={16} />
                    Call {company.phone.primary}
                  </a>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] border border-border bg-background text-sm font-semibold text-success hover:bg-surface transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp us
                </a>
              </div>
            </div>

            {placeImages[location.state] && (
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden border border-border shadow-md bg-surface aspect-[16/10]">
                  <img
                    src={placeImages[location.state]}
                    alt={`1st Om Packers and Movers operations in ${location.name}, ${location.state}`}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Local Logistics & Practical Details */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-4">
                  Relocation operations in {location.name}
                </h2>
                <p className="text-text-muted text-base leading-relaxed mb-4">
                  Moving in or out of {location.name} requires familiarity with local routes and road conditions. Our drivers operate via {context.corridors}, selecting optimal timing to navigate urban traffic and interstate toll checkpoints smoothly.
                </p>
                <p className="text-text-muted text-base leading-relaxed">
                  {context.logisticsNote} Every item in your home or workplace is catalogued and wrapped before loading, with dedicated vehicle space so your goods travel directly to your destination address.
                </p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-text text-lg mb-4">
                  What we provide for {location.name} relocations
                </h3>
                <ul className="space-y-3.5" role="list">
                  {[
                    `Full door-to-door packing and delivery within ${location.name} and to any state`,
                    "High-density bubble wrap, corner protectors, and heavy-duty corrugated cartons",
                    "Experienced loaders familiar with multi-storey staircases and complex building guidelines",
                    "Disassembly and reassembly of large beds, wardrobes, and modular desks",
                    "Optional transit insurance protecting your declared consignment value",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                        <CheckCircle2 size={15} strokeWidth={2.5} />
                      </span>
                      <span className="text-text-muted text-sm sm:text-base leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular routes from here */}
              <div>
                <h3 className="font-display font-semibold text-text text-lg mb-4">
                  Frequent moving routes from {location.name}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {context.popularDestinations.map((dest) => (
                    <span
                      key={dest}
                      className="px-3.5 py-1.5 rounded-full border border-border bg-surface text-xs sm:text-sm text-text-muted flex items-center gap-1.5"
                    >
                      <Truck size={13} className="text-primary" />
                      <span>{location.name} to {dest}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 rounded-[var(--radius-md)] border border-border bg-surface space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-text text-base mb-2">
                    Shifting in {location.name}?
                  </h3>
                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                    Contact our move coordinators for an immediate quote based on your room configuration and date.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    to={`/get-quote?from=${encodeURIComponent(location.name + ", " + location.state)}`}
                    size="md"
                    className="w-full"
                  >
                    Get a Free Quote in {location.name}
                  </Button>
                  {company.phone.primary && (
                    <a
                      href={`tel:${company.phone.primary}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-sm)] border border-border bg-background text-sm font-medium text-text hover:bg-surface transition-colors"
                    >
                      <PhoneCall size={15} strokeWidth={2} className="text-primary" />
                      Call {company.phone.primary}
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <ShieldCheck size={16} className="text-primary shrink-0" />
                    <span>Safe transit. Fully verified ground crew.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote form directly on the page */}
      <QuoteForm />
    </>
  );
};

export default LocationPage;
