import React from 'react';
import type { ResponsiveImage } from '../lib/visuals';

const services = [
  {
    name: 'AI & Automation',
    scope: 'Business Process AI Assimilation',
    description: 'Human Led AI with Expert Human Oversight of AI (Expert in the Loop).',
    href: '/ai',
    accent: 'accent-ai',
  },
  {
    name: 'Cybersecurity',
    scope: 'Cybersecurity services',
    description: 'MXDR, Network Security Testing, and Application Security Testing.',
    href: '/security',
    accent: 'accent-security',
  },
  {
    name: 'Managed IT',
    scope: 'Managed IT and Business Processes',
    description: 'Help Desk as a Service and Product Support as a Service.',
    href: '/managed-it',
    accent: 'accent-global',
  },
];

interface OperationsVisualProps {
  /** One optimized image per service, resolved by the Astro page. */
  images: ResponsiveImage[];
}

// Server-rendered only (no client directive), so it ships no JavaScript.
export default function OperationsVisual({ images }: OperationsVisualProps) {
  return (
    <section className="agi-section" aria-labelledby="agi-structure-title">
      <div className="mx-auto max-w-7xl">
        <div className="agi-section-heading agi-section-heading--center" data-reveal>
          <span className="agi-eyebrow">How AGI is structured</span>
          <h2 id="agi-structure-title" className="font-display font-bold">
            Three specialized service areas. Coordinated delivery.
          </h2>
          <p>
            Start with the AGI service that matches your requirement. Our specialists define the right scope, ownership, review points, and engagement path with you.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3" data-reveal-group>
          {services.map((service, index) => {
            const image = images[index];
            return (
              <a
                key={service.name}
                href={service.href}
                className={`agi-card agi-card--dark agi-card--accent agi-card--interactive group overflow-hidden p-0 ${service.accent}`}
              >
                <div className="overflow-hidden">
                  {image && (
                    <img
                      src={image.src}
                      srcSet={image.srcset}
                      sizes="(min-width: 1024px) 26rem, 100vw"
                      alt=""
                      width={image.width}
                      height={image.height}
                      className="aspect-[16/10] w-full object-cover opacity-80 transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100 motion-reduce:transform-none"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="p-6">
                  <span className="agi-eyebrow">{service.name}</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">{service.scope}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
                  <span className="agi-card-link agi-card-link--on-dark mt-5">Explore service</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
