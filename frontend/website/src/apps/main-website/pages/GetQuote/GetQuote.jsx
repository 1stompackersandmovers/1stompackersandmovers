import { Link } from "react-router";
import { ChevronRight, PhoneCall, MessageCircle, ShieldCheck } from "lucide-react";
import { company } from "../../../../data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";

const GetQuote = () => {
  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20a%20quote%20for%20my%20relocation.`
    : "#";

  return (
    <>
      <SEO
        title="Get a Free Moving Quote"
        description="Request a free, transparent moving estimate for home, office, or vehicle shifting. Fixed price after pre-move evaluation."
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Get a Quote</span></li>
            </ol>
          </nav>
          <div className="max-w-2xl">
            <h1
              className="font-display font-bold text-text mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Request a free relocation quote
            </h1>
            <p className="text-text-muted text-base leading-relaxed mb-6">
              Tell us what you are moving and when. Our supervisors evaluate the distance, floor access, and item volume to provide a transparent, all-inclusive price.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <PhoneCall size={16} />
                  Call {company.phone.primary}
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-success hover:underline"
              >
                <MessageCircle size={16} />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Quote Form */}
      <QuoteForm />

      {/* Assurance banner */}
      <section className="bg-background py-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-3">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-display font-semibold text-text text-lg mb-1">
            Our price guarantee
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
            Once we inspect your inventory and provide a formal quote, there are zero surprise charges at the delivery destination.
          </p>
        </div>
      </section>
    </>
  );
};

export default GetQuote;
