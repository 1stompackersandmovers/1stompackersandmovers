import { useEffect, useRef } from "react";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";

/**
 * HowItWorks — the ONE bold motion moment on this page.
 *
 * A route line threads through 4 steps (Survey → Pack → Transport → Unpack).
 * A truck marker travels along the line as the user scrolls — built with
 * GSAP ScrollTrigger.
 *
 * Every other section on this page uses NO scroll animation.
 * This section owns the "spent boldness."
 *
 * prefers-reduced-motion: the line still draws but instantly, no motion.
 */

const steps = [
  {
    icon: CheckCircle2,
    step: "1",
    title: "Survey & quote",
    description:
      "We visit your home (or do a video survey), assess the volume and distance, and give you a clear, itemised price before anything is packed.",
  },
  {
    icon: Package,
    step: "2",
    title: "Professional packing",
    description:
      "Our team arrives on the agreed date with the right materials. Fragile items are individually wrapped. Nothing gets taped into the wrong box.",
  },
  {
    icon: Truck,
    step: "3",
    title: "Safe transport",
    description:
      "Your belongings travel in a dedicated vehicle, never mixed with another family's goods. We take the safest route and update you when we depart and arrive.",
  },
  {
    icon: Home,
    step: "4",
    title: "Delivery & unpacking",
    description:
      "We unload, place furniture where you want it, and do a room-by-room check with you before we leave. Your new home, ready to live in.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const truckRef = useRef(null);

  useEffect(() => {
    let ctx;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
          // No motion — just show the full line immediately
          if (lineRef.current) {
            lineRef.current.style.strokeDashoffset = "0";
          }
          return;
        }

        // Animate the route line drawing itself
        if (lineRef.current) {
          const length = lineRef.current.getTotalLength?.() ?? 1000;
          gsap.set(lineRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(lineRef.current, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          });
        }

        // Truck marker travels along the line
        if (truckRef.current && lineRef.current) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              // Translate truck from left to right across the section
              gsap.set(truckRef.current, {
                left: `${progress * 85}%`,
              });
            },
          });
        }
      }, sectionRef);
    };

    initGSAP();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-surface py-14 sm:py-20 overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2
            id="how-it-works-heading"
            className="font-display font-extrabold text-text mb-3 tracking-tight"
            style={{ fontSize: "clamp(1.85rem, 3vw, 2.5rem)", lineHeight: "1.25" }}
          >
            How your move works
          </h2>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
            Four clear steps from your current front door to your new one. No surprises, no hidden steps.
          </p>
        </div>

        {/* ── Route line + truck (desktop) ─────────────────── */}
        <div className="relative hidden lg:block mb-12" aria-hidden="true">
          <svg
            width="100%"
            height="4"
            className="overflow-visible"
            role="presentation"
          >
            <line
              ref={lineRef}
              x1="5%"
              y1="2"
              x2="95%"
              y2="2"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Step dots */}
            {[12.5, 37.5, 62.5, 87.5].map((cx, i) => (
              <circle
                key={i}
                cx={`${cx}%`}
                cy="2"
                r="6"
                fill="var(--color-primary)"
                stroke="var(--color-background)"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Animated truck marker */}
          <div
            ref={truckRef}
            className="absolute"
            style={{ top: "-18px", left: "0%" }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary shadow-md">
              <Truck size={16} className="text-primary-foreground" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* ── Steps grid ───────────────────────────────────── */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.step}
                className="flex flex-col p-6 rounded-[var(--radius-lg)] border border-border bg-background shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-extrabold font-display shrink-0 shadow-xs">
                    0{s.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary">
                    <Icon
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="font-display font-bold text-text text-base mb-2">
                  {s.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed flex-1">
                  {s.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
