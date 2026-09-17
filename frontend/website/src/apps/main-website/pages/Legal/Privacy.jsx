import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { company } from "../../../../data/company";

const Privacy = () => {
  return (
    <>
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Privacy Policy</span></li>
            </ol>
          </nav>
          <h1
            className="font-display font-bold text-text mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-xl">
            How {company.legalName} collects, uses, and safeguards the personal information you provide when requesting moving services.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-text leading-relaxed">
          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">1. Information We Collect</h2>
            <p className="text-text-muted text-sm sm:text-base mb-3">
              When you submit an inquiry or book a move with {company.brandName}, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-text-muted" role="list">
              <li>Your name and contact phone number</li>
              <li>Your origin and destination addresses or cities</li>
              <li>Relocation dates, preferred timeline, and move scope</li>
              <li>Your email address (if voluntarily provided)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">2. How We Use Your Information</h2>
            <p className="text-text-muted text-sm sm:text-base mb-3">
              Your details are used exclusively for coordinating your relocation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-text-muted" role="list">
              <li>Conducting pre-move surveys and calculating pricing quotes</li>
              <li>Communicating pickup schedules, transit updates, and delivery timelines</li>
              <li>Issuing transit invoices and facilitating insurance documentation</li>
            </ul>
            <p className="text-text-muted text-sm sm:text-base mt-3">
              We do not sell, rent, or trade your contact information to third-party marketing agencies.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">3. Data Retention and Security</h2>
            <p className="text-text-muted text-sm sm:text-base">
              We retain customer contact records only as necessary to provide service, maintain accounting logs, and comply with applicable statutory laws. We implement technical controls to prevent unauthorized access to customer records.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-text mb-3">4. Contact Us</h2>
            <p className="text-text-muted text-sm sm:text-base">
              If you have inquiries regarding this privacy policy or wish to review your details, please reach our head office at {company.headOffice.city}, {company.headOffice.state}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
