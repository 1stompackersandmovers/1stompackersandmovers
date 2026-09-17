import { useParams, Link, Navigate } from "react-router";
import { ChevronRight, Truck, PhoneCall, MessageCircle, ShieldCheck, CheckCircle2, MapPin } from "lucide-react";
import { allRoutes } from "../../../../data/locations/index";
import { company } from "../../../../data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

const RoutePage = () => {
  const { slug } = useParams();
  const route = allRoutes.find((r) => r.slug === slug);

  if (!route) {
    return <Navigate to="/where-we-serve" replace />;
  }

  const estimatedDays = route.distanceKm
    ? route.distanceKm > 1500
      ? "4 to 6 days"
      : route.distanceKm > 800
      ? "3 to 4 days"
      : "1 to 2 days"
    : "2 to 4 days";

  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20a%20quote%20for%20moving%20from%20${encodeURIComponent(route.from)}%20to%20${encodeURIComponent(route.to)}.`
    : "#";

  return (
    <>
      <SEO
        title={`Packers and Movers from ${route.from} to ${route.to}`}
        description={`Dedicated interstate relocation from ${route.from} to ${route.to}. Sealed closed containers, direct transit, and comprehensive insurance.`}
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link to="/where-we-serve" className="hover:text-text transition-colors">Routes</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">{route.from} to {route.to}</span></li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Truck size={13} />
              <span>Interstate Relocation Corridor</span>
            </div>

            <h1
              className="font-display font-bold text-text mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Packers and movers {route.from} to {route.to}
            </h1>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-6">
              Dedicated interstate relocation services between {route.from} and {route.to}. Packed with multi-layer materials, transported in dedicated closed containers, and delivered directly to your doorstep.
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
        </div>
      </section>

      {/* Corridor Overview */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              
              {/* Route stat pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-[var(--radius-md)] border border-border bg-surface">
                <div>
                  <span className="text-xs text-text-muted block">Origin Hub</span>
                  <span className="font-semibold text-text text-sm sm:text-base">{route.from}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Destination Hub</span>
                  <span className="font-semibold text-text text-sm sm:text-base">{route.to}</span>
                </div>
                {route.distanceKm && (
                  <div>
                    <span className="text-xs text-text-muted block">Highway Distance</span>
                    <span className="font-semibold text-text text-sm sm:text-base">~{route.distanceKm} km</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-text-muted block">Estimated Transit</span>
                  <span className="font-semibold text-text text-sm sm:text-base">{estimatedDays}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Vehicle Type</span>
                  <span className="font-semibold text-text text-sm sm:text-base">Closed Container</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Transit Insurance</span>
                  <span className="font-semibold text-text text-sm sm:text-base">Full Value Available</span>
                </div>
              </div>

              <div>
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-4">
                  Moving your home from {route.from} to {route.to}
                </h2>
                <p className="text-text-muted text-base leading-relaxed mb-4">
                  Long-distance journeys over {route.distanceKm ? `approx ${route.distanceKm} kilometres` : "interstate corridors"} require specialized handling. Your household goods endure highway vibrations and multiple toll crossings. We use high-density packing, foam edging, and secure internal truck anchoring so nothing shifts during transit.
                </p>
                <p className="text-text-muted text-base leading-relaxed">
                  Your move receives a dedicated vehicle. Unlike shared freight operators who unload and reload goods across intermediate transshipment hubs, your consignment stays sealed inside the same container from {route.from} until it arrives at your new home in {route.to}.
                </p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-text text-lg mb-4">
                  Our interstate service commitments
                </h3>
                <ul className="space-y-3.5" role="list">
                  {[
                    `Direct doorstep pickup in ${route.from} with professional room-wise packing`,
                    "Direct transit without intermediate unloading or hub re-sorting",
                    "Continuous transit tracking and direct updates via your supervisor",
                    `Scheduled delivery and room placement at your new residence in ${route.to}`,
                    "Assistance with transit insurance documentation for all declared valuables",
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
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 rounded-[var(--radius-md)] border border-border bg-surface space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-text text-base mb-2">
                    Planning this route?
                  </h3>
                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                    Get an itemised quote for the {route.from} to {route.to} corridor with your required dates.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    to="/get-quote"
                    size="md"
                    className="w-full"
                  >
                    Request Route Quote
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
                    <span>Sealed containers. Dedicated long-distance vehicles.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <QuoteForm />
    </>
  );
};

export default RoutePage;
