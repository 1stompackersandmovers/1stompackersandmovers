import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

/**
 * Pricing page — indicative rate table only.
 *
 * These are starting-range estimates. The real quote comes from a survey.
 * Rates are maintained here (and editable via admin panel once backend is live).
 *
 * IMPORTANT: Update rates with client-confirmed figures before launch.
 * Never present these as fixed prices — always pair with a "get a quote" CTA.
 */

const localRates = [
  { homeSize: "1 BHK", range: "₹3,000 – ₹8,000" },
  { homeSize: "2 BHK", range: "₹5,000 – ₹15,000" },
  { homeSize: "3 BHK", range: "₹8,000 – ₹25,000" },
  { homeSize: "4+ BHK / Villa", range: "₹15,000 – ₹50,000+" },
];

const interstateRates = [
  { route: "Bihar to Jharkhand (e.g. Patna to Ranchi)", range: "₹10,000 – ₹35,000" },
  { route: "Bihar to Delhi NCR", range: "₹20,000 – ₹60,000" },
  { route: "Bihar to West Bengal (e.g. Patna to Kolkata)", range: "₹12,000 – ₹40,000" },
  { route: "Bihar to UP (e.g. Patna to Lucknow)", range: "₹12,000 – ₹38,000" },
  { route: "Bihar to Mumbai / Pune / Bengaluru", range: "₹30,000 – ₹80,000+" },
];

const additionalServices = [
  { service: "Car transportation", range: "₹5,000 – ₹20,000" },
  { service: "Bike transportation", range: "₹2,000 – ₹8,000" },
  { service: "Packing & unpacking only", range: "₹2,000 – ₹12,000" },
  { service: "Loading & unloading only", range: "₹1,500 – ₹8,000" },
  { service: "Storage per month", range: "₹2,000 – ₹10,000" },
];

const RateCard = ({ title, rows }) => (
  <div className="rounded-[var(--radius-md)] border border-border overflow-hidden">
    <div className="px-5 py-4 bg-surface border-b border-border">
      <h2 className="font-display font-semibold text-text text-base">{title}</h2>
    </div>
    <ul role="list">
      {rows.map((row, i) => (
        <li
          key={i}
          className={`flex items-center justify-between px-5 py-4 ${
            i < rows.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className="text-sm text-text-muted flex-1 pr-4">
            {row.homeSize ?? row.route ?? row.service}
          </span>
          <span className="text-sm font-semibold text-text shrink-0">{row.range}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Pricing = () => {
  return (
    <>
      <SEO
        title="Pricing & Moving Cost Estimates"
        description="Indicative relocation pricing and moving cost estimates for local shifting in Bihar and Jharkhand as well as interstate routes across India."
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Pricing</span></li>
            </ol>
          </nav>
          <h1
            className="font-display font-bold text-text mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Pricing &amp; estimates
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-2xl">
            The ranges below are starting estimates based on typical moves. Your actual
            quote depends on the volume of goods, the specific route, the floor and access
            at both addresses, and any add-on services. We give you a fixed price
            after a proper survey, so the number you agree to is the number you pay.
          </p>
        </div>
      </section>

      {/* Rate tables */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <RateCard title="Local / within-city home shifting" rows={localRates} />
          <RateCard title="Interstate home shifting" rows={interstateRates} />
          <RateCard title="Additional services" rows={additionalServices} />

          {/* Disclaimer */}
          <p className="text-xs text-text-muted leading-relaxed">
            All prices are indicative estimates only and include basic packing materials
            unless noted otherwise. Goods insurance, Turnstile protection fees, and
            any special handling charges are quoted separately. Actual price is confirmed
            in writing before any work begins.
          </p>

          {/* CTA */}
          <div className="bg-surface rounded-[var(--radius-md)] border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="font-display font-semibold text-text mb-1">
                Get your actual quote
              </p>
              <p className="text-sm text-text-muted">
                Fill the short form and we&apos;ll call with a clear, fixed price after assessing your move.
              </p>
            </div>
            <Button to="/get-quote" size="md" className="shrink-0">
              Get a free quote
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
