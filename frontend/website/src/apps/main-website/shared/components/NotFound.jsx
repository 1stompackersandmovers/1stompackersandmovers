import { Link } from "react-router";
import { PhoneCall, MessageCircle, Home } from "lucide-react";
import { company } from "../../../../data/company";
import Button from "./Button";

const NotFound = () => {
  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-display font-bold text-border mb-2">404</p>
      <h1 className="text-2xl font-display font-semibold text-text mb-3">
        Page not found
      </h1>
      <p className="text-text-muted text-base max-w-sm mb-8 leading-relaxed">
        This page doesn&apos;t exist or may have moved. You can head back home,
        or reach us directly and we&apos;ll help you from there.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button to="/" size="sm" icon={<Home size={16} strokeWidth={2} />} showArrow={false}>
          Back to home
        </Button>
        {company.phone.primary && (
          <a
            href={`tel:${company.phone.primary}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] border border-border text-sm font-medium text-text hover:bg-surface transition-colors"
          >
            <PhoneCall size={16} strokeWidth={2} className="text-primary" />
            Call us
          </a>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] border border-border text-sm font-medium text-text hover:bg-surface transition-colors"
        >
          <MessageCircle size={16} strokeWidth={2} className="text-success" />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default NotFound;
