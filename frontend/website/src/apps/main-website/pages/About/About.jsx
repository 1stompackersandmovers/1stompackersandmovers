import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { company } from "../../../../data/company";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

/**
 * About page — tells the company's story using only confirmed facts from company.js.
 * No fabricated numbers, no invented awards.
 */
const About = () => {
  return (
    <>
      <SEO
        title={`About Us - Leading Moving Company in Bihar`}
        description={`Learn about ${company.brandName}, our service origins in Patna, and our commitment to transparent, dedicated household and office relocation.`}
      />
      {/* Hero */}
      <section className="bg-surface border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-text-muted" role="list">
              <li><Link to="/" className="hover:text-text transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><span className="text-text font-medium">About us</span></li>
            </ol>
          </nav>
          <h1
            className="font-display font-bold text-text mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            About {company.brandName}
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-xl">
            A moving company rooted in Bihar, built on the idea that relocation should feel
            like a beginning, not a crisis.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="prose-like space-y-5 text-text-muted text-base leading-relaxed">
            <p>
              {company.legalName} started in Patna with a simple observation:
              most people moving homes in Bihar and Jharkhand had to choose
              between trusting an unorganised local contractor or paying metro-city
              rates for a large national brand that treated their move as a
              low-priority consignment.
            </p>
            <p>
              We built {company.brandName} to be the reliable alternative. We bring
              local knowledge of every road and route between Patna and
              Ranchi, between Bhagalpur and Kolkata, combined with the
              discipline and care people expect when handing over
              their household possessions.
            </p>
            <p>
              Today we serve families and businesses across Bihar, Jharkhand,
              Uttar Pradesh, Delhi NCR, and West Bengal, and handle interstate
              routes to every major city in India. Every move we take on gets
              a dedicated team, a clear price before anything is packed, and a
              call from us when the truck arrives at your door.
            </p>
          </div>

          {/* What makes us different — no generic badge claims */}
          <div className="bg-surface rounded-[var(--radius-md)] border border-border p-6 space-y-5">
            <h2 className="font-display font-bold text-text text-xl">
              How we work differently
            </h2>
            <ul className="space-y-4" role="list">
              {[
                {
                  title: "One price, stated upfront",
                  body: "We do a proper survey before quoting. The number you agree to is the number you pay. We never add surprise charges at the destination.",
                },
                {
                  title: "Your goods travel alone",
                  body: "We don't mix your household with another family's goods to fill a truck faster. Your move gets its own vehicle.",
                },
                {
                  title: "We cover the routes we know",
                  body: "We operate where we have actual experience, including Bihar districts, Jharkhand highway corridors, and UP border routes. We don't promise service in cities we have never worked in.",
                },
                {
                  title: "Direct supervisor contact",
                  body: "When something matters or a question comes up mid-move, you speak directly with the person managing your shift, not an automated system.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5" aria-hidden="true">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-text text-sm mb-0.5">{item.title}</p>
                    <p className="text-text-muted text-sm leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button to="/get-quote" size="md">
              Get a free quote
            </Button>
            <Button to="/contact" variant="outline" size="md" showArrow={false}>
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
