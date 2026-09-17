import { Link } from "react-router";
import { ChevronRight, MapPin, Navigation } from "lucide-react";
import { locationsByState, allRoutes, placeImages } from "../../../../data/locations/index";
import SEO from "../../../../configs/seo";

const STATE_ORDER = [
  "Bihar",
  "Jharkhand",
  "Uttar Pradesh",
  "Delhi NCR",
  "West Bengal",
  "Maharashtra",
  "Karnataka",
  "Telangana",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Chandigarh",
];

const WhereWeServe = () => {
  return (
    <>
      <SEO
        title="Service Locations & Interstate Moving Routes"
        description="Explore all cities, hubs, and interstate corridors served by 1st Om Packers and Movers across Bihar, Jharkhand, UP, Delhi NCR, and India."
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Where We Serve</span></li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <h1
              className="font-display font-bold text-text mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Our service locations &amp; interstate routes
            </h1>
            <p className="text-text-muted text-base leading-relaxed">
              We operate dedicated packing and relocation crews across East and North India, with direct transport corridors connecting to every major commercial hub nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* State by State directory */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-8">
            State-wise district &amp; city coverage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STATE_ORDER.map((state) => {
              const locations = locationsByState[state];
              if (!locations || locations.length === 0) return null;
              const image = placeImages[state];

              return (
                <div
                  key={state}
                  className="rounded-3xl border border-border bg-surface overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                >
                  {image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-background border-b border-border/60">
                      <img
                        src={image}
                        alt={`1st Om Packers and Movers in ${state}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                      <MapPin size={18} className="text-primary" />
                      <h3 className="font-display font-bold text-text text-lg">
                        {state}
                      </h3>
                    </div>

                    <ul className="grid grid-cols-2 gap-2 flex-1" role="list">
                      {locations.map((loc) => (
                        <li key={loc.slug}>
                          <Link
                            to={`/packers-movers-${loc.slug}`}
                            className="text-xs sm:text-sm text-text-muted hover:text-primary transition-colors flex items-center gap-1 py-1"
                          >
                            <span className="truncate">{loc.name}</span>
                            {loc.type === "hub" && (
                              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                                Hub
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Popular Interstate Routes */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <Navigation size={22} className="text-primary" />
              <h2 className="font-display font-bold text-text text-xl sm:text-2xl">
                Dedicated interstate transport corridors
              </h2>
            </div>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
              Regularly scheduled long-distance moves with direct routes, dedicated vehicle allocation, and predictable delivery timelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRoutes.map((route) => (
                <Link
                  key={route.slug}
                  to={`/route/${route.slug}`}
                  className="p-4 rounded-[var(--radius-sm)] border border-border bg-background hover:bg-surface hover:border-primary/30 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-text group-hover:text-primary">
                    {route.from} to {route.to}
                  </span>
                  {route.distanceKm && (
                    <span className="text-xs text-text-muted font-normal">
                      ~{route.distanceKm} km
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhereWeServe;
