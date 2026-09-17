import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { company } from "../../../../data/company";

const Terms = () => {
  return (
    <>
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Terms of Service</span></li>
            </ol>
          </nav>
          <h1
            className="font-display font-bold text-text mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Terms of Service
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-xl">
            Operating conditions and terms governing relocation services provided by {company.legalName}.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-text leading-relaxed">
          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">1. Scope of Quotations</h2>
            <p className="text-text-muted text-sm sm:text-base">
              Online estimates and verbal ranges are indicative. A binding price is issued upon survey or detailed confirmation of the inventory list, floor elevations, lift accessibility, and parking distances. Any subsequent additions of heavy items or extra packing requirements will be adjusted transparently.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">2. Prohibited &amp; Restrictive Items</h2>
            <p className="text-text-muted text-sm sm:text-base mb-3">
              For legal compliance and vehicle safety, we do not transport hazardous materials, flammables, explosives, contraband, liquids in open containers, or perishable food items.
            </p>
            <p className="text-text-muted text-sm sm:text-base">
              Personal jewelry, precious metals, currency, financial documents, and high-value negotiable bonds must remain under personal custody of the customer during the move.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">3. Transit Insurance</h2>
            <p className="text-text-muted text-sm sm:text-base">
              Transit insurance covers consignments against road accidents, theft, or unforeseen transit hazards based on the declared valuation list signed prior to dispatch. Claims are processed according to the underlying underwriter policy terms.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">4. Delivery Inspection</h2>
            <p className="text-text-muted text-sm sm:text-base">
              Upon unloading at the destination residence, the customer or authorized representative participates in the physical receipt check before final delivery sign-off is recorded.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
