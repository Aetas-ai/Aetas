import React from 'react';

const practices = [
  {
    name: 'Aetas AI',
    scope: 'Business Process AI Assimilation',
    description: 'Human Led AI with Expert Human Oversight of AI (Expert in the Loop).',
    href: '/ai',
    image: '/visual-ai-workflows.webp',
    accent: 'text-indigo-300',
  },
  {
    name: 'Aetas Security',
    scope: 'Cybersecurity services',
    description: 'MXDR, Network Security Testing, and Application Security Testing.',
    href: '/security',
    image: '/visual-security-ops.webp',
    accent: 'text-sky-300',
  },
  {
    name: 'Aetas Global',
    scope: 'Managed IT and Business Processes',
    description: 'Help Desk as a Service and Product Support as a Service.',
    href: '/global',
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
            One company. Three independent service practices.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Start with the team that matches your requirement. Each practice keeps its own scope, service ownership, and engagement path.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">
          {practices.map((practice) => (
            <a key={practice.name} href={practice.href} className="group bg-brand-bg transition-colors hover:bg-white/[0.035]">
              <img src={practice.image} alt="" width="1440" height="810" className="aspect-[16/10] w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" loading="lazy" decoding="async" />
              <div className="p-6">
                <span className={`text-[10px] font-bold uppercase ${practice.accent}`}>{practice.name}</span>
                <h3 className="mt-3 text-xl font-bold text-white">{practice.scope}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{practice.description}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-white">Explore practice &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
