import React from 'react';

const services = [
  {
    name: 'AI & Automation',
    scope: 'Business Process AI Assimilation',
    description: 'Human Led AI with Expert Human Oversight of AI (Expert in the Loop).',
    href: '/ai',
    image: '/visual-ai-workflows.webp',
    accent: 'text-indigo-300',
  },
  {
    name: 'Cybersecurity',
    scope: 'Cybersecurity services',
    description: 'MXDR, Network Security Testing, and Application Security Testing.',
    href: '/security',
    image: '/visual-security-ops.webp',
    accent: 'text-sky-300',
  },
  {
    name: 'Managed IT',
    scope: 'Managed IT and Business Processes',
    description: 'Help Desk as a Service and Product Support as a Service.',
    href: '/managed-it',
    image: '/visual-global-ops.webp',
    accent: 'text-amber-300',
  },
];

export default function OperationsVisual() {
  return (
    <section className="px-6 py-20 sm:py-24" aria-labelledby="agi-structure-title">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase text-gray-400">How AGI is structured</span>
          <h2 id="agi-structure-title" className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
            One company. Three specialized service areas.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Start with the AGI service that matches your requirement. Our specialists define the right scope, ownership, review points, and engagement path with you.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">
          {services.map((service) => (
            <a key={service.name} href={service.href} className="group bg-brand-bg transition-colors hover:bg-white/[0.035]">
              <img src={service.image} alt="" width="1440" height="810" className="aspect-[16/10] w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" loading="lazy" decoding="async" />
              <div className="p-6">
                <span className={`text-[10px] font-bold uppercase ${service.accent}`}>{service.name}</span>
                <h3 className="mt-3 text-xl font-bold text-white">{service.scope}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{service.description}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-white">Explore service &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
