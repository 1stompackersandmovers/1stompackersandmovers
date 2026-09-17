import { Link } from "react-router";
import { ChevronRight, MapPin, PhoneCall, Mail, Clock, MessageCircle } from "lucide-react";
import { company } from "../../../../data/company";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

const Contact = () => {
  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20want%20to%20enquire%20about%20your%20moving%20services.`
    : "#";

  return (
    <>
      <SEO
        title="Contact Us - Branches & Customer Care"
        description={`Contact ${company.brandName} head office in ${company.headOffice.city} or speak directly with our relocation supervisors.`}
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">Contact</span></li>
            </ol>
          </nav>
          <h1
            className="font-display font-bold text-text mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Contact our team
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-xl">
            Reach out by phone, WhatsApp, or visit our head office. We are ready to answer your questions and assist with your relocation plans.
          </p>
        </div>
      </section>

      {/* Main Details */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact cards */}
            <div className="p-6 rounded-[var(--radius-md)] border border-border bg-surface flex flex-col">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center text-primary mb-4">
                <PhoneCall size={20} strokeWidth={2} />
              </div>
              <h2 className="font-display font-semibold text-text text-lg mb-2">Phone &amp; WhatsApp</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">
                Speak directly with our move planners for instant clarifications and quotes.
              </p>
              <div className="space-y-3">
                {company.phone.primary && (
                  <a
                    href={`tel:${company.phone.primary}`}
                    className="block font-semibold text-primary hover:underline text-base"
                  >
                    {company.phone.primary}
                  </a>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-success hover:underline"
                >
                  <MessageCircle size={16} />
                  Connect on WhatsApp
                </a>
              </div>
            </div>

            <div className="p-6 rounded-[var(--radius-md)] border border-border bg-surface flex flex-col">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Mail size={20} strokeWidth={2} />
              </div>
              <h2 className="font-display font-semibold text-text text-lg mb-2">Email Inquiries</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">
                Send us your shifting requirements, inventory lists, or corporate relocation tenders.
              </p>
              <div>
                {company.email.general ? (
                  <a
                    href={`mailto:${company.email.general}`}
                    className="font-semibold text-primary hover:underline text-base"
                  >
                    {company.email.general}
                  </a>
                ) : (
                  <span className="text-sm text-text-muted">Available on request</span>
                )}
              </div>
            </div>

            <div className="p-6 rounded-[var(--radius-md)] border border-border bg-surface flex flex-col">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Clock size={20} strokeWidth={2} />
              </div>
              <h2 className="font-display font-semibold text-text text-lg mb-2">Operating Hours</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">
                Our support desk is active every day. Field shifting operates around the clock as scheduled.
              </p>
              <div className="space-y-1 text-sm text-text">
                <p><span className="font-medium">Monday to Saturday:</span> {company.businessHours.weekdays}</p>
                <p><span className="font-medium">Sunday:</span> {company.businessHours.weekends}</p>
              </div>
            </div>

          </div>

          {/* Head Office & Branches */}
          <div className="mt-14 pt-12 border-t border-border">
            <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-6">
              Head Office &amp; Operational Hub
            </h2>
            <div className="p-6 rounded-[var(--radius-md)] border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-text text-base">
                    {company.brandName} Head Office
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {company.headOffice.addressLine ? (
                      `${company.headOffice.addressLine}, ${company.headOffice.city}, ${company.headOffice.state} ${company.headOffice.pincode}`
                    ) : (
                      `${company.headOffice.city}, ${company.headOffice.state}`
                    )}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Serving all districts across Bihar, Jharkhand, and pan-India corridors.
                  </p>
                </div>
              </div>

              <Button to="/get-quote" size="md" className="shrink-0">
                Request a Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
